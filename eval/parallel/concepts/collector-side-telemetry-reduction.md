---
title: Collector-side telemetry reduction
date: 2026-08-24
domain: observability
maturity: emerging
source_type: vendor-doc
tags: [concept, observability, sampling, cost-control, domain/observability, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://oneuptime.com/blog/post/2026-02-06-reduce-observability-costs-intelligent-sampling/view
    hash: sha256:53c73ced4f7a44f08bddf01b5f767be8e4b6bd76220c1ce2b96ecd1ecf3035aa
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Collector-side telemetry reduction

## Definition

**Collector-side telemetry reduction** is the practice of deciding what telemetry is worth storing inside the pipeline process that sits between instrumented services and the storage backend, rather than at instrumentation time or at query time: complete traces are buffered briefly so the keep-or-drop decision can be made on the finished trace instead of on its first span, oversized span attributes are truncated or deleted, high-cardinality labels are normalised out of metrics before aggregation, and low-severity logs are filtered per service, so spend falls with volume while every error, slow and debug-flagged trace is still stored in full.

## Explanation

The load-bearing distinction is head versus tail. Head-based sampling decides at the first span, before anything is known about how the request ends, so it must sample failures at the same rate as successes and the interesting traces vanish proportionally. Tail-based sampling holds spans until the trace completes, bounded by a decision window sized above the longest expected trace and a cap on in-flight traces, which is where its memory cost lives, and only then evaluates policies against the whole trace: keep everything with an error status, keep everything above a latency threshold, keep anything carrying a debug header, drop health-check and readiness routes outright, and sample the routine remainder at a few percent. Because the interesting traces are rare and the routine ones are the volume, keeping all of the former and almost none of the latter are not in tension, and that is the entire trick. Three cheaper levers stack on top of it and each attacks a different cost driver: truncating and deleting fat span attributes such as full SQL text and request headers reduces per-span size rather than span count; stripping per-instance labels and templating identifiers out of route names reduces metric series cardinality, which is billed separately from volume; and severity filtering trims logs per service. The discipline around the change transfers further than the configuration does. Roll out one strategy at a time and validate each before starting the next, using deliberate tests rather than inspection: trigger a known error and confirm the full trace arrives, inject latency and confirm the trace is kept, check dashboards still show the same trends, and fire a test alert. Measure the actual reduction from the collector's own accepted-versus-exported span counters, not from next month's invoice. The source is a vendor blog post, but its content is vendor-neutral OpenTelemetry Collector configuration and its headline percentages are illustrative rather than measured, so treat the ratios as shape and the counters as truth.

## Key Properties

- The decision point is the collector, between instrumentation and storage, so no service is re-instrumented and no backend feature is required
- Tail sampling buffers complete traces so policy can key on outcome; head sampling structurally cannot know how a trace ends
- Canonical policy shape: keep all errors, all slow traces and all debug-flagged traces, drop health checks, sample the routine rest at a few percent
- Attribute trimming reduces per-span size and label normalisation reduces metric cardinality — cost drivers distinct from span count
- Validate one strategy at a time with deliberate tests, and measure reduction from the collector's own accepted and exported span counters

## Relationships

- [[observability-generations]] — sits in tension with that framing's read-time promise, because sampling and attribute trimming are write-time decisions about which questions the stored data will ever be able to answer, taken for cost rather than for architecture
- [[wide-events-single-source-of-truth]] — is in direct conflict with attribute trimming and cardinality normalisation, since that architecture's value comes from each event carrying all of its context and these techniques cut cost by removing exactly that width
- [[slo-burn-rate-alerting]] — constrains what may be sampled away, because error-budget alerting has to key on signals that survive the pipeline, so anything an alert derives from must be counted before the sampler or exempted from it
- [[ebpf-zero-instrumentation-observability]] — makes this necessary at a scale nobody opted into, since collecting telemetry for every process on a node without developers wiring anything in produces volume that has to be priced somewhere, and the collector is where
- [[telemetry-collector-pipeline]] — collector-side telemetry reduction describes a specific policy the telemetry collector runs — the keep-or-drop sampling decision happens inside the hand-off point a collector occupies, buffering a complete trace before deciding rather than sampling at instrumentation time.

## Applications

Bringing an OpenTelemetry pipeline's bill down without turning instrumentation off or losing incident data: start with tail-sampling policies that keep errors, slow requests and debug-flagged traces, then trim attributes and metric cardinality, validating and measuring after each step. It is also the layer to reach for when the telemetry volume is being produced by something you do not control, such as a shared node-level collector.

## Sources

- https://oneuptime.com/blog/post/2026-02-06-reduce-observability-costs-intelligent-sampling/view

## See Also

- [[observability-generations]]
- [[wide-events-single-source-of-truth]]
- [[slo-burn-rate-alerting]]
- [[ebpf-zero-instrumentation-observability]]
