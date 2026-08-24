---
title: CFRG curves in JOSE (OKP key type)
date: 2026-08-24
domain: standards
maturity: established
source_type: vendor-doc
tags: [concept, cryptography, standards, jose, domain/standards, maturity/established, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.rfc-editor.org/info/rfc8037/
    class: external-primary
---

# CFRG curves in JOSE (OKP key type)

## Definition

**CFRG curves in JOSE** is the binding, standardised by RFC 8037, that lets the modern curve algorithms selected by the IRTF Crypto Forum Research Group — the X25519 and X448 Diffie-Hellman functions and the Ed25519 and Ed448 signature schemes — be used inside JSON Web Signature, JSON Web Encryption and JSON Web Key. It introduces one new key type, OKP or Octet Key Pair, whose public and private keys are plain octet strings rather than coordinate pairs, and one new signature algorithm identifier, EdDSA, whose variant is determined by the key's curve subtype rather than by the algorithm name.

## Explanation

An OKP key carries exactly four things: kty set to OKP, a mandatory crv naming the subtype, a mandatory x holding the base64url-encoded public key, and, for private keys only, d holding the base64url-encoded private key. What is absent matters more than what is present — there is no y. The classic JOSE EC key type models a point on a Weierstrass curve as an x-and-y coordinate pair, whereas the CFRG algorithms take and return octet strings, so the specification explicitly warns implementers not to assume an underlying elliptic curve at all, leaving the key type free to cover other constructions later. JWK thumbprints hash the three public fields crv, kty and x in that lexicographic order. The subtypes are strictly partitioned by purpose: Ed25519 and Ed448 are for signing under the EdDSA algorithm and MUST NOT be used for ECDH-ES, while X25519 and X448 are for ECDH-ES and MUST NOT be used for signing. The procedures themselves are thin wrappers over the underlying primitives — signing applies RFC 8032's algorithm to the private key, public key and JWS Signing Input, and the resulting octet string is the JWS Signature; for ECDH-ES, the ephemeral public key's x is the ECDH function applied to the ephemeral private scalar and the standard base point, and the Z value fed to the key derivation function is the same function applied to that scalar and the recipient's public key. The design decision with the longest shadow is that a single algorithm value, EdDSA, covers both variants: the choice between Ed25519 and Ed448 rides on the key, not the header. That is why the security considerations insist key material never be separated from information about its subtype, and that implementations check algorithm-key compatibility before use — algorithm-confusion is the named failure mode, with mixing up signature and MAC algorithms called out as particularly dangerous. One further caution is easy to miss: although Ed25519 and Ed448 signatures do bind the key used to sign, implementers are told not to assume that property generically, and to place the signing key inside the JWS protected header or the signed data whenever key binding is actually required.

## Key Properties

- OKP keys carry kty, crv, x and (private keys only) d — there is no y, because the algorithms take octet strings not coordinates
- One algorithm value, EdDSA, covers both variants; Ed25519 versus Ed448 is decided by the key's crv subtype
- Subtypes are purpose-partitioned: Ed25519 and Ed448 for signing only, X25519 and X448 for ECDH-ES only
- JWK thumbprint input includes crv, kty and x in lexicographic order
- Key material must never be separated from its subtype, since algorithm confusion is the named attack

## Relationships

- [[json-web-encryption]] — supplies the key representation that encryption format consumes on its agreement path — X25519 and X448 OKP keys are what make ECDH-ES over CFRG curves available to JWE's Direct Key Agreement and Key Agreement with Key Wrapping modes

## Applications

Issuing and verifying Ed25519-signed JWTs, where short keys and signatures matter for size-constrained tokens; publishing OKP keys from a JWKS endpoint so relying parties can resolve them; and implementing X25519 ECDH-ES key agreement for JWE recipients.

## Sources

- https://www.rfc-editor.org/info/rfc8037/

## See Also

- [[json-web-encryption]]
