---
title: The four golden signals
date: 2026-08-24
domain: observability
maturity: established
source_type: practitioner
tags: [concept, observability, monitoring, sre, domain/observability, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://sre.google/sre-book/monitoring-distributed-systems/
    hash: sha256:0b46517deadbdc47994f359966cc29ba0390ef5eee4f68988a189a49c73c2f3b
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# The four golden signals

## Definition

The **four golden signals** are latency, traffic, errors and saturation — the minimal measurement set held to give adequate monitoring coverage of a user-facing service, on the rule that if you can measure only four things about a system, measure these, and page a human when one of them is problematic or, in saturation's case, nearly so.

## Explanation

Each signal is defined so as to close a specific way naive instrumentation lies. Latency must be split by outcome, because an error returned instantly when a backend connection drops will pull a mean latency down and hide the failure — and since a slow error is worse than a fast one, error latency is tracked separately rather than filtered out. Traffic is demand expressed in a high-level, system-specific unit: requests per second for a web service, concurrent sessions or network I/O for audio streaming, transactions and retrievals for a key-value store. Errors count three kinds of failure, not one: explicit (a 500), implicit (a 200 carrying the wrong content, which only end-to-end tests catch), and by policy (any request slower than a committed response-time budget) — so counting load-balancer 500s catches complete failures and nothing else. Saturation is how full the most constrained resource is, measured against a utilization target set below 100% because most systems degrade before they saturate; rising 99th-percentile latency over a short window is often its earliest indicator, and saturation extends to prediction, such as the disk that will fill in four hours. The claim attached to the set is modest and worth reading literally: measure all four and page on them and a service is "at least decently covered", which makes this a reachable floor rather than a complete model of a system. The source is the Google SRE book's monitoring chapter, a documented account of one organization's practice rather than a study.

## Key Properties

- Latency is split between successful and failed requests, since fast errors otherwise flatter the mean
- Errors include explicit failures, wrong content returned with a success code, and policy breaches of a latency budget
- Saturation targets the most constrained resource and needs a utilization target below 100%
- Rising 99th-percentile latency is a leading indicator of saturation
- The claim is sufficient coverage for a user-facing service, not a complete description of it

## Relationships

- [[slo-burn-rate-alerting]] — supplies the alerting arithmetic these raw signals lack — the golden signals say what to measure, burn rate says when a measurement has earned a page
- [[symptom-based-alerting]] — is the discipline deciding which of these may page, and the reason they page well is that all four are measured at the user-facing surface, making them symptoms rather than causes
- [[tail-latency-histograms]] — is how the latency signal has to be collected if it is to mean anything, since a mean latency describes no actual request
- [[observability-generations]] — frames what these are in generational terms — four pre-aggregated counters are the metrics-first practice that concept calls observability 1.0, not the high-cardinality events it argues should replace them

## Applications

Instrumenting a user-facing service that currently has no monitoring at all; auditing an existing dashboard for which of the four it silently omits, saturation being the usual gap.

## Sources

- https://sre.google/sre-book/monitoring-distributed-systems/

## See Also

- [[slo-burn-rate-alerting]]
- [[symptom-based-alerting]]
- [[tail-latency-histograms]]
- [[observability-generations]]
