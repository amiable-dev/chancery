---
tags: [flashcards, observability, telemetry, instrumentation, domain/observability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Metrics, logs and traces as wide-event projections — Flashcards

#flashcards/observability

## Definition <!-- kb:card:edca0b -->
What is the pillars-as-projections claim?
?
That metrics, logs, and traces are not three kinds of telemetry but three read-time views over a single primitive — the wide event, a flat bag of named fields recording one fact. Each pillar is recovered by adding a few conventional fields to an event, not by running a separate SDK, pipeline, store, and vocabulary.

## Trace mechanism <!-- kb:card:1cb13d -->
How is a trace's waterfall view recovered from wide events?
?
Filter wide events on a shared TraceId, then topologically sort them by the SpanId-to-ParentSpanId relation — the waterfall falls out at query time, with no separate trace store needed.

## Log mechanism <!-- kb:card:af80c0 -->
How does the wide-event model recover log error-family grouping without a separate log-analytics product?
?
A log is a wide event whose message sits in a field. Strip the ID-shaped tokens from that message, hash the remaining template, and group by the hash to rank error families.

## Metric mechanism <!-- kb:card:b7081a -->
How is a metric recovered from the wide-event model, and what limitation does it lack compared to Prometheus scraping?
?
A metric is a wide event emitted once per interval carrying a snapshot of counters — the same thing Prometheus scraping already does, minus the cardinality ceiling.

## The unknown-unknowns consequence <!-- kb:card:aadb0c -->
Why does storing raw, unaggregated wide events let an investigation group by any dimension mid-incident?
?
Because nothing is pre-aggregated, no field's cardinality is privileged — any field is a legal grouping key. Pre-declared metric sets structurally cannot serve this case, since they force you to decide which dimensions matter before the incident happens.

## Why sampling rate travels in-band <!-- kb:card:a4b3e1 -->
Why must the sampling rate travel in-band on each wide event?
?
So the correct aggregate is a sum of sampling rates rather than a row count — that makes per-class dynamic sampling safe and keeps upscaling invisible to whoever is querying.
