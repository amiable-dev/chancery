---
tags: [flashcards, ai-agents, orchestration, parallelism, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Stateless worker fan-out — Flashcards

#flashcards/ai-agents

## Stateless worker fan-out: definition <!-- kb:card:d28c21 -->
What is 'stateless worker fan-out' as an orchestration shape for bulk maintenance work?
?
A coordinator partitions a backlog into independent single-unit tasks, holding only metadata and result summaries; each unit is dispatched to a short-lived agent that loads exactly one unit, acts on it, and exits.

## How capacity scales in fan-out <!-- kb:card:0b18fd -->
How is capacity increased in stateless worker fan-out, as opposed to giving one agent a bigger context window?
?
By raising the number of concurrent short-lived workers, not by enlarging any single agent's context window — for independently decomposable work, context length is the wrong scaling axis.

## Why the coordinator stays constant-size <!-- kb:card:0c08cd -->
Why does the coordinator in stateless worker fan-out stay constant in size regardless of backlog size?
?
It never reads the source material/payload — only a list of units, a prompt template, and per-unit outcomes enter its context.

## Shared-nothing workers and sandboxing <!-- kb:card:40ee15 -->
What does the shared-nothing property of workers enable operationally?
?
Each worker can be placed in its own sandbox with credentials injected there rather than left on the host, and torn down identically on success or failure.

## When fan-out applies <!-- kb:card:14695a -->
What property must a backlog have for stateless worker fan-out to apply?
?
It must decompose cleanly into units that can be fixed independently of each other.
