import type { Context } from 'hono';
import { prisma } from '../../prisma';
import {
  verifySign,
  type AttendanceProofPayload,
  type ReceiptProofPayload,
} from '../lib/signature';
import { proofSchema } from '../validators/proof.validator';

export class Proof {
  async proofVerification(ctx: Context) {
    const data = proofSchema.safeParse(await ctx.req.json());

    if (!data.success) {
      return ctx.json('Invalid Input', 422);
    }

    try {
      const proof = await prisma.proof.findUnique({
        where: { id: data.data.id },
      });

      if (!proof) {
        return ctx.json('Proof not found', 404);
      }

      if (proof.expiresAt < new Date()) {
        return ctx.json({ valid: false, reason: 'expired' }, 410);
      }

      const isValid = verifySign(
        proof.payload as AttendanceProofPayload | ReceiptProofPayload,
        proof.signature,
      );

      if (!isValid) {
        return ctx.json({ valid: false, reason: 'invalid_signature' }, 404);
      }

      return ctx.json({
        isValid,
        type: proof.type,
        expiresAt: proof.expiresAt,
      });
    } catch (err) {
      console.log('Err verifiying proof', err);
      return ctx.json('Err verifying proof', 500);
    }
  }

  async getVerifictaions(ctx: Context) {
    const identity = ctx.get('identity');

    try {
      const proofs = prisma.proof.findMany({
        where: {
          identityId: identity.id,
        },
      });

      return ctx.json(proofs, 200);
    } catch (err) {
      console.log('Err fetching proofs', 500);
      return ctx.json('Err fetching proofs', 500);
    }
  }
}
