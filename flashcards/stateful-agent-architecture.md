---
tags: [flashcards, ai-agents]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Stateful Agent Architecture — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:3ae7d4 -->
What is a stateful agent architecture?
?
A deployment pattern where the agent owns and persists its own conversational memory server-side, keyed by a session ID: the client sends only the newest prompt plus session ID, and the agent retrieves, appends to, and writes back the session history from a persistent store on every turn.

## Application <!-- kb:card:86cf71 -->
When would you use a stateful agent architecture?
?
For long-running assistants, coding assistants, or multi-turn customer service bots — especially workflows that need to pause and wait on tool results, external callbacks, or human approval before resuming.

## Relationship <!-- kb:card:09e187 -->
How does stateful agent architecture relate to the "localized amnesia" problem?
?
Localized amnesia occurs when session history is held in a specific instance's local memory during horizontal scaling; if a later request for that session is routed to a different instance, the history is inaccessible. It's avoided by using a centrally-addressable store (DB or shared cache like Redis) instead of per-instance memory.

## Relationship <!-- kb:card:2946e4 -->
How does OpenClaw exemplify stateful agent architecture?
?
OpenClaw keeps per-session memory keyed by sessionId, supports approval-gated async pauses, and does server-side history trimming/summarization instead of requiring the client to resend full context — a direct real-world instance of the stateful pattern.
