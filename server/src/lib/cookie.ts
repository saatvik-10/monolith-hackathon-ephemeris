import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';

export const generateCookie = (
  ctx: Context,
  tokenName: string,
  token: string,
) => {
  setCookie(ctx, tokenName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: 15 * 60,
  });
};
