---
title: "Device-Bound Licensing"
date: 2026-05-03
domain: security
maturity: established
source_type: practitioner
tags: [concept, security, licensing, cryptography, desktop-apps, tauri, domain/security, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://crates.io/crates/tauri-plugin-better-auth-license
    unreachable: true
    reason: no extractable text
    checked: 2026-08-21
    class: unclassified
    reachability: js-required
  - url: https://www.npmjs.com/package/@crabnebula/better-auth-license
    unreachable: true
    reason: HTTP 403
    checked: 2026-08-21
    class: unclassified
    reachability: blocked-4xx
  - url: https://www.rfc-editor.org/rfc/rfc8037
    hash: sha256:0221989629445da9d84b713dfca6c57cc7830cb21534b01b841a97aa6f168b58
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Device-Bound Licensing

## Definition
A software licensing model where a license is cryptographically tied to a specific device through a device-generated asymmetric keypair, such that the license cannot be transferred to or validated on another machine without re-activation. The private key never leaves the device; only the public key is shared with the licensing server.

## Explanation
Traditional software licensing relies on license keys (strings) that are easy to copy, share, or crack. Device-bound licensing replaces the shareable secret with something anchored to the device itself.

**How it works:**

1. **Keypair generation:** On first run, the app generates an asymmetric keypair (e.g. X25519 or RSA) on-device. The private key is stored in the OS native credential store (macOS Keychain, Windows Credential Manager, Linux Secret Service / libsecret).
2. **Activation:** The device sends its public key + license identifier to the licensing server. The server encrypts the license token (a JWT) using the device's public key, returning a [[jwe-json-web-encryption|JWE]]-wrapped response that only this device can decrypt.
3. **Validation:** The plugin decrypts the JWE with the local private key, verifying the inner JWT. After the initial fetch, the JWT can be validated offline against a cached JWKS (JSON Web Key Set), so no network is required for subsequent validations.
4. **Revocation:** The server can refuse to re-issue or flag a key as revoked. Offline tokens eventually expire (JWT `exp` claim), forcing re-activation.

**Why it's stronger than traditional approaches:**
- The license cannot be extracted and replanted — the decryption key is in the OS keychain, inaccessible to user-space processes on a hardened OS
- Replay attacks are prevented because the encrypted payload is addressed to a specific device key
- Man-in-the-middle attacks are prevented because the server encrypts to the device's public key (only the device can read the response)
- Offline validation is possible via locally cached JWKS — no continuous server connection needed

**Example implementation (Tauri):** `tauri-plugin-better-auth-license` by CrabNebula implements this pattern using X25519 keypairs + [[jwe-json-web-encryption|JWE]] (ECDH-ES). The server side is `@crabnebula/better-auth-license`, a plugin for the Better Auth framework. App code calls three JS functions: `update()`, `validate()`, `remove()` — all crypto is handled transparently.

## Key Properties
- **Non-transferable:** The license is usable only on the device that generated the keypair
- **Offline-capable:** After initial activation, validation runs locally against cached JWKS
- **Tamper-resistant:** Private key is stored in OS credential store, not in app files or registry values
- **Revocable:** Server-side key revocation + JWT expiry enforces re-activation
- **Transparent crypto:** Modern implementations (e.g. tauri-plugin-better-auth-license) handle all cryptographic operations — app code sees only high-level `validate()` calls

## Relationships
- Relies on [[jwe-json-web-encryption]]: JWE is the encryption envelope used to deliver the license token in a form only the target device can unwrap
- Related to [[zero-trust-architecture]]: shares the principle of "never trust, always verify" — device identity must be cryptographically proven, not assumed
- Related to [[agent-attestation-standards]]: both use cryptographic keypairs to prove device/agent identity; device-bound licensing applies the same pattern to commercial software

## Applications
- **Desktop app monetisation:** Selling commercial desktop software (e.g. Tauri apps) without SaaS infrastructure; licenses are self-contained per-device after activation
- **Offline/air-gapped software:** Industries (legal, medical, government) that need licensed software to run without internet access; offline JWT validation satisfies this
- **Enterprise seat management:** Binding a license seat to a specific machine rather than a named user — useful for shared workstations
- **Anti-piracy for developer tools:** IDEs, compilers, design tools where license sharing between developers is a real concern
- **Self-hosted licensing infrastructure:** Using open-source auth frameworks (Better Auth) + device-bound crypto gives full control over the licensing stack without SaaS lock-in

## Study
- Flashcards: [[flashcards/device-bound-licensing|Practice this concept]]

## Sources
- [tauri-plugin-better-auth-license on crates.io](https://crates.io/crates/tauri-plugin-better-auth-license) — Primary source; Rust implementation by CrabNebula
- [@crabnebula/better-auth-license on npm](https://www.npmjs.com/package/@crabnebula/better-auth-license) — Server-side counterpart; describes the hardened licensing pipeline (ephemeral nonces, rotating JWK keys, device-side public-key encryption)
- [RFC 8037 — ECDH with X25519 in JOSE](https://www.rfc-editor.org/rfc/rfc8037) — Specification for the X25519 key agreement used in this pattern

## See Also
- [[jwe-json-web-encryption]]
- [[zero-trust-architecture]]
- [[agent-attestation-standards]]
- [[license-gated-software-distribution]]
- [[licensing-as-a-service]]
- [[isv-distribution-platform]]
