---
tags: [flashcards, oauth, security, protocols, domain/standards, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Authorization response issuer identification — Flashcards

#flashcards/oauth

## Definition <!-- kb:card:093016 -->
What problem does authorization response issuer identification (RFC 9207) solve, and how?
?
It closes the OAuth mix-up attack gap by having each authorization server include an `iss` parameter (its issuer identifier) in every authorization response, success and error alike, so a client trusting multiple servers can verify who actually responded, via string comparison against the expected issuer.

## Mix-up attack mechanics <!-- kb:card:3ccdc9 -->
What is a mix-up attack, and how does the `iss` parameter defeat it?
?
An attacker who controls one authorization server the client trusts steers the flow so the client receives an honest server's code but redeems it at the attacker's token endpoint. Because the honest response carries its own `iss`, the client can detect the mismatch against the server it believes it contacted, and reject the response.

## Per-server support tracking <!-- kb:card:3e8dde -->
Why must a client track whether `iss` is supported on a per-server basis, rather than just checking whether the field is present?
?
In mixed deployments, if the client doesn't already know a server supports `iss`, an attacker can defeat the check by simply omitting the parameter from a forged response — the client has no way to distinguish "not supported" from "attacker stripped it."

## Why no integrity protection <!-- kb:card:960207 -->
Why does RFC 9207 leave `iss` without cryptographic integrity protection, and is that a flaw?
?
It's deliberate: an attacker able to tamper with an honest server's response already holds the authorization code and has no need to mount a mix-up attack at all, so protecting `iss` cryptographically would guard against a threat that's already moot.

## Normative status and proof <!-- kb:card:834196 -->
What kind of document is RFC 9207, and what backs its claim that `iss` defeats mix-up attacks?
?
An IETF Standards Track document, so the `iss` requirement is normative, not advisory. The claim was formally proven, not merely asserted, in Fett, Küsters and Schmitz's comprehensive formal security analysis of OAuth 2.0.
