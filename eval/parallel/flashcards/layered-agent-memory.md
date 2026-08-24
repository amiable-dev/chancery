---
tags: [flashcards, ai-agents, memory, architecture, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Layered agent memory — Flashcards

#flashcards/ai-agents

## Three-tier definition <!-- kb:card:933d98 -->
What are the three tiers of layered agent memory?
?
Short-term session memory (current task state, recent tool outputs); long-term memory (typically a vector store, cross-session context and learned patterns); structured logs (a durable audit/debugging record).

## Failure it prevents <!-- kb:card:5ea52c -->
What design failure does layered agent memory exist to prevent?
?
Designing an agent like a chatbot — just passing the conversation in and taking a response out — which makes context-window overflow a production incident rather than a design parameter.

## Why one transcript fails <!-- kb:card:f0b6bd -->
Why does a single conversation transcript fail as an agent's only memory on long tasks?
?
It forces one retention policy on three needs with incompatible lifetimes: high-detail short-lived task state crowds out working room, while the durable record that should survive vanishes with the session.

## Structured logs are distinct <!-- kb:card:dfcb9f -->
What makes the structured-logs tier different from the session and long-term tiers?
?
It must survive whatever the agent chooses to forget, and unlike the other two tiers it is never consumed by the model at all — it exists for people to inspect after the fact.

## Retrofit cost <!-- kb:card:e39ea1 -->
Why is retrofitting layered memory onto an already-deployed agent risky?
?
It usually amounts to a partial rebuild, because the tier boundaries determine what the agent was ever able to record — so the design decision is front-loaded, not deferrable.
