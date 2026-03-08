import type { Context } from 'hono';
import { prisma } from '../../prisma';
import { eventSchema } from '../validators/event.validator';
import { uploadImageToIPFS, uploadToIPFS } from '../utils/ipfs';
import { createEventCollection } from '../utils/mint';

export class Events {
  async createEvent(ctx: Context) {
    const data = eventSchema.safeParse(await ctx.req.json());

    if (!data.success) {
      return ctx.json('Invalid Input', 422);
    }

    try {
      let imageIpfsUri = data.data.image;
      try {
        imageIpfsUri = await uploadImageToIPFS(data.data.image);
      } catch (err) {
        console.warn(
          'Failed to upload event image to IPFS, storing original URL:',
          err,
        );
      }

      const newEvent = await prisma.event.create({
        data: {
          name: data.data.name,
          image: imageIpfsUri,
          startTime: new Date(data.data.startTime),
          endTime: new Date(data.data.endTime),
          location: data.data.location,
          locationURL: data.data.locationURL,
          organizerName: data.data.organizerName,
          organizerWallet: data.data.organizerWallet,
          nftEnabled: data.data.nftEnabled,
        },
      });

      if (data.data.nftEnabled && data.data.organizerWallet) {
        try {
          const collectionMetadataUri = await uploadToIPFS({
            name: data.data.name,
            description: `Official collection for ${data.data.name}`,
            image: imageIpfsUri,
          });

          const collectionMintAddress = await createEventCollection(
            data.data.name,
            collectionMetadataUri,
            process.env.METAPLEX_WALLET_KEYPAIR!,
          );

          await prisma.event.update({
            where: { id: newEvent.id },
            data: { collectionMintAddress },
          });

          newEvent.collectionMintAddress = collectionMintAddress;
        } catch (err) {
          console.warn('Failed to create collection NFT:', err);
        }
      }

      return ctx.json(newEvent, 201);
    } catch (err) {
      console.log('Err creating new event', err);
      return ctx.json('Err creating new event', 500);
    }
  }

  async getEventId(ctx: Context) {
    const eventId = ctx.req.param('eventId');

    try {
      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        select: { id: true },
      });

      if (!event) {
        return ctx.json('Event not found', 404);
      }

      return ctx.json(eventId, 200);
    } catch (err) {
      console.log('Err getting event id', err);
      return ctx.json('Err getting event id', 500);
    }
  }

  async getEventQr(ctx: Context) {
    const eventId = ctx.req.param('eventId');

    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true },
      });

      if (!event) {
        return ctx.json('Event not found', 404);
      }

      const entryUrl = `${process.env.BASE_URL}/join/${eventId}`;

      return ctx.json(
        {
          eventId,
          entryUrl,
        },
        200,
      );
    } catch (err) {
      console.error('Err getting event QR', err);
      return ctx.json('Err getting event QR', 500);
    }
  }

  async deleteEvent(ctx: Context) {
    const eventId = ctx.req.param('eventId');
    const currTime = new Date();

    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        return ctx.json('Event not found', 404);
      }

      if (currTime <= event.endTime) {
        return ctx.json('Event has not ended yet', 400);
      }

      await prisma.event.delete({
        where: { id: eventId },
      });

      return ctx.json(eventId, 200);
    } catch (err) {
      console.error('Err deleting event', err);
      return ctx.json('Err deleting event', 500);
    }
  }
}
