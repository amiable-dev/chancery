---
title: Actionable page criteria
date: 2026-08-24
domain: reliability
maturity: established
source_type: practitioner
tags: [concept, alerting, on-call, sre, domain/reliability, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://sre.google/sre-book/monitoring-distributed-systems/
    hash: sha256:0b46517deadbdc47994f359966cc29ba0390ef5eee4f68988a189a49c73c2f3b
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Actionable page criteria

## Definition

**Actionable page criteria** are the tests an alert must pass before it is permitted to wake a human: it detects an otherwise undetected condition that is urgent, actionable and actively or imminently user-visible; the responder can do something about it now; the response demands judgement rather than a rote script; and nobody else is already being paged for the same thing.

## Explanation

The criteria work as a budget rather than a style guide, because the cost being controlled is cumulative. A page interrupts work or sleep, and a responder can react with genuine urgency only a few times a day before fatigue sets in — after which alerts get second-guessed, skimmed or ignored, a real page gets masked by the noise, and outages run longer because the noise also obstructs diagnosis. Each test removes a distinct failure. Requiring an otherwise undetected condition kills duplicate coverage across teams. Asking whether the alert will ever be safely ignorable surfaces the cases that should be filtered out rather than fired — drained traffic, test deployments — before they teach the rotation to dismiss it. Asking whether the action could be safely automated catches the rote page, which the source treats as a red flag rather than a nuisance: a page whose response is algorithmic should be a script, and a team unwilling to automate it is signalling that it does not trust itself to clean up its own technical debt, which is a problem worth escalating rather than an alerting decision. The philosophy has a matching prescription for everything that fails the tests: email alerts are judged of very limited value and prone to becoming spam that nobody reads, so subcritical ongoing problems belong on a dashboard, optionally paired with a log for historical correlation. The source is Google SRE's monitoring chapter, which flags the philosophy as partly aspirational even inside Google — it is offered as a checklist for writing or reviewing an alert, not as a description of a solved problem.

## Key Properties

- Urgent, actionable, actively or imminently user-visible, and not already covered by another page
- Every page response should require intelligence; a rote response means the work should be a script
- Pages should concern novel problems rather than events already seen and understood
- Refusal to automate a rote page signals distrust of the team's own follow-through and is worth escalating
- Subcritical conditions belong on a dashboard, since email alerts reliably decay into unread spam

## Relationships

- [[symptom-based-alerting]] — narrows the field this checklist then judges, and the checklist in turn makes the detection method irrelevant once a candidate page satisfies all four tests
- [[short-term-availability-tradeoff]] — is the lever to reach for when the checklist stops helping — when every rule passes on its own merits and the aggregate paging load is still the thing making the team unhealthy
- [[slo-burn-rate-alerting]] — operationalizes the urgency test by tying page-worthiness to how fast an error budget is being consumed rather than to a threshold chosen by intuition

## Applications

Reviewing a proposed alert before it ships; auditing a rotation by running every existing rule through the checklist and deleting or demoting the failures; settling arguments about whether a recurring condition deserves a page or a script.

## Sources

- https://sre.google/sre-book/monitoring-distributed-systems/

## See Also

- [[symptom-based-alerting]]
- [[short-term-availability-tradeoff]]
- [[slo-burn-rate-alerting]]
