export const PINATA_JWT = process.env.PINATA_JWT!;
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';
const PINATA_UPLOAD_API = 'https://uploads.pinata.cloud/v3/files';

export async function uploadToPinata(file: Blob, filename: string): Promise<string> {
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

export function getIPFSHttpUrl(ipfsUri: string): string {
  if (!ipfsUri.startsWith('ipfs://')) {
    throw new Error('Invalid IPFS URI format');
  }
  const cid = ipfsUri.replace('ipfs://', '');
  return `${PINATA_GATEWAY}/${cid}`;
}