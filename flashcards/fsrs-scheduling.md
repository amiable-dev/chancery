---
tags: [flashcards, spaced-repetition, learning, algorithms, pkm, memory]
sr-due: 2026-08-21
sr-interval: 1
sr-ease: 250
---

# FSRS (Free Spaced Repetition Scheduler) — Flashcards

#flashcards/spaced-repetition

## Definition <!-- kb:card:119356 -->
What is FSRS, and how does it decide the next review interval?
?
The **Free Spaced Repetition Scheduler** — a scheduling algorithm that models each card's memory state as difficulty, stability and retrievability, then picks the interval at which retrievability will have decayed to a chosen target retention. It solves for a target rather than compounding a fixed multiplier.

## The DSR model <!-- kb:card:e8c3b6 -->
What do difficulty, stability and retrievability each represent in FSRS?
?
- **Difficulty** — an intrinsic property of the card; how hard this material is for you
- **Stability** — how long the memory currently lasts before it fades
- **Retrievability** — the probability you could recall it right now, decaying as elapsed time grows relative to stability

A review updates all three.

## Contrast with SM-2 <!-- kb:card:82148c -->
What can FSRS express that SM-2's ease factor cannot?
?
SM-2 tracks a single ease factor per card and compounds it, so it cannot separate *why* a card is hard from *how long* the memory lasts, and it cannot be aimed at a retention target. FSRS separates those into difficulty and stability, which is what lets it distinguish an intrinsically hard card from a merely under-reviewed one.

## Retention as an input <!-- kb:card:a11e2d -->
Why does making target retention a parameter change how you use a scheduler?
?
You state the retention you want and the review workload follows from it. Under SM-2 the reverse holds — you get whatever retention the multipliers happen to produce and only discover it afterwards. Retention becomes a dial you set rather than an outcome you measure.

## When not to fit parameters <!-- kb:card:ab6cac -->
When should you keep FSRS's default parameters rather than fitting your own?
?
Below roughly a few hundred reviews. Fitting needs enough review history to be signal rather than noise; with a thin log the personalised parameters are overfitted to accident, and the defaults are the more honest choice.
