export interface IdentityIssueResponse {
  token: string;
  identity: {
    id: string;
    eventId: string;
    sessionId: string;
    issuedAt: string;
    expiresAt: string;
  };
}

export interface IdentityStatusResponse {
  status: 'ACTIVE' | 'EXPIRED';
  attendedAt: string | null;
  expiresAt: string;
}

export interface Event {
  id: string;
  name: string;
  image: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  location: string;
  locationURL: string;
  organizerName: string;
  organizerWallet: string;
  nftEnabled: boolean;
}

export interface CreateEventFormData {
  name: string;
  startDate: string;
  startTime: string;
  description: string;
  endTime: string;
  location: string;
  locationURL: string;
  image: string;
  organizerName: string;
  organizerWallet: string;
  nftEnabled: boolean;
}

export interface EventQRResponse {
  entryUrl: string;
}

export interface AttendanceMarkResponse {
  attendedAt: string;
}

export interface Receipt {
  id: string;
  description: string;
  issuedAt: string;
  nftMinted: boolean;
  nftTxHash: string | null;
}

export interface IssueReceiptRequest {
  description: string;
}

export interface MintNFTRequest {
  walletAddress: string;
}

export interface MintNFTResponse {
  txHash: string;
}

export interface Proof {
  id: string;
  type: 'ATTENDANCE' | 'RECEIPT';
  expiresAt: string;
  createdAt: string;
}

export interface VerifyProofRequest {
  id: string;
}

export interface VerifyProofResponse {
  isValid: boolean;
  type: 'ATTENDANCE' | 'RECEIPT';
  expiresAt: string;
}

export interface AttendedEvent {
  eventId: string;
  name: string;
  image: string;
  startDate: string;
  nftEnabled: boolean;
  attendedAt: string;
  token: string;
}

export interface VerifiedEvent {
  eventId: string;
  name: string;
  image: string;
  startDate: string;
  attendedAt: string;
  verifiedAt: string;
  mintAddress: string;
  walletAddress: string;
}