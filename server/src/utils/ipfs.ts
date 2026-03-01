const PINATA_JWT = process.env.PINATA_JWT!;
const PINATA_UPLOAD_API = 'https://uploads.pinata.cloud/v3/files';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

export function validateIPFSConfig(): boolean {
  if (!PINATA_JWT) {
    console.error('PINATA_JWT not configured in .env');
    return false;
  }
  console.log('IPFS storage configured (Pinata)');
  return true;
}

async function uploadToPinata(file: Blob, filename: string): Promise<string> {
  const form = new FormData();
  form.append('network', 'public');
  form.append('file', file, filename);
  form.append('name', filename);

  const res = await fetch(PINATA_UPLOAD_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pinata upload failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { data: { cid: string } };
  return json.data.cid;
}

export async function uploadToIPFS(metadata: object): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error('PINATA_JWT not configured.');
  }

  try {
    console.log('Uploading metadata to IPFS via Pinata...');

    const imageUrl = (metadata as any).image;
    let imageCid: string | null = null;

    if (
      imageUrl &&
      typeof imageUrl === 'string' &&
      imageUrl.startsWith('http')
    ) {
      try {
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const ext = imageBlob.type.split('/')[1] ?? 'png';
        imageCid = await uploadToPinata(imageBlob, `image.${ext}`);
        console.log(`Image uploaded to IPFS: ${imageCid}`);
      } catch (err) {
        console.warn(`Failed to upload image to IPFS: ${err}`);
      }
    }

    const finalMetadata = imageCid
      ? { ...(metadata as any), image: `ipfs://${imageCid}` }
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

export function getIPFSHttpUrl(ipfsUri: string): string {
  if (!ipfsUri.startsWith('ipfs://')) {
    throw new Error('Invalid IPFS URI format');
  }
  const cid = ipfsUri.replace('ipfs://', '');
  return `${PINATA_GATEWAY}/${cid}`;
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
