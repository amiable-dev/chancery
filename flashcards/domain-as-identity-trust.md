---
tags: [flashcards, ai-agents, security, cryptography, trust, identity]
sr-due: 2026-06-18
sr-interval: 1
sr-ease: 250
---

# Domain-as-Identity Trust — Flashcards

#flashcards/security

## Definition <!-- kb:card:d62861 -->
What is domain-as-identity trust?
?
A trust model where ownership of a DNS domain serves as the primary identity anchor for cryptographically verifying the publisher of AI capabilities. Hosting a manifest at a well-known path on a controlled domain leverages existing DNS/TLS infrastructure — rather than a central certificate authority or identity broker — to assert publisher identity.

## Why Domain Ownership Implies Trust <!-- kb:card:8a56d5 -->
Why does hosting at `/.well-known/ai-catalog.json` on a domain serve as a trust proof?
?
Because TLS certificate issuance requires domain control verification. If `https://acme.com/.well-known/ai-catalog.json` is served over TLS, the DNS/TLS ecosystem guarantees the actual owner of `acme.com` put it there. You can't serve a valid TLS response from a domain you don't control.

## Trust Manifest <!-- kb:card:4585e1 -->
What is a trust manifest in ARD?
?
A structured JSON document embedded in (or linked from) a capability catalog that cryptographically binds capability claims to the publisher's domain identity. It can include compliance certifications (HIPAA, SOC2) and can be verified by clients or registries before connecting, enabling compliance gating without a central authority.

## No Central Authority <!-- kb:card:0396fd -->
Why does ARD's trust model not require a central certificate authority?
?
Because it reuses the existing public internet PKI — DNS + TLS — which is already distributed across many CAs. Domain ownership verification is a solved problem. ARD piggybacks on this instead of building a new centralised trust system.

## Relationship to Agent Attestation <!-- kb:card:20e02f -->
How does domain-as-identity trust differ from agent attestation standards?
?
Domain-as-identity operates at the *publisher* level: "Is this organisation who they claim to be?" Agent attestation operates at the *artifact* level: "Was this agent binary built from the claimed source code?" Both are cryptographic provenance mechanisms but at different layers.

## Application — Spoofing Resistance <!-- kb:card:1f56f7 -->
How does domain-as-identity trust prevent capability spoofing?
?
An attacker would need to actually control `acme.com`'s DNS and TLS certificate to publish a fraudulent catalog under that domain. They can't just claim to be Acme — they have to own the domain. This is the same reason you can't easily fake being `google.com`.
