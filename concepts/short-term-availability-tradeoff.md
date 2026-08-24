---
title: Trading short-term availability for long-term health
date: 2026-08-24
domain: reliability
maturity: established
source_type: practitioner
tags: [concept, reliability, on-call, sre, domain/reliability, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://sre.google/sre-book/monitoring-distributed-systems/
    hash: sha256:0b46517deadbdc47994f359966cc29ba0390ef5eee4f68988a189a49c73c2f3b
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Trading short-term availability for long-term health

## Definition

The **short-term availability trade** is the deliberate decision to accept a controlled, temporary loss of availability or alerting coverage — relaxing an objective, disabling a class of alerts, shipping a stopgap — in order to free the engineering attention needed to fix the underlying problem, on the reasoning that every page fired today is a human not improving the system for tomorrow.

## Explanation

The mechanism is buying attention with reliability, and two documented cases show its shape. Bigtable's service objective was once set against a synthetic client's mean performance, which a heavy tail dominated; email alerts fired as the objective was approached and pages when it was exceeded, both voluminously, so the team spent its days triaging to find the few actionable alerts and still missed the problems that genuinely affected users, because so few of them did. The remedy was three-pronged: work on the real performance problem, temporarily relax the target from the mean to the 75th percentile, and disable the email alerts outright — buying enough quiet to fix the storage stack rather than that day's symptoms. Early Gmail, built on a batch scheduler retrofitted to long-lived processes, alerted per de-scheduled task across many thousands of tasks each representing a fraction of a percent of users; the team built a tool to nudge the scheduler and then argued about whether automating the whole detect-and-nudge loop would relieve the pain that was motivating the real fix. That argument is the pattern's actual content, and it is not technical: it turns on whether a team trusts its own discipline to return and do the proper fix once the pain stops, which makes it a leadership problem — someone has to keep the slow fix prioritized after the paging subsides, or the stopgap becomes the architecture. The corollary is that paging load is itself a metric: page frequency per shift is reviewed with management, because the question worth asking is not whether each individual page was justified but whether the overall level is compatible with a team that will still be there next year.

## Key Properties

- Every page today costs some of the work that would have prevented tomorrow's pages
- Relaxing an objective or disabling an alert class can be the correct move rather than a retreat
- The stopgap-versus-real-fix argument turns on trust in the team's own follow-through, not on engineering merit
- Someone in authority must keep the long-term fix prioritized after the pain subsides
- Page frequency per shift is tracked as a health metric and reviewed with management

## Relationships

- [[actionable-page-criteria]] — operates on individual rules while this operates on the aggregate, which is why a rotation can be drowning even though every single rule passes that checklist
- [[slo-burn-rate-alerting]] — presumes an objective worth burning against, and this is the move to make when the objective itself — badly chosen, or set on a mean over a heavy tail — is the thing generating the noise

## Applications

Deciding what to do about a rotation drowning in individually justified pages; setting or deliberately relaxing a service objective that is not currently achievable; making the case to management for a reliability pause with a named end condition.

## Sources

- https://sre.google/sre-book/monitoring-distributed-systems/

## See Also

- [[actionable-page-criteria]]
- [[slo-burn-rate-alerting]]
