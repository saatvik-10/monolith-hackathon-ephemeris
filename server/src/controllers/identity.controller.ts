import type { Context } from 'hono';
import { prisma } from '../../prisma';
import { generateJWT } from '../lib/jwt';
import { generateCookie } from '../lib/cookie';

export class Identity {
  async issueIdentity(ctx: Context) {
    try {
      const eventId = ctx.req.param('eventId');

      if (!eventId) {
        return ctx.json('Event ID is required', 400);
      }

      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        return ctx.json('Event not found', 404);
      }

      const expiresAt = new Date(
        event.endTime.getTime() + event.expiryWindow * 60 * 1000,
      );

      const newIdentity = await prisma.identity.create({
        data: {
          eventId,
          expiresAt,
        },
      });

      const session = await prisma.session.create({
        data: {
          identityId: newIdentity.id,
          expiresAt: newIdentity.expiresAt,
        },
      });

      const token = await generateJWT(session.id);

      generateCookie(ctx, 'auth_token', token);

      return ctx.json(
        {
          token,
          identityId: newIdentity.id,
          expiresAt: newIdentity.expiresAt,
        },
        201,
      );
    } catch (err) {
      console.log('Err issuing new identity', err);
      return ctx.json('Err issuing new identity', 500);
    }
  }

  async identityStatus(ctx: Context) {
    try {
      const identity = ctx.get('identity');

      if (!identity) {
        return ctx.json('Unauthorized: No identity found', 401);
      }

      return ctx.json(
        {
          status: identity.status,
          expiresAt: identity.expiresAt,
          attendedAt: identity.attendedAt,
        },
        200,
      );
    } catch (err) {
      console.log('Err getting identity status', err);
      return ctx.json('Err getting identity status', 500);
    }
  }
}
