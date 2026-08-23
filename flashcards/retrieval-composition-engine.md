---
tags: [flashcards, ai-agents, rag, retrieval]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# Retrieval Composition Engine — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:4e3088 -->
What is a retrieval composition engine, and how does it differ from a fixed RAG pipeline?
?
A system that runs retrieval as a dynamic graph of strategies, each gated by a firing predicate (e.g. "run when entity phrases exist and no warehouse candidates do"). The graph's shape emerges per query, unlike a fixed pipeline that treats every query identically (embed → search → rerank → generate).

## Application <!-- kb:card:1104c8 -->
How does logging the executed retrieval graph turn debugging from "archaeology" into a five-minute task?
?
Because the graph that actually ran for a given query — which strategies fired, what each retrieved, what got dropped — is itself a runtime artifact that can be diagrammed. Answering "why didn't it know about X" becomes reading that diagram instead of re-running the query with debug logging bolted on after the fact.

## Application <!-- kb:card:fefe03 -->
How does a composition engine decide when to call an LLM versus using deterministic retrieval?
?
By candidate count at each stage: a handful of candidates gets fetched wholesale (no LLM needed), hundreds get a cheap LLM relevance filter, and thousands get vector search plus a reranker first before any LLM involvement.
