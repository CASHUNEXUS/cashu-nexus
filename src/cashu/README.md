# Cashu adapter foundation

The v1.0 alpha foundation pins `@cashu/cashu-ts` to **4.13.1** and adds a narrowly scoped mint adapter.

## Current capability

- Validates mint URLs (HTTPS required; HTTP is allowed only for localhost).
- Creates a Cashu TS `Wallet` instance in memory.
- Calls `loadMint()` and reads public mint information.
- Returns the in-memory SDK instance to a future application service layer.

## Explicitly not implemented

- No seed generation/import or key custody.
- No proof persistence, proof-state reconciliation, or recovery.
- No token decode/receive/send/melt/swap.
- No Lightning invoice integration.
- No transaction history or balance accounting.
- No production security review.

Do not connect this adapter to real funds. Cashu TS itself warns that it is early development software and can operate with real sats. Use only a self-hosted/local development mint or a test environment whose operator and test-only status you have independently verified.

## Local setup

```sh
npm install
npm run check
```

The current GitHub Pages app remains the clearly labelled v0.3.0 concept build. This adapter is on the `v1.0-foundation` branch and is not bundled into the public site.
