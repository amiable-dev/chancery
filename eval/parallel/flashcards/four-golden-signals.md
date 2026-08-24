---
tags: [flashcards, observability, monitoring, sre, domain/observability, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# The four golden signals — Flashcards

#flashcards/observability

## Definition <!-- kb:card:efc006 -->
What are the four golden signals, and what rule of thumb governs them?
?
Latency, traffic, errors and saturation — the minimal measurement set held to give adequate monitoring coverage of a user-facing service; if you can measure only four things about a system, measure these.

## Why latency is split by outcome <!-- kb:card:f625b0 -->
Why must latency be measured separately for successful and failed requests rather than as one mean?
?
An instant error (e.g. a dropped backend connection) pulls the mean latency down and hides the failure. A slow error is worse than a fast one, so error latency is tracked separately rather than filtered out.

## Three kinds of errors <!-- kb:card:f2decb -->
What three kinds of failure does the errors signal need to count, beyond explicit failures like a 500?
?
Explicit (a 500), implicit (a 200 carrying the wrong content, caught only by end-to-end tests), and by policy (any request slower than a committed response-time budget).

## Saturation target and leading indicator <!-- kb:card:2e9cd4 -->
Why is saturation's utilization target set below 100%, and what is often its earliest indicator?
?
Most systems degrade before they saturate, so the target sits below full utilization; rising 99th-percentile latency over a short window is often the earliest indicator of approaching saturation.

## Scope of the claim <!-- kb:card:ae0d70 -->
What does the four golden signals framework claim about a service that measures and pages on all four?
?
Only that it is 'at least decently covered' — a reachable floor for monitoring, not a complete description of the system.
