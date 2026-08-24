---
tags: [flashcards, evaluation, statistics, methodology, domain/data, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Adaptive data analysis — Flashcards

#flashcards/evaluation

## Adaptive data analysis: authors/year <!-- kb:card:44eacd -->
Who wrote the founding adaptive data analysis paper, and when?
?
Dwork, Feldman, Hardt, Pitassi, Reingold, and Roth, 2014.

## The core gap <!-- kb:card:806a7c -->
What gap does 'adaptive data analysis' name between statistical theory and practice?
?
Classical inference guarantees assume hypotheses are fixed before the data is seen, but real analysis adaptively chooses each next question based on previous answers from the same data.

## Naive vs. perturbed reuse <!-- kb:card:877b64 -->
How many adaptive queries can a holdout answer accurately under naive reuse versus under the paper's perturbation approach?
?
Naive reuse degrades after only linearly many adaptive queries; perturbation extends this to an exponential-in-n number of queries.

## The privacy connection <!-- kb:card:f74ef6 -->
What machinery does the paper use to make adaptive reuse of data safe, and why does it work?
?
Machinery developed for privacy preservation — limiting how much any answer reveals about individual samples also limits how much an adaptive analyst can overfit to them.

## Practical translation for eval harnesses <!-- kb:card:43e690 -->
What happens to a holdout set's statistical validity when it repeatedly informs the next change, without a protective mechanism?
?
It is silently spent — the fixed-hypothesis assumption is violated every time results inform the next question, so validity degrades even though nothing looks wrong.
