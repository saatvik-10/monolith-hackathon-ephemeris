import { getIPFSHttpUrl, PINATA_JWT, uploadToPinata } from '../helper/ipfs.helper';

export function validateIPFSConfig(): boolean {
  if (!PINATA_JWT) {
    console.error('PINATA_JWT not configured in .env');
    return false;
  }
  console.log('IPFS storage configured (Pinata)');
  return true;
}

export async function uploadImageToIPFS(imageUrl: string): Promise<string> {
  if (!PINATA_JWT) throw new Error('PINATA_JWT not configured.');
  if (imageUrl.startsWith('ipfs://')) return imageUrl;

  // Handle base64 data URIs from mobile clients
  if (imageUrl.startsWith('data:')) {
    const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/s);
    if (!matches || !matches[1] || !matches[2]) throw new Error('Invalid data URI format');
    const mimeType = matches[1];
    const base64Data = matches[2];
    const raw = Buffer.from(base64Data, 'base64');
    const imageBlob = new Blob([new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength)], { type: mimeType });
    const ext = mimeType.split('/')[1] ?? 'png';
    const cid = await uploadToPinata(imageBlob, `image.${ext}`);
    console.log(`Image uploaded to IPFS from base64: ${cid}`);
    return `ipfs://${cid}`;
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok)
    throw new Error(`Failed to fetch image: ${imageResponse.status}`);

  const imageBlob = await imageResponse.blob();
  const ext = imageBlob.type.split('/')[1] ?? 'png';
  const cid = await uploadToPinata(imageBlob, `image.${ext}`);
  console.log(`Image uploaded to IPFS: ${cid}`);
  return `ipfs://${cid}`;
}

export async function uploadToIPFS(metadata: object): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error('PINATA_JWT not configured.');
  }

  try {
    console.log('Uploading metadata to IPFS via Pinata...');

    const imageUrl = (metadata as any).image;
    let finalImage = imageUrl;

    if (imageUrl && typeof imageUrl === 'string') {
      if (imageUrl.startsWith('ipfs://')) {
        finalImage = imageUrl;
      } else if (imageUrl.startsWith('http')) {
        try {
          finalImage = await uploadImageToIPFS(imageUrl);
        } catch (err) {
          console.warn(`Failed to upload image to IPFS: ${err}`);
        }
      }
    }

    const finalMetadata = finalImage
      ? { ...(metadata as any), image: finalImage }
      : metadata;

    const metadataBlob = new Blob([JSON.stringify(finalMetadata)], {
      type: 'application/json',
    });
    const cid = await uploadToPinata(metadataBlob, 'metadata.json');

    const ipfsUri = `ipfs://${cid}`;
    console.log(`Metadata uploaded to IPFS: ${ipfsUri}`);
    return ipfsUri;
  } catch (err) {
    console.error('IPFS upload failed', err);
    throw new Error(
      `IPFS upload failed: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`,
    );
  }
}

export async function verifyIPFSUri(ipfsUri: string): Promise<boolean> {
  try {
    const httpUrl = getIPFSHttpUrl(ipfsUri);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(httpUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return false;
    const data = await res.json();
    return data !== null && typeof data === 'object';
  } catch {
    return false;
  }
}

export async function getMetadataFromIPFS(
  ipfsUri: string,
): Promise<object | null> {
  try {
    const httpUrl = getIPFSHttpUrl(ipfsUri);
    const res = await fetch(httpUrl);
    if (!res.ok) return null;
    return (await res.json()) as object;
  } catch {
    return null;
  }
}
