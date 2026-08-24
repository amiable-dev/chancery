---
tags: [flashcards, ai-agents, architecture, orchestration, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Sub-agent delegation — Flashcards

#flashcards/ai-agents

## Sub-agent delegation: definition <!-- kb:card:8cd85d -->
What is 'sub-agent delegation' as an agent architecture pattern?
?
A coordinating agent owns the workflow sequence, and specialized sub-agents each carry a focused instruction and narrow tool set; the coordinator transfers execution to a sub-agent at defined points, which completes its specialty, writes results to shared state, and hands control back.

## Division of context, not labor <!-- kb:card:1c0801 -->
Is sub-agent delegation best understood as a division of labor or a division of context?
?
A division of context: each sub-agent's instruction covers only its specialty and its tool list contains only what that specialty needs, unlike one monolithic prompt loaded with every tool and rule.

## How sub-agents hand results back <!-- kb:card:6a7468 -->
How do results produced by a sub-agent reach the coordinator and the rest of the workflow?
?
The sub-agent reads and writes the same shared session state as the coordinator, then hands control back — there is no separate result-passing channel.

## Why delegation improves reasoning quality <!-- kb:card:33e047 -->
Why does splitting responsibilities into sub-agents improve reasoning quality compared to one monolithic prompt?
?
A single prompt carrying every tool description, workflow rule, and accumulated state degrades tool selection and step tracking, worse as context accrues in long-running work; narrow prompts keep each model call sharp regardless of total system complexity.
