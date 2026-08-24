---
tags: [flashcards, alerting, on-call, sre, domain/reliability, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Actionable page criteria — Flashcards

#flashcards/alerting

## The four page-worthiness tests <!-- kb:card:1f73c0 -->
What four tests must an alert pass before it's allowed to page a human, per actionable page criteria?
?
It detects an otherwise-undetected condition that's urgent, actionable, and actively or imminently user-visible; the responder can act on it now; the response needs judgement rather than a rote script; and nobody else is already being paged for the same thing.

## Why treat paging as a budget <!-- kb:card:35e169 -->
Why does actionable page criteria treat paging as a budget rather than a style guide?
?
Because the cost is cumulative — a responder can react with genuine urgency only a few times a day before fatigue sets in, after which real pages get masked by noise and outages run longer.

## Rote response means automate it <!-- kb:card:9acc1f -->
What should happen to a page whose response is purely algorithmic (rote)?
?
It should become a script instead of a page; a team unwilling to automate a rote page is signalling distrust of its own follow-through, which is itself worth escalating rather than an alerting decision.

## Subcritical conditions go on a dashboard <!-- kb:card:e9b874 -->
Where should subcritical, non-paging conditions be surfaced instead of an email alert?
?
On a dashboard, optionally paired with a log for historical correlation — email alerts are judged of very limited value and prone to becoming spam nobody reads.

## Source treats this as aspirational <!-- kb:card:5feec0 -->
How solved does Google SRE's monitoring chapter consider this philosophy to be, even inside Google itself?
?
Partly aspirational — it's offered as a checklist for writing or reviewing an alert, not as a description of an already-solved problem.
