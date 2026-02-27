export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    category: string;
    files: Array<{
      uri: string;
      type: string;
    }>;
  };
}

export function generateMetadata(
  eventName: string,
  eventDate: string,
  contentHash: string,
  imageUrl: string,
  receiptId: string,
  walletAddress: string,
): NFTMetadata {
  return {
    name: `${eventName}`,
    symbol: 'PROOF',
    description: `Verified proof of attendance at ${eventName} on ${eventDate}. This NFT is cryptographically bound to your attendance record.`,
    image: imageUrl || 'https://via.placeholder.com/400',
    attributes: [
      {
        trait_type: 'Event',
        value: eventName,
      },
      {
        trait_type: 'Date',
        value: eventDate,
      },
      {
        trait_type: 'Receipt ID',
        value: receiptId.substring(0, 16),
      },
      {
        trait_type: 'Content Hash',
        value: contentHash,
      },
      {
        trait_type: 'Verified',
        value: 'true',
      },
      {
        trait_type: 'Wallet',
        value: walletAddress.substring(0, 8),
      },
    ],
    properties: {
      category: 'membership',
      files: [
        {
          uri: imageUrl || 'https://via.placeholder.com/400',
          type: 'image/*',
        },
      ],
    },
  };
}

export function validateMetadata(metadata: NFTMetadata): boolean {
  if (!metadata.name || metadata.name.trim().length === 0) {
    console.error('Metadata validation failed: missing name');
    return false;
  }

  if (!metadata.symbol || metadata.symbol.trim().length === 0) {
    console.error('Metadata validation failed: missing symbol');
    return false;
  }

  if (!metadata.description || metadata.description.trim().length === 0) {
    console.error('Metadata validation failed: missing description');
    return false;
  }

  if (!metadata.image || metadata.image.trim().length === 0) {
    console.error('Metadata validation failed: missing image');
    return false;
  }

  if (!Array.isArray(metadata.attributes) || metadata.attributes.length === 0) {
    console.error('Metadata validation failed: missing attributes');
    return false;
  }

  for (const attr of metadata.attributes) {
    if (!attr.trait_type || !attr.value) {
      console.error('Metadata validation failed: invalid attribute structure');
      return false;
    }
  }

  if (!metadata.properties || !metadata.properties.category) {
    console.error('Metadata validation failed: missing properties');
    return false;
  }

  return true;
}

export function getMetadataSize(metadata: NFTMetadata): number {
  const jsonString = JSON.stringify(metadata);
  const sizeInBytes = Buffer.byteLength(jsonString, 'utf-8');
  const sizeInKB = sizeInBytes / 1024;

  return sizeInKB;
}
