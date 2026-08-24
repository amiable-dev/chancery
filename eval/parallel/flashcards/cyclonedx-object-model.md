---
tags: [flashcards, security, supply-chain, standards, domain/standards, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# CycloneDX object model — Flashcards

#flashcards/security

## Definition <!-- kb:card:6ebb6f -->
What is the CycloneDX object model?
?
The schema at the core of the OWASP CycloneDX BOM standard: a modular, extensible object model for stating what a software system is made of and what is claimed about it, serialized as XML, JSON or Protocol Buffers.

## Key mechanism <!-- kb:card:787f58 -->
What gives the CycloneDX object model its reach, per the spec?
?
Pairing an inventory (components, services, dependencies) with claims made about that inventory (vulnerabilities, formulation, definitions/declarations).

## Compositions <!-- kb:card:62115e -->
What do 'compositions' declare in a CycloneDX BOM?
?
How complete the inventory claims to be: complete, incomplete, incomplete first-party-only, incomplete third-party-only, or unknown.

## Dependency graph scope <!-- kb:card:4fb4df -->
Besides direct component-to-component edges, what else can CycloneDX's dependency graph represent?
?
Transitive dependencies, plus component-to-service and service-to-service dependencies.

## Definitions vs. declarations <!-- kb:card:a3c293 -->
In CycloneDX, how do 'definitions' differ from 'declarations'?
?
Definitions express standards (e.g. OWASP ASVS, MASVS) machine-readably; declarations attach attestations, claims, evidence and signatures against those definitions — the basis for compliance-as-code.
