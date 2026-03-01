import { Connection, PublicKey } from '@solana/web3.js';
import { initializeMetaplex, SOLANA_RPC_URL } from '../helper/mint.helper';

interface MintNFTResult {
  mintAddress: string;
  success: boolean;
}

export async function mintNFT(
  metadataUri: string,
  recipientWallet: string,
  eventName: string,
  organizerPvtWalletKey: string,
): Promise<MintNFTResult> {
  try {
    if (!metadataUri || !metadataUri.startsWith('ipfs://')) {
      throw new Error('Invalid metadata uri format');
    }

    const metaplex = initializeMetaplex(organizerPvtWalletKey);

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
