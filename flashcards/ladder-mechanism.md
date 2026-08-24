---
tags: [flashcards, evaluation, statistics, leaderboards, domain/data, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# The Ladder mechanism — Flashcards

#flashcards/evaluation

## The Ladder: authors/year <!-- kb:card:a3d9b1 -->
Who introduced the Ladder mechanism, and when?
?
Blum & Hardt, 2015.

## The structural problem it solves <!-- kb:card:5410cd -->
Why does repeated leaderboard resubmission overfit a holdout, even without adversarial intent?
?
Every published score reveals information about the holdout, so a sequence of submissions guided by those scores becomes an optimization loop running against the evaluation data itself.

## Prior heuristics <!-- kb:card:553b63 -->
What folk heuristics did practice use before the Ladder, and how does the paper characterize them?
?
Limited resubmission rates and truncated score precision — characterized as poorly understood.

## Validation and guarantees <!-- kb:card:8e1ef9 -->
How was the Ladder's practicality validated, beyond its theoretical guarantees?
?
It holds guarantees under a fully adaptive model, resists practical attacks, and was validated on real Kaggle submission data; a parameter-free variant is deployable with no tuning.

## Design lesson <!-- kb:card:a8a4a6 -->
What design lesson does the Ladder mechanism establish about score-gated evaluation?
?
The reporting channel is part of the mechanism itself — what a system reveals per run determines how fast its holdout depletes.
