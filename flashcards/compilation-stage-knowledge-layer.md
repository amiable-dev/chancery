---
tags: [flashcards, ai-agents, rag, architecture, knowledge-management]
sr-due: 2026-05-06
sr-interval: 1
sr-ease: 250
---

# Compilation-Stage Knowledge Layer — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:de4f60 -->
What is a compilation-stage knowledge layer?
?
An architectural pattern that pre-processes enterprise knowledge into persistent knowledge artifacts *before* any agent query — shifting reasoning work from inference time to compilation time. Contrasts with RAG, which re-interprets raw data on every agent call.

## Problem it solves <!-- kb:card:bc22b3 -->
What problem does a compilation-stage knowledge layer solve that RAG cannot?
?
RAG causes agents to re-discover data structure (schemas, authority, relationships, formats) from scratch every session. Pinecone estimates 85% of agent compute is wasted on this re-discovery cycle. Pre-compilation amortises that work once, producing structured, citable artifacts that agents consume directly.

## Token economics <!-- kb:card:5e48de -->
What token reduction did Pinecone claim for Nexus on a financial analysis task?
?
98% reduction — from 2.8 million tokens (RAG) to 4,000 tokens (Nexus compilation-stage artifacts). Not yet validated in customer production deployments.

## Architecture <!-- kb:card:883a2f -->
What are the three components of Pinecone's Nexus compilation-stage architecture?
?
1. **Context Compiler** — converts raw source data + task specification into persistent, task-specific knowledge artifacts
2. **Composable Retriever** — serves artifacts with typed fields, per-field citations, and deterministic conflict resolution
3. **KnowQL** — declarative query language with six agent-native primitives (intent, filter, provenance, output shape, confidence, budget)

## Relationship to RAG <!-- kb:card:5491c4 -->
How does a compilation-stage knowledge layer relate to RAG?
?
It supersedes RAG for agentic workloads. RAG is an inference-time pattern built for human queries; compilation-stage layers are a pre-inference pattern built for agents executing multi-step tasks. Analysts call it an evolution of RAG architecture, not a complete replacement — the vector database is still the underlying store.
