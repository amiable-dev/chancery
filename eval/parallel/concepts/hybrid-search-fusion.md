---
title: Hybrid search with rank fusion
date: 2026-08-24
domain: knowledge-management
maturity: emerging
source_type: practitioner
tags: [concept, retrieval, search, knowledge-management, domain/knowledge-management, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
    class: external-primary
---

# Hybrid search with rank fusion

## Definition

**Hybrid search with rank fusion** combines three retrieval streams over one corpus — BM25 keyword matching with stemming and synonym expansion, vector search over embeddings for semantic similarity, and entity-aware graph traversal for structural connections — and merges their candidate lists with reciprocal rank fusion, on the grounds that each stream retrieves relevant material the other two systematically miss.

## Explanation

Each stream has a characteristic blind spot the others cover: BM25 finds exact terms and identifiers that embeddings blur, vectors find paraphrases and semantic neighbours that share no keywords, and graph traversal finds items connected by relationships that neither textual stream can see. Reciprocal rank fusion merges by rank position rather than raw score, which sidesteps calibrating incomparable scoring scales across the streams. The pattern's trigger is scale: an LLM-maintained wiki can navigate by reading a single index file in full up to roughly 100-200 pages, after which the index outgrows a single reading pass and real search must replace it as the model's primary mechanism — the index survives as a human-readable catalog. The claim that the fused ensemble beats any single approach comes from a practitioner extension gist reporting production experience with agentmemory, a memory engine for coding agents; it matches the wider industry practice of hybrid lexical-plus-vector search, but the note offers no published measurements.

## Key Properties

- Three streams: BM25 (exact terms, stemming, synonym expansion), embedding vectors (semantic similarity), graph traversal (structural connections)
- Reciprocal rank fusion merges by rank position, sidestepping score calibration across streams
- Single-file index navigation stops scaling around 100-200 pages; past that the index remains a human catalog while search takes over
- Each stream catches relevant results the others systematically miss

## Relationships

- [[llm-wiki-architecture]] — replaces that architecture's index-first navigation once the wiki outgrows the roughly hundred-source scale its index file can serve in a single reading pass
- [[graph-vs-vector-code-retrieval]] — operationalizes that comparison's closing rule — structural questions want graphs, semantic ones want similarity, production needs both — by running the streams in parallel and fusing their ranks
- [[retrieval-composition-engine]] — shares the move of composing multiple retrieval strategies per query, but fuses fixed parallel streams by rank where that engine routes predicate-gated strategies under token budgets
- [[typed-knowledge-graph-layer]] — draws its third stream from that layer, whose typed, entity-aware edges make traversal usable as a retrieval strategy
- [[hypothetical-document-embeddings]] — HyDE supplies a drop-in enhancement for exactly the vector-search stream hybrid search fusion combines with BM25 and graph traversal — a generated-passage vector is a better query representation for one of its three input streams.

## Applications

Search over a knowledge base that has outgrown catalog-file navigation; retrieval layers for agent memory where identifier lookups, paraphrase questions and dependency questions all occur against the same corpus.

## Sources

- https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2

## See Also

- [[graph-vs-vector-code-retrieval]]
- [[retrieval-composition-engine]]
