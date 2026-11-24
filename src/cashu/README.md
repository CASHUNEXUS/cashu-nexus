# Cashu adapter foundation

The v1.0 alpha pins @cashu/cashu-ts to 4.13.1 and provides a narrowly scoped mint adapter, local non-spending token inspection, and an encrypted snapshot primitive.

## Current capability

- Validates mint URLs (HTTPS required; HTTP only for localhost).
- Creates an in-memory Cashu TS Wallet and loads public mint metadata.
- Decodes a pasted token locally and returns only mint, unit, amount, and proof count.
- Provides an AES-256-GCM encrypted JSON snapshot envelope using PBKDF2-SHA256 (310,000 iterations), random salt, and random IV.
- The token inspector never returns proof secrets; the encryption module does not persist data.

## Critical limitations

- No seed generation/import, key custody, or recovery.
- No durable storage adapter, proof-state reconciliation, atomic transitions, or crash recovery.
- No token receive/swap, send, melt, or Lightning invoice integration.
- No transaction history or balance accounting.
- No production security review.

The encrypted snapshot primitive is only a cryptographic building block. It is not yet connected to IndexedDB or a wallet flow. A passphrase can be lost or guessed; browser malware, XSS, compromised devices, and unsafe backups remain risks. Do not put real proofs or seed material into this alpha.

IMPORTANT: do not add wallet.receive() to a user-facing flow until durable proof storage, atomic state transitions, crash recovery, duplicate-token prevention, and mint-state reconciliation are implemented. Receiving can swap proofs at the mint; returning proofs to the UI without safely persisting them can lose funds.

## Local setup

```sh
npm install
npm run check
```

The GitHub Pages app remains the clearly labelled v0.3.0 concept build. The v1.0 adapter is on v1.0-foundation and is not bundled into the public site.

## Safe connection smoke test

On a computer with Node.js 20 or newer:

```sh
npm install
npm run check:mint
```

By default this connects to the public Testnut development mint (https://testnut.cashu.space) and loads public mint information and keysets. It does not create invoices, mint/redeem ecash, send payments, or use real funds. Testnut uses simulated payments and resettable fake tokens.

Do not use a production mint or real funds for this smoke test. Never paste seed phrases, proofs, or ecash tokens into logs, issues, or chat.
