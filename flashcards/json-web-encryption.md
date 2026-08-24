---
tags: [flashcards, cryptography, standards, jose, domain/standards, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# JSON Web Encryption (JWE) — Flashcards

#flashcards/cryptography

## Definition <!-- kb:card:ae19a3 -->
What does JWE define, and under which RFC?
?
RFC 7516 — the IETF standard for representing encrypted and integrity-protected content as JSON-based data structures; a symmetric Content Encryption Key encrypts the payload under an authenticated encryption algorithm, delivered to recipients via one of five key management modes.

## The two-part design <!-- kb:card:c21e10 -->
What are the two separately-varying concerns in every JWE?
?
Bulk encryption of the content under a symmetric CEK (always the same mechanism), and delivery of that CEK to each recipient, which varies across the five key management modes.

## Header integrity <!-- kb:card:40aa0b -->
How does JWE protect its header from tampering, including algorithm downgrade?
?
The base64url-encoded protected header (plus an optional AAD value in the JSON serialization) is passed to the AEAD as Additional Authenticated Data, so tampering with the header invalidates the authentication tag.

## Telling JWE and JWS apart <!-- kb:card:a55829 -->
How can you cheaply tell a Compact-serialized JWE apart from a JWS?
?
By dot count — a JWE compact serialization has five base64url segments joined by four dots; a JWS has three segments and two dots.

## Avoiding a decryption oracle <!-- kb:card:a26597 -->
What must be true of how a JWE recipient handles a malformed encrypted key, and why?
?
Format, padding and length errors must be reported identically (e.g. substitute a randomly generated CEK and continue) — otherwise an attacker who flips the key-management algorithm header and observes a distinguishable error can recover the CEK, turning the recipient into a decryption oracle.
