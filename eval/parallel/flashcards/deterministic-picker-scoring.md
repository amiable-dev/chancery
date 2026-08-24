---
tags: [flashcards, agents, evaluation, llm-as-judge, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Deterministic-picker scoring — Flashcards

#flashcards/agents

## Definition <!-- kb:card:99201e -->
What is deterministic-picker scoring?
?
Instead of letting a model emit a numeric score or name a winner directly, the model commits to categorical features (booleans, enumerated labels) about each candidate, and ordinary program code composes those features into the deciding signal. Judgement stays with the model; the arithmetic moves into code.

## Key mechanism <!-- kb:card:a2d478 -->
What pathology does deterministic-picker scoring escape, and how?
?
Models asked for a numeric self-rating cluster their scores in a narrow band, hiding real quality differences in noise. Asking instead for discrete, individually checkable facts (does it cite a source, which failure category applies) puts the model on questions it answers more reliably.

## Testability <!-- kb:card:1ecb41 -->
Why can a deterministic-picker's weights and thresholds be unit-tested and changed without re-prompting the model?
?
Because they are ordinary program state that composes the model's feature output, not part of the model's own output.

## Explainability <!-- kb:card:101ccf -->
How can a deterministic-picker decision be explained after the fact?
?
By pointing at the specific feature that changed the outcome.

## Limit of the discipline <!-- kb:card:e6e1a3 -->
What does deterministic-picker scoring guarantee, and what does it not guarantee?
?
It makes judgement legible and stable, not correct — if the model misreads a feature, the composed decision is confidently wrong in a traceable way.
