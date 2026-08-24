---
tags: [flashcards, data, ai-agents, architecture, domain/data, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Context layer — Flashcards

#flashcards/data

## Definition <!-- kb:card:50ba75 -->
What is a context layer?
?
The production system behind the "company brain" idea: it continuously maps source systems into normalized, typed context items, indexes them multiple specialized ways, composes the right subset into a token budget at query time, learns from curation and usage, and acts on the sources it describes — with tenancy, permissions, freshness, and cost as first-class constraints.

## Key mechanism: datamap-driven reconciliation <!-- kb:card:34973e -->
What drives ingestion in a context layer, and why does the process never terminate?
?
A declarative datamap — a typed hierarchy of what exists in each source (e.g. warehouse: connection to database to schema to table to column) — drives a reconciliation loop whose coverage queries continuously find what is missing or stale, so one mining engine serves many sources without vendor branching.

## Idempotent identity <!-- kb:card:b68933 -->
What makes context-layer ingestion operations idempotent under retries and crashes?
?
Item identity derives deterministically from the triple (tenant, type, path).

## Truth store vs. rebuildable projections <!-- kb:card:ce27c4 -->
In a context layer, what holds ground truth, and what are the keyword index, vector collections, and knowledge graph?
?
Ground truth lives in a per-tenant relational store. The keyword index, vector collections, and knowledge graph are all rebuildable projections of it — "search indexes are caches, the database is the truth."

## Physical isolation and final ACL check <!-- kb:card:07e9bd -->
How does a context layer enforce tenant isolation and access control before content reaches a prompt?
?
Isolation is physical: a separate schema, index, collection, and graph per tenant. The relational store performs the final ACL check; search indexes act only as permissive prefilters, because a forgotten filter fails open while a wrong index name fails closed.

## Conflict resolution <!-- kb:card:38d678 -->
When curated human knowledge conflicts with mined metadata in a context layer, which one wins?
?
Curated human knowledge outranks mined metadata on conflict.
