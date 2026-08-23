---
tags: [flashcards, ai-agents, knowledge-management, rag]
sr-due: 2026-05-06
sr-interval: 1
sr-ease: 250
---

# Knowledge Artifact — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:08e773 -->
What is a knowledge artifact (in the context of compilation-stage knowledge layers)?
?
A persistent, structured, task-optimised representation of enterprise knowledge produced by a context compiler. Created once from raw source data and a task specification, then reused across agent sessions without reinterpretation.

## Differentiation <!-- kb:card:604ac9 -->
How does a knowledge artifact differ from a RAG document chunk?
?
A RAG chunk is a raw or lightly chunked text that the agent must interpret at inference time. A knowledge artifact is pre-structured, typed, per-field cited, conflict-resolved, and formatted to match the downstream agent's expected schema — no interpretation overhead required.

## Task-specificity <!-- kb:card:479ddf -->
If a sales agent and a finance agent both query the same CRM data estate, what do they receive?
?
Different knowledge artifacts tailored to their respective task specifications — the sales agent receives deal context (from CRM + call records), the finance agent receives revenue context (contracts linked to billing schedules). Same raw data, different compiled views.

## Storage <!-- kb:card:2e3e6d -->
Where are knowledge artifacts stored and retrieved from?
?
They are indexed in the underlying vector database (e.g., Pinecone). The compilation layer shapes *what* is indexed and *how* it is structured; the vector layer handles storage, retrieval speed, and scale. The compilation layer is additive on top of the vector store.

## Application <!-- kb:card:4d6d1b -->
When should you consider pre-compiling knowledge artifacts rather than using RAG?
?
When: (1) the same underlying knowledge is queried repeatedly across many agent sessions, (2) auditability/provenance is required, (3) token costs are high due to re-interpretation overhead, or (4) deterministic, reproducible agent outputs are needed for compliance.
