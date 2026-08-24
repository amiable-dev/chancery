---
title: Symptom-based alerting
date: 2026-08-24
domain: reliability
maturity: established
source_type: practitioner
tags: [concept, observability, alerting, sre, domain/reliability, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://sre.google/sre-book/monitoring-distributed-systems/
    class: external-primary
---

# Symptom-based alerting

## Definition

**Symptom-based alerting** is the discipline of paging humans on what is broken from the user's point of view and reserving cause-oriented signals for debugging after the page — on the reasoning that symptoms are few, stable and definitely user-affecting, while causes are numerous, invalidated by every refactor, and mostly fire when nobody is being hurt.

## Explanation

The mechanism is a forced separation of two questions a monitoring system is asked to answer at once: what is broken, and why. Serving 500s is a symptom; database servers refusing connections is its cause. The pairing is relative to layer rather than absolute — a slow database read is a symptom to the engineer who owns the database and a cause to the engineer watching a slow website — so "symptom" means symptom at the layer being paged, and the same measurement changes role depending on who is holding the pager. Black-box monitoring, probing externally as a user would, is symptom-oriented by construction and can only represent active rather than predicted problems, which is exactly what makes it disciplined for paging: it cannot fire unless something is already ongoing and visible, and it is correspondingly useless for imminent problems. White-box monitoring, reading internal metrics, logs and statistics endpoints, is indispensable for debugging — distinguishing a genuinely slow database from a network problem between web server and database requires both sides' view of the same latency — and can catch imminent failures and failures masked by retries, but it is symptom-oriented or cause-oriented depending on how informative the instrumentation happens to be. Two practical consequences follow. Monitoring symptoms gets easier the further up the stack you go, though saturation and subsystem performance usually have to be measured on the subsystem itself. And dependency-conditioned rules — alert on the database if it is slow, otherwise on the site — mostly fail to pay off, because continuous refactoring keeps invalidating the hierarchy they encode; the exception is a very stable fact such as suppressing latency alerts for a drained datacenter.

## Key Properties

- Page on symptoms; keep cause-oriented signals as debugging aids rather than pagers
- One layer's symptom is the layer below's cause, so the distinction is relative to who is paged
- Black-box probes fire only on active, user-visible problems and are useless for imminent ones
- White-box telemetry is required for debugging and can catch failures that retries are masking
- Dependency-conditioned alert rules rot under continuous refactoring and rarely justify their upkeep

## Relationships

- [[four-golden-signals]] — are mostly symptom measurements taken at the user-facing surface, which is why they translate into paging rules more cleanly than internal cause metrics do
- [[actionable-page-criteria]] — dissolves this distinction at the final step — once a candidate page is urgent, actionable, user-visible and novel, whether black-box or white-box monitoring detected it stops mattering
- [[slo-burn-rate-alerting]] — is the modern formalization of this rule, since burn against a user-facing objective is a symptom measure by construction and cannot accidentally page on a cause

## Applications

Triaging an existing alert set into pagers versus dashboards; deciding whether a proposed cause-based alert belongs in the rotation at all; choosing where in a multi-layer stack a given failure should page.

## Sources

- https://sre.google/sre-book/monitoring-distributed-systems/

## See Also

- [[four-golden-signals]]
- [[actionable-page-criteria]]
- [[slo-burn-rate-alerting]]
