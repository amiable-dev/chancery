---
tags: [flashcards, security, identity, ai-agents, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Attested per-agent identity — Flashcards

#flashcards/security

## Definition: attested per-agent identity <!-- kb:card:46fb6f -->
What is attested per-agent identity, and what does it replace?
?
Each deployed agent gets its own cryptographically attested principal — a SPIFFE identifier bound to its lifecycle and hosting resource, proven by a short-lived X.509 certificate — replacing a fleet sharing one service account, so permissions and audit records attach to the individual agent.

## Proof: short-lived, auto-rotated certs <!-- kb:card:cb09f0 -->
How does the 'proof' mechanism limit the damage from credential theft?
?
The certificate is auto-provisioned and short-lived — 24 hours in the documented implementation, rotated automatically — so a stolen credential has only a small window before it expires.

## Binding: tokens tied to the certificate <!-- kb:card:691e1c -->
How are access tokens bound to an agent's identity, and what does that binding defeat?
?
Cryptographically tied to the certificate, presented over mutual TLS and, beyond a gateway, with an added proof-of-possession header — which makes a stolen bearer token useless to anyone lacking the private key.

## Brokering: outbound secrets held externally <!-- kb:card:f9269b -->
Where do an agent's outbound secrets live, and how does the agent authenticate to reach them?
?
In a credential broker, never inlined into the agent — the agent authenticates to the broker using its own attested identity, and the broker holds the actual API keys, client credentials, and delegated end-user tokens behind it.

## Use without possession <!-- kb:card:ca2444 -->
How can an agent exercise a delegated permission on a user's behalf without ever holding the user's credential?
?
A broker encrypts the end-user credential and a paired gateway decrypts it, so the agent exercises the permission without ever possessing the credential itself.

## Governance payoff: attribution <!-- kb:card:884bcb -->
What governance capability does per-agent attestation enable that shared service accounts don't?
?
Every access is traceable to a specific agent's identifier, and delegated actions log both the agent and the user — the precondition for determining, after an incident, which agent did what on whose behalf.
