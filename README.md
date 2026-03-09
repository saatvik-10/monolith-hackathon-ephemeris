# Ephemeris

Ephemeris is an event attendance system built around the idea that showing up should mean something. Organizers create events and display a QR code at the door. Attendees scan it, get a session-scoped identity, mark their attendance, and can mint a Solana NFT as a permanent, verifiable record of being there.

There are no accounts. No passwords. Your identity exists only for the duration of the event.

---

## What it does

**For organizers:**
- Create an event with a name, date, time, location, and optional NFT support
- Get a QR code that attendees scan to enter
- Optionally enable NFT minting so attendees can take something on-chain with them

**For attendees:**
- Scan the QR code to receive a time-limited JWT tied to the event
- Mark attendance once — it is recorded and cannot be re-submitted
- Issue a receipt describing your experience
- Mint a Solana NFT for your receipt if the organizer has enabled it
- View and share cryptographic proofs of attendance or receipts — verifiable by anyone, no token required

---

## Tech stack

| Layer | Tech |
|-------|------|
| Mobile app | React Native + Expo (file-based routing via Expo Router) |
| Styling | NativeWind (Tailwind for React Native) |
| Backend | Hono on Node.js + TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Blockchain | Solana — NFT minting via on-chain collection |
| Wallet | Solana Mobile Wallet Adapter (Android) |

---

## Project structure

```
monolith-hackathon/
  client/     React Native app (Expo)
  server/     Hono API server
```

---

## Running locally

### Server

```bash
cd server
npm install
npm run dev
```

The server runs on port `8080` by default. It expects a `DATABASE_URL` environment variable pointing to a PostgreSQL instance.

```bash
npx prisma migrate dev
```

### Client

```bash
cd client
npm install
npx expo start
```

Scan the QR code with Expo Go, or run on an Android/iOS emulator.

---

## API overview

All routes are under `/api`. Authenticated routes require `Authorization: Bearer <token>` where the token is issued by `POST /identity/issue/:eventId` after scanning an event QR code.

| Route | Auth | Purpose |
|-------|------|---------|
| `POST /identity/issue/:eventId` | No | Issue identity + JWT after QR scan |
| `GET /identity/status` | Yes | Check identity status and attendance |
| `POST /attendance/mark` | Yes | Mark attendance (one-time) |
| `POST /events/create` | No | Create a new event |
| `GET /events/:eventId/qr` | No | Get the QR entry URL for an event |
| `GET /receipts` | Yes | List receipts for current identity |
| `POST /receipts/issue` | Yes | Issue a new receipt |
| `POST /receipts/:id/mint-nft` | Yes | Mint NFT for a receipt |
| `GET /proofs` | Yes | List all proofs (attendance + receipts) |
| `POST /proofs/verify` | No | Verify any proof by ID — public |

---

## How the identity model works

There are no user accounts. When an attendee scans an event QR code, the server issues a JWT that is scoped entirely to that event session. The token expires, attendance can only be marked once, and everything — receipts, proofs, NFTs — is tied to that single identity. This keeps the system lightweight while still giving attendees something meaningful and verifiable at the end.

---

## NFT minting

If an organizer enables NFT support when creating an event, a Solana NFT collection is created for that event. Attendees who connect a Solana wallet (via Mobile Wallet Adapter on Android) can mint an NFT linked to their receipt. The mint address and metadata URI are stored on the receipt record so the proof is always traceable back to the on-chain asset.
