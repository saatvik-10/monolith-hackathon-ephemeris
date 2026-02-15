import nacl from 'tweetnacl';
import bs58 from 'bs58';

export type ProofPayload = {
  eventId: string;
  identityId: string;
  attendedAt: string;
};

const SECRET_KEY = bs58.decode(process.env.PROOF_SECRET!);
const PUBLIC_KEY = SECRET_KEY.slice(32);

export function signProof(payload: ProofPayload): string {
  const msg = Buffer.from(JSON.stringify(payload));
  const sig = nacl.sign.detached(msg, SECRET_KEY);

  return bs58.encode(sig);
}

export function verifySign(payload: ProofPayload, signature: string): boolean {
  try {
    const message = Buffer.from(JSON.stringify(payload));
    const sigBytes = bs58.decode(signature);

    return nacl.sign.detached.verify(message, sigBytes, PUBLIC_KEY);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
