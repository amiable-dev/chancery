---
title: Context layer
date: 2026-08-24
domain: data
maturity: emerging
source_type: practitioner
tags: [concept, data, ai-agents, architecture, domain/data, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
    hash: sha256:b20520de2900c93455d4757c6d6ed3ab57f2a8351623246c60ee9dbfe22da7ef
    retrieved: 2026-08-24
    reachability: ok
    class: external-primary
---

# Context layer

## Definition

A **context layer** is the production system behind the 'company brain' idea: it continuously maps source systems into normalized, typed context items, indexes them multiple specialized ways, composes the right subset into a token budget at query time, learns from curation and usage, and acts on the sources it describes — with tenancy, permissions, freshness, and cost as first-class constraints.

## Explanation

The demo version — chunk, embed, retrieve top-k, paste — is a weekend project that works on ten questions and fails quietly in production; the essay's claim is that each verb in the definition hides a distributed-systems problem the demo never meets. Ingestion is a reconciliation loop that never terminates, driven by a declarative *datamap* — a typed hierarchy of what exists in each source (warehouse: connection → database → schema → table → column; wiki: space → page → block) — so one mining engine serves many sources without vendor branching, and a coverage query decides what is missing or stale. Item identity derives from (tenant, type, path), which makes retries and crashes idempotent. Ground truth lives in a per-tenant relational store; the keyword index (for lexical recall like table names), vector collections (split by content kind), and knowledge graph (containment, joins, lineage) are all rebuildable projections — 'search indexes are caches, the database is the truth.' Isolation is physical (schema, index, collection, graph per tenant), because a forgotten filter fails open while a wrong index name fails closed; the final ACL check before content reaches a prompt is the relational store, with search indexes only permissive prefilters. Curated human knowledge outranks mined metadata on conflict, and execution credentials are separated from mining credentials because their blast radii differ.

## Key Properties

- Never-terminating reconciliation loop over declarative datamaps, not per-source sync scripts
- Deterministic identity (tenant, type, path) makes every operation idempotent
- Relational truth store; keyword, vector, and graph indexes are rebuildable projections
- Physical per-tenant isolation; relational store is the last ACL check before a prompt
- Human-curated notes outrank mined metadata on conflict

## Relationships

- [[sync-deletion-semantics]] — depends on that discipline to keep its map truthful — a missed deletion channel leaves the brain confidently describing what no longer exists
- [[retrieval-composition-engine]] — delegates its query-time verb to that engine, which composes heterogeneous context under a token budget
- [[golden-dataset-retrieval-evals]] — is kept honest by that harness, because its retrieval quality degrades invisibly otherwise
- [[llm-maintained-wiki]] — contrasting substrates for agent knowledge: the wiki distils at write time into curated pages, the context layer indexes sources at read time and layers curation on top

## Applications

Grounding enterprise agents in company data with defensible permissions; deciding build-versus-buy (build if the context layer is the product, buy if it is a feature); explaining why the RAG demo and the production system are different artifacts.

## Sources

- https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/

## See Also

- [[sync-deletion-semantics]]
- [[retrieval-composition-engine]]
- [[golden-dataset-retrieval-evals]]
