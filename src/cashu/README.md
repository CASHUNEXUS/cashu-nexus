# Cashu adapter foundation

The v1.0 alpha pins @cashu/cashu-ts to 4.13.1 and provides a narrowly scoped mint adapter plus local, non-spending token inspection.

## Current capability

- Validates mint URLs (HTTPS required; HTTP only for localhost).
- Creates an in-memory Cashu TS Wallet and loads public mint metadata.
- Decodes a pasted token locally and returns only mint, unit, amount, and proof count.
- The token inspector never returns proof secrets.

## Not implemented

- Seed generation/import, key custody, or recovery.
- Durable encrypted proof storage, proof-state reconciliation, atomic transitions, or crash recovery.
- Token receive/swap, send, melt, or Lightning invoice integration.
- Transaction history or balance accounting.
- Production security review.

IMPORTANT: do not add wallet.receive() to a user-facing flow until durable proof storage, atomic state transitions, crash recovery, duplicate-token prevention, and protocol-level tests are implemented. Receiving can swap proofs at the mint; returning proofs to the UI without safely persisting them can lose funds. Never use real funds in this alpha.

## Local setup

```sh
npm install
npm run check
```

The GitHub Pages app remains the clearly labelled v0.3.0 concept build. This adapter is on v1.0-foundation and is not bundled into the public site.

## Safe connection smoke test

On a computer with Node.js 20 or newer:

```sh
npm install
npm run check:mint
```

By default this connects to the public Testnut development mint (https://testnut.cashu.space) and loads public mint information and keysets. It does not create invoices, mint/redeem ecash, send payments, or use real funds. Testnut uses simulated payments and resettable fake tokens.

Do not use a production mint or real funds for this smoke test. Never paste seed phrases, proofs, or ecash tokens into logs, issues, or chat.
