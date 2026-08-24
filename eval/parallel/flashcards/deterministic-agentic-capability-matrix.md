---
tags: [flashcards, agents, architecture, system-design, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Deterministic/agentic capability matrix — Flashcards

#flashcards/agents

## Definition <!-- kb:card:74552b -->
What is a deterministic/agentic capability matrix?
?
A design procedure that decomposes every workflow step into the part a fixed rule can decide and the part that requires model reasoning, on a single test: whether the decision admits alternative valid interpretations.

## Key mechanism <!-- kb:card:b08a96 -->
What single test decides whether a workflow step should be coded as deterministic or routed to a model?
?
Whether the decision admits alternative valid interpretations. Anything derivable from current application state (e.g. an ID, an SLA timer, a queue assignment) is coded as a rule; only judgements over unstructured or ambiguous content go to a model.

## Cost control <!-- kb:card:4ae6e4 -->
Why does confining model calls to genuine judgement act as a built-in cost control?
?
Model calls are the expensive and slow part of the stack, so restricting them to steps that truly need judgement reduces cost without needing a separate optimisation pass.

## Reliability requirement <!-- kb:card:e89380 -->
Why must a step with exactly one correct interpretation never be made agentic?
?
Because it would fail outright if the model's output varied — such a step needs deterministic correctness, not merely benefits from it.

## Resulting shape <!-- kb:card:494ba4 -->
What does a well-designed agentic application look like, per this framing?
?
Deliberately mostly non-agentic — even good agentic candidates remain majority-deterministic in production.
