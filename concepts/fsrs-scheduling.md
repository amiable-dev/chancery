---
title: FSRS (Free Spaced Repetition Scheduler)
aliases:
  - FSRS
  - Free Spaced Repetition Scheduler
date: 2026-08-21
domain: knowledge-management
maturity: established
source_type: research
topics: [pkm, memory]
tags: [concept, spaced-repetition, learning, algorithms, pkm, memory, domain/knowledge-management, maturity/established, source-type/research, topic/pkm, topic/memory]
status: draft
sources:
  - url: https://github.com/open-spaced-repetition/fsrs4anki
    hash: sha256:6d1092c4fd7833b4d894a343cc0b7ea08ab276eb7ca1852e76f457ad3d0c4c46
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# FSRS (Free Spaced Repetition Scheduler)

## Definition

A spaced-repetition scheduling algorithm that models each card's memory state explicitly as three quantities — difficulty, stability and retrievability — and computes the next review interval by predicting when retrievability will fall to a chosen target, rather than by multiplying the previous interval by a fixed ease factor as SM-2 and its descendants do.

## Explanation

SM-2, the algorithm behind most flashcard software since 1987, tracks one number per card: an ease factor it nudges up or down based on how a review went. Intervals are that factor compounded. It works, but it cannot express why a card is hard, and it cannot be tuned to a target — you get whatever retention the multipliers happen to produce.

FSRS replaces the single factor with the **DSR model**. *Difficulty* is an intrinsic property of the card. *Stability* is how long the memory currently lasts. *Retrievability* is the probability of recall right now, decaying as a function of elapsed time over stability. A review updates all three, and the scheduler solves for the interval at which retrievability will hit the requested retention — typically 0.9.

The consequential difference is that retention becomes an **input, not an outcome**. You state the retention you want and the workload follows, instead of discovering your retention after the fact. Because the model has free parameters, it can also be fitted to an individual's own review log, so the schedule reflects how that person actually forgets rather than a population average.

FSRS began as a third-party Anki add-on and was absorbed into Anki itself, which is the usual arc for a scheduler that measurably beats the incumbent on the same review data.

## Key Properties

- Models memory as difficulty, stability and retrievability (DSR) rather than a single ease factor
- Target retention is a parameter you set; interval length is derived from it
- Parameters can be fitted to an individual's review history, making the schedule personal rather than generic
- Evaluated by prediction error against real review logs, so competing schedulers can be compared on the same data
- Distinguishes an intrinsically hard card from a merely under-reviewed one — SM-2 cannot

## Relationships

- [[retention-decay-knowledge]] — formalises the decay this concept describes: retrievability is the decay curve, and FSRS schedules the next review against it rather than against a fixed multiplier
- [[knowledge-compounding]] — supplies the mechanism — scheduling to a stated retention is what makes review effort compound instead of dissipate
- [[cognitive-offloading]] — sits on the opposite side of the trade-off: FSRS invests review effort to keep knowledge internal, where offloading externalises it
- [[knowledge-consolidation-tiers]] — supplies the scheduling half of consolidation: tiers decide what is worth keeping, FSRS decides when to revisit it

## Applications

**This vault:** the 1,240 cards here carry file-level scheduling inherited from the plugin's note-review feature, and only five have per-card review history. As that history accumulates, per-card difficulty and stability become the signal for the refresh loop — a card whose stability refuses to grow across many reviews is usually badly written rather than intrinsically hard, which is exactly the up-flow the pipeline needs to close.

More generally: choose FSRS over SM-2 whenever you have review logs to fit against and a retention target you can name. Below a few hundred reviews the fitted parameters are noise and the defaults are the honest choice.

## Sources

- https://github.com/open-spaced-repetition/fsrs4anki

## See Also

- [[retention-decay-knowledge]]
- [[knowledge-compounding]]
- [[cognitive-offloading]]
