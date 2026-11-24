# Design notes — Cashu Nexus

## Product thesis
Cashu's privacy model is powerful, but ecash introduces unfamiliar concepts and important trust decisions. Nexus aims to make those decisions visible without overselling privacy or implying that a mint is equivalent to a bank.

## Visual system
- **Base:** deep navy and graphite surfaces (#080B12 / #0E1420).
- **Primary accent:** luminous blue (#477DFF) for focus, navigation and primary actions.
- **Supporting accent:** ice white for legibility and Bitcoin orange (#F7931A) used sparingly.
- **Typography:** Manrope for interface text and DM Mono for amounts, labels and technical details.
- **Layout:** fixed desktop navigation, responsive mobile bottom bar, modular cards, clear spacing and restrained glow.

The blue direction is an interpretation of the WGSN x Coloro 2027 Luminous Blue forecast, not an official Pantone 2027 selection.

## Interaction principles
1. Label sample data and demo-only flows at the point of use.
2. Never claim a token is valid, a mint is verified, or a payment succeeded.
3. Explain the risk beside the relevant action, not only in a separate legal page.
4. Keep local data local and give users export/reset controls.
5. Use plain language first; protocol details can be added progressively.

## Screens
- Overview: demo balance, recent activity, local mint bookmarks, privacy cues.
- Send: safe placeholder review; adds a local illustrative activity item only.
- Receive: creates a fake, clearly labelled demo string; no invoice or payment request.
- Activity: searchable/filterable local history and CSV export.
- Mint directory: URL bookmarks only, with basic format validation and removal.
- Privacy & safety: blind-signature concept, issuer risk, bearer-token safety, recovery.
- Settings: reset demo data and export history.

## Accessibility and resilience
- Semantic landmarks, labels and button names.
- Visible keyboard focus and keyboard-dismissable modal.
- Responsive layouts for narrow screens and reduced dependence on remote assets.
- DOM text inserted using `textContent` for user-provided values.
- No external JavaScript libraries or API dependencies.

## Explicit limitations
This is a front-end prototype, not a functional wallet. It does not integrate a Cashu SDK, mint, Lightning node, or wallet connection. It does not parse or validate tokens, manage proofs, store keys, or move value. Browser local storage is not secure wallet storage. Production use requires protocol integration, threat modelling, recovery design, extensive testing and independent security review.
