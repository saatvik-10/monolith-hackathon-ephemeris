import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyJWT } from './lib/jwt';
import { prisma } from '../prisma';

export async function proxy(ctx: Context, next: Next) {
  try {
    const cookieToken = getCookie(ctx, 'auth_token');

    const authHeader = ctx.req.header('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    const token = cookieToken || headerToken;

    if (!token) {
      return ctx.text('Not authenticated', 401);
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      return ctx.text('Invalid or expired token', 401);
    }

    const session = await prisma.session.findUnique({
      where: { id: payload.sid },
      include: { identity: true },
    });

    if (!session) {
      return ctx.text('Session not found', 404);
    }

    if (session.expiresAt < new Date()) {
      return ctx.json('Session expired', 401);
    }

    const identity = session.identity;

    if (
      !identity ||
      identity.status !== 'ACTIVE' ||
      identity.expiresAt < new Date()
    ) {
      return ctx.text('Identity expired', 401);
    }

    ctx.set('session', session);
    ctx.set('identity', identity);

    await next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return ctx.json('Auth middleware error', 500);
  }
}
