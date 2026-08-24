---
tags: [flashcards, cryptography, standards, jose, domain/standards, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# CFRG curves in JOSE (OKP key type) — Flashcards

#flashcards/cryptography

## Definition <!-- kb:card:6e509f -->
What does RFC 8037 define, and what new key type does it introduce to JOSE?
?
The binding of CFRG curve algorithms (X25519/X448 for ECDH, Ed25519/Ed448 for signing) into JOSE (JWS/JWE/JWK). It introduces the OKP (Octet Key Pair) key type, whose public/private keys are plain octet strings rather than x/y coordinate pairs.

## Why OKP has no y <!-- kb:card:a7ec66 -->
Why does an OKP key have no `y` field, and what fields does it carry instead?
?
CFRG algorithms take and return octet strings rather than points on a Weierstrass curve, so there's no coordinate pair to represent. OKP carries `kty: OKP`, a mandatory `crv` (subtype), a mandatory `x` (public key, base64url), and `d` (private key, base64url) for private keys only.

## One algorithm, key picks variant <!-- kb:card:150384 -->
JOSE has only one algorithm identifier, EdDSA, for both Ed25519 and Ed448. How is the actual variant signaled?
?
The variant rides on the key, not the header — it's determined by the key's `crv` subtype. This is why security considerations insist key material must never be separated from its subtype information.

## Purpose partition <!-- kb:card:6207a5 -->
How are the four CFRG subtypes partitioned by purpose in JOSE?
?
Ed25519 and Ed448 are for signing under EdDSA only (MUST NOT be used for ECDH-ES); X25519 and X448 are for ECDH-ES only (MUST NOT be used for signing).

## Key-binding caveat <!-- kb:card:a8d12b -->
What caution does RFC 8037 give about relying on Ed25519/Ed448 signatures for key binding?
?
Although these signatures do bind the key used to sign, implementers must not assume that property generically — when key binding is actually required, the signing key should be placed inside the JWS protected header or the signed data itself.
