# Cashu Nexus 1.0 — foundation status

**Status:** alpha foundation / not a usable wallet  
**SDK:** @cashu/cashu-ts@4.13.1  
**Branch:** v1.0-foundation

## Delivered

1. Exact SDK dependency pin.
2. Mint URL validation with HTTPS enforcement.
3. In-memory adapter loading public mint metadata.
4. Local token inspection returning only mint, unit, amount, and proof count; proof secrets are not exposed.
5. Automated tests for URL validation and token-inspection guardrails.

## Not yet safe or implemented

- [ ] Durable encrypted proof storage and backup/recovery.
- [ ] Atomic proof state transitions, in-flight locks, and crash recovery.
- [ ] Safe receive flow with duplicate-token prevention and mint-state reconciliation.
- [ ] Safe send/swap/melt flow with confirmation and replay protection.
- [ ] Seed/key generation, custody, import/export, and recovery design.
- [ ] Lightning invoice integration.
- [ ] End-to-end protocol tests against an isolated development mint.
- [ ] Dependency auditing, CSP, threat model, and independent security review.

## Release rule

Keep **NOT A LIVE WALLET** visible until key custody, proof management, recovery, transaction operations, integration tests, and security review are complete. Metadata loading or local token decoding does not prove funds can be safely held or transferred.

## Automated checks

GitHub Actions runs syntax checks and unit tests on pushes to this branch and pull requests. A separate manually triggered Testnut smoke workflow exists but has not yet been run. These checks do not audit the SDK, prove a mint trustworthy, or authorize real-fund use.
