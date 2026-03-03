import {
  AttendanceMarkResponse,
  CreateEventRequest,
  EventQRResponse,
  IdentityIssueResponse,
  IdentityStatusResponse,
  IssueReceiptRequest,
  MintNFTRequest,
  MintNFTResponse,
  Proof,
  Receipt,
  VerifyProofRequest,
  VerifyProofResponse
} from '@/types';
import { tokenStorage } from '../utils/token';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = await tokenStorage.get();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[${res.status}] ${path}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export async function issueIdentity(
  eventId: string,
): Promise<IdentityIssueResponse> {
  const data = await request<IdentityIssueResponse>(
    `/identity/issue/${eventId}`,
    { method: 'POST' },
  );
  await tokenStorage.save(data.token);
  return data;
}

export function getIdentityStatus(): Promise<IdentityStatusResponse> {
  return request<IdentityStatusResponse>('/identity/status', {}, true);
}

export function createEvent(body: CreateEventRequest): Promise<Event> {
  return request<Event>('/events/create', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getEventQR(eventId: string): Promise<EventQRResponse> {
  return request<EventQRResponse>(`/events/${eventId}/qr`);
}

export function markAttendance(): Promise<AttendanceMarkResponse> {
  return request<AttendanceMarkResponse>(
    '/attendance/mark',
    { method: 'POST' },
    true,
  );
}

export function getReceipts(): Promise<Receipt[]> {
  return request<Receipt[]>('/receipts', {}, true);
}

export function issueReceipt(body: IssueReceiptRequest): Promise<Receipt> {
  return request<Receipt>(
    '/receipts/issue',
    { method: 'POST', body: JSON.stringify(body) },
    true,
  );
}

export function mintNFT(
  receiptId: string,
  body: MintNFTRequest,
): Promise<MintNFTResponse> {
  return request<MintNFTResponse>(
    `/receipts/${receiptId}/mint-nft`,
    { method: 'POST', body: JSON.stringify(body) },
    true,
  );
}

export function getProofs(): Promise<Proof[]> {
  return request<Proof[]>('/proofs', {}, true);
}

export function verifyProof(body: VerifyProofRequest): Promise<VerifyProofResponse> {
  return request<VerifyProofResponse>('/proofs/verify', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
