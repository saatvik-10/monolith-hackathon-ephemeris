import nacl from 'tweetnacl';
import bs58 from 'bs58';

const SECRET_KEY = bs58.decode(process.env.PROOF_SECRET!);

export function signProof(payload: object): string {
  const msg = Buffer.from(JSON.stringify(payload));
  const sig = nacl.sign.detached(msg, SECRET_KEY);

  return bs58.encode(sig);
}
