---
tags: [flashcards, security, authentication, identity, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Passkeys — Flashcards

#flashcards/security

## Definition <!-- kb:card:7cc56c -->
What are passkeys, structurally?
?
FIDO2 credentials that replace passwords with asymmetric cryptography: a per-site key pair is generated, the private half stays in a hardware-backed secure element unlocked by biometric or PIN, and the site stores only the public half.

## Why phishing resistance is structural <!-- kb:card:9559b0 -->
Why is phishing resistance a structural property of passkeys rather than a matter of user vigilance?
?
Two facts: the device signs a challenge so no secret ever travels off it, and the browser only offers a credential matching the actual origin — unlike an OTP code, which a real-time phishing proxy can simply relay, a lookalike domain gets no usable passkey signature.

## Breach resilience <!-- kb:card:725d22 -->
What happens to a passkey credential database if the server is breached?
?
It yields nothing replayable — the server only ever stored the public key, never the private key.

## The weak point: recovery <!-- kb:card:7af17f -->
What is the main weak point in most passkey deployments?
?
Account recovery: falling back to SMS codes or emailed links reintroduces the exact interceptable, phishable channel that the passkey credential was designed to eliminate.

## Synced vs. device-bound assurance <!-- kb:card:a29b8d -->
How do synced passkeys compare to device-bound (hardware key) passkeys in assurance terms?
?
Synced passkeys (replicated via a credential manager) now meet a mid-tier assurance level under updated US federal guidance and can move between managers via a portability protocol; the highest assurance tier still requires device-bound credentials on hardware keys.
