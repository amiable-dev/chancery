---
tags: [flashcards, ai-agents, retrieval, query-languages]
sr-due: 2026-05-06
sr-interval: 1
sr-ease: 250
---

# KnowQL — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:59f861 -->
What is KnowQL?
?
A declarative query language for AI agents (not humans) introduced by Pinecone. It gives agents a vocabulary to specify knowledge retrieval requirements — including output format, source provenance, confidence thresholds, and cost/latency budgets — in a single query interface.

## Six primitives <!-- kb:card:a84299 -->
What are KnowQL's six primitives?
?
1. **intent** — the task or goal driving the query
2. **filter** — data source, date, or entity scope constraints
3. **provenance** — source attribution requirements
4. **output shape** — expected response schema/format
5. **confidence** — minimum confidence threshold for included results
6. **budget** — token or latency cost ceiling for the retrieval

## Analogy <!-- kb:card:297d43 -->
KnowQL is described as "SQL for agent retrieval." What does that analogy mean?
?
Before SQL standardised relational data access, every application built its own data access layer from scratch. KnowQL aims to do the same for agent retrieval — providing a standard interface so agents don't each implement custom retrieval logic. If it becomes a standard, backends can swap while agents remain unchanged.

## Key advantage <!-- kb:card:0e681c -->
What is the key advantage of KnowQL's `budget` primitive?
?
Agents can cap token or latency cost *at the query level*, preventing runaway costs in multi-step orchestrations without requiring post-hoc monitoring or external guardrails. Critical for production deployments with hard cost SLAs.

## Relationship to artifacts <!-- kb:card:5bf8b8 -->
What does a KnowQL query retrieve?
?
Pre-compiled knowledge artifacts from the Nexus composable retriever — not raw documents. The `output shape` primitive ensures the response conforms to the schema the agent expects, eliminating per-agent response parsing code.
