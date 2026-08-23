---
title: "ADR-007: Retrieval is lexical + curated graph, escalated by measured recall — not corpus size"
status: accepted
date: 2026-08-22
tags: [adr, retrieval, query]
links: ["003-files-are-canon.md"]
council_review: "2026-08-22 packet 2 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

The 2025–26 "RAG is dead" settlement: single-pass chunk→embed→top-k died as a default; the winner is conditional, agent-driven retrieval over navigable, deterministic corpora (Claude Code's grep-first result, LlamaIndex's own concession, Sourcegraph's deterministic-search guidance). The one controlled head-to-head (Cursor, Nov 2025) shows semantic search paying off *as a hybrid on top of lexical*, concentrated at 1,000+-file scale. Long context is not the answer either (context-rot sets in far below window limits).

## Decision

1. **Now**: lexical IDF ranking + the hand-curated typed relationship graph (edges travel with every hit) + facet pre-filtering. No embeddings at ~250 notes — an evidence-based position, not an aesthetic.
2. **Escalation is eval-triggered, never size-triggered**: a maintained ~30-query eval set with pinned expected results, run as a **scheduled monthly job — not part of `kb verify`** (the gate stays fast, hermetic, and free of quality-trend concerns; the eval job files its result as a dated report). Recall@10 < 0.8 for two consecutive months triggers the next rung. (Invented thresholds like "at 2k notes" are explicitly rejected.)
3. **The ladder**: rung 2 = SQLite FTS5/BM25 as a C7 *derived, rebuildable* index; rung 3 = **local** embeddings + reciprocal-rank fusion, still serverless, still no secret — and the embedding step, like every network-or-model-adjacent operation, lives **outside the gate path**: `kb verify` never computes, fetches, or depends on an embedding; it at most byte-checks a committed index against regeneration metadata. **Never**: API embeddings anywhere in the engine, trained/RL retrievers, or auto-extracted GraphRAG — the curated links are the hallucination-free graph extraction pipelines fail to produce.
4. **Retrieval provenance is checked deterministically** (renamed from "grounding", which overclaimed): the check proves *an answer cites only notes that were actually retrieved for that query* — it does not and cannot prove the answer is faithful to those notes' content. A query answer citing a concept outside the retrieved set is rejected; faithfulness beyond that is the supplier's accountability, visible in C6.
5. Curated graphs rot by omission — that risk is assigned to the audit spec (staleness/omission checks), not ignored.

## Consequences

- Retrieval stays zero-infrastructure until measurement says otherwise; the eval set becomes a first-class asset.
- The FTS5 rung, when triggered, doubles as the home for any future claim-level querying (ADR-003).
