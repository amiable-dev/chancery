---
tags: [flashcards, reliability, observability, sre, domain/reliability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Spec-driven SLO rule generation — Flashcards

#flashcards/reliability

## Definition <!-- kb:card:aa6650 -->
What is spec-driven SLO rule generation?
?
Declaring a service's objective once in a compact spec (target percentage, period, and error/total event queries) and compiling that mechanically into the full set of monitoring artifacts it implies, instead of hand-writing recording rules, metadata, and burn-rate alerts per service.

## Compiler output layers <!-- kb:card:f8bebb -->
What three layers of monitoring artifacts does the generator emit from one spec?
?
Recording rules (precomputing the error ratio at every window the alerting scheme needs), metadata rules (carrying the objective and its labels for dashboards), and page-severity plus ticket-severity burn-rate alert rules with routing and severity labels attached.

## What problem it removes <!-- kb:card:ebead3 -->
What class of error does spec-driven generation remove, and why does that matter more than saving keystrokes?
?
Expertise-gated error: window arithmetic and burn-rate thresholds are derived once inside the generator instead of being re-derived, and potentially mistyped, by every team.

## Why the spec is reviewable <!-- kb:card:f06d13 -->
Why does deterministic generation make the spec itself the reviewable artifact?
?
Because generation is deterministic, the spec is diffable in a pull request, checkable by a validate command in CI, and produces an identical shape across services — which is what lets one generic dashboard and one alert-routing convention work org-wide.

## Evidence caveat <!-- kb:card:b8ca9e -->
What is the evidentiary status of the claims about uniformity and reliability in this concept's source?
?
The source is a maintained open-source project's own README, which asserts uniformity and reliability rather than measuring them; what is independently checkable is the transformation itself, since the repo publishes an example spec next to the exact rules it produces.
