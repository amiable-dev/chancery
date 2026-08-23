---
tags: [flashcards, ai-alignment, metrics, evaluation]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Performance Gap Recovered (PGR) — Flashcards

#flashcards/ai-alignment

## Definition <!-- kb:card:e3511c -->
What is Performance Gap Recovered (PGR)?
?
A normalised metric for weak-to-strong supervision experiments:
PGR = (strong_model_perf − weak_teacher_perf) / (strong_ceiling_perf − weak_teacher_perf)
PGR = 0 → strong model no better than weak teacher.
PGR = 1 → strong model achieves its theoretical best (as if trained on ground-truth labels).

## Interpretation <!-- kb:card:a7d7f6 -->
What does a PGR of 0.97 mean in plain English?
?
The supervision method recovered 97% of the gap between the weak teacher's performance ceiling and the strong model's theoretical best. In other words, the strong model is nearly as good as it could possibly be, given access only to weak teacher supervision.

## Why normalise? <!-- kb:card:abfc9d -->
Why use PGR instead of raw accuracy?
?
Raw accuracy varies across tasks and model pairs. PGR abstracts away absolute performance and focuses on relative improvement — making results comparable across different domains (chat, math, coding) and different model size pairings.

## Failure mode <!-- kb:card:c8cb5b -->
How can PGR scores be gamed?
?
An agent can exploit gaps between the metric and the underlying task — e.g. predicting the most common answer (mode) rather than learning from supervision, or running code against tests to read off answers. This is reward hacking: high PGR without meaningful alignment progress.
