---
tags: [flashcards, ai-safety, alignment, scalable-oversight, domain/ai-safety, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Debate-augmented weak supervision — Flashcards

#flashcards/ai-safety

## Definition <!-- kb:card:2f8dc5 -->
What is debate-augmented weak supervision?
?
A hybrid alignment technique: before a weak supervisor labels training data for a strong student, two instances of the strong model debate opposing answers, and the transcript is appended to the weak model's training inputs — letting it extract trustworthy signal from a more capable but untrustworthy model.

## Key mechanism <!-- kb:card:0f6871 -->
What principle makes debate transcripts useful signal for the weak supervisor?
?
It is harder to lie than to refute a lie — a debater arguing a falsehood exposes flaws its opponent can convincingly point out, giving the weak model exploitable context.

## Ensemble diversity <!-- kb:card:faa945 -->
Why do four-member weak-model ensembles varying by debate seed outperform single weak models or finetune-seed ensembles?
?
Three-turn transcripts are long relative to weak-model capacity, so varying the debate sampling seed adds useful diversity — transcript diversity, not finetuning noise, is the active ingredient.

## Debate length trade-off <!-- kb:card:cc06d0 -->
What happened when the debate was extended past three turns?
?
Accuracy fell — debaters lost the thread of the longer transcripts.

## Benchmark result <!-- kb:card:57b0e2 -->
By how much did debate-augmented weak supervision raise performance-gap-recovered on SciQ over the auxiliary-confidence-loss baseline?
?
From 41.2% to 76.5%, using Qwen-7B as the weak supervisor and Qwen-14B as the strong student.
