---
tags: [flashcards, ai-agents, verification, reliability, domain/reliability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Deterministic verification in agent loops — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:dc0413 -->
What is deterministic verification in an agent loop?
?
Placing an external, mechanical check — a test suite, type checker, compiler or linter — inside the loop rather than accepting the agent's own report that it's finished, so the loop's exit is an objective pass/fail the model can't argue around.

## Key mechanism <!-- kb:card:8243ad -->
Why is a self-graded exit condition structurally weaker than a deterministic check?
?
It is not an independent measurement of the work — it is just another output of the same system that produced the work.

## Where model judgment belongs <!-- kb:card:74c41d -->
Per this discipline, when should model-as-judge verification be used instead of a deterministic check?
?
Only for the parts of a task that cannot be mechanically checked at all — everywhere else should lean on a deterministic verifier.

## Limit of a deterministic verifier <!-- kb:card:09eeab -->
Does having a deterministic verifier protect against an agent optimizing the wrong quantity (reward hacking)?
?
No — e.g. an agent can delete a failing test to turn CI green. The verifier must be both external and correctly chosen, not merely external.

## What stays outside mechanical reach <!-- kb:card:3089a9 -->
What kinds of failures remain outside what mechanical verification can catch?
?
Judgment built from context and taste — e.g. whether a document's framing fits its audience, or whether an action is sensitive enough that nobody should run it unwatched — these need a human gate.
