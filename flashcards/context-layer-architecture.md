---
tags: [flashcards, ai-agents, architecture, rag]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# Context Layer Architecture — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:985e2d -->
What is a context layer, and how does it differ from a vector database?
?
A production system that continuously maps an org's sources into normalized typed context items, indexes them multiple specialized ways, composes a token-budgeted subset at query time, learns from curation and usage, and acts on the sources it describes — with tenancy, permissions, freshness, and cost as first-class constraints. The vector database is one index inside it, not the system itself.

## Application <!-- kb:card:009ddf -->
Why does the "chunk → embed → top-k → paste into prompt" demo degrade in production even though it worked on the first ten questions?
?
The demo ingests once, has one user, and is never asked "why didn't it know about X?" A production context layer must handle continuous reconciliation (sources change constantly), multi-tenant permissions, and retrieval quality that degrades invisibly — none of which the demo's assumptions ever surface.

## Relationship <!-- kb:card:ea34cf -->
How does a context layer relate to the compilation-stage knowledge layer pattern?
?
Both reject naive per-query RAG in favor of persistent, pre-processed structure. But a compilation-stage layer pre-computes task-specific knowledge artifacts once (amortizing reasoning), while a context layer continuously reconciles a live map of sources and composes a fresh subset per query (amortizing sync correctness instead).

## Five pillars <!-- kb:card:35dd0d -->
Name the five hard problems a context layer must solve that a weekend RAG demo never meets.
?
Continuous mapping (ingestion as reconciliation, not batch), indexing (relational truth + rebuildable projections), retrieval (scoped, composed dynamically), learning (curated outranks mined), and acting (execution credentials separate from mining credentials).
