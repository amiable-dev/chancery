---
tags: [flashcards, rag]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# HyDE (Hypothetical Document Embeddings) — Flashcards

#flashcards/rag

## Definition <!-- kb:card:a14aec -->
What is HyDE (Hypothetical Document Embeddings)?
?
A RAG retrieval technique that embeds an LLM-generated hypothetical answer passage instead of the raw user query, then uses that passage's vector to search. The hypothetical is discarded after retrieval; only the real retrieved documents go to the generator.

## Problem <!-- kb:card:8e04d6 -->
What retrieval problem does HyDE solve?
?
Query-document asymmetry: a question and the document that answers it are written in different vocabulary, structure, and level of detail. Embedding models place semantically similar text near each other, but were never trained to place a question near its answer — so direct query-to-document cosine similarity is a weak signal.

## Mechanism <!-- kb:card:884c58 -->
Why does embedding a fabricated hypothetical passage still improve retrieval?
?
The hypothetical is written in the same register/vocabulary as real documentation, so it lands in the same embedding-space neighbourhood as the genuine answer document — turning the comparison into "answer vs. answer" instead of "question vs. answer." Correctness of facts doesn't matter; only the shape/vocabulary does. Retrieval finds the real document; the generator answers from that real document.

## Risk <!-- kb:card:dc0983 -->
What is the one real risk in a HyDE pipeline, and how is it mitigated?
?
The hypothetical (which can be factually wrong) leaking into the generation context as if it were real evidence. Mitigation is architectural, not statistical: the hypothetical must be used strictly inside the retrieval step and never passed to the answer generator.

## Application <!-- kb:card:89ab7d -->
When should you use HyDE, and when should you avoid it?
?
Use when: the embedding model is weak in your domain, you lack labelled query-doc pairs to fine-tune a retriever, queries are conversational against formal docs, and you can afford an extra LLM call. Avoid when: latency requirements are strict, queries already contain strong keywords/error codes/identifiers, hybrid/BM25 search already works well, or you have labelled data to fine-tune the retriever directly.

## Relationship <!-- kb:card:59a7bf -->
How does HyDE relate to Retrieval-Augmented Generation (RAG)?
?
HyDE is a modification of only the query-embedding step inside the standard RAG pipeline. Ingestion, the vector store, and the generation step are unchanged — the only difference is that an LLM-generated hypothetical passage is embedded and searched instead of the raw query.

## Relationship <!-- kb:card:e48e35 -->
How does HyDE's use of hallucination contrast with Circular Hallucination?
?
Both rely on an LLM producing a plausible-but-possibly-wrong output. In HyDE, that hallucination-prone output is architecturally quarantined to retrieval and never reaches the trusted final answer. In circular hallucination, the hallucination-prone step (an AI reviewing AI-generated code from the same underspecified context) *does* feed back into and validate the trusted output — the inverse failure shape.
