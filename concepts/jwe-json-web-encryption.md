---
title: "JWE (JSON Web Encryption)"
date: 2026-05-03
domain: standards
maturity: established
source_type: vendor-doc
topics: [protocols]
tags: [concept, cryptography, security, web-standards, jose, jwt, domain/standards, maturity/established, source-type/vendor-doc, topic/protocols]
status: draft
sources:
  - url: https://www.rfc-editor.org/rfc/rfc7516
    hash: sha256:e3a2f83f8161f9f694d606c9cfea3ecbae5b4c66004417791a8156fe7a4c0858
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.rfc-editor.org/rfc/rfc8037
    hash: sha256:0221989629445da9d84b713dfca6c57cc7830cb21534b01b841a97aa6f168b58
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://crates.io/crates/tauri-plugin-better-auth-license
    unreachable: true
    reason: no extractable text
    checked: 2026-08-21
    class: unclassified
    reachability: js-required
---

# JWE (JSON Web Encryption)

## Definition
A standard (RFC 7516) for representing encrypted content as a compact, URL-safe token in JSON format. JWE encrypts arbitrary payloads — including JWTs — so that only the intended recipient (who holds the correct decryption key) can read them. It is part of the JOSE (JSON Object Signing and Encryption) family of standards alongside JWS, JWT, and JWK.

## Explanation
JWE is distinct from JWS (JSON Web Signature): JWS *signs* data to prove authenticity; JWE *encrypts* data to ensure confidentiality. Both can be combined — a common pattern is to sign a JWT first (JWS), then encrypt the entire signed token (JWE), producing a nested token readable only by the recipient and verifiably issued by the sender.

**Compact serialisation format:**
```
BASE64URL(JWE Protected Header) .
BASE64URL(Encrypted Key) .
BASE64URL(Initialization Vector) .
BASE64URL(Ciphertext) .
BASE64URL(Authentication Tag)
```

**Key concepts:**

- **Key Management Algorithm:** How the content encryption key (CEK) is established. For device-bound licensing, `ECDH-ES` (Elliptic Curve Diffie-Hellman Ephemeral Static) is used with X25519 keys — the sender derives a shared secret from the recipient's public key and an ephemeral key, requiring no pre-shared secret.
- **Content Encryption Algorithm:** How the payload is encrypted with the CEK. Common choices: `A256GCM` (AES-256 GCM) or `A128CBC-HS256`.
- **Authentication Tag:** GCM-mode algorithms produce an authentication tag that simultaneously proves the ciphertext was not tampered with (authenticated encryption = confidentiality + integrity in one step).

**ECDH-ES with X25519 (used by tauri-plugin-better-auth-license):**
1. Device generates an X25519 keypair; private key goes in OS keychain, public key is sent to server
2. Server generates an ephemeral X25519 keypair for this request
3. Server performs ECDH between its ephemeral private key and the device's public key → shared secret
4. Shared secret is used (via HKDF) to derive the CEK
5. Payload (license JWT) is encrypted with CEK using AES-GCM
6. Server sends: ephemeral public key + encrypted payload
7. Device performs ECDH between its private key and server's ephemeral public key → same shared secret → decrypts payload
8. No key material is ever transmitted in plaintext; the private key never leaves the device

This gives **forward secrecy per request** (each activation uses a fresh ephemeral key) and ensures only the exact device can decrypt its own license.

## Key Properties
- **Confidentiality:** Only the key holder can read the payload
- **Integrity:** Authenticated encryption (GCM) detects tampering
- **Asymmetric key establishment:** ECDH-ES avoids the need to pre-share a secret; the sender only needs the recipient's public key
- **Forward secrecy:** Ephemeral sender keys mean past messages can't be decrypted if the long-term key is later compromised
- **Composable:** JWTs are commonly nested inside JWE, giving a signed + encrypted token in one compact string
- **URL-safe compact form:** Works in HTTP headers, query params, cookie values

## Relationships
- Related to [[device-bound-licensing]]: JWE is the encryption envelope that makes device-bound licenses non-transferable — the license JWT is encrypted to the device's public key
- Part of the JOSE family alongside JWT (JSON Web Token), JWS (JSON Web Signature), and JWK (JSON Web Key)
- Related to [[zero-trust-architecture]]: JWE implements the "encrypt everything in transit" principle at the token level
- Related to [[agent-attestation-standards]]: attestation tokens can be wrapped in JWE when they carry sensitive device metadata

## Applications
- **Device-bound software licensing:** Encrypting a license JWT to a specific device's public key (see [[device-bound-licensing]])
- **API request encryption:** Encrypting sensitive request payloads beyond TLS — defence-in-depth where TLS termination is untrusted
- **Secure token exchange in OIDC:** OpenID Connect uses JWE for encrypted ID tokens when the RP registers an encryption key
- **Mobile app secrets distribution:** Delivering configuration secrets (API keys, etc.) encrypted to a device key at provisioning time — only that device instance can decrypt
- **Healthcare / financial data portability:** SMART on FHIR and financial data APIs use JWE to protect sensitive records during inter-party exchange

## Study
- Flashcards: [[flashcards/jwe-json-web-encryption|Practice this concept]]

## Sources
- [RFC 7516 — JSON Web Encryption](https://www.rfc-editor.org/rfc/rfc7516) — The defining IETF specification
- [RFC 8037 — ECDH with X25519 in JOSE](https://www.rfc-editor.org/rfc/rfc8037) — Extension defining X25519/X448 key agreement for JWE
- [tauri-plugin-better-auth-license on crates.io](https://crates.io/crates/tauri-plugin-better-auth-license) — Practical example: JWE used for device-bound license delivery in Tauri apps

## See Also
- [[device-bound-licensing]]
- [[zero-trust-architecture]]
- [[agent-attestation-standards]]
- [[licensing-as-a-service]]
