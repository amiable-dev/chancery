---
title: JSON Web Encryption (JWE)
date: 2026-08-24
domain: standards
maturity: established
source_type: vendor-doc
tags: [concept, cryptography, standards, jose, domain/standards, maturity/established, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.rfc-editor.org/info/rfc7516/
    hash: sha256:e3a2f83f8161f9f694d606c9cfea3ecbae5b4c66004417791a8156fe7a4c0858
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# JSON Web Encryption (JWE)

## Definition

**JSON Web Encryption (JWE)** is the IETF Standards Track format, defined by RFC 7516, for representing encrypted and integrity-protected content as JSON-based data structures. A symmetric Content Encryption Key encrypts the payload under an authenticated encryption algorithm, that key is delivered to each recipient by one of five key management modes, and the result is serialised either as five base64url segments joined by dots for space-constrained transports, or as a JSON object able to address the same ciphertext to several recipients at once.

## Explanation

Every JWE separates two concerns: bulk encryption of the content under a symmetric Content Encryption Key, and delivery of that key to each recipient. Only the second half varies, across five key management modes. Key Encryption and Key Wrapping encrypt a freshly generated random CEK to the recipient's public or symmetric key. Direct Key Agreement derives the CEK from an ECDH agreement, so no encrypted key travels at all. Key Agreement with Key Wrapping uses the agreed key to wrap a random CEK. Direct Encryption simply uses a pre-shared symmetric key as the CEK. The two agreement-or-direct modes leave the encrypted key field an empty octet sequence. Integrity is not bolted on afterwards: the base64url-encoded protected header, plus an optional additional-authenticated-data value in the JSON form, is passed as the AEAD's Additional Authenticated Data, so tampering with the header — including downgrading the algorithm it names — invalidates the authentication tag. Two serializations share those cryptographic underpinnings. The Compact Serialization concatenates protected header, encrypted key, initialization vector, ciphertext and authentication tag as five base64url segments separated by four dots, which doubles as the cheapest way to tell a JWE from a JWS, since a JWS has three segments and two dots. The JSON Serialization carries per-recipient encrypted keys and unprotected headers, letting one ciphertext be opened by several parties. The most consequential guidance in the document is not about the format at all but about the decryption path: a recipient must never become a decryption oracle. Format, padding and length errors on the encrypted key must be reported identically — the specification recommends substituting a randomly generated CEK on a malformed key and continuing to the next step — because an attacker who flips the algorithm header from RSA-OAEP to RSA1_5 and observes a distinguishable formatting error can recover the CEK regardless of which algorithm the sender actually used.

## Key Properties

- Content is encrypted once under a symmetric CEK; only the delivery of that CEK varies between modes
- Five key management modes: Key Encryption, Key Wrapping, Direct Key Agreement, Key Agreement with Key Wrapping, Direct Encryption
- The encoded protected header is fed to the AEAD as Additional Authenticated Data, so header tampering breaks the tag
- Compact Serialization is five dot-separated segments; a JWS is three, which is the cheapest way to distinguish them
- Decryption must make key format, padding and length errors indistinguishable, or the recipient becomes a decryption oracle

## Relationships

- _No relationships recorded yet._
- [[cfrg-curves-in-jose]] — JWE is one of the three JOSE specifications the CFRG-curves-in-JOSE binding extends — the OKP key type it introduces is usable directly inside JWE's key-management modes, not only in JWS and JWK.
- [[json-web-token]] — is the encrypted-payload half of the design decision this format's own spec leaves to a JWT implementer — a bare signed JWT only protects integrity, and reaching for this format instead is how confidentiality gets added.

## Applications

Encrypting bearer tokens and claim sets so that user agents and intermediaries cannot read them — nested JWTs, encrypted OpenID Connect ID tokens, encrypted request objects — and carrying ciphertext through HTTP Authorization headers or URI query parameters, where the compact form's URL-safety is what makes it usable at all.

## Sources

- https://www.rfc-editor.org/info/rfc7516/

## See Also

- _None yet._
