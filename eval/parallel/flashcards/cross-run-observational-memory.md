---
tags: [flashcards, ai-agents, memory, observability, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Cross-run observational memory — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:3b7f6a -->
What is cross-run observational memory?
?
The practice of having an agent system record, for each session, a compressed observation of what it attempted and how it turned out (strategy chosen, attempt number, outcome, tokens spent), and read that accumulated history back on later runs — so a system stateless within a run still improves across runs instead of restarting from zero.

## Key mechanism: observations vs. raw transcripts <!-- kb:card:15c370 -->
What is the key distinction between hauling raw context forward and cross-run observational memory's approach?
?
Raw transcripts are large, mostly irrelevant, and grow without bound. An observation is a small structured record — strategy, unit, round, result, cost — that is cheap to store as an append-only event log and cheap to query.

## Selective read-back <!-- kb:card:af625e -->
What does the structured format of observations enable that a purely stateless evaluate-keep-or-revert loop cannot do?
?
Selective read-back: the next run can select on prior records, so a unit that stalled under a particular strategy last time can start higher on its escalation ladder. A stateless loop can run a hundred experiments overnight without knowing which strategies worked last week.

## Aggregate trend queries <!-- kb:card:516c5a -->
What can aggregate queries over the observational log answer that individual records cannot?
?
Whether the system is trending toward more fixes for fewer tokens over time.

## Hard requirement: harness instrumentation <!-- kb:card:a9277e -->
What must be true of an agent harness for cross-run observational memory to work at all?
?
The harness must emit per-attempt structured telemetry — a system that records nothing between input and output cannot learn between runs by any means.
