# API Reference — All Screens

Base URL: `http://<server>/api`

Auth: All routes marked 🔒 require `Authorization: Bearer <token>` header.

---

## Identity (Global — runs before any screen is usable)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/identity/issue/:eventId` | ❌ | Scan QR → issue JWT token + identity for the event |
| GET | `/identity/status` | 🔒 | Get current identity status, expiresAt, attendedAt |

---

## Events Tab (Organizer)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/events/create` | ❌ | Create a new event (returns event object with id) |
| GET | `/events/:eventId/qr` | ❌ | Get the entryUrl to render as a QR code |

**Request body for `/events/create`:**
```json
{
  "name": "string",
  "image": "string (URL)",
  "startTime": "ISO string",
  "endTime": "ISO string",
  "organizerWallet": "string (Solana wallet address)",
  "nftEnabled": true,
  "expiryWindow": 60
}
```

---

## Attendance Tab (Attendee)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/identity/issue/:eventId` | ❌ | Called after scanning QR — issues token (shared with Identity above) |
| GET | `/identity/status` | 🔒 | Show current status card (ACTIVE/EXPIRED, attendedAt) |
| POST | `/attendance/mark` | 🔒 | Mark attendance — one time only, 409 if already marked |

---

## Receipts Tab (Attendee)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/receipts` | 🔒 | Fetch all receipts issued for current identity |
| POST | `/receipts/issue` | 🔒 | Issue a new receipt |
| POST | `/receipts/:receipt_id/mint-nft` | 🔒 | Mint an NFT for a receipt (requires wallet address) |

**Request body for `/receipts/issue`:**
```json
{
  "description": "string"
}
```

**Request body for `/receipts/:receipt_id/mint-nft`:**
```json
{
  "walletAddress": "string (Solana wallet address)"
}
```

---

## Proofs Tab (Attendee + Public Verifier)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/proofs` | 🔒 | Fetch all proofs (ATTENDANCE + RECEIPT) for current identity |
| POST | `/proofs/verify` | ❌ | Verify any proof by ID — public, no token needed |

**Request body for `/proofs/verify`:**
```json
{
  "id": "string (proof UUID)"
}
```

**Response from `/proofs/verify`:**
```json
{
  "isValid": true,
  "type": "ATTENDANCE | RECEIPT",
  "expiresAt": "ISO string"
}
```
