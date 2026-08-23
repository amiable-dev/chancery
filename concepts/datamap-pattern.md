---
title: "Datamap Pattern"
date: 2026-08-01
domain: data
maturity: emerging
source_type: practitioner
topics: [patterns, rag]
tags: [concept, ai-agents, architecture, data-governance, infrastructure, ontology, domain/data, maturity/emerging, source-type/practitioner, topic/patterns, topic/rag]
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
    hash: sha256:b20520de2900c93455d4757c6d6ed3ab57f2a8351623246c60ee9dbfe22da7ef
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Datamap Pattern

## Definition
The **datamap pattern** describes each connected data source declaratively as a typed hierarchy of what exists there — rather than writing a bespoke sync script per source — so that ingestion becomes an ontology-and-data problem instead of a per-connector coding problem. A warehouse's datamap is `connection → database → schema → table → column`; a wiki's is `space → page → block`; each level can declare its own context types and refresh cadence.

## Explanation
The naive way to ingest N heterogeneous sources (SQL warehouses, wikis, ticketing systems, chat) is to write N sync scripts, each independently implementing "list, fetch, paginate, handle deletes." Every implementation carries its own bugs, and none of them share fixes: a deletion-handling bug fixed in the wiki connector teaches you nothing about the warehouse connector.

The datamap pattern inverts this: describe the *shape* of each source type as data (a typed hierarchy), and write one mining engine that walks any hierarchy. Once the hierarchy is data instead of code, one engine serves seven SQL warehouses without branching on vendor name — the engine doesn't know or care whether it's walking Snowflake or Postgres, only that it's walking `connection → database → schema → table → column`.

This has a second, less obvious payoff: **identity**. Every mined artifact gets an identity derived from `(tenant, type, path)` — a deterministic key rather than an auto-incrementing ID or a source-specific primary key. That determinism is what makes the ingestion loop idempotent: if an orchestrator retries a failed step, or a worker crashes mid-batch and resumes, re-mining the same path produces the same identity and safely overwrites rather than duplicating. Without a datamap's typed path structure, idempotent retries would need source-specific dedup logic — exactly the kind of per-connector special-casing the pattern exists to eliminate.

The hierarchy also determines refresh behavior: each context type declares its own cadence (a table's schema might be re-checked hourly, a wiki page's content daily), and different cadences need their own queues — sharing one queue between first-time mining and refreshes lets a backlog starve a newly connected source for days.

## Key Properties
- **Declarative, not imperative** — the source's shape is data (a typed hierarchy definition), not a sync script
- **Vendor-agnostic mining** — one engine walks any hierarchy of a given shape, with zero per-vendor branching
- **Deterministic identity** — `(tenant, type, path)` gives every context item a stable key, which is the foundation for idempotent retries
- **Per-type refresh cadence** — each level of the hierarchy can declare how often it needs re-checking, independent of other levels
- **Composable across source classes** — the same pattern (typed hierarchy → mining engine) applies whether the source is bounded (a table's columns) or an unbounded stream (tickets, PRs), though the two need opposite deletion semantics

## Relationships
- Composes [[context-layer-architecture]]: the datamap is the mechanism that makes "continuous mapping" tractable at the scale of dozens of heterogeneous sources
- Enables idempotent ingestion, the property [[context-layer-architecture]] identifies as necessary because "retries aren't an edge case in this architecture; they are the architecture"
- Related to [[metadata-as-code]]: both treat structural/configuration information as versioned data rather than embedded logic, though metadata-as-code is about agent-facing curated context, not source ingestion topology
- Contrasts with hand-written per-connector sync scripts: the datamap pattern's entire value proposition is eliminating this class of code

## Applications
- **Multi-source enterprise ingestion**: any system connecting to more than two or three structurally similar sources (multiple SQL warehouses, multiple wiki platforms) benefits from describing the shape once and writing one walker
- **New connector onboarding**: adding a new source of an already-modeled type (an eighth SQL warehouse) becomes a data-entry task (declare the connection) rather than an engineering task (write a new sync script)
- **Idempotent pipeline design generally**: the `(tenant, type, path)` identity-derivation trick is reusable in any ingestion pipeline that must survive crashes and retries without duplicating work

## Sources
- [How to Build a Context Layer and a Company Brain — Towards Data Science](https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/) — Tomer Mesika; the datamap concept is introduced as part of the "continuous mapping" section of a production multi-tenant context layer

## See Also
- [[context-layer-architecture]]
- [[metadata-as-code]]
- [[retrieval-composition-engine]]
