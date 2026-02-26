import crypto from 'crypto';

export function generateContentHash(
  receiptId: string,
  eventId: string,
  timestamp: number,
  secret: string,
): string {
  const data = `${receiptId}|${eventId}|${timestamp}|${secret}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  return hash;
}

export function verifyContentHash(
  storedHash: string,
  receiptId: string,
  eventId: string,
  timestamp: number,
  secret: string,
): boolean {
  const computedHash = generateContentHash(
    receiptId,
    eventId,
    timestamp,
    secret,
  );

  return crypto.timingSafeEqual(
    Buffer.from(storedHash),
    Buffer.from(computedHash),
  );
}
