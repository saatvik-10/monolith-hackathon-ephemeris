import type { Context } from 'hono';
import { prisma } from '../../prisma';
import { signProof } from '../lib/signature';

export class Attendance {
  async markAttendance(ctx: Context) {
    const identity = ctx.get('identity');

    if (identity.attendedAt) {
      return ctx.json('Attendance already marked', 409);
    }

    try {
      const now = new Date();

      const updatedIdentity = await prisma.identity.update({
        where: { id: identity.id },
        data: { attendedAt: now },
      });

      const payload = {
        eventId: updatedIdentity.eventId,
        identityId: updatedIdentity.id,
        attendedAt: now.toISOString(),
      };

      await prisma.proof.create({
        data: {
          type: 'ATTENDANCE',
          identityId: updatedIdentity.id,
          eventId: updatedIdentity.eventId,
          issuedAt: now,
          expiresAt: updatedIdentity.expiresAt,
          payload,
          signature: signProof(payload),
        },
      });
    } catch (err) {
      console.log('Err marking attendance', err);
      return ctx.json('Err marking attendance', 500);
    }
  }
}
