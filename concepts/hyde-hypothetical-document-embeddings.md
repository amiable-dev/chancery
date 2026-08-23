---
title: "HyDE (Hypothetical Document Embeddings)"
date: 2026-07-26
domain: llm
maturity: established
source_type: research
topics: [rag]
tags: [concept, rag, information-retrieval, embeddings, llm, domain/llm, maturity/established, source-type/research, topic/rag]
status: draft
sources:
  - url: https://www.freecodecamp.org/news/what-is-hyde-how-to-improve-rag-with-hypothetical-documents/
    hash: sha256:d59ea369771cd5bfe0b93bb44fd54463db4940df0c36a9a9705412fb7d16e4ee
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# HyDE (Hypothetical Document Embeddings)

## Definition
A [[retrieval-augmented-generation|RAG]] retrieval technique that fixes query-document asymmetry by embedding an LLM-generated hypothetical answer passage instead of the raw user query, then using that passage's vector to perform the similarity search. The hypothetical is discarded after retrieval; only the real retrieved documents are passed to the generator.

## Explanation
Standard RAG embeds the user's question directly and searches for nearby document vectors. This has a structural weakness: **a question and the document that answers it are written differently** — different vocabulary, structure, and level of detail. A user might ask *"Why does my Lambda function take longer to respond after being idle?"* while the relevant doc says *"AWS Lambda reclaims idle execution environments... causing a cold start."* Same topic, different shape.

Embedding models are trained to place *semantically similar text* near each other in vector space — they were never explicitly trained to place a *question* near its *answer*. Those are different geometries, so a direct query→document cosine comparison produces a weaker similarity signal than it should.

**HyDE's fix is one function, not a new architecture:**

1. Prompt an LLM: *"Write a passage from technical documentation that answers this question."*
2. Embed the LLM's generated passage — not the original question.
3. Use that embedding to run the exact same nearest-neighbour search as naïve RAG.
4. Retrieve the real top-k documents using this vector.
5. Discard the hypothetical. Pass the *real* retrieved documents (plus the original question) to the generator.

Because the hypothetical passage is written in the same register as real documentation (declarative, technical, same vocabulary density), it lands in the same neighbourhood of embedding space as the genuine answer document — turning the comparison into "answer vector vs. answer vector" instead of "question vector vs. answer vector."

**Everything downstream of the embedding call is untouched:** same embedding model, same cosine/nearest-neighbour search, same top-k selection. The only change is *what gets embedded* before the search runs.

### Why hallucination in the hypothetical doesn't break it
This is the counterintuitive part: the LLM can't know the true answer (e.g., "what caused a specific outage on July 18?") and will fabricate a plausible-sounding cause. That fabrication can be **factually wrong** yet still be **structurally right** — it uses the correct domain vocabulary (*outage, failover, replica, connection pool, cascading timeout*), which is exactly the vocabulary the real postmortem also uses. The embedding is pulled into the correct neighbourhood by shape and register, not by factual accuracy. Retrieval succeeds; the generator then reads the *real* document and answers from ground truth.

> "The hypothetical was wrong about the facts, but it was right about the shape. Shape is what the embedding sees. Facts are what the retrieved document provides."

### The one real risk
If the fabricated hypothetical leaks past retrieval and reaches the *generation* context (i.e., the generator is shown the hypothetical instead of, or alongside, the real retrieved docs as if it were evidence), the fabrication reaches the user. This is **not a statistical risk to manage — it's an architectural boundary to enforce**: the hypothetical must never cross from the retrieval step into the generation step.

## Key Properties
- **One-line delta over naïve RAG** — same embedding model, same vector search, same top-k logic; only the embedded input changes
- **Two LLM calls, two different jobs** — first (cheap, low-stakes) rewrites the query as a hypothetical document; second (the one that matters) generates the final answer from real retrieved docs
- **Hallucination-tolerant by design** — correctness of the hypothetical's facts is irrelevant; only its vocabulary/register/shape matters for retrieval
- **Retrieval-only scope** — the hypothetical must never be passed to the generator; keeping it strictly inside retrieval is the core safety invariant
- **Costs latency + money** — an extra LLM call per query, which only pays off when query-document asymmetry is the actual retrieval bottleneck

## Relationships
- Extends [[retrieval-augmented-generation|Retrieval-Augmented Generation]]: HyDE modifies only the query-embedding step of the standard RAG pipeline, leaving ingestion, vector store, and generation untouched
- Distinct from but complementary to [[hybrid-search-reciprocal-rank-fusion|Hybrid Search with RRF]]: HyDE improves the *vector* stream's query representation; it doesn't replace BM25 or graph traversal streams and can be combined with them
- Contrasts with [[circular-hallucination]]: HyDE's hallucination is safe because it's architecturally quarantined to retrieval and never influences the final generated claim — the opposite of circular hallucination, where a hallucination-prone step *does* feed back into the trusted output
- Related to [[matryoshka-representation-learning|Matryoshka Representation Learning]]: both are query/embedding-side techniques that improve RAG retrieval quality without touching the generator or corpus

## Applications
- **Weak domain embeddings:** when the embedding model wasn't fine-tuned on your document register (e.g., internal jargon, incident postmortems, legal language)
- **No labelled query-doc pairs:** when you can't fine-tune a retriever directly because you lack supervised query→relevant-doc training data
- **Conversational queries against formal docs:** casual, underspecified user questions against professionally-written documentation
- **When you can afford the extra LLM call:** HyDE trades latency and cost for recall — worth it only when asymmetry, not keyword coverage, is the bottleneck
- **When to avoid:** strict low-latency requirements; queries already contain strong keywords/error codes/identifiers (BM25 already wins); hybrid search already performs well; labelled data exists to fine-tune the retriever directly instead

### Production guardrails
- **Timeout + fallback** — if hypothetical generation is slow or fails, degrade gracefully to naïve query-embedding retrieval rather than blocking the user
- **Cap generation length** (~200 tokens) — a longer hypothetical dilutes the embedding signal rather than sharpening it
- **Scrub PII** before sending user queries to an external model for hypothetical generation
- **Trace every stage** — query, hypothetical prompt, generated hypothetical, retrieval latencies, retrieved document IDs and scores — for debuggability and audit

## Study

> [!tip] Flashcards
> [[flashcards/hyde-hypothetical-document-embeddings|Review flashcards for this concept]]

## Sources
- [What Is HyDE? How to Improve RAG with Hypothetical Documents (freeCodeCamp)](https://www.freecodecamp.org/news/what-is-hyde-how-to-improve-rag-with-hypothetical-documents/) — primary explainer with runnable Python (naïve RAG vs. HyDE retriever, using sentence-transformers + Anthropic API)
- [Precise Zero-Shot Dense Retrieval without Relevance Labels (Gao et al., 2022)](https://arxiv.org/abs/2212.10496) — original HyDE paper introducing the technique for unsupervised dense retrieval

## See Also
- [[retrieval-augmented-generation]]
- [[hybrid-search-reciprocal-rank-fusion]]
- [[matryoshka-representation-learning]]
- [[circular-hallucination]]
