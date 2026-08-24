---
tags: [flashcards, retrieval, search, knowledge-management, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Hybrid search with rank fusion — Flashcards

#flashcards/retrieval

## Definition <!-- kb:card:c1d6b3 -->
What three retrieval streams does hybrid search with rank fusion combine, and how are the results merged?
?
BM25 keyword matching (with stemming and synonym expansion), vector search over embeddings, and entity-aware graph traversal — merged with reciprocal rank fusion.

## Why rank position, not score <!-- kb:card:ed2fdd -->
Why does reciprocal rank fusion merge candidate lists by rank position instead of raw relevance score?
?
Because it sidesteps having to calibrate incomparable scoring scales across three different retrieval streams.

## Complementary blind spots <!-- kb:card:cdb187 -->
What blind spot does each of the three streams cover that the other two systematically miss?
?
BM25 finds exact terms and identifiers embeddings blur; vectors find paraphrases and semantic neighbours sharing no keywords; graph traversal finds relationship-connected items neither text stream can see.

## Trigger for adoption <!-- kb:card:06e96d -->
At roughly what scale does single-file index navigation stop working, forcing real search to take over?
?
Around 100-200 pages/sources — past that, the index survives only as a human-readable catalog, not the primary navigation mechanism.

## Evidence caveat <!-- kb:card:54f80f -->
What is the evidentiary basis for the claim that the fused ensemble beats any single retrieval approach?
?
A practitioner gist reporting production experience with one memory engine (agentmemory) — it matches wider hybrid-search industry practice but reports no published measurements of its own.
