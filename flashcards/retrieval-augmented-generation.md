---
tags: [flashcards, rag, ai-agents, knowledge-management]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Retrieval-Augmented Generation (RAG) — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:5f2103 -->
What is Retrieval-Augmented Generation (RAG)?
?
An architectural pattern that augments LLM generation by first retrieving relevant documents from an external store, then injecting them into the prompt as grounding context. RAG decouples parametric knowledge (fixed at training) from retrieved knowledge (updatable anytime), enabling grounded, current, domain-specific responses.

## Pipeline <!-- kb:card:a46739 -->
What are the five steps of a standard RAG pipeline?
?
1. **Ingestion** — chunk documents, embed them, store in vector DB
2. **Query embedding** — embed the user's query with the same model
3. **Retrieval** — nearest-neighbour search finds semantically similar chunks
4. **Augmentation** — inject retrieved chunks into the prompt as context
5. **Generation** — LLM responds grounded in the retrieved context

## Failure Modes <!-- kb:card:6a6740 -->
What are the three common RAG failure modes?
?
1. **Retrieval miss** — the right document exists but wasn't retrieved (embedding mismatch, poor chunking)
2. **Context stuffing** — too many chunks dilute signal; LLMs attend poorly to middle-context items
3. **Faithfulness failure** — model ignores retrieved context and hallucates from parametric memory

## Relationship <!-- kb:card:b49692 -->
How does RAG relate to fine-tuning?
?
They're complementary: **RAG** for factual grounding on current/private data (no retraining needed, updatable); **fine-tuning** for behaviour/style/domain adaptation. Use RAG first for knowledge; fine-tune only when style or reasoning patterns need to change.

## Application <!-- kb:card:977d3d -->
When would you use Agentic RAG vs standard RAG?
?
**Standard RAG**: always retrieve on every turn, single-pass. Simple; works for Q&A.
**Agentic RAG**: a ReAct agent decides *when* to retrieve and issues multiple targeted queries. Better for complex multi-hop questions where one retrieval isn't enough, or where some queries don't need retrieval at all.
