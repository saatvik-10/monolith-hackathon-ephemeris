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
  startTime: string;
  endTime: string;
  organizerName: string;
  organizerWallet: string;
  nftEnabled: boolean;
  expiryWindow: number;
  createdAt: string;
}

export interface CreateEventRequest {
  name: string;
  image: string;
  startTime: string;
  endTime: string;
  organizerName: string;
  organizerWallet: string;
  nftEnabled: boolean;
  expiryWindow: number;
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