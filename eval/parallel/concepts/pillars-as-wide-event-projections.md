---
title: Metrics, logs and traces as wide-event projections
date: 2026-08-24
domain: observability
maturity: emerging
source_type: practitioner
tags: [concept, observability, telemetry, instrumentation, domain/observability, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics
    hash: sha256:b612b95b3dc7603595166f262bbfad4cf1d6c4e46ae064c9df4ab171d62a0572
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Metrics, logs and traces as wide-event projections

## Definition

**Pillars-as-projections** is the data-model claim that metrics, logs and traces are not three kinds of telemetry but three read-time views over a single primitive — the wide event, a flat bag of named fields recording one fact — such that each pillar is recovered by adding a few conventional fields to an event rather than by running a separate SDK, pipeline, store and vocabulary; the pillars are a presentation choice, not a storage requirement.

## Explanation

The reduction is mechanical and checkable field by field. A trace is wide events that happen to carry SpanId, TraceId and ParentSpanId: filter on a TraceId, topologically sort the resulting events by the SpanId-to-ParentSpanId relation, and the waterfall view falls out at query time. A log is a wide event whose message sits in a field alongside metadata; strip the ID-shaped tokens from that message, hash the remaining template, and grouping by the hash ranks error families without a separate log-analytics product. A metric is a wide event emitted once per interval carrying a snapshot of counters — which is what Prometheus scraping already does, minus the cardinality ceiling. Two consequences follow. First, because the store keeps raw events and pre-aggregates nothing, no field's cardinality is privileged, so an investigation can group by any dimension it thinks of mid-incident — the unknown-unknowns case that pre-declared metric sets structurally cannot serve. Second, the sampling rate must be carried in-band on each event so that the correct aggregate is a sum of sampling rates rather than a row count; that makes per-class dynamic sampling safe and keeps upscaling invisible to the querier. The source is a practitioner essay by an ex-Meta engineer comparing Scuba, Meta's internal wide-event store, with the outside world, and its polemic targets OpenTelemetry's pedagogy and its sixty-term glossary rather than its wire format — the author openly hedges on whether an OpenTelemetry Span is exactly a wide event. What survives the polemic is the mapping itself, which any reader can verify against their own schema.

## Key Properties

- Traces are wide events carrying SpanId, TraceId and ParentSpanId; the waterfall is a topological sort performed at read time
- Logs are wide events with the message in a field; hashing an ID-stripped template turns grouping into error-family ranking
- Metrics are wide events emitted per interval carrying a state snapshot — the scrape model without a cardinality ceiling
- Storing raw events and pre-aggregating nothing makes cardinality irrelevant, so any field is a legal grouping key
- The sampling rate travels in-band per event, so correct aggregation sums sampling rates instead of counting rows
- Field explorability — browsable values and descriptions — is what lets someone debug a system they do not already know

## Relationships

- [[wide-events-single-source-of-truth]] — supplies the reduction argument underneath that architecture: if each pillar is only a view over wide events, then writing telemetry into separate pillar stores is storing the same data three times
- [[observability-generations]] — grounds that generational split in a field-level mapping rather than a maturity narrative, showing the 1.0 pillars to be derivable from the 2.0 storage model instead of merely older than it
- [[telemetry-collector-pipeline]] — the pillars-as-projections claim states the data-model choice that determines what flows through the telemetry collector's hand-off point — whether it exports three separately-shaped telemetry types or a single wide-event stream pillar views are derived from at read time.

## Applications

Deciding whether a proposed telemetry pipeline needs a distinct trace, log and metric path or one event schema with conventional fields; auditing an existing schema by checking whether each pillar can be reconstructed from the raw events, and whether the sampling rate is recorded per event so aggregates stay correct under dynamic sampling.

## Sources

- https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics

## See Also

- [[wide-events-single-source-of-truth]]
- [[observability-generations]]
