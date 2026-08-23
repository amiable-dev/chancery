---
title: "Context Layer Architecture"
date: 2026-08-01
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [rag, context-engineering, memory, enterprise]
tags: [concept, ai-agents, architecture, rag, infrastructure, data-governance, knowledge-management, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/rag, topic/context-engineering, topic/memory, topic/enterprise]
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
    hash: sha256:b20520de2900c93455d4757c6d6ed3ab57f2a8351623246c60ee9dbfe22da7ef
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Context Layer Architecture

## Definition
A **context layer** (colloquially a "company brain") is a production system, not a vector database, that continuously maps an organization's source systems into normalized typed context items; indexes those items in multiple specialized ways; composes a subset into a token budget at query time; learns from curation and usage; and acts on the sources it describes — with tenancy, permissions, freshness, and cost treated as first-class constraints rather than afterthoughts. The vector database is one index inside it, not the system itself.

## Explanation
Every organization that adopts LLMs converges on the same idea: point a model at everything the company knows — warehouse schemas, wiki pages, the Slack threads where decisions actually got made, the tribal knowledge about which table is deprecated. The weekend-project version of this (chunk → embed → top-k → paste into prompt) works impressively on the first ten questions and then degrades *silently* in production. Nobody files a ticket saying "the context was 8% worse this week" — the system just quietly starts answering from stale or incomplete data.

The gap between the demo and a production context layer is five distinct hard problems, each of which the demo never meets because it ingests once, has one user, and is never asked "why didn't it know about X?":

1. **Continuous mapping** — ingestion is a never-terminating reconciliation loop (see [[datamap-pattern]]), not a batch job. Sources change constantly, and staleness compounds because people trust the brain even after it goes stale.
2. **Indexing** — no single index serves every query shape. A relational store holds ground truth; everything else (BM25, vector collections, a knowledge graph) is a rebuildable projection that fans out from it and can be thrown away and regenerated without loss.
3. **Retrieval** — scoped by a *skill* (a slice of the map packaged with instructions for a purpose, e.g. "finance analyst") that compiles once into an authoritative filter clause, then composed by a dynamic graph of retrieval strategies (see [[retrieval-composition-engine]]) rather than a fixed pipeline.
4. **Learning** — curated human knowledge ("this table double-counts refunds before 2024") must outrank mined metadata on conflict, and behavioral signal from real usage feeds back as a ranking tie-breaker rather than an authority override (see [[curated-over-mined-precedence]]).
5. **Acting** — answering ultimately means *doing something* (running a query, filing a ticket, updating a record), which requires execution credentials scoped separately from the credentials used to mine metadata, plus durable checkpointing for anything that writes.

The article's central discipline is architectural, not algorithmic: almost none of the hard parts are about retrieval quality (ranking, embeddings, reranking). They're about sync correctness, identity, idempotency, and measurement — the unglamorous distributed-systems machinery that a weekend demo never has to build because it never runs twice.

## Key Properties
- **Not a vector database** — the vector index is one specialized projection inside a larger system with a relational source of truth
- **Reconciliation, not batch ingestion** — sync is a continuous loop reconciling what exists against what's stored, not a one-time import
- **Tenancy, permissions, freshness, and cost are load-bearing constraints**, not features bolted on after the retrieval pipeline works
- **Curated knowledge has structural priority** over mined metadata, encoded as a first-class context item type, not a footnote
- **Execution is separated from mining** — the identity crawling metadata nightly is not the identity answering a user's query
- **Degrades invisibly without a golden-dataset eval harness** — retrieval quality regressions produce no error, only quietly worse answers

## Relationships
- Extends [[retrieval-augmented-generation]]: RAG describes the retrieve-then-generate pattern; a context layer is the production infrastructure that makes RAG (and non-RAG retrieval strategies) reliable at organizational scale across many sources and tenants
- Contrasts with [[compilation-stage-knowledge-layer]]: both reject naive per-query RAG in favor of persistent, pre-processed structure, but a compilation-stage layer pre-computes task-specific [[knowledge-artifact|knowledge artifacts]] once, while a context layer continuously reconciles a live map of sources and composes a fresh subset per query — compilation trades continuous sync for amortized reasoning
- Composed of [[datamap-pattern]]: the declarative typed hierarchy that makes ingestion an ontology problem instead of a per-connector coding problem
- Composed of [[retrieval-composition-engine]]: the dynamic-graph retrieval strategy that replaces a fixed retrieval pipeline
- Governed by [[curated-over-mined-precedence]]: the ranking discipline that keeps human-curated corrections authoritative
- Related to [[claim-check-pattern]]: durable workflow orchestrators used for the ingestion reconciliation loop must not let customer data leak into orchestration vendor storage
- Related to [[separation-of-duties-agentic-sdlc]]: the same identity-separation discipline (don't let one identity both create and authorize) applies here as execution-credentials-separate-from-mining-credentials
- Related to [[ai-llm-gateway]]: acting on a context layer's contents routes back through an LLM gateway, whose route-level fallback and cost attribution are a direct answer to the "which model × provider × transport × tier failed" question
- Related to [[deterministic-grounding]]: both concepts push back against "semantic similarity is enough" — a context layer's relational ground truth is what makes retrieved context traceable and auditable

## Applications
- **Enterprise knowledge assistants** spanning warehouses, wikis, ticketing systems, and chat — anywhere an org wants one agent-facing surface over dozens of heterogeneous, permissioned sources
- **Multi-tenant SaaS products** where each customer's data must be mined, indexed, and retrieved with hard tenant isolation enforced at the relational layer, not just in application code
- **Build vs. buy decision**: build a context layer if it *is* the product; buy or use a lighter RAG stack if it's a supporting feature — "the demo takes a weekend, the brain takes a platform team"
- **PKM vaults at smaller scale**: a single-tenant, hand-curated vault (like this one) is the industrial pattern's small sibling — staging notes are mined items, concept notes are enriched projections, and the index is a rebuildable projection that must stay regenerable rather than becoming unrebuildable truth

## Sources
- [How to Build a Context Layer and a Company Brain — Towards Data Science](https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/) — Tomer Mesika (co-founder/CTO of modus, ex-Head of Architecture at Cyera), primary source; production architecture behind a multi-tenant context layer, argued through the specific failures each design decision prevents

## See Also
- [[datamap-pattern]]
- [[retrieval-composition-engine]]
- [[curated-over-mined-precedence]]
- [[claim-check-pattern]]
- [[retrieval-augmented-generation]]
- [[compilation-stage-knowledge-layer]]
- [[knowledge-artifact]]
- [[ai-llm-gateway]]
- [[deterministic-grounding]]
- [[separation-of-duties-agentic-sdlc]]
