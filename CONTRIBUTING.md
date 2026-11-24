# Contributing

Thanks for your interest in Cashu Nexus.

## Current scope
This repository is a UI/UX prototype. Contributions should preserve its honest demo-only status. Do not add fake “connected”, “verified”, “paid”, or “success” states that are not backed by real protocol responses.

## Before proposing a change
- Keep the app dependency-free unless a dependency is clearly justified.
- Keep user-provided content out of `innerHTML`; prefer DOM APIs and `textContent`.
- Keep responsive behavior and keyboard focus visible.
- Update README/design notes when behavior or limitations change.
- Never request or commit real tokens, seed phrases, keys, or user secrets.

## Local check
Open `index.html` in a current browser or run `python -m http.server 8000`. Test the desktop and mobile layouts, every navigation item, send/receive demo states, activity filters/export, mint add/remove, and reset flow.
