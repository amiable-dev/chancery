---
title: Extension registry trust model
aliases:
  - Plugin registry trust
  - Unsandboxed extension distribution
date: 2026-08-24
domain: security
maturity: emerging
source_type: practitioner
tags: [concept, security, supply-chain, extensibility, domain/security, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/
    hash: sha256:db47a3a23c8db34574379ae1c5cfd4ced48717fb33c56242b3fea87efae9620d
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Extension registry trust model

## Definition

An **extension registry trust model** is the set of guarantees a distribution channel must supply when the extensions it distributes execute arbitrary code with no sandbox: because such a registry is in substance a channel for distributing executables, and because a signature establishes only who produced an artifact and never whether it is safe, the defensible posture is provenance plus signing, untrusted-by-default with explicit per-extension opt-in, and curation of a small vetted set rather than open submission.

## Explanation

The argument turns on what signing actually buys. A signature binds an artifact to an identity, which makes attribution and revocation possible after the fact; it makes no claim whatsoever about behaviour, so a correctly signed extension from a real account with a valid key can still read every credential the host process can reach. That gap is tolerable when the runtime confines what an extension can do and intolerable when it does not — an extension engine that can execute arbitrary commands and issue session-aware HTTP requests against whatever the host is already authenticated to inherits the host's full authority, so a compromise is total rather than partial. This is why the usual marketplace defence does not transfer: scale, reputation and takedown are remedies that operate after code has run, and against a total compromise a takedown is a post-mortem. The alternative accepts a smaller ecosystem in exchange for a bounded one — nothing is trusted until an operator explicitly enables it, provenance records what was built by whom from what, and curation replaces open submission so that the vetted set stays small enough to actually vet. The position comes from the author of an open-source scanner explaining why he had not built a registry, so it is a design stance rather than a study of registry compromises; the compensating evidence is the steady record of package-registry and editor-extension compromises that keep confirming the same asymmetry.

## Key Properties

- Unsandboxed extensions make a registry a channel for distributing executables, not documents
- Signing establishes authorship and enables revocation; it asserts nothing about behaviour
- An extension with host authority and session-aware network access inherits the host's full privilege, so compromise is total
- Takedown and reputation are post-execution remedies, which is the wrong timing for total compromise
- Untrusted-by-default with explicit opt-in, and a small curated set in place of open submission

## Relationships

- [[exposure-first-supply-chain-defense]] — names editor-extension marketplaces as a live theft channel, which is the empirical case this trust model is built to refuse
- [[model-provenance-over-inspection]] — the extension-registry trust model and model provenance over inspection make the identical argument about neighbouring artifact classes — a registry signature proves only who produced an extension, published weights cannot be reverse engineered into a description of behaviour, so trust in both cases has to come from attested lineage, not inspection.
- [[mcp-attack-surface-taxonomy]] — the extension-registry trust model supplies the concrete trust posture for the MCP attack surface taxonomy's dependency-provenance category — provenance plus signing, untrusted-by-default, and curation of a small vetted set.

## Applications

Deciding whether to open a plugin ecosystem for a tool whose extensions run unsandboxed, and what to require before doing so; evaluating an existing marketplace by asking what its signatures actually assert; arguing for a curated extension set inside an organisation rather than allowing arbitrary installs.

## Sources

- https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/

## See Also

- [[exposure-first-supply-chain-defense]]
