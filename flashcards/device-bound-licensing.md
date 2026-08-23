---
tags: [flashcards, device-bound-licensing, security, cryptography, licensing]
sr-due: 2026-05-03
sr-interval: 1
sr-ease: 250
---

# Device-Bound Licensing — Flashcards

#flashcards/security

## Definition <!-- kb:card:a7d543 -->
What is device-bound licensing?
?
A licensing model where a software license is cryptographically tied to a specific device via a device-generated asymmetric keypair. The private key is stored in the OS credential store and never leaves the device; the license is encrypted to the device's public key, making it non-transferable.

## Activation Flow <!-- kb:card:f9309b -->
What happens during device-bound license activation?
?
1. Device generates an asymmetric keypair on first run, storing the private key in the OS keychain
2. Device sends its public key + license identifier to the server
3. Server encrypts the license JWT using the device's public key (via JWE/ECDH-ES)
4. Device decrypts the JWE with its private key and validates the inner JWT
5. Subsequent validations happen offline against a cached JWKS

## Offline Validation <!-- kb:card:6f0f7b -->
How does device-bound licensing support offline validation?
?
After initial activation, the plugin fetches and caches the server's JWKS (JSON Web Key Set). The license JWT is then validated locally against those cached public keys, with no network call needed. The JWT `exp` claim enforces eventual re-activation.

## Security Advantage <!-- kb:card:2691fe -->
Why is device-bound licensing more secure than a traditional license key?
?
A traditional license key is a shareable string — easy to copy or redistribute. Device-bound licensing ties the secret to OS keychain-protected private key material. An attacker would need to extract the private key from the OS credential store (extremely difficult on hardened systems) — simply copying the license file is useless because they can't decrypt the JWE.

## Key Storage <!-- kb:card:9eeb3b -->
Where is the device private key stored in device-bound licensing?
?
In the OS native credential store: macOS Keychain, Windows Credential Manager, or Linux Secret Service (libsecret). This keeps the key out of app files, the registry, and user-space memory, leveraging OS-level hardware protection.

## Relationship to JWE <!-- kb:card:aa54e7 -->
How does JWE relate to device-bound licensing?
?
JWE (JSON Web Encryption) is the encryption envelope used to deliver the license JWT. The server encrypts the license using the device's public key (ECDH-ES/X25519), producing a JWE token. Only the device holding the matching private key can decrypt it, making the license non-transferable.

## Tauri Implementation <!-- kb:card:7b7869 -->
What is the Tauri ecosystem's first-party device-bound licensing solution?
?
`tauri-plugin-better-auth-license` by CrabNebula (the Tauri company). It generates X25519 device keypairs, stores private keys in the OS keychain, handles all JWE encryption/decryption automatically, and exposes a simple three-function API: `update()`, `validate()`, `remove()`. The server side is `@crabnebula/better-auth-license` for the Better Auth framework.
