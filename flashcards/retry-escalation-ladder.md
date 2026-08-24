---
tags: [flashcards, ai-agents, reliability, orchestration, domain/reliability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Retry escalation ladder — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:72cd5d -->
What is a retry escalation ladder?
?
A failure policy for agent loops where each further attempt on a stalled task changes strategy instead of repeating the previous prompt — successive rungs widen context, permitted changes, and cost; a stall counter decides when to climb; a terminal rung ends the task.

## Why not just retry the same prompt <!-- kb:card:d76824 -->
Why does re-issuing an identical prompt on an already-failed task waste tokens?
?
It re-samples the same distribution the first attempt already failed against, so it spends tokens to buy mostly the same answer instead of a genuinely different attempt.

## Three-rung example <!-- kb:card:18273f -->
What are the three rungs in the worked example of a retry escalation ladder?
?
A standard prompt (fix it without changing behaviour); a retry prompt that includes the previous attempt's (truncated) output and instructs a different approach; and an exploration prompt that lifts the blast-radius constraint, letting the agent refactor surrounding code and pull in neighbouring files.

## When to escalate <!-- kb:card:8b4aad -->
What decides when a stalled unit climbs to the next rung of the ladder?
?
A per-unit stall counter tracking consecutive rounds with no improvement, not a fixed round number — so cheap attempts aren't abandoned prematurely and expensive ones aren't wasted on units still progressing.

## Terminal rung <!-- kb:card:0ebb65 -->
What happens at the top rung of a retry escalation ladder once it fails?
?
The unit is dropped from the queue and surfaced for a human, rather than retried again — this is what bounds the loop and stops it being unbounded.
