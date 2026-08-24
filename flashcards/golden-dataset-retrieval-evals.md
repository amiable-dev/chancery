---
tags: [flashcards, llm, evaluation, retrieval, domain/llm, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Golden-dataset retrieval evals — Flashcards

#flashcards/llm

## Definition <!-- kb:card:c43342 -->
What are golden-dataset retrieval evals, and what are they trust infrastructure for?
?
Trust infrastructure for a retrieval system: real questions labeled with the items required to answer them, scored deterministically, run nightly with regression alerting, with LLM judges reserved for what determinism cannot settle.

## The two deterministic metrics <!-- kb:card:66716c -->
What two deterministic metrics form the primary scoring in golden-dataset retrieval evals?
?
Precision/recall against the items the composer actually selected, and recall at token-budget checkpoints (whether required items survived to the model within budget).

## Why degradation is otherwise invisible <!-- kb:card:85d007 -->
Why does retrieval quality degrade invisibly without a golden-dataset harness?
?
No user files a ticket saying the context was slightly worse this week, and standard APM sees traffic but not prompts — nothing else surfaces the degradation.

## Role of LLM judges <!-- kb:card:7ed06f -->
When do LLM judges enter a golden-dataset retrieval eval, given the deterministic metrics already used?
?
Only where rules cannot decide the question — determinism handles everything it can, because it keeps the signal cheap, stable, and diffable.

## When to build the harness <!-- kb:card:e419d1 -->
What is the ordering advice for when to build a golden-dataset retrieval harness?
?
Build it before the third retrieval strategy, not after the thirtieth — you cannot safely refactor what you do not measure, and by the thirtieth strategy the system is too entangled to attribute regressions.
