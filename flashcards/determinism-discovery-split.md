---
tags: [flashcards, agents, architecture, reliability, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Tools for certainty, agents for discovery — Flashcards

#flashcards/agents

## Definition <!-- kb:card:74028f -->
What is the determinism and discovery split?
?
A compound AI system should route work by what it demands: exactness-valued, expensive-to-unwind work goes to a deterministic tool that only does what it's told; work whose value is finding something unspecified goes to an agent permitted to be wrong; recurring agent behavior gets demoted into a rule.

## Key mechanism <!-- kb:card:5f2a69 -->
When a model repeatedly fumbles the same mechanical task (e.g. the same join or lookup), what is the correction?
?
Not a better prompt — demote the behavior into a parametrised query, runbook, or rule of thumb the agent invokes, keeping discovery capacity intact while making the mechanical part exact.

## Routing criterion <!-- kb:card:d9be42 -->
What criterion decides whether a task gets a deterministic tool or an agent?
?
Consequence and reversibility — e.g. a refund or funds transfer gets a deterministic tool plus human approval, because a confident wrong answer there is a loss, not a lead.

## Why tolerate wrongness <!-- kb:card:5f1fc1 -->
Why is tolerating agent wrongness sometimes valuable, per this rule?
?
An agent allowed to be wrong occasionally produces an answer nobody would have specified; restricting it to only pre-programmed branches forecloses that discovery entirely.

## Under-tooling hazard <!-- kb:card:331db8 -->
What hazard does giving a model too little tool access create?
?
A model with nothing exact to call will reason its way to a plausible-sounding number instead of getting the right one — under-tooling is a hazard in itself.
