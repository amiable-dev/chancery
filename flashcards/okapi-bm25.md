---
tags: [flashcards, retrieval, ranking, lexical-search, domain/llm, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Okapi BM25 — Flashcards

#flashcards/retrieval

## BM25: origin <!-- kb:card:e522f1 -->
BM25 originates from which framework, and in which system was it first deployed?
?
The probabilistic relevance framework (Robertson, Sparck Jones, and colleagues), first deployed in the Okapi system at London City University.

## k1 parameter <!-- kb:card:963ebe -->
What does the k1 parameter in BM25 control?
?
The saturation of the term-frequency component — repeated term occurrences add diminishing evidence.

## b parameter <!-- kb:card:714b0b -->
What does the b parameter in BM25 control?
?
Document-length normalization — it stops long documents from winning by sheer volume.

## Determinism <!-- kb:card:31fc6a -->
Why is BM25 deterministic across runs on the same corpus?
?
It scores from corpus statistics (IDF and TF) alone, with no model, training, or network — the same query on the same corpus and parameters scores identically forever.

## BM25's blind spot <!-- kb:card:a81a53 -->
What assumption limits BM25's relevance signal regardless of parameter tuning?
?
Term-independence — it treats the query as a bag of terms, so proximity and meaning between terms are invisible to it, and a query term absent from a document contributes nothing.

## BM25F <!-- kb:card:0fb013 -->
How does BM25F extend base BM25 for structured documents?
?
It scores separate fields (e.g. title, body, anchors) with per-field weights instead of treating the document as one undifferentiated bag.
