# Dependencies Required

## Install Command
```bash
npx expo install expo-camera expo-barcode-scanner @react-native-async-storage/async-storage react-native-qrcode-svg
npm install @solana/web3.js @solana-mobile/mobile-wallet-adapter-protocol @solana-mobile/mobile-wallet-adapter-protocol-web3js
```

---

## Dependency Breakdown

### `expo-camera`
**Required for:** Attendance tab — scanning the event QR code shown by the organizer.
Provides the camera view and integrates natively with Expo's managed workflow. Handles camera permissions on both iOS and Android.

---

### `expo-barcode-scanner`
**Required for:** Decoding the QR code content from the camera feed.
Works together with `expo-camera` to parse the scanned QR into the `entryUrl` string, from which we extract the `eventId`.

---

### `@react-native-async-storage/async-storage`
**Required for:** Persisting the JWT auth token across app restarts.
The token received from `POST /identity/issue/:eventId` must survive the app being closed and reopened — `AsyncStorage` is the standard key-value store for React Native, used inside the Auth Context.

---

### `react-native-qrcode-svg`
**Required for:** Events tab — rendering the `entryUrl` as a scannable QR code for attendees.
Takes a plain string and generates a QR image using SVG. Needs `react-native-svg` as a peer dependency (already installable via `npx expo install react-native-svg`).

---

### `react-native-svg`
**Required for:** Peer dependency of `react-native-qrcode-svg`.
Provides SVG rendering primitives for React Native — Expo manages the native linking automatically.

---

### `@solana/web3.js`
**Required for:** Core Solana types — specifically `PublicKey` and connection utilities used when interacting with the wallet adapter and passing the wallet address to `POST /receipts/:receipt_id/mint-nft`.

---

### `@solana-mobile/mobile-wallet-adapter-protocol`
**Required for:** Low-level Mobile Wallet Adapter (MWA) protocol implementation. This is the base layer that handles the communication between the app and an installed Solana wallet app (e.g. Phantom, Solflare) on Android.

---

### `@solana-mobile/mobile-wallet-adapter-protocol-web3js`
**Required for:** Web3.js-compatible wrapper around the MWA protocol.
Provides `transact()` and `AuthorizationResult` — used to connect the wallet, get the `publicKey` (wallet address), and pass it as `walletAddress` to the NFT mint endpoint.

---

## Already Available (no install needed)

| Package | Reason |
|---------|--------|
| `expo-linear-gradient` | Already in package.json |
| `expo-blur` | Already in package.json |
| `expo-haptics` | Already in package.json — useful for button feedback |
| `@expo/vector-icons` | Already in package.json — icons throughout UI |
| `react-native-reanimated` | Already in package.json — animations |
