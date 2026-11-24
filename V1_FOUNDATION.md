# Cashu Nexus 1.0 — foundation status

**Status:** alpha foundation / not a usable wallet  
**SDK:** `@cashu/cashu-ts@4.13.1`  
**Branch:** `v1.0-foundation`

## Delivered in this foundation

1. Pinned the Cashu TypeScript SDK to an exact version.
2. Added a mint URL validator with HTTPS enforcement.
3. Added an in-memory adapter that calls `Wallet.loadMint()` and reads public mint metadata.
4. Documented the security boundary and what is not yet implemented.

## Next engineering gates

- [ ] Add a build pipeline and integrate the adapter behind an explicit developer/test mode.
- [ ] Select and document a maintained test mint; verify its operator and test-only status.
- [ ] Add automated tests for URL validation and mint connection failures.
- [ ] Design proof storage, atomic state transitions, and crash-safe recovery before any value operation.
- [ ] Implement receive/send/swap only with protocol-level tests and explicit confirmation states.
- [ ] Add dependency auditing, CSP, threat model, and independent security review.

## Release rule

The product must continue to display **NOT A LIVE WALLET** until key custody, proof management, recovery, transaction operations, integration tests, and a security review are complete. A successful metadata connection is not proof that funds can be safely held or transferred.
