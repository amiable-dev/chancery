---
tags: [flashcards, observability, reliability, sre, domain/reliability, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# SLO burn-rate alerting — Flashcards

#flashcards/observability

## Definition <!-- kb:card:204ac2 -->
What does SLO burn-rate alerting alert on, instead of raw error counts or instantaneous error rates?
?
The rate at which the error budget is being consumed, evaluated over multiple time windows simultaneously.

## Four evaluation attributes <!-- kb:card:18c2f7 -->
What four attributes does the SRE Workbook chapter use to evaluate any alerting strategy?
?
Precision (fraction of alerts marking significant events), recall (fraction of significant events alerted), detection time, and reset time.

## Why naive strategies fail <!-- kb:card:6a1ef2 -->
Why do the two naive alerting strategies — alerting on instantaneous error rate, and alerting only when the whole budget is exhausted — each fail?
?
Instantaneous error rate is noisy (low precision); waiting until the whole budget is gone detects problems far too late.

## What burn rate means <!-- kb:card:c149cc -->
What does a burn rate of exactly 1 mean, and why does normalizing consumption against the budget matter?
?
A burn rate of 1 spends exactly the allotted budget over the SLO window; normalizing consumption against the budget lets alert thresholds map directly to time-to-exhaustion, rather than being an arbitrary error-count cutoff.

## Multiwindow design <!-- kb:card:9fa3fa -->
Why does mature burn-rate alerting pair a long window with a short window (e.g., one hour and five minutes)?
?
So alerts fire quickly on genuine spikes via the short window while resetting promptly once the problem clears via the long window; a slower, lower-burn-rate pair is also layered beneath the paging pair for ticket-severity issues.
