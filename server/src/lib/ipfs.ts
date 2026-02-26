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

    const blob = new Blob([metadataJson], { type: 'application/json' });

    const cid = await client.store({
      name: (metadata as any).name || 'attendance-proof',
      description: (metadata as any).description || 'Attendance Proof',
      image: new URL((metadata as any).image),
      properties: metadata
    });
  } catch (err) {}
}


// import { NFTStorage } from 'nft.storage';

// const NFT_STORAGE_KEY = process.env.NFT_STORAGE_API_KEY || '';

// /**
//  * Verify NFT_STORAGE_API_KEY is configured
//  * Call this on server startup
//  */
// export function validateIPFSConfig(): boolean {
//   if (!NFT_STORAGE_KEY) {
//     console.error('❌ NFT_STORAGE_API_KEY not configured in .env');
//     return false;
//   }
//   console.log('✅ IPFS storage configured');
//   return true;
// }

// /**
//  * Upload metadata JSON to IPFS via nft.storage
//  * 
//  * @param metadata - NFT metadata object (from generateMetadata)
//  * 
//  * @returns IPFS URI (ipfs://QmXxxx...)
//  * 
//  * The returned URI is permanent and immutable
//  * Can be referenced in NFT metadata on-chain
//  */
// export async function uploadToIPFS(metadata: object): Promise<string> {
//   if (!NFT_STORAGE_KEY) {
//     throw new Error(
//       'NFT_STORAGE_API_KEY not configured. Set it in .env file'
//     );
//   }

//   try {
//     const client = new NFTStorage({ token: NFT_STORAGE_KEY });

//     console.log('🔄 Uploading metadata to IPFS...');

//     // Convert metadata to JSON string
//     const metadataJson = JSON.stringify(metadata);
//     const sizeInKB = Buffer.byteLength(metadataJson, 'utf8') / 1024;

//     console.log(`📦 Metadata size: ${sizeInKB.toFixed(2)} KB`);

//     // Create blob from JSON
//     const blob = new Blob([metadataJson], { type: 'application/json' });

//     // Upload to nft.storage (which stores on IPFS)
//     const cid = await client.store({
//       name: (metadata as any).name || 'attendance-proof',
//       description: (metadata as any).description || 'Attendance proof',
//       image: new URL((metadata as any).image),
//       properties: metadata,
//     });

//     // Convert CID to IPFS URI format
//     const ipfsUri = `ipfs://${cid}`;

//     console.log(`✅ Metadata uploaded to IPFS: ${ipfsUri}`);

//     return ipfsUri;
//   } catch (error) {
//     console.error('❌ IPFS upload failed:', error);
//     throw new Error(
//       `IPFS upload failed: ${
//         error instanceof Error ? error.message : 'Unknown error'
//       }`
//     );
//   }
// }

// /**
//  * Get public HTTP URL from IPFS URI
//  * 
//  * Useful if you need to access metadata via HTTP
//  * Example: ipfs://QmXxxx → https://nft.storage/ipfs/QmXxxx
//  */
// export function getIPFSHttpUrl(ipfsUri: string): string {
//   if (!ipfsUri.startsWith('ipfs://')) {
//     throw new Error('Invalid IPFS URI format');
//   }

//   const cid = ipfsUri.replace('ipfs://', '');
//   return `https://nft.storage/ipfs/${cid}`;
// }

// /**
//  * Verify IPFS URI is accessible and returns valid JSON
//  * 
//  * Use this to test uploads before minting
//  */
// export async function verifyIPFSUri(ipfsUri: string): Promise<boolean> {
//   try {
//     const httpUrl = getIPFSHttpUrl(ipfsUri);
    
//     console.log(`🔍 Verifying IPFS URI: ${httpUrl}`);
    
//     const response = await fetch(httpUrl, { timeout: 5000 });
    
//     if (!response.ok) {
//       console.error(`❌ IPFS verification failed: HTTP ${response.status}`);
//       return false;
//     }

//     // Try to parse as JSON
//     const data = await response.json();
    
//     if (!data || typeof data !== 'object') {
//       console.error('❌ IPFS URI does not contain valid JSON');
//       return false;
//     }

//     console.log('✅ IPFS URI verified successfully');
//     return true;
//   } catch (error) {
//     console.error('❌ Failed to verify IPFS URI:', error);
//     return false;
//   }
// }

// /**
//  * Get metadata from IPFS
//  * 
//  * Useful for verification endpoint
//  * Fetches metadata to verify it matches stored hash
//  */
// export async function getMetadataFromIPFS(ipfsUri: string): Promise<object | null> {
//   try {
//     const httpUrl = getIPFSHttpUrl(ipfsUri);
//     const response = await fetch(httpUrl);
    
//     if (!response.ok) {
//       console.error(`Failed to fetch IPFS metadata: HTTP ${response.status}`);
//       return null;
//     }

//     const metadata = await response.json();
//     return metadata;
//   } catch (error) {
//     console.error('Failed to retrieve metadata from IPFS:', error);
//     return null;
//   }
// }