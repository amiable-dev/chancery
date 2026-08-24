---
title: Okapi BM25
date: 2026-08-24
domain: llm
maturity: established
source_type: research
tags: [concept, retrieval, ranking, lexical-search, domain/llm, maturity/established, source-type/research]
status: draft
sources:
  - url: https://en.wikipedia.org/wiki/Okapi_BM25
    hash: sha256:48bf2561dbfb0e1e3aef732fae8cd21c27cfe7e816209adfc28f07a43a682bc2
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Okapi BM25

## Definition

**Okapi BM25** is the bag-of-words ranking function — from the probabilistic relevance framework of Robertson, Spärck Jones and colleagues, first deployed in London City University's Okapi system — that scores a document for a query by combining each query term's inverse document frequency with a saturating term-frequency component, normalized for document length.

## Explanation

BM25 is TF-IDF made honest about diminishing returns: term frequency contributes through a saturation curve governed by parameter k1 (repetitions add less and less evidence), and the length normalization governed by parameter b prevents long documents from winning by volume. IDF supplies the discrimination — rare terms carry more weight — computed entirely from corpus statistics, with no model, no training, and no network: given the same corpus and parameters, the same query scores identically forever, which is what makes it the default deterministic baseline in retrieval systems four decades on. The BM25F variant extends scoring across document fields (title, body, anchors) with per-field weights, which is the shape a structured corpus wants — fielded scoring over titles, definitions, and tags rather than one undifferentiated bag.

## Key Properties

- Score = per-term IDF × saturating TF, length-normalized; parameters k1 (saturation) and b (normalization)
- Deterministic and training-free: corpus statistics only
- Term-independence assumption: proximity and meaning are invisible to it
- BM25F scores structured fields with per-field weights

## Relationships

- [[hybrid-search-fusion]] — is the lexical channel that fusion pattern combines with vector search, and the function it presumes without explaining
- [[vocabulary-mismatch]] — is bounded by that phenomenon — a term absent from a relevant document contributes nothing, which is what query expansion and graph stages exist to repair

## Applications

The seed-stage scorer for lexical retrieval over a curated corpus (fielded, per BM25F); the null-hypothesis baseline any fancier ranking must beat; explainable relevance — every score decomposes into per-term contributions.

## Sources

- https://en.wikipedia.org/wiki/Okapi_BM25

## See Also

- [[hybrid-search-fusion]]
- [[vocabulary-mismatch]]
