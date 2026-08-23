---
title: "Retrieval-Augmented Generation (RAG)"
aliases: ["Retrieval-Augmented Generation (RAG)"]
date: 2026-04-15
domain: llm
maturity: established
source_type: practitioner
topics: [rag, context-engineering]
tags: [concept, ai-agents, rag, information-retrieval, knowledge-management, llm, domain/llm, maturity/established, source-type/practitioner, topic/rag, topic/context-engineering]
status: draft
sources:
  - url: https://arxiv.org/abs/2005.11401
    hash: sha256:72df6adcb0769869d4e3b2acd2cdd72495e74b49ba1c61dddeb013830df5d1e2
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/research
    hash: sha256:02dd4079add79ffc1e1fd43df757100b2648cee35dd9fe9b9fb0b3f3ac7c3377
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.llamaindex.ai/
    hash: sha256:05fbf3849ea092fc465ece5c78f7635ff14013cd18a6c2a506255628c6e17333
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Retrieval-Augmented Generation (RAG)

## Definition
An architectural pattern that augments a language model's generation process by first retrieving relevant documents or knowledge chunks from an external store, then injecting them into the prompt as grounding context. RAG decouples what the model *knows* (parametric knowledge, fixed at training) from what it *has access to* (retrieved knowledge, updatable at any time), allowing LLM responses to be grounded in current, domain-specific, or private information.

## Explanation
LLMs have two fundamental limitations: their knowledge is frozen at training cutoff, and they cannot access private or proprietary data. RAG solves both by treating retrieval as a first step in the generation pipeline.

**Standard RAG pipeline:**

1. **Ingestion** — Documents are chunked, embedded (converted to dense vectors), and stored in a vector database (e.g., pgvector, Chroma, Weaviate, Pinecone).
2. **Query embedding** — The user's query is embedded with the same model to produce a query vector.
3. **Retrieval** — Nearest-neighbour search finds chunks semantically similar to the query. May be pure vector search, [[hybrid-search-reciprocal-rank-fusion|hybrid search (vector + BM25)]], or graph-traversal for structured knowledge.
4. **Augmentation** — Retrieved chunks are injected into the prompt as context ("Here are relevant excerpts: …").
5. **Generation** — The LLM generates a response grounded in the retrieved context, citing or synthesising from it.

**Variants and refinements:**

- **Naive RAG** — single-pass retrieval → generation. Fast but quality depends heavily on chunking and embedding choices.
- **Advanced RAG** — adds pre-retrieval query rewriting, post-retrieval re-ranking (cross-encoder), and iterative refinement loops.
- **Modular RAG** — decomposed pipeline with interchangeable components; retriever, ranker, and generator are independently swappable.
- **Agentic RAG** — a ReAct-style agent decides *when* to retrieve and *what* to query, rather than always retrieving on every turn.
- **Graph RAG** — retrieval from a [[typed-knowledge-graph|knowledge graph]] rather than a flat vector store; preserves structural relationships between entities.

**Chunking strategy matters significantly:**
- Fixed-size chunking is simple but cuts across sentence/paragraph boundaries
- Semantic chunking (split at topic boundaries) produces better retrieval units
- Parent-document retrieval: retrieve small chunks for precision, return their parent document for context

**Common failure modes:**
- **Retrieval misses** — the right document exists but wasn't retrieved (embedding mismatch, poor chunking)
- **Context stuffing** — too many chunks dilute signal; LLMs attend poorly to middle-context items
- **Faithfulness failures** — model ignores retrieved context and falls back to parametric knowledge (hallucination persists)
- **Staleness** — ingestion pipeline falls behind document updates; retrieved content is outdated

## Key Properties
- **Knowledge is external and updatable** — no model retraining needed when knowledge changes
- **Grounded responses** — source attribution is possible since the retrieved chunks are known
- **Scales to private data** — any corpus can be indexed; no fine-tuning required
- **Retrieval quality is the ceiling** — generation quality is bounded by what retrieval surfaces
- **Context window is the bottleneck** — retrieved chunks compete for limited context space
- **Complementary to fine-tuning** — RAG for factual grounding; fine-tuning for style/behaviour; both can combine

## Relationships
- Relies on [[hybrid-search-reciprocal-rank-fusion]]: production RAG systems typically combine vector similarity with BM25 keyword search for better recall
- Powers the Data & Knowledge layer in [[agentic-ai-platform-architecture]]: vector stores and retrieval pipelines are core infrastructure
- Related to [[typed-knowledge-graph]]: Graph RAG uses structured knowledge graphs rather than flat vector stores for richer retrieval
- Related to [[knowledge-consolidation-tiers]]: RAG operates on externalised knowledge; consolidation tiers determine what enters the retrieval corpus
- Related to [[react-agent-pattern]]: Agentic RAG wraps retrieval in a ReAct loop, calling retrieval tools as needed rather than always retrieving upfront
- Related to [[memory-as-harness]]: long-term agent memory is often implemented as a RAG system — past interactions stored, embedded, and retrieved
- Related to [[multimodal-embedding-space]]: a unified multimodal embedding space enables RAG to retrieve across text, image, audio, and video from one index
- Related to [[matryoshka-representation-learning]]: MRL enables cost-efficient two-stage RAG retrieval — fast coarse search at low dimensions, precise re-ranking at full dimensions

## Applications
- **Question-answering over private docs:** Legal, medical, or internal knowledge bases queried via natural language without exposing raw documents to the model
- **Code assistants with codebase context:** [[codebase-knowledge-graphs]] retrieved via semantic search give coding agents precise, current context
- **Customer support:** Product documentation + ticket history embedded; support agent retrieves relevant history before responding
- **This knowledge pipeline:** The Obsidian vault + luminescent-cluster backend is a RAG system — concept notes are the corpus; queries retrieve relevant context for synthesis tasks
- **Agentic research:** An agent issues multiple retrieval queries, synthesises across results, and iterates — Agentic RAG pattern

## Study

> [!tip] Flashcards
> [[flashcards/retrieval-augmented-generation|Review flashcards for this concept]]

## Sources
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401) — original RAG paper
- [RAG vs Fine-Tuning (Anthropic)](https://www.anthropic.com/research) — when to use each approach
- [Advanced RAG techniques (LlamaIndex docs)](https://docs.llamaindex.ai/) — practical implementation patterns

## See Also
- [[hybrid-search-reciprocal-rank-fusion]]
- [[typed-knowledge-graph]]
- [[knowledge-consolidation-tiers]]
- [[memory-as-harness]]
- [[react-agent-pattern]]
- [[agentic-ai-platform-architecture]]
- [[multimodal-embedding-space]]
- [[matryoshka-representation-learning]]
- [[compilation-stage-knowledge-layer]] — next architectural evolution beyond RAG for agentic workloads; pre-compiles [[knowledge-artifact|knowledge artifacts]] rather than re-interpreting at inference time
- [[knowledge-artifact]] — pre-compiled, task-specific knowledge units that replace raw document retrieval
- [[knowql]] — declarative query language for agent retrieval with provenance and budget constraints
- [[deterministic-grounding]] — what RAG lacks and compilation-stage layers provide: reproducible, auditable, structurally-aware retrieval
- [[context-layer-architecture]] — the production infrastructure (continuous sync, multi-index, tenancy, curation) that makes RAG reliable at organizational scale, rather than a single retrieve-then-generate call
