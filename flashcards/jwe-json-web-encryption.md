---
tags: [flashcards, jwe, cryptography, security, jose, jwt]
sr-due: 2026-05-03
sr-interval: 1
sr-ease: 250
---

# JWE (JSON Web Encryption) — Flashcards

#flashcards/security

## Definition <!-- kb:card:3993d9 -->
What is JWE (JSON Web Encryption)?
?
An IETF standard (RFC 7516) for representing encrypted content as a compact, URL-safe token. JWE encrypts arbitrary payloads (including JWTs) so only the holder of the decryption key can read them. It is part of the JOSE family alongside JWT, JWS, and JWK.

## Compact Format <!-- kb:card:cb288e -->
What are the five parts of a compact-serialised JWE?
?
`BASE64URL(Protected Header) . BASE64URL(Encrypted Key) . BASE64URL(IV) . BASE64URL(Ciphertext) . BASE64URL(Authentication Tag)` — separated by dots. The header names the key management and content encryption algorithms; the auth tag proves integrity.

## JWE vs JWS <!-- kb:card:3d1c73 -->
What is the key difference between JWE and JWS?
?
JWS (JSON Web Signature) **signs** data — it proves authenticity and integrity but the payload is still readable. JWE **encrypts** data — it provides confidentiality; only the key holder can read the payload. They can be nested: a JWS-signed JWT wrapped in JWE gives a signed + encrypted token.

## ECDH-ES Key Agreement <!-- kb:card:b0d528 -->
How does ECDH-ES work in JWE for device-bound use cases?
?
1. Recipient has a long-term public key (e.g. X25519, stored in OS keychain on device)
2. Sender generates an ephemeral keypair for this message
3. Sender performs ECDH between its ephemeral private key and the recipient's public key → shared secret
4. Shared secret (via HKDF) derives the Content Encryption Key (CEK)
5. Payload is encrypted with CEK using AES-GCM
6. Recipient performs ECDH between its private key and sender's ephemeral public key → same shared secret → decrypts
7. No key material is transmitted in plaintext; each message uses a fresh ephemeral key (forward secrecy)

## Forward Secrecy <!-- kb:card:d7e9eb -->
Why does ECDH-ES in JWE provide forward secrecy?
?
Because the sender generates a fresh ephemeral keypair for each message. If the recipient's long-term private key is later compromised, an attacker cannot decrypt past messages — those were encrypted using an ephemeral sender key that no longer exists.

## Authenticated Encryption <!-- kb:card:1c66c3 -->
Why is AES-GCM preferred as the content encryption algorithm in JWE?
?
AES-GCM provides authenticated encryption — it simultaneously encrypts (confidentiality) and produces an authentication tag (integrity). Any tampering with the ciphertext causes tag verification to fail, preventing both passive eavesdropping and active modification attacks in one step.

## Relationship to Device-Bound Licensing <!-- kb:card:3f6140 -->
How is JWE used in device-bound software licensing?
?
The licensing server encrypts the license JWT using the device's public key (ECDH-ES/X25519), producing a JWE. Only the device holding the matching private key (in its OS keychain) can decrypt it. This makes the license non-transferable: copying the JWE token to another machine is useless without the private key.
