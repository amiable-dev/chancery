---
tags: [flashcards, prompting, requirements, human-ai-interaction, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent-led elicitation — Flashcards

#flashcards/prompting

## Definition of agent-led elicitation <!-- kb:card:9dd260 -->
What is agent-led elicitation?
?
A technique where the model interrogates the person instead of the person specifying a task — requirements are produced by the exchange, not assumed to exist beforehand.

## Why the model can surface blind spots <!-- kb:card:e2c39d -->
Why is a model able to surface questions a newcomer wouldn't know to ask?
?
An asymmetry of coverage: the model has seen far more of the average domain and can enumerate the relevant question set faster than the person could discover it by trial.

## The two shapes of elicitation <!-- kb:card:765b87 -->
What are the two shapes agent-led elicitation takes?
?
A one-shot blind-spot pass (name what you don't know you don't know) and an iterative interview (one question at a time).

## Prioritization rule for interviews <!-- kb:card:5589ff -->
What rule makes an iterative elicitation interview worth the turns?
?
Ask one question at a time, prioritized by which answer would most change the architecture.

## Precondition: stating your starting point <!-- kb:card:f7386a -->
What must the human declare for agent-led elicitation to ask questions at the right level?
?
Their own starting point — what they've tried, already know, and how much of the codebase is familiar — since productive questions for a novice and an expert barely overlap.

## Relation to disposable-artifact-specification <!-- kb:card:f5b1b6 -->
How does agent-led elicitation complement disposable-artifact-specification?
?
Elicitation surfaces criteria you never considered, by asking questions; disposable-artifact-specification surfaces criteria you could never articulate, by having you react to a concrete artifact.
