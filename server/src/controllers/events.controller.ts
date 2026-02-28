import type { Context } from 'hono';
import { prisma } from '../../prisma';
import { eventSchema } from '../validators/event.validator';

export class Events {
  async createEvent(ctx: Context) {
    const data = eventSchema.safeParse(await ctx.req.json());

    if (!data.success) {
      return ctx.json('Invalid Input', 422);
    }

    try {
      const newEvent = await prisma.event.create({
        data: {
          name: data.data.name,
          image: data.data.image,
          startTime: new Date(data.data.startTime),
          endTime: new Date(data.data.endTime),
          organizerWallet: data.data.organizerWallet,
          nftEnabled: data.data.nftEnabled,
          expiryWindow: data.data.expiryWindow,
        },
      });

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
}
