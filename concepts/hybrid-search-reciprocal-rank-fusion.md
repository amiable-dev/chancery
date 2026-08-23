---
title: "Hybrid Search with Reciprocal Rank Fusion"
aliases: ["Hybrid Search with Reciprocal Rank Fusion"]
date: 2026-04-14
domain: knowledge-management
maturity: established
source_type: practitioner
topics: [rag, pkm]
tags: [concept, knowledge-management, search, information-retrieval, ai-agents, pkm, domain/knowledge-management, maturity/established, source-type/practitioner, topic/rag, topic/pkm]
status: draft

sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
    hash: sha256:9cec05f1dcdf4fc0162cfd801b68c448df9b7ee1fa4ee94c17c5c607909ab3ff
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://dl.acm.org/doi/10.1145/1571941.1572114
    unreachable: true
    reason: HTTP 403
    checked: 2026-08-21
    class: unclassified
    reachability: blocked-4xx
---

# Hybrid Search with Reciprocal Rank Fusion

## Definition
A search strategy for LLM knowledge bases that combines three complementary retrieval streams — BM25 keyword matching, vector embedding similarity search, and graph traversal — whose result sets are merged using Reciprocal Rank Fusion (RRF), a rank-aggregation algorithm that produces a single prioritised result list without requiring score normalisation.

## Explanation
No single search mechanism is sufficient for a mature knowledge base:

| Stream | Strengths | Weaknesses |
|--------|-----------|------------|
| **BM25** | Exact terms, rare tokens, proper nouns | Misses synonyms, semantics |
| **Vector search** | Semantic similarity, paraphrases | Misses exact tokens, slow on large corpora |
| **Graph traversal** | Structural/relational connections | Requires typed graph; misses unlinked content |

**Reciprocal Rank Fusion:**  
Each stream returns a ranked list. RRF merges them:

```
RRF_score(d) = Σ 1 / (k + rank_i(d))
```

Where `rank_i(d)` is document `d`'s rank in stream `i`, and `k` (typically 60) is a smoothing constant that prevents top-ranked results from dominating. Documents appearing in multiple streams get boosted without requiring score normalisation across heterogeneous systems.

**Why RRF works:**  
A document that ranks #2 in BM25, #5 in vector, and #3 in graph will outscore a document that ranks #1 in just one stream. The fusion rewards cross-stream corroboration.

**Practical scale threshold:**  
`index.md` (flat catalogue) works as the primary search mechanism up to ~100–200 pages. Beyond that, full hybrid search is needed — the index itself becomes too large for a single LLM context window.

## Key Properties
- Three complementary streams: BM25, vector, graph.
- RRF normalisation-free rank fusion — works across heterogeneous scoring systems.
- Flat `index.md` remains as a human-readable catalogue; not the primary query path at scale.
- Each stream is independently useful; hybrid is the sum of their complementary strengths.
- Graph stream requires [[typed-knowledge-graph]] infrastructure.

## Relationships
- Depends on [[typed-knowledge-graph]] for the graph traversal stream.
- Enabled by [[agent-knowledge-schema]] which defines entity types graph traversal relies on.
- Replaces sole reliance on `index.md` at scale (>100–200 pages).
- Feeds back into [[knowledge-confidence-scoring]]: results appearing in multiple streams can receive a confidence boost.
- [[hyde-hypothetical-document-embeddings]] — fuses rankings across retrievers, where HyDE instead reshapes the query before any retriever sees it

## Applications
- **Large wiki retrieval:** When a knowledge base outgrows a single index file, hybrid search maintains quality retrieval.
- **Semantic + exact balance:** Technical queries (exact function names) and conceptual queries (design intent) both get correct results.
- **Relational queries:** "Everything that depends on service X" requires graph traversal — not available in BM25 or vector search alone.
- **PoC path:** Start with BM25 + vector (e.g., via a simple `sqlite-vec` or `chromadb` setup on the Obsidian vault). Add graph traversal as a third stream once the [[typed-knowledge-graph]] PoC is running. Validate that the fused results are qualitatively better than vector-only at query time.

## Sources
- [LLM Wiki v2 — Rohit Ghumare](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — hybrid search, RRF, scale thresholds
- [Reciprocal Rank Fusion (Cormack et al., 2009)](https://dl.acm.org/doi/10.1145/1571941.1572114) — original RRF paper

## See Also
- [[typed-knowledge-graph]]
- [[agent-knowledge-schema]]
- [[knowledge-confidence-scoring]]
