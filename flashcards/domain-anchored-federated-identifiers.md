---
tags: [flashcards, architecture, identity, distributed-systems, naming]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Domain-anchored federated identifiers — Flashcards

#flashcards/architecture

## Definition <!-- kb:card:3bac06 -->
What is a domain-anchored federated identifier?
?
An identifier that names a resource by embedding a verifiable domain name as its root (e.g. urn:scheme:example.com:namespace:resource-name) instead of network location or cryptographic identity, keeping the name stable and collision-free across independent federated registries.

## Identity vs location <!-- kb:card:c847a8 -->
What two roles does a plain URL conflate that a domain-anchored identifier separates?
?
Logical identity (the permanent name) and physical location (where to fetch it right now) — a URL collapses both, so references break when infrastructure migrates even though the resource itself hasn't changed.

## Federated trust mechanism <!-- kb:card:f43c0a -->
How does anchoring an identifier to a domain let a federated registry verify a claimed namespace without a central naming authority?
?
The registry checks that the identifier's domain segment is cryptographically backed by that domain's own security credentials (verifiable via DNS), rejecting claims to a namespace the claimant does not control.

## Third decoupled role <!-- kb:card:c46f72 -->
Besides logical identity and physical location, what third role does this identifier scheme keep separate?
?
The runtime cryptographic security principal used to authenticate the resource (e.g. a certificate, SPIFFE ID, or DID) is kept decoupled from the discovery identifier itself.

## Uniqueness guarantee <!-- kb:card:3199a3 -->
Where does this identifier scheme get its cross-registry uniqueness guarantee from?
?
It reuses DNS's existing global uniqueness guarantee for free, rather than inventing a new namespace-allocation scheme.
