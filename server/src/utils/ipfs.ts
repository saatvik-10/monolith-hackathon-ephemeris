import { NFTStorage } from 'nft.storage';

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_API_KEY!;

export function validateIPFSConfig(): boolean {
  if (!NFT_STORAGE_KEY) {
    console.error('NFT_STORAGE_API_KEY not configured in .env');
    return false;
  }
  console.log('IPFS storage configured');
  return true;
}

export async function uploadToIPFS(metadata: object): Promise<string> {
  if (!NFT_STORAGE_KEY) {
    throw new Error('NFT_STORAGE_API_KEY not configured.');
  }

  try {
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });

    console.log('Uploading metadata to IPFS...');

    const metadataJson = JSON.stringify(metadata);
    const sizeInKB = Buffer.byteLength(metadataJson, 'utf-8') / 1024;

    console.log(`Metadata size: ${sizeInKB.toFixed(2)} KB`);

    // const blob = new Blob([metadataJson], { type: 'application/json' });

    const imageUrl = (metadata as any).image;
    let imageBlob: Blob;

    try {
      const imageResponse = await fetch(imageUrl);
      imageBlob = await imageResponse.blob();
    } catch (err) {
      console.warn(`Failed to fetch ${imageUrl}, using placeholder`);
      const placeholderResponse = await fetch(
        'https://via.placeholder.com/400',
      );
      imageBlob = await placeholderResponse.blob();
    }

    const cid = await client.store({
      name: (metadata as any).name || 'attendance-proof',
      description: (metadata as any).description || 'Attendance Proof',
      image: imageBlob,
      properties: metadata,
    });

    const ipfsUri = `ipfs://${cid}`;

    return ipfsUri;
  } catch (err) {
    console.error('IPFS upload failed', err);
    throw new Error(
      `IPFS upload failed: ${
        err instanceof Error ? err.message : 'Unknown err'
      }`,
    );
  }
}

export function getIPFSHttpUrl(ipfsUri: string): string {
  if (!ipfsUri.startsWith('ipfs://')) {
    throw new Error('Invalid IPFS URI format');
  }

  const cid = ipfsUri.replace('ipfs://', '');

  return `https://nft.storage/ipfs/${cid}`;
}

export async function verifyIPFSUri(ipfsUri: string): Promise<boolean> {
  try {
    const httpUrl = getIPFSHttpUrl(ipfsUri);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(httpUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`IPFS verification failed: HTTP ${res.status}`);
      return false;
    }

    const data = await res.json();

    if (!data || typeof data !== 'object') {
      console.error('IPFS URI does not contain valid JSON');
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export async function getMetadataFromIPFS(
  ipfsUri: string,
): Promise<object | null> {
  try {
    const httpUrl = getIPFSHttpUrl(ipfsUri);
    const res = await fetch(httpUrl);

    if (!res.ok) {
      return null;
    }

    const metadata = await res.json();

    return metadata as object;
  } catch (err) {
    return null;
  }
}
