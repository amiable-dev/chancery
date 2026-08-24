---
title: JSON Web Token (JWT)
aliases:
  - JWT
date: 2026-08-24
domain: standards
maturity: established
source_type: vendor-doc
topics: [licensing]
tags: [concept, jose, claims-based-authentication, offline-verification, licensing, domain/standards, maturity/established, source-type/vendor-doc, topic/licensing]
status: draft
sources:
  - url: https://www.rfc-editor.org/rfc/rfc7519.html
    hash: sha256:336850ef67428b27e0bfd8d2d87a8018fe27bd017135fc2bce8ea7d618b1667c
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# JSON Web Token (JWT)

## Definition

A JSON Web Token (JWT, RFC 7519) is a compact, URL-safe representation of a set of claims — statements about a subject, such as who issued them, who they are about, and when they expire — encoded as a JSON object and secured as the payload of a JSON Web Signature or the plaintext of a JSON Web Encryption, so a party holding only the issuer's public key can verify the claims' integrity and origin, and reject an expired or not-yet-valid token, entirely offline without contacting the issuer.

## Explanation

The token's power is in what it moves out of band: because the signature or encryption binds the claims to a key the issuer controls, verification becomes a local cryptographic check instead of a server round trip, which is what makes JWTs the default building block for offline-capable authorization — session tokens, API access tokens, OpenID Connect ID tokens, and signed license or entitlement tokens all reuse the same shape. The spec standardizes seven registered claim names so implementations do not reinvent them: iss (issuer), sub (subject), aud (audience), exp (expiration time), nbf (not before), iat (issued at), and jti (unique token ID) — exp and nbf in particular give any consumer built-in, no-extra-code expiry and grace-period semantics. A JWT can be signed only, a JWS, which is readable but tamper-evident, or also encrypted as a JWE, which is opaque to anyone without the decryption key, and the security considerations are mostly about that choice and about validating every claim that matters before trusting the token — an unsigned or improperly verified token, or one whose expiry a caller forgot to check, is not a security boundary at all. As a decade-old IETF Standards Track document with wide library support, the format itself is stable; what changes over time is which claims, algorithms and profiles a given ecosystem layers on top.

## Key Properties

- Compact, URL-safe JSON claims object, signed as a JWS and/or encrypted as a JWE
- Seven registered claim names — iss, sub, aud, exp, nbf, iat, jti — with exp/nbf giving built-in expiry and grace-period semantics
- Verification is a local cryptographic check against the issuer's key, so it works fully offline with no server round trip
- Signing proves integrity and origin without hiding content; encryption is required if the claims themselves must stay opaque
- IETF Standards Track (RFC 7519, 2015) with broad library support across languages and platforms

## Relationships

- [[json-web-encryption]] — JWE is one of the two ways a JWT's claims can be secured — encrypting them for confidentiality, where a bare signed JWT only protects integrity — so the choice between the two is a JWT design decision, not a separate technology.
- [[cfrg-curves-in-jose]] — CFRG curves in JOSE define an elliptic-curve key type a JWT's signature algorithm can select, extending the signing-algorithm choice this format leaves open to implementations.
- [[authorization-response-issuer-identification]] — solves the same problem, confirming who actually produced what a party received, at a different layer: this format's iss claim travels inside a signed or encrypted token, while RFC 9207's iss is a separate, unprotected OAuth redirect parameter a client checks before ever reaching a token.
- [[perpetual-fallback-access]] — names signed software license and entitlement tokens as one of its offline-verifiable applications; this licensing design is a worked example — an active, fallback or unlicensed state read locally from a signed token with no server round trip.

## Applications

Building any offline-verifiable authorization or entitlement scheme — session tokens, API access tokens, OIDC ID tokens, or signed software license and entitlement tokens — on the standardized claim vocabulary and signed-or-encrypted structure instead of inventing a bespoke token format and expiry mechanism from scratch.

## Sources

- https://www.rfc-editor.org/rfc/rfc7519.html

## See Also

- [[json-web-encryption]]
- [[cfrg-curves-in-jose]]
- [[authorization-response-issuer-identification]]
