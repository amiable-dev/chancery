---
tags: [flashcards, agents, observability, telemetry, domain/observability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent loop telemetry — Flashcards

#flashcards/agents

## Definition of agent loop telemetry <!-- kb:card:7a7092 -->
What is agent loop telemetry?
?
A passive observation layer around an autonomous agent loop that records each iteration as a span (duration, outcome, token cost, tool calls, files touched) without ever gating, pausing, or steering the loop.

## Why the observability gap exists <!-- kb:card:4c7a12 -->
Why does a context-resetting agent loop leave behind so little record of how its result was produced?
?
Each pass re-runs with a fresh context window and keeps state only in the filesystem and commits — the amnesia makes the loop robust, but destroys each iteration's reasoning the moment it ends, so only a diff survives.

## Observer, not controller <!-- kb:card:e187c6 -->
How does agent loop telemetry interact with the loop it watches?
?
It sits interposed between the loop and the model as a pure observer — recording without gating, approving, or interrupting — so the agent code itself is unmodified.

## Per-iteration attribution <!-- kb:card:216819 -->
What does agent loop telemetry attribute to each individual iteration?
?
Count, duration, success or failure, cost by model, tool mix, and files touched.

## The cost-per-iteration trade-off <!-- kb:card:b53740 -->
What did the author's instrumented comparison reveal about a cheaper model versus a stronger one on the same task?
?
The cheaper model needed about 44% more iterations and 12% more input tokens, yet still cost roughly 63% less overall — a trade-off invisible without measurement.
