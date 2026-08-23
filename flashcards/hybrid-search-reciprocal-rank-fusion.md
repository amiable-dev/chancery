---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- knowledge-management
- search
- information-retrieval
- ai-agents
---


# Hybrid Search with Reciprocal Rank Fusion — Flashcards

#flashcards/knowledge-management


## Definition <!-- kb:card:aef229 -->
What is Reciprocal Rank Fusion (RRF)?
?
A rank-aggregation algorithm that merges ranked result lists from multiple search streams without requiring score normalisation. Formula: RRF_score(d) = Σ 1/(k + rank_i(d)), where k≈60. Documents appearing in multiple streams are boosted over documents ranking #1 in only one stream.

## Application <!-- kb:card:b01c2a -->
When should you move beyond a single `index.md` to hybrid search?
?
When the knowledge base exceeds ~100–200 pages. At that scale, the index file itself becomes too long for a single LLM context window, and a single search strategy misses too many results. Hybrid search maintains retrieval quality as the base grows.

## Relationship <!-- kb:card:c451a9 -->
What are the three streams in hybrid search and what does each catch?
?
1. **BM25** — exact terms, rare tokens, proper nouns (misses synonyms/paraphrases).
2. **Vector search** — semantic similarity, paraphrases (misses exact tokens).
3. **Graph traversal** — relational/structural connections via typed edges (requires knowledge graph, misses unlinked content).

## Mechanism <!-- kb:card:b88c11 -->
Why does RRF work without score normalisation?
?
It uses *rank position*, not raw scores. BM25 scores are not directly comparable to cosine similarities, but a document's rank in each list is comparable. RRF rewards documents that consistently appear near the top across multiple independent streams.
