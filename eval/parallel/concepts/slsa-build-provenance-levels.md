---
title: SLSA build provenance levels
aliases:
  - SLSA
  - Supply chain Levels for Software Artifacts
  - SLSA build track
date: 2026-08-24
domain: standards
maturity: established
source_type: vendor-doc
topics: [supply-chain]
tags: [concept, security, supply-chain, ci-cd, standards, domain/standards, maturity/established, source-type/vendor-doc, topic/supply-chain]
status: draft
sources:
  - url: https://slsa.dev/spec/v1.0/levels
    hash: sha256:abebc0f3b99150d819c84b397120e5220b01202f1983ea05d0751a0eb53e7c39
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# SLSA build provenance levels

## Definition

SLSA's build track defines four cumulative levels — L0 through L3 — that grade how trustworthy and tamper-resistant a software artifact's build provenance is, giving producers a checklist to work toward and consumers a common, verifiable yardstick for how much confidence a given package's build history actually deserves: L0 requires nothing, L1 only requires that provenance describing the build exists, L2 requires that provenance be signed by a dedicated hosted build platform so forging it takes an explicit attack rather than a configuration mistake, and L3 requires the build platform itself to be hardened so that runs cannot influence each other and the signing key stays inaccessible even to the build's own steps.

## Explanation

Provenance in SLSA's sense means a verifiable record of what entity built an artifact, by what process, and from what inputs — and the four levels are cumulative, so each one requires everything the level below it requires plus a specific additional guarantee. The jump from L1 to L2 is not really about producing more provenance but about who can be trusted to have produced it truthfully: at L1 provenance can be self-reported and is trivial to forge or omit, so it only helps catch honest mistakes; at L2 the provenance must come from a hosted build platform that signs it, so falsifying it requires an actual attack rather than just skipping a step, which deters casual and legally-risk-averse adversaries even though a sufficiently motivated attacker could still compromise the platform itself. L3 closes that remaining gap: the build platform must isolate concurrent runs from influencing one another and must keep its signing key unreachable from user-defined build steps, so even code running inside the build itself cannot forge or leak the credential that vouches for its own output. Each level names both what it protects against and what it deliberately still leaves open, which is what makes the framework usable as a yardstick rather than a marketing claim — a consumer can ask what level a dependency's build actually reaches and know precisely what that does and does not rule out. SLSA reached version 1.0 specifically to freeze this Build-track structure as a stable reference point after an earlier, broader version that also covered source-control aspects; those were deliberately dropped to keep the 1.0 spec's scope tight, with a Source track left for a future version rather than bundled in prematurely.

## Key Properties

- The four levels (L0-L3) are cumulative: each level's requirements include everything the previous level required, plus one additional guarantee
- L1 only requires that build provenance exist — it is trivially forgeable or omittable, and only helps catch honest mistakes, not attacks
- L2 requires that provenance be signed by a dedicated hosted build platform, so forging it requires an explicit attack rather than a configuration error
- L3 requires the build platform itself to isolate concurrent runs and keep the signing key inaccessible even to the build's own steps, closing the gap where a compromised or malicious build step could forge its own provenance
- Each level states both what it protects against and what it still leaves open, which is what makes the scale usable as a comparison yardstick rather than a pass or fail marketing claim

## Relationships

- [[threshold-signed-software-updates]] — operates one layer downstream of the same trust chain — that concept is about how a client verifies an already-built artifact was signed by a trusted key, while SLSA's levels grade how trustworthy the build process that produced the thing being signed actually was
- [[immutable-reference-pinning]] — is one concrete technique that helps satisfy SLSA's build-input integrity concerns — pinning a dependency to an immutable content hash is part of what lets a build's provenance honestly claim its inputs were exactly what it says they were
- [[exposure-first-supply-chain-defense]] — targets the same build-pipeline attack surface from the opposite direction — that concept is about removing what an attacker can steal from a CI runner, while SLSA's levels grade how hard it is to forge or tamper with what the runner claims it produced
- [[macos-gatekeeper]] — is a concrete, deployed instance of the identity-versus-build-trust gap these levels formalize — a Developer ID signature and notarization scan establish who signed an app and that it passed a malware check, but neither says anything about the build platform that produced it, which is exactly what climbing from L1 toward L3 would add.

## Applications

Use SLSA's build levels as a shared vocabulary rather than reinventing one: when adopting a dependency, ask what build level its provenance actually reaches rather than trusting a bare version number; when hardening a release pipeline, treat the levels as an incremental roadmap — first make provenance exist at all (L1), then move builds onto a hosted platform that signs it (L2), then isolate and lock down that platform's signing key from the build steps themselves (L3) — rather than attempting every control at once.

## Sources

- https://slsa.dev/spec/v1.0/levels

## See Also

- _None yet._
