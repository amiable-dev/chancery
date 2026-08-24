---
title: Fitted spaced-repetition scheduling
date: 2026-08-24
domain: knowledge-management
maturity: emerging
source_type: practitioner
tags: [concept, learning, spaced-repetition, memory, domain/knowledge-management, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://github.com/open-spaced-repetition/fsrs4anki
    class: external-primary
---

# Fitted spaced-repetition scheduling

## Definition

**Fitted spaced-repetition scheduling** replaces a hand-tuned interval heuristic with two separable parts: a memory model that predicts, from a small per-item state, the probability an item is still recallable after a given delay, and an optimizer that fits that model's free parameters to one learner's own logged review history by machine learning. Intervals are then derived from a personal estimate of forgetting rather than from fixed multipliers shared by every user of the system.

## Explanation

Classic schedulers in the SM-2 lineage carry an ease factor per card and multiply the interval by it after each success, with global constants that no data ever updates — the learner's actual pass and lapse record influences the schedule only through those coarse multipliers. A fitted scheduler inverts the arrangement. The memory model predicts recall probability as a function of elapsed time and the item's current state, and the scheduler asks it for the delay at which predicted recall is still at the chosen retention target; that delay is the next interval. The optimizer consumes the complete review log — every grade with its timestamp — and adjusts the model's parameters so predicted recall matches observed recall for that specific person, which is where the personalisation actually lives. One structural consequence matters more than the accuracy gain: because the schedule is derived from the model, anything else that modifies intervals breaks the derivation. That is why interval-altering add-ons become incompatible rather than merely redundant, and why quantities inherited from the older scheme — the ease factor, the post-lapse new interval — stop carrying meaning once the model is in charge. The research line is deliberately data-driven while keeping parameters interpretable and verifiable rather than opaque, following work published by Maimemo in 2022 and 2023, and shipped inside Anki core from version 23.10 rather than staying an add-on. The source here is the project's own repository README, so claims of superiority over the built-in scheduler rest on those linked papers and community-contributed review datasets, not on an independent evaluation.

## Key Properties

- Two separable parts: a scheduler that applies a memory model, and an optimizer that fits the model's parameters
- Parameters are fitted per learner from their own review log, not shared constants baked into the algorithm
- The interval is derived — the delay at which predicted recall still meets a chosen retention target
- Any external modification of intervals invalidates the derivation, making interval-changing add-ons incompatible rather than merely redundant
- Parameters are kept interpretable and verifiable by design, in preference to a black-box predictor

## Relationships

- [[ebbinghaus-forgetting-curve]] — turns that decay finding into a fitted per-learner model, replacing the shared constants of earlier schedulers with parameters estimated from one person's review history
- [[knowledge-lifecycle-management]] — knowledge lifecycle management applies the same decay-driven scheduling logic fitted spaced-repetition scheduling fits to a human learner's recall, instead to a knowledge base's claims — unreinforced material fading along a forgetting curve is the system-directed analogue of a personal forgetting estimate.

## Applications

Scheduling review in any spaced-repetition setting where per-learner review logs already exist — flashcard decks, language vocabulary, recertification material — by choosing an explicit retention target and letting intervals follow from the fitted model, instead of hand-tuning interval multipliers. Also a template for personalising any scheduling heuristic that currently ships with global constants.

## Sources

- https://github.com/open-spaced-repetition/fsrs4anki

## See Also

- [[ebbinghaus-forgetting-curve]]
