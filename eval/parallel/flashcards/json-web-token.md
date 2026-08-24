---
tags: [flashcards, jose, claims-based-authentication, offline-verification, licensing]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# JSON Web Token (JWT) — Flashcards

#flashcards/jose

## Definition <!-- kb:card:fae592 -->
What is a JSON Web Token (JWT)?
?
A compact, URL-safe JSON object of claims, secured as the payload of a JSON Web Signature or the plaintext of a JSON Web Encryption (RFC 7519), verifiable offline by anyone holding the issuer's public key.

## Offline verification <!-- kb:card:ce2ff1 -->
Why can a JWT be verified without contacting the issuer?
?
Because the signature or encryption binds the claims to a key the issuer controls, so verification is a local cryptographic check instead of a server round trip.

## Registered claims <!-- kb:card:2210a5 -->
Name the seven registered JWT claim names.
?
iss (issuer), sub (subject), aud (audience), exp (expiration time), nbf (not before), iat (issued at), and jti (unique token ID).

## JWS vs JWE <!-- kb:card:2153f9 -->
What's the difference between securing a JWT as a JWS versus a JWE?
?
A JWS is signed only — readable but tamper-evident, proving integrity and origin; a JWE is also encrypted, making the claims opaque to anyone without the decryption key.

## Security boundary caveat <!-- kb:card:479c1a -->
When does a JWT fail to act as a security boundary at all?
?
When it's unsigned or improperly verified, or when a caller forgets to check its expiry (exp) claim.
