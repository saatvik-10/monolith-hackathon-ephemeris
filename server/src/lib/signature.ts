import nacl from 'tweetnacl';
import bs58 from 'bs58';

export type AttendanceProofPayload = {
  eventId: string;
  identityId: string;
  attendedAt: string;
};

export type ReceiptProofPayload = {
  receiptId: string;
  eventId: string;
  identityId: string;
  issuedAt: string;
};

const SECRET_KEY = bs58.decode(process.env.PROOF_SECRET!);
const PUBLIC_KEY = SECRET_KEY.slice(32);

function canonicalStringify(
  payload: AttendanceProofPayload | ReceiptProofPayload,
): string {
  return JSON.stringify(payload, Object.keys(payload).sort());
}

export function signProof(
  payload: AttendanceProofPayload | ReceiptProofPayload,
): string {
  const msg = Buffer.from(canonicalStringify(payload));
  const sig = nacl.sign.detached(msg, SECRET_KEY);

  return bs58.encode(sig);
}

export function verifySign(
  payload: AttendanceProofPayload | ReceiptProofPayload,
  signature: string,
): boolean {
  try {
    const message = Buffer.from(canonicalStringify(payload));
    const sigBytes = bs58.decode(signature);

    return nacl.sign.detached.verify(message, sigBytes, PUBLIC_KEY);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
