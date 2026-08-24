---
tags: [flashcards, learning, spaced-repetition, memory, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Fitted spaced-repetition scheduling — Flashcards

#flashcards/learning

## Definition <!-- kb:card:9f601b -->
What two separable parts make up fitted spaced-repetition scheduling, replacing a hand-tuned interval heuristic?
?
A memory model that predicts recall probability from per-item state and elapsed time, plus an optimizer that fits the model's free parameters to one learner's own logged review history.

## How the interval is derived <!-- kb:card:4d8a26 -->
How is the next review interval derived in a fitted spaced-repetition scheduler?
?
It is the delay at which the memory model's predicted recall probability still equals the chosen retention target.

## Where personalization lives <!-- kb:card:addbee -->
Where does the personalization in fitted spaced-repetition scheduling actually come from?
?
From the optimizer fitting the model's parameters so predicted recall matches one person's observed pass/lapse record — not from shared constants baked into the algorithm.

## Add-on incompatibility <!-- kb:card:2ee606 -->
Why do interval-altering add-ons become incompatible, not just redundant, with a fitted scheduler?
?
The schedule is derived from the model, so anything else that modifies intervals breaks that derivation; legacy quantities like the ease factor stop carrying meaning once the model is in charge.

## Contrast with classic SM-2 schedulers <!-- kb:card:8b2b81 -->
How does a classic SM-2-lineage scheduler differ from a fitted scheduler in how it uses a learner's review record?
?
SM-2 multiplies intervals by a per-card ease factor and fixed global constants that no data ever updates; a fitted scheduler instead fits its model's parameters directly to that learner's full review log.
