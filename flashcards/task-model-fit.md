---
tags: [flashcards, local-models, orchestration]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# Task-Model Fit — Flashcards

#flashcards/local-models

## Definition <!-- kb:card:9184b1 -->
What is task-model fit?
?
The principle that whether a task can be successfully delegated to a smaller/cheaper/local model is determined primarily by characteristics of the task itself — reasoning complexity, context/file breadth, and specification precision — rather than by the model's raw capability alone.

## Application <!-- kb:card:28f914 -->
When would you apply task-model fit thinking?
?
When designing a cost-tiered orchestration pipeline (e.g. plan with a strong model, execute with a cheap/local model) — instead of just picking a "good enough" model, shrink the delegated sub-task until it clears the fit criteria (low complexity, narrow file scope, precisely specified) for the weaker model.

## Relationship <!-- kb:card:ec2cb9 -->
How does task-model fit relate to the Thinker-Worker-Verifier pattern?
?
Task-model fit is the condition that determines whether the Worker role in a Thinker-Worker-Verifier setup can safely be assigned to a weaker or local model — if the Thinker's plan doesn't shrink the task into the Worker's fit envelope (complexity, context, precision), delegation breaks down regardless of how good the plan is.

## Distinction <!-- kb:card:80034a -->
How is task-model fit different from weak-to-strong supervision?
?
Weak-to-strong supervision is about a weak model providing *training* signal to a stronger model. Task-model fit is about matching a weak model to an appropriately-scoped *runtime task* — no training is involved, it's a deployment-time delegation decision.
