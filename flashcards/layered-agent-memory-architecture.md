---
tags: [flashcards, ai-agents]
sr-due: 2026-07-15
sr-interval: 1
sr-ease: 250
---

# Layered Agent Memory Architecture — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:435064 -->
What are the three layers in a layered agent memory architecture?
?
Short-term session memory (current task state and recent tool outputs, ephemeral), long-term memory (typically a vector store, for cross-session context and learned patterns, persistent), and structured logs (for auditability and debugging, persistent, append-only).

## Application <!-- kb:card:7ee7b8 -->
When would you design a layered agent memory architecture?
?
When designing any agent expected to run multi-step tasks (not single-turn Q&A) — decide up front what belongs in short-term session state vs. a retrievable long-term store vs. audit logs, ideally before deployment since retrofitting later is a partial rebuild.

## Relationship <!-- kb:card:a4508f -->
How does layered agent memory architecture relate to context rot?
?
A well-designed short-term/long-term split is what enables selective, need-based context loading — pulling in only what's needed for the current step rather than dumping full history into context every turn, which is a key mitigation for context rot.
