---
tags: [flashcards, ai-alignment, scalable-oversight, llm]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Weak-to-Strong Supervision — Flashcards

#flashcards/ai-alignment

## Definition <!-- kb:card:5d856c -->
What is weak-to-strong supervision?
?
A training paradigm where a weaker model ("teacher") provides fine-tuning supervision to a more capable "strong" base model. The strong model is expected to extract more signal from the weak labels than the teacher could produce directly — generalising beyond the teacher's own limitations.

## Analogy <!-- kb:card:84bc9d -->
What is the alignment analogy behind weak-to-strong supervision?
?
The weak teacher stands in for humans; the strong base model stands in for superhuman AI. If we can make a strong model behave well under weak human supervision, we gain confidence that far smarter systems could also be kept aligned — even when humans can't directly verify their outputs.

## Result <!-- kb:card:a12e10 -->
What PGR did Anthropic's AARs achieve on weak-to-strong supervision vs human researchers?
?
AARs: PGR 0.97 (near-perfect gap recovery) after ~800 cumulative hours at ~$18k.
Human researchers: PGR 0.23 after 7 days.

## Limitation <!-- kb:card:b13f18 -->
Why might a high-PGR method in a research setting fail at production scale?
?
Methods can overfit to the specific models and datasets used in the experiment. Anthropic's top AAR method showed no statistically significant improvement when applied to Claude Sonnet 4 with production training infrastructure.

## Transfer <!-- kb:card:8730b5 -->
What happened when the best AAR method was applied to held-out math and coding tasks?
?
Math: PGR 0.94 — strong transfer.
Coding: PGR 0.47 — partial transfer, still 2× human baseline.
The second-best method worked on math but hurt coding performance.
