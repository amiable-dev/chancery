---
tags: [flashcards, licensing, saas, desktop-apps]
sr-due: 2026-05-03
sr-interval: 1
sr-ease: 250
---

# Licensing-as-a-Service — Flashcards

#flashcards/licensing

## Definition <!-- kb:card:bdeaa9 -->
What is Licensing-as-a-Service (LaaS)?
?
A hosted SaaS model where license key generation, activation, validation, device management, and payment integration are delegated to a third-party platform and consumed via REST API — eliminating the need for a custom licensing backend.

## Core Flow <!-- kb:card:d1eb37 -->
What are the two essential API calls in a LaaS integration?
?
1. **Activate** — links a license key to a specific device on first use (`POST /licenses/activate` with licenseKey + deviceIdentifier + productId)
2. **Validate** — confirms the license is still active on each app launch (`POST /licenses/validate`)

## Storage <!-- kb:card:189d96 -->
Where should you store the license key after activation in a Tauri app, and why?
?
In a secure OS credential store — e.g. `tauri-plugin-stronghold` or macOS Keychain. This avoids asking the user to re-enter the key on each launch, and keeps it out of plain-text config files or app storage.

## Offline <!-- kb:card:ba05ea -->
How does LaaS support offline usage?
?
Activation returns a signed JWT token. When offline, the app verifies the token locally using the product's public key (no network needed). When back online, the token is refreshed from the server to pick up any status changes (renewals, revocations).

## Comparison — LaaS vs Device-Bound Licensing <!-- kb:card:9b26ca -->
How does LaaS differ from device-bound licensing?
?
LaaS uses shared license key strings (the key is the secret) with device ID tracking server-side. Device-bound licensing uses asymmetric keypairs where the private key never leaves the device, making it cryptographically impossible to transfer — stronger security but more implementation complexity.

## Comparison — LaaS vs License-Gated Distribution <!-- kb:card:021be7 -->
How does LaaS differ from license-gated software distribution?
?
LaaS validates inside the *running app* via an API call — enforcement happens in app code. License-gated distribution enforces at the *binary delivery layer* (the CDN refuses to serve the update/installer) — enforcement happens before the code even runs.

## Payment Integration <!-- kb:card:a5e2d3 -->
What payment providers does a typical LaaS platform (e.g. Keyforge) integrate with, and what does that give you?
?
Stripe, Lemon Squeezy, and Polar. Integration means license keys are auto-generated and emailed to customers on purchase, and subscription renewals/cancellations automatically extend or deactivate licenses — no webhooks or backend code required.
