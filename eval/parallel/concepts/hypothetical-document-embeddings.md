---
title: Hypothetical document embeddings (HyDE)
aliases:
  - HyDE
  - Hypothetical Document Embeddings
date: 2026-08-24
domain: knowledge-management
maturity: emerging
source_type: practitioner
tags: [concept, retrieval, rag, embeddings, domain/knowledge-management, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.freecodecamp.org/news/what-is-hyde-how-to-improve-rag-with-hypothetical-documents/
    class: external-secondary
---

# Hypothetical document embeddings (HyDE)

## Definition

**Hypothetical document embeddings (HyDE)** is a query transformation for dense retrieval: rather than embedding the user's question, an LLM is prompted to write a short passage that would answer it in the register of the target corpus, and that generated passage's vector is what searches the index. Nothing else in the pipeline changes — same embedding model, same similarity metric, same top-k — and the hypothetical passage is thrown away once its vector exists, never reaching the generator, which answers from the real documents the vector retrieved.

## Explanation

The mechanism is entirely geometric. A dense retriever is trained to place semantically similar text near each other, but it was never trained to place a question near its answer: a question and the documentation passage that resolves it differ in vocabulary, structure, and level of detail, so their cosine similarity measures an angle between two shapes of text that were never meant to be close. Generating an answer-shaped passage makes both sides of the comparison the same shape, turning question-against-answer into answer-against-answer, and everything else in a HyDE implementation — prompt wording, which small model generates, caching — is downstream of that single fact. The counterintuitive part is that factual hallucination in the hypothetical does not break the technique, because the passage functions as a retrieval representation rather than as knowledge. Asked what caused a specific private outage, the model necessarily invents a cause, but the invented passage still carries the vocabulary and register that every real postmortem shares — failover, replica, cascading timeout, connection pool — and those terms pull the vector into the neighbourhood where the true postmortem lives. It was wrong about the facts and right about the shape, and shape is what the embedding sees. The corresponding risk is architectural rather than statistical: if the hypothetical ever leaks into the generation context as though it were retrieved evidence, the fabrication reaches the user, so containing it strictly inside the retrieval step is the property to enforce. The costs are real — an extra LLM call sits on the read path — which is why the practical guardrails are a fallback to embedding the raw query when generation is slow or fails, a hard cap on generated length so unrelated concepts do not dilute the vector, PII scrubbing before a query leaves for an external provider, and structured logging of query, hypothetical, latencies, retrieved ids and scores. The technique earns its place only when query-document asymmetry is the actual bottleneck, and not when latency is tight, when queries already carry strong identifiers or error codes, when keyword or hybrid search already retrieves well, or when there is enough labelled data to fine-tune the retriever directly. The source is a tutorial explainer restating a published technique with runnable sample code; the mechanism is reproducible from that code, but the article reports no benchmark of its own, so what it establishes is the geometric argument rather than a measured gain.

## Key Properties

- The only change is what gets embedded at query time — index, embedding model, similarity metric and top-k are untouched, so adoption needs no re-indexing
- Rests on one geometric claim: embedders place similar text together but were never trained to place a question near its answer
- Hallucinated content is tolerable because the passage is a retrieval representation, not evidence — it must be right about register and vocabulary, not facts
- The safety boundary is architectural: the hypothetical must never enter the generation context, or the fabrication reaches the user
- Trades latency and cost for recall, and needs a raw-query fallback plus a generation length cap to stay safe and dense

## Relationships

- [[retrieval-augmented-generation]] — modifies that architecture at exactly one point — how the retriever encodes the query — while leaving the non-parametric index and the evidence-conditioned generator untouched, which is what makes it adoptable without rebuilding an existing pipeline
- [[hybrid-search-fusion]] — attacks the same vocabulary-mismatch failure by a different route and is partly redundant with it, since keyword and graph streams already recover documents a question-shaped vector misses — which is why an adequate hybrid pipeline is an explicit reason not to adopt this technique
- [[chain-of-thought-prompting]] — chain-of-thought prompting and HyDE share a generate-an-intermediate-artifact-to-improve-a-downstream-step pattern with opposite persistence choices — CoT's reasoning stays in context to condition the final answer, HyDE's hypothetical passage is discarded the moment its embedding is taken.

## Applications

Raising recall in a dense-retrieval pipeline whose embedding model does not know the domain and where no labelled query-document pairs exist to fine-tune a retriever — conversational support questions against formal technical documentation, or incident questions against postmortems. Also useful as a diagnostic: run it against a held-out query set to test whether query-document asymmetry is really the bottleneck before paying for an extra call on every read.

## Sources

- https://www.freecodecamp.org/news/what-is-hyde-how-to-improve-rag-with-hypothetical-documents/

## See Also

- [[retrieval-augmented-generation]]
- [[hybrid-search-fusion]]
