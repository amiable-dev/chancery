---
tags: [flashcards, ai-agents, trading]
sr-due: 2026-07-23
sr-interval: 1
sr-ease: 250
---

# LLM-as-Strategy-Engine — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:2cff89 -->
What is the LLM-as-Strategy-Engine pattern?
?
An architecture pattern where the LLM generates the primary decision output (e.g. a trading signal) directly from raw context/features inside the live decision loop, rather than sitting alongside or downstream of a hand-coded rule engine or trained model as a design-time assistant.

## Application <!-- kb:card:52c25d -->
When would you use LLM-as-Strategy-Engine, and what must accompany it?
?
When decisions depend on ambiguous, multi-factor context that's hard to reduce to fixed rules or a trained classifier — but it must be paired with a deterministic downstream risk/validation gate, since the LLM's raw runtime output is not inherently safe to execute unattended.

## Relationship <!-- kb:card:d97135 -->
How does LLM-as-Strategy-Engine differ from a framework like Jesse's strategy model?
?
Jesse's strategies are deterministic Python code (with an optional trained ML classifier gating entries and an LLM assistant only helping write/debug code at design-time). LLM-as-Strategy-Engine instead puts the LLM call itself inside the live per-decision path — the LLM produces the signal at runtime, not just at development time.

## Relationship <!-- kb:card:d0134d -->
How does LLM-as-Strategy-Engine relate to Agentic Decision Intelligence?
?
Both close a detect→decide→act loop, but Agentic Decision Intelligence typically has the LLM classify a pre-computed signal into a constrained action, while LLM-as-Strategy-Engine has the LLM generate the primary signal itself from raw indicators — a step further upstream in the pipeline.
