import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

interface MintNFTResult {
  mintAddress: string;
  success: boolean;
}

const SOLANA_RPC_URL = clusterApiUrl('devnet');
const METAPLEX_AUTHORITY_SECRET = process.env.METAPLEX_AUTHORITY_SECRET!;

if (!METAPLEX_AUTHORITY_SECRET) {
  throw new Error('METAPLEX_AUTHORITY_SECRET is missing!');
}

function getOrganizerKeypair(): Keypair {
  try {
    const secretBytes = bs58.decode(METAPLEX_AUTHORITY_SECRET);
    return Keypair.fromSecretKey(new Uint8Array(secretBytes));
  } catch (err) {
    throw new Error(
      `Failed to decode METAPLEX_AUTHORITY_SECRET: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`,
    );
  }
}

function initializeMetaplex(): Metaplex {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const organizerKeypair = getOrganizerKeypair();

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

export async function mintNFT(
  metadataUri: string,
  recipientWallet: string,
  eventName: string,
): Promise<MintNFTResult> {
  try {
    if (!metadataUri || !metadataUri.startsWith('ipgs://')) {
      throw new Error('Invalid metadata uri format');
    }

    const metaplex = initializeMetaplex();

    let receiptPublicKey: PublicKey;

    try {
      receiptPublicKey = new PublicKey(recipientWallet);
    } catch (err) {
      throw new Error(`Invalid recipient wallet address: ${recipientWallet}`);
    }

    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: `${eventName} Proof`,
      symbol: 'PROOF',
      sellerFeeBasisPoints: 0,
      tokenOwner: receiptPublicKey,
    });

    return {
      mintAddress: nft.address.toBase58(),
      success: true,
    };
  } catch (err) {
    throw new Error(
      `Failed to mint nft: ${err instanceof Error ? err.message : 'Unknown Error while minting nft'}`,
    );
  }
}

export async function verifyMintAddress(mintAddress: string): Promise<boolean> {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const mintPublicKey = new PublicKey(mintAddress);
    const accountInfo = await connection.getAccountInfo(mintPublicKey);

    return accountInfo != null;
  } catch (err) {
    console.error('Failed to verify the mint address', err);
    return false;
  }
}
