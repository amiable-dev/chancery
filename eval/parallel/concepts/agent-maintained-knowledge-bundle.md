---
title: Agent-maintained knowledge bundle
date: 2026-08-24
domain: standards
maturity: emerging
source_type: vendor-doc
tags: [concept, knowledge-management, provenance, standards, domain/standards, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
    hash: sha256:b87f2d7b1524b0ab81d0ad27f756210e51d42613fcf2dde17b4842b06be11824
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Agent-maintained knowledge bundle

## Definition

An **agent-maintained knowledge bundle** is a corpus of knowledge documents — plain markdown files with YAML frontmatter, arranged in a directory tree — whose frontmatter carries the small set of facts a reader needs once most of the text was written by machines rather than people: what each document was derived from, who or what has confirmed it, when it stops being trustworthy, and whether it is still the current version. The convention is deliberately thin, with no schema registry, no central authority and no required runtime, so the corpus stays readable without tooling and shippable as an ordinary repository while remaining traversable by code.

## Explanation

The mechanism is four optional frontmatter families layered onto an otherwise unopinionated markdown convention, each answering one question a machine-written corpus raises that a hand-written one does not. Provenance records the materials a document derives from and, per source, objective credibility signals — author, exercise count over a stated window, last-modified date — and deliberately stores signals rather than a score, because a score is subjective, unportable between consumers and goes stale, so credibility is inferred at read time instead of frozen at write time. Trust splits authorship from confirmation: who wrote a document need not be who checked it, so generation and verification are separate keys, verification is a list because independent checks accumulate, and trust tiers (unverified, machine-confirmed, human-reviewed) are derived from whether any verifier's actor string carries the human prefix rather than stored as a judgement. Lifecycle uses a status value plus an absolute expiry instant rather than a relative time-to-live, which makes staleness a plain comparison needing no reference to when the document was read. Per-claim attribution uses footnotes keyed to a stable source id rather than a positional index, on the reasoning that agents constantly rewrite these documents and a positional reference misattributes silently the moment a list is reordered. Conformance is asymmetric on purpose: producers should follow the families they use, but consumers must not reject a bundle for missing optional fields, unknown type values, unknown extra keys or broken cross-links, since a link with no target is treated as not-yet-written knowledge. The source is Google Cloud's Open Knowledge Format specification at version 0.2 — a vendor-published but openly specified convention that argues its design rather than measuring it, so the rationales are reasoning to weigh, not evidence.

## Key Properties

- A directory of markdown files with YAML frontmatter; a single type key is the only always-required field
- Credibility is recorded as per-source signals — author, usage count, last modified — never as a stored score
- Generation and verification are separate keys, and trust tiers derive from the verifier's actor prefix rather than being written down
- Expiry is an absolute instant, so staleness is a comparison that does not depend on when the document is read
- Consumers must not reject a bundle for missing optional fields, unknown types or broken links

## Relationships

- [[agent-skills-format]] — shares this markdown-plus-frontmatter, no-SDK-required design but packages procedure for an agent to execute, where this packages knowledge for an agent to read and re-verify
- [[llm-wiki-architecture]] — is exactly the kind of machine-written corpus whose provenance, trust and freshness questions these frontmatter families exist to answer from metadata alone
- [[event-driven-knowledge-maintenance]] — supplies the refresh trigger this convention only records — an expiry instant marks when a document goes stale, but the format executes nothing and refreshes nothing itself
- [[attested-computation]] — is the document type this bundle format defines for figures that must be recomputed and checked rather than trusted as prose

## Applications

Standing up an agent-written documentation or metadata corpus where a reader must judge trust document by document; retrofitting provenance, verification and expiry onto an existing markdown wiki; exchanging curated knowledge between organizations that share no runtime or query infrastructure.

## Sources

- https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md

## See Also

- [[agent-skills-format]]
- [[llm-wiki-architecture]]
- [[event-driven-knowledge-maintenance]]
- [[attested-computation]]
