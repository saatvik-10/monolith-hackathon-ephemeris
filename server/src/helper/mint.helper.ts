import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export const SOLANA_RPC_URL = clusterApiUrl('devnet');

function getOrganizerKeypair(organizerPvtWalletKey: string): Keypair {
  try {
    const secretBytes = bs58.decode(organizerPvtWalletKey);
    return Keypair.fromSecretKey(new Uint8Array(secretBytes));
  } catch (err) {
    throw new Error(
      `Failed to decode METAPLEX: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`,
    );
  }
}

export function initializeMetaplex(organizerPvtWalletKey: string): Metaplex {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const organizerKeypair = getOrganizerKeypair(organizerPvtWalletKey);

    const metaplex = Metaplex.make(connection).use(
      keypairIdentity(organizerKeypair),
    );

    return metaplex;
  } catch (err) {
    throw new Error(
      `Failed to decode METAPLEX: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`,
    );
  }
}
