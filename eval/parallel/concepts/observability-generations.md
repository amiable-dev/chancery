---
title: Observability generations (1.0 vs 2.0)
aliases:
  - Observability 1.0
  - Observability 2.0
  - Versioning observability
date: 2026-08-24
tags:
  - concept
  - observability
  - telemetry
  - cost-model
status: draft
sources:
  - url: https://www.honeycomb.io/blog/time-to-version-observability-signs-point-to-yes
---

# Observability generations (1.0 vs 2.0)

## Definition

**Observability generations** is the framing, introduced by Honeycomb co-founder Charity Majors, that observability tooling has crossed a semver-style major-version boundary: observability 1.0 is the "three pillars" generation — metrics, logs and traces held in separate tools, with aggregation decided at write time — while observability 2.0 is tooling built on arbitrarily-wide structured log events kept as a single source of truth and queried at read time; the major-version label is argued on the ground that the two storage models are backwards-incompatible, since telemetry cannot simultaneously be scattered across pillar stores and consolidated into one canonical store, and on the observation that which side of the break a stack sits on cascades into its debugging style, its cost model, and whether observability serves operating code or developing it.

## Explanation

The mechanism behind the split is what each generation uses as its source of truth. Metrics became 1.0's workhorse when hardware was expensive: they summarize cheaply, but they discard context at write time, support enrichment only through tags, and cannot hold high-cardinality data — and metrics-based pricing tracks cardinality, so "custom metrics" is effectively a euphemism for unique values, and teams spend engineering careers massaging cardinality to control the bill. Wide structured events (canonical logs in Stripe's usage, service logs in AWS's, Scuba's rows at Facebook) invert the trade: context and relationships are preserved, cardinality is unconstrained, and metrics, traces or SLOs are derived on demand from raw events. From that storage difference the essay derives the generational contrasts: 1.0 debugging is search-first — flipping between static dashboards, pattern-matching shapes by eye, so the best debugger is whoever has seen the system longest — while 2.0 debugging is analysis-first, an interrogative loop starting from the user's experience, where the best debugger is the most curious; 1.0 costs multiply per format stored while 2.0 pays once and samples; 1.0 ends a developer's job at deploy-and-wait-for-pages, while 2.0 expects instrument-as-you-write and inspection of real production behavior before the work counts as done. This is a vendor manifesto — Honeycomb exemplifies the 2.0 side, and its five-year adoption predictions are advocacy — but the storage-model dichotomy it rests on is checkable against any stack and against the cited primary practice at Stripe, AWS and Facebook.

## Key Properties

- Defining split: many pillar stores with write-time aggregation (1.0) versus one wide-event store queried at read time (2.0)
- Semver logic: the storage models are mutually exclusive, making the shift a backwards-incompatible major-version change rather than an increment
- Metrics price by cardinality — "custom metrics" means unique values — so 1.0 cost control means suppressing detail; 2.0 controls cost by sampling
- Debugging shifts from search-first dashboard pattern-matching to analysis-first hypothesis loops over raw events
- Orientation shifts from operating code (MTTR, incidents, pages) to developing it (instrument as you write, verify behavior in production)

## Relationships

- [[wide-events-single-source-of-truth]] — the 2.0 generation is defined by exactly that storage architecture; this framing adds the versioning argument and the debugging, cost and development-practice consequences that follow from which side of the break a stack sits on

## Applications

Classifying an observability stack or vendor by which generation its storage model puts it in before comparing features; deciding where to invest by asking whether a tool's building block is pre-aggregated metrics or wide structured events; framing a migration case around the backwards-incompatible storage break rather than as incremental tool swaps.

## Sources

- https://www.honeycomb.io/blog/time-to-version-observability-signs-point-to-yes

## See Also

- [[wide-events-single-source-of-truth]]
