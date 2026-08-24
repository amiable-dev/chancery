---
tags: [flashcards, agents, architecture, evaluation, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Purpose-built agent hierarchies — Flashcards

#flashcards/agents

## Definition <!-- kb:card:1b0e26 -->
What is a purpose-built agent hierarchy?
?
A compound AI system built from deliberately narrow agents layered together — e.g. retrieval agents scoped to one table, analyst agents, an orchestrator, action agents — instead of one general agent holding every tool.

## Why narrowing helps <!-- kb:card:0e69b2 -->
Why does constraining an agent to one table or one question raise accuracy?
?
Accuracy comes from constraint: a narrowly scoped agent (flat/wide schema, read-only access, few examples) is more reliable than a general agent with a broad tool menu, which reasons longer, costs more, and answers worse.

## Error stacking <!-- kb:card:ddce18 -->
What happens to error rates as you add layers to an agent hierarchy?
?
Error stacks upward — each layer multiplies the failure rate of the layer beneath it, so compounding failure is a first-class design constraint, not an implementation detail.

## Eval structure <!-- kb:card:ebc874 -->
How does verification of a purpose-built agent hierarchy mirror a test pyramid?
?
Many cheap leaf-level evals run constantly (mechanical checks, model-as-judge only for equivalent phrasing); fewer, costlier middle evals act like integration tests; end-to-end supervisor evals are fewest and most expensive but still necessary.

## Demo vs. production bar <!-- kb:card:9dea1d -->
Why is 80% accuracy in a pilot not sufficient for production, per this concept?
?
Eighty percent accuracy clears the demo bar, not the production bar — it is a pilot-stage threshold, not one for a system ready to ship.
