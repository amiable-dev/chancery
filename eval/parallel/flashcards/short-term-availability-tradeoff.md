---
tags: [flashcards, reliability, on-call, sre, domain/reliability, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Trading short-term availability for long-term health — Flashcards

#flashcards/reliability

## Definition <!-- kb:card:60e0a1 -->
What is the "short-term availability trade," and what's the reasoning behind deliberately accepting it?
?
The deliberate decision to accept a controlled, temporary loss of availability or alerting coverage (relaxing an objective, disabling a class of alerts, shipping a stopgap) to free the engineering attention needed to fix the underlying problem — because every page fired today is a human not improving the system for tomorrow.

## Bigtable example <!-- kb:card:38aed1 -->
How did the Bigtable team apply this trade to a noisy alerting problem caused by their objective?
?
Their objective was set against a synthetic client's mean, dominated by a heavy tail, which generated voluminous alerts. They worked the real performance problem while relaxing the target from the mean to the 75th percentile and disabling the email alerts outright — buying quiet to fix the storage stack.

## The real trade-off <!-- kb:card:18923a -->
According to the concept, what does the "stopgap vs. real fix" argument actually turn on, and why does that make it a leadership problem?
?
Whether a team trusts its own discipline to return and do the proper fix once the pain stops, not on engineering merit — someone in authority must keep the slow fix prioritized after the paging subsides, or the stopgap becomes the architecture.

## Page frequency as a metric <!-- kb:card:2348d6 -->
What aggregate metric does the concept say is tracked and reviewed with management, and what question does it answer?
?
Page frequency per shift — reviewed not to ask whether each individual page was justified, but whether the overall level is compatible with a team that will still be there next year.
