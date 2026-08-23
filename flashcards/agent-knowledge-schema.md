---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- knowledge-management
- ai-agents
- pkm
- architecture
- meta
---


# Agent Knowledge Schema — Flashcards

#flashcards/knowledge-management


## Definition <!-- kb:card:59dfba -->
What is an Agent Knowledge Schema?
?
A domain-specific configuration document (CLAUDE.md / AGENTS.md) that transforms a generic LLM into a disciplined knowledge worker. It encodes entity types, relationship vocabulary, ingest rules, quality standards, contradiction handling policy, consolidation schedules, and privacy/scope boundaries. Co-evolved between human and LLM over time.

## Application <!-- kb:card:83d4dd -->
Why is the Agent Knowledge Schema considered the most important file in an LLM knowledge base?
?
Without it, LLM behaviour on the knowledge base is ad hoc and inconsistent — different entity types extracted per session, no clear page-update-vs-create rules, no quality standards. The schema is the constitution that makes all other knowledge operations (ingest, lint, supersession, crystallisation) consistent and automatable.

## Relationship <!-- kb:card:9bed5c -->
How does the Agent Knowledge Schema relate to Prompts as Infrastructure?
?
Both encode operational intent as a reusable artifact rather than restating it per-session. Prompts-as-Infrastructure applies at the individual prompt level; the Agent Knowledge Schema applies at the entire knowledge base level — governing all LLM interactions with the domain over its lifetime.

## Evolution <!-- kb:card:e79d83 -->
What does "co-evolution" mean for an Agent Knowledge Schema?
?
The schema starts rough and is refined through use. After processing dozens of sources and running lint passes, human and LLM collaboratively update the schema to reflect how the domain actually works — not how it was originally imagined. A mature schema is an intellectual asset transferable to similar domains.
