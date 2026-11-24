# Cashu Nexus

**Private by nature.** Cashu Nexus is a responsive, interactive front-end concept for a more approachable Cashu ecash wallet. It explores a privacy-aware dashboard, send and receive journeys, local mint bookmarks, activity history, and plain-language safety education.

> **Important — prototype only:** This project is not a wallet and must not be used with real funds. It does not connect to a Cashu mint or Lightning node, parse or validate tokens, create invoices, manage proofs or keys, or send/receive payments. All balances, transactions, and request strings are illustrative demo data.

## Run locally

No build system, package manager, or third-party JavaScript dependency is required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser, or serve the folder locally:

   ```bash
   python -m http.server 8000
   ```

3. Visit `http://localhost:8000`.

Google Fonts are optional; the interface falls back to system fonts if they are unavailable. The application itself does not make API calls.

## Included features

- Responsive desktop sidebar and mobile bottom navigation.
- Overview dashboard with clearly labelled sample balance and activity.
- Privacy-aware send-flow preview that never parses or transmits the entered placeholder.
- Receive-request concept that generates an explicitly fake demo string, not an invoice.
- Local demo activity, search, filters, and CSV export.
- Mint URL bookmarks with basic URL validation and remove controls; no mint connectivity or trust verification.
- Plain-language privacy, bearer-token, issuer-risk, and recovery information.
- Settings to export activity or reset demo data.
- Local persistence through browser `localStorage`.
- Keyboard-accessible controls, focus states, semantic landmarks, and responsive layouts.

## Design direction

The visual system uses deep graphite/navy surfaces, a luminous-blue accent inspired by the WGSN x Coloro 2027 forecast, ice-white typography, and restrained Bitcoin orange details. The goal is to feel like a focused privacy tool rather than a trading terminal.

## Security and privacy boundaries

- Do not enter real Cashu tokens, secrets, seed phrases, or private data.
- Do not interpret a saved mint bookmark as a recommendation, verification, or trust signal.
- Browser local storage is used only for demo state and is not encrypted wallet storage.
- No analytics, remote API, wallet connection, mint request, or payment operation is implemented.

## Production engineering roadmap

A real wallet requires substantially more than this interface. Before handling value, the project would need:

1. Select and pin a maintained Cashu wallet SDK; document supported protocol/NUT versions.
2. Build a dedicated wallet service layer for mint discovery, capability checks, token decoding, proof state, send/receive, swaps, and Lightning integration.
3. Design key custody, browser storage, backup/recovery, and threat models before implementing secrets.
4. Add mint metadata verification and clear operator, fee, availability, and trust disclosures.
5. Add unit, integration, property, and end-to-end tests against test mints only.
6. Commission an independent security review before any mainnet or real-value release.

No production feature should be represented as complete until implemented against the protocol and tested. A UI success state must never substitute for a verified mint response.

## Project structure

- `index.html` — semantic application shell and screens.
- `styles.css` — responsive design system and components.
- `app.js` — local-only demo interactions and persistence.
- `assets/nexus-mark.svg` — project mark.
- `DESIGN_NOTES.md` — product rationale, accessibility and limitations.
- `DEMO_SCRIPT.md` — short walkthrough for reviewers.

## License

MIT. See `LICENSE`.
