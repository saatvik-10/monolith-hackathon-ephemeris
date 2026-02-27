import type { Context } from 'hono';
import { prisma } from '../../prisma';
import { nftMintSchema, receiptSchema } from '../validators/receipt.validator';
import { signProof } from '../lib/signature';
import { generateContentHash } from '../lib/hash';
import { mintNFT } from '../utils/mint';
import { uploadToIPFS } from '../utils/ipfs';
import { generateMetadata, validateMetadata } from '../utils/metadata';
import { success } from 'zod';
export class Receipt {
  async issueReceipt(ctx: Context) {
    const data = receiptSchema.safeParse(await ctx.req.json());

    const identity = ctx.get('identity');

    if (!identity) {
      return ctx.json('Unauthorized: No identity found', 401);
    }

    if (!data.success) {
      return ctx.json('Invalid input', 422);
    }

    const now = new Date();

    try {
      const newReceipt = await prisma.receipt.create({
        data: {
          description: data.data.description,
          identityId: identity.id,
          eventId: identity.eventId,
          issuedAt: now,
          expiresAt: identity.expiresAt,
        },
      });

      const payload = {
        receiptId: newReceipt.id,
        eventId: newReceipt.eventId,
        identityId: newReceipt.identityId,
        issuedAt: newReceipt.issuedAt.toISOString(),
      };

      await prisma.proof.create({
        data: {
          type: 'RECEIPT',
          receiptId: newReceipt.id,
          eventId: newReceipt.eventId,
          identityId: newReceipt.identityId,
          issuedAt: now,
          expiresAt: newReceipt.expiresAt,
          payload,
          signature: signProof(payload),
        },
      });

      return ctx.json(newReceipt, 201);
    } catch (err) {
      console.log('Err issuing receipt', err);
      return ctx.json('Err issuing receipt', 500);
    }
  }

  async getReceipts(ctx: Context) {
    const identity = ctx.get('identity');

    if (!identity) {
      return ctx.json('Unauthorized: No identity found', 401);
    }

    try {
      const receipts = await prisma.receipt.findMany({
        where: {
          identityId: identity.id,
        },
      });

      return ctx.json(receipts, 200);
    } catch (err) {
      console.log('Err fetching receipts', err);
      return ctx.json('Err fetching receipts', 500);
    }
  }

  async mintNFTForReceipt(ctx: Context) {
    const identity = ctx.get('identity');

    if (!identity) {
      return ctx.json('No identity found', 401);
    }

    const receiptId = ctx.req.param('receipt_id');
    const data = nftMintSchema.safeParse(await ctx.req.json());

    const walletAddress = data.data?.walletAddress;

    if (!data.success) {
      return ctx.json('Invalid input', 422);
    }

    try {
      const receipt = await prisma.receipt.findUnique({
        where: {
          id: receiptId,
        },
        include: { event: true, identity: true },
      });

      if (!receipt) {
        return ctx.json('Receipt not found', 404);
      }

      if (!receipt.identityId != identity.id) {
        return ctx.json('Receipt does not belong to the user', 403);
      }

      if (receipt.nftMinted) {
        return ctx.json('NFT already minted for this receipt', 409);
      }

      const contentHash = generateContentHash(
        receiptId,
        receipt.eventId,
        Math.floor(new Date().getTime() / 1000),
        process.env.PROOF_SECRET!,
      );

      const metadata = generateMetadata(
        receipt.event.name,
        receipt.event.startTime.toISOString().split('T')[0] as string,
        contentHash,
        receipt.event.image,
        receipt.id,
        walletAddress as string,
      );

      if (!validateMetadata(metadata)) {
        throw new Error('Metadata verification failed');
      }

      const metadataUri = await uploadToIPFS(metadata);

      const { mintAddress } = await mintNFT(
        metadataUri,
        walletAddress as string,
        receipt.event.name,
      );

      const updatedReceipt = await prisma.receipt.update({
        where: {
          id: receiptId,
        },
        data: {
          contentHash,
          walletAddress,
          mintAddress,
          metadataUri,
          nftMinted: true,
          mintedAt: new Date(),
        },
      });

      return ctx.json(
        {
          receipt: updatedReceipt,
          nft: {
            mintAddress,
            metadataUri,
          },
        },
        201,
      );
    } catch (err) {
      console.error(`Error minting NFT for receipt`, err);
      return ctx.json('Err minting nft for the receipt', 500);
    }
  }
}
