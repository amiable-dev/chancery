---
tags: [flashcards, agents, architecture, ci, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Build-time governance of generated code — Flashcards

#flashcards/agents

## Definition — dual expression <!-- kb:card:567702 -->
What is build-time generation governance's core mechanism for constraining what a coding agent produces?
?
Every structural invariant and threat vector is declared once and expressed twice: as prose compiled into the agent's context (biases generation softly) and as a deterministic static rule, e.g. Semgrep/CodeQL/Bandit, in the pipeline (rejects violations mechanically at merge, regardless of what the model produced).

## Why scope artifacts per module <!-- kb:card:04d4e9 -->
Why does a compiler step scope which governance artifacts apply to which module, instead of concatenating every document into one prompt?
?
A context window crowded with competing constraints degrades what the model attends to — scoping keeps only the relevant boundaries in view for a given module.

## Conflict resolution <!-- kb:card:63441d -->
When declared governance artifacts conflict, how is the conflict resolved?
?
Deterministically, before assembly, not by the model reconciling documents: threat model outranks structural boundaries, boundaries outrank coding standards, standards outrank feature intent. The conflict then surfaces as a failed build, and a human changes the design.

## Two gates <!-- kb:card:0d220e -->
What are the two gates that run against agent-generated code, and why are both needed?
?
An adversarial check (no declared abuse path was opened) and an acceptance check against machine-executable scenarios (the declared business contract was met). Without the adversarial gate the system can violate its structure; without the acceptance gate it can faithfully implement the wrong thing.

## Limits of static rules <!-- kb:card:b87822 -->
What can build-time static rules never verify, and what practical consequence follows from that limit?
?
They can't verify domain semantics, aggregate ownership, or conceptual cohesion — only compliance with what was declared. Consequence: a stale or wrong governance artifact is enforced just as faithfully as a correct one, so these artifacts must be treated as production code with owners, versioning and peer review.
