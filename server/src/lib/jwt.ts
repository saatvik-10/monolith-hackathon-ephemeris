import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  sid: string;
  exp: number;
  [key: string]: string | number;
}

export async function generateJWT(
  sessionId: string,
  ttlSeconds: number = 15 * 60,
): Promise<string> {
  const payload: JWTPayload = {
    sid: sessionId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  return sign(payload, JWT_SECRET, 'HS256');
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    return (await verify(token, JWT_SECRET, 'HS256')) as JWTPayload;
  } catch {
    return null;
  }
}
