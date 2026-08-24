---
tags: [flashcards, observability, telemetry, instrumentation, domain/observability, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Wide events as a single source of truth — Flashcards

#flashcards/observability

## Wide events: definition <!-- kb:card:e93ff5 -->
What is the 'wide events as a single source of truth' telemetry architecture?
?
Each unit of work emits one arbitrarily-wide structured log event carrying all its context; that event stream is stored once, and every other signal (metrics, traces, SLOs) is derived from it at read time — as opposed to writing separately into metrics, logs, traces and other stores.

## Write-time vs read-time aggregation <!-- kb:card:87a294 -->
What is the core mechanism difference between multi-pillar telemetry and wide-event telemetry?
?
Pillar tools aggregate at write time (counters and log lines fire immediately, context is discarded before anyone knows what question matters); a wide-event store defers aggregation to read time, so queries can slice on arbitrary dimensions after the fact.

## Wide-event cost model <!-- kb:card:c82de2 -->
How does the wide-events architecture control telemetry cost, compared to the multi-pillar approach?
?
Cost is paid once and controlled by head- or tail-based sampling, instead of paying per pillar and capping cardinality or log levels.

## Litmus test for one source of truth <!-- kb:card:d07467 -->
What is the discriminating test for whether an observability platform truly has a single source of truth?
?
Count how many times the telemetry data is stored — a 'unified observability platform' that federates several stores behind one bill or presentation layer still has many sources of truth.

## High-cardinality data preserved <!-- kb:card:80f698 -->
Why does a wide-event store preserve high-cardinality fields like build id, feature flag, and user id?
?
So read-time queries can slice on arbitrary dimensions, compute outliers, and zoom between a single request and long-term trends — none of which survive write-time aggregation.
