---
tags: [flashcards, observability, alerting, sre, domain/reliability, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Symptom-based alerting — Flashcards

#flashcards/observability

## Symptom-based alerting: definition <!-- kb:card:2b25cb -->
What is 'symptom-based alerting', and what does it reserve cause-oriented signals for?
?
Paging humans on what is broken from the user's point of view; cause-oriented signals are reserved for debugging after the page, not for paging.

## Symptom vs cause is relative to layer <!-- kb:card:c70887 -->
Is the symptom/cause distinction absolute or relative? Give the concept's database example.
?
Relative to layer: a slow database read is a symptom to the engineer who owns the database, but a cause to the engineer watching a slow website. 'Symptom' means symptom at the layer being paged.

## Black-box monitoring's paging discipline <!-- kb:card:515e0d -->
Why is black-box (external probe) monitoring naturally disciplined for paging, and what is it useless for?
?
It probes externally as a user would, so it can only represent active, user-visible problems — it cannot fire on something not yet happening, which also makes it useless for imminent problems.

## White-box monitoring's role <!-- kb:card:2c3b15 -->
What is white-box monitoring indispensable for, and what kind of failures can it catch that black-box monitoring cannot?
?
Debugging — e.g. distinguishing a genuinely slow database from a network problem — and it can catch imminent failures and failures masked by retries.

## Why dependency-conditioned alert rules fail <!-- kb:card:b20f47 -->
Why do dependency-conditioned alert rules (e.g. 'alert on the database if slow, else on the site') mostly fail to pay off?
?
Continuous refactoring keeps invalidating the hierarchy they encode; they only work for a very stable fact, such as suppressing latency alerts for a drained datacenter.
