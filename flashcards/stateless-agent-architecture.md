---
tags: [flashcards, ai-agents]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Stateless Agent Architecture — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:9341fb -->
What is a stateless agent architecture?
?
A deployment pattern where the agent retains no server-side memory between requests: each call is processed in isolation (prompt in, inference out, forgotten), and the client must resend the full conversation history on every subsequent turn.

## Application <!-- kb:card:613cce -->
When would you use a stateless agent architecture?
?
For single-turn or simple pipelines with no meaningful multi-turn context — text extraction, summarization, classification, or one-shot chatbots — where architectural simplicity and trivial horizontal scaling matter more than client payload efficiency.

## Tradeoff <!-- kb:card:aa491c -->
What is the main tradeoff of stateless agent design?
?
It enables trivial horizontal scaling (no server-side memory, any instance can serve any request) but pushes conversation continuity onto the client, causing token usage and payload size to snowball as the conversation grows.

## Relationship <!-- kb:card:189573 -->
How does stateless agent architecture relate to stateful agent architecture?
?
They are counterparts in the same foundational deployment dichotomy: whichever one you choose for where an agent's memory lives cascades into the rest of the deployment architecture (load balancing, database layer, caching strategy).
