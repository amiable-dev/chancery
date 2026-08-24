---
title: Passkeys
date: 2026-08-24
domain: security
maturity: emerging
source_type: practitioner
tags: [concept, security, authentication, identity, domain/security, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.thoughtworks.com/radar/techniques
    hash: sha256:52b9aa4d85844d1297a66a66f03904fc0d72fc860de4eb0fb9196fe3e6f1e8c7
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Passkeys

## Definition

**Passkeys** are FIDO2 credentials that replace passwords with asymmetric cryptography: a key pair is generated per site, the private half stays in a hardware-backed secure element unlocked by biometric or PIN, and the site stores only the public half — and because the credential is bound to the origin it was created for, a lookalike domain cannot elicit a usable signature, which makes phishing resistance a structural property of the protocol rather than a matter of user vigilance.

## Explanation

The mechanism turns on two facts working together. First, the secret never travels: authentication is a challenge signed on the device, so there is no shared value for a server breach, a network intercept or a convincing form to capture. Second, the browser or platform will only offer a credential whose registered relying-party identifier matches the origin actually being visited, so a proxy site that renders a perfect replica of a login page receives nothing — a difference in kind from one-time codes, whether by SMS or authenticator app, which a real-time phishing proxy simply relays. Given that phishing accounts for a large share of breaches, that structural property is the whole argument. The remaining objections have been closing: synced passkeys, once viewed as weaker because the private key is replicated through a credential manager, are now treated as meeting a mid-tier assurance level in updated US federal guidance, a portability protocol allows credentials to move between managers instead of stranding users in one vendor's ecosystem, and mainstream identity providers expose passkeys as a first-class option, which is what reduced adoption from a multi-month project to a couple of sprints. Two design cautions carry more weight than the adoption numbers. Account recovery is where the phishing resistance is usually thrown away — a fallback to SMS codes or emailed links reintroduces exactly the interceptable channel the credential eliminated — and the highest assurance tier still requires device-bound credentials on hardware keys rather than synced ones, which matters for privileged access. The scale and success-rate figures quoted alongside all this come from the alliance and the platforms themselves, so they are self-reported adoption claims rather than independent measurement.

## Key Properties

- Per-site key pair; the private key stays in a hardware-backed secure element unlocked by biometric or PIN
- Origin binding to the relying-party domain makes phishing resistance structural, unlike OTP codes a proxy can relay
- Servers store only public keys, so a credential database breach yields nothing replayable
- Synced passkeys now qualify for mid-tier assurance, with an exchange protocol for portability between managers
- Recovery paths and fallbacks are the weak point: an SMS or emailed link reintroduces the phishable channel
- The highest assurance tier still needs device-bound credentials on hardware keys

## Relationships

- _No relationships recorded yet._
- [[attested-per-agent-identity]] — per-agent attestation and passkeys apply the same anti-impersonation pattern to different principals — both bind an asymmetric credential to a lifecycle so it cannot be replayed elsewhere, passkeys to a browser origin and human presence, attestation to an agent's own lifecycle and hosting resource.

## Applications

Choosing the default authentication method for a new consumer or workforce application; removing phishable fallbacks from an existing login and recovery flow; meeting regulatory mandates for phishing-resistant authentication in finance and government systems.

## Sources

- https://www.thoughtworks.com/radar/techniques

## See Also

- _None yet._
