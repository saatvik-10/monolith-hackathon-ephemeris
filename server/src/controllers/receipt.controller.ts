import type { Context } from 'hono';
import { prisma } from '../../prisma';
import { receiptSchema } from '../validators/receipt.validator';
import { signProof } from '../lib/signature';

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
}
