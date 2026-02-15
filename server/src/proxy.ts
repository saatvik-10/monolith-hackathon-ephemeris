import type { Context, Next } from 'hono';
import { verifyJWT } from './lib/jwt';
import { prisma } from '../prisma';

export async function proxy(ctx: Context, next: Next) {
  try {
    const authHeader = ctx.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.text('Not authenticated', 401);
    }

    const token = authHeader.slice(7);

    const payload = await verifyJWT(token);

    if (!payload) {
      ctx.text('Invalid or expired token', 401);
      return;
    }

    const session = await prisma.session.findUnique({
      where: { id: payload.sid },
    });

    if (!session || session.expiresAt < new Date()) {
      return ctx.text('Session expired', 401);
    }

    const identity = await prisma.identity.findUnique({
      where: { id: session.identityId },
    });

    if (
      !identity ||
      identity.status !== 'ACTIVE' ||
      identity.expiresAt < new Date()
    ) {
      return ctx.text('Identity expired', 401);
    }

    ctx.set('session', payload);
    ctx.set('identity', identity);

    await next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return ctx.json('Auth middleware error', 500);
  }
}
