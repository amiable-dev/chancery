---
tags: [flashcards, spec-driven-development, ai-agents, engineering, process]
sr-due: 2026-05-21
sr-interval: 1
sr-ease: 250
---

# Spec-Driven Development — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:703747 -->
What is Spec-Driven Development?
?
A development approach where the human writes explicit specifications — defining "why" and "what" with constraints and validation criteria — before handing off to an AI agent for implementation. The intermediate level (level 2) between prompt-driven and Agentic-Agile.

## Improvement Over Prompts <!-- kb:card:783b7a -->
Why is Spec-Driven better than prompt-driven development?
?
Specs give the agent an objective reference to check against, replacing "good enough" with "spec satisfied." They reduce emergent/nondeterministic behaviour and produce more consistent, less-debugging-intensive outputs for bounded tasks.

## Scaling Failure <!-- kb:card:662d52 -->
Why does Spec-Driven Development break down at scale?
?
Four failure modes emerge: (1) **spec drift** — agents update the spec during implementation, creating conflicting docs; (2) **no phased delivery** — everything attempted at once; (3) **no parallelism support** — agents collide on files; (4) **no retrospective loop** — no mechanism to improve process over time.

## Spec Drift <!-- kb:card:6cca29 -->
What is spec drift and why is it a problem specific to Spec-Driven Development?
?
When agents implement against a spec, they tend to also update it — their "improvements" diverge from original intent. Subsequent agents reading conflicting specs produce inconsistent results. Agentic-Agile solves this by treating issues as locked specs and capturing new requirements in new issues.

## Relationship <!-- kb:card:e5800a -->
How does Spec-Driven Development relate to Contract-Driven Execution?
?
Specs are the informal precursor; contracts are specs promoted to formal commitments with explicit invariants, negative constraints, and binary exit conditions. Contract-driven execution adds the precision and enforcement that bare specs lack.
