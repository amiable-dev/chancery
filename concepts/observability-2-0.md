---
title: "Observability 2.0"
date: 2026-04-26
domain: observability
maturity: emerging
source_type: practitioner
topics: [devops]
tags: [concept, observability, distributed-systems, architecture, wide-events, honeycomb, domain/observability, maturity/emerging, source-type/practitioner, topic/devops]
status: draft
sources:
  - url: https://www.honeycomb.io/blog/time-to-version-observability-signs-point-to-yes
    hash: sha256:bbb44491850eca4b17dac1e9e9d7291ac013763fe8221b273408832634419d7e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.honeycomb.io/blog/one-key-difference-observability1dot0-2dot0
    hash: sha256:1136900266428aa3d3329400016f0fa6caf281d37028f6aadb384b9f780087b3
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics
    hash: sha256:b612b95b3dc7603595166f262bbfad4cf1d6c4e46ae064c9df4ab171d62a0572
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Observability 2.0

## Definition
A paradigm shift in observability, coined by Charity Majors (Honeycomb), that replaces the siloed metrics/logs/traces "three pillars" model with **arbitrarily-wide structured events** as a single source of truth. Where Observability 1.0 pre-aggregates data at write time into separate stores, Observability 2.0 stores raw, high-cardinality events and aggregates at read time, enabling arbitrary ad-hoc queries without predetermining questions in advance.

## Explanation
The "three pillars" model (metrics, logs, traces) was named by Peter Bourgon in 2017 and became the dominant industry framing. Vendors embraced it because they happened to already have separate products for each. Charity Majors argues this framing is "backwards-incompatible" with modern system complexity — hence the major version bump.

**The core architectural difference:**

| | Observability 1.0 | Observability 2.0 |
|---|---|---|
| **Data model** | Separate metrics, logs, traces stores | Single store of wide structured events |
| **Aggregation** | At write time (you decide upfront) | At read time (you ask anything later) |
| **Cardinality** | Limited — high cardinality = expensive | Unlimited — pack thousands of dimensions |
| **Source of truth** | Many (one per tool type) | One (the canonical event) |
| **Debugging mode** | Search-first ("find the metric that spiked") | Analysis-first ("why does this set of events differ?") |
| **Who benefits most** | On-call engineers who know the system | Any engineer, including those new to it |

**The wide event model:**

A "wide event" (also called a canonical log line or structured log event) is a single JSON object with hundreds of fields emitted per request or operation. Instead of:
- A metric for latency
- A trace for the service call tree
- A log for the error message

You emit one event that contains *all* of those: user ID, request ID, service, latency, error, feature flag state, A/B variant, trace ID, build version, datacenter, customer tier, etc.

From this single event you can *derive* metrics (aggregate over time), reconstruct trace trees (group by trace ID), or search logs (filter by error field). The derivation happens at read time, not write time.

**Why high cardinality matters:**

In 1.0, querying "what's the latency for user ID 12345?" is impossible — user ID is too high cardinality to store as a metric label. In 2.0, user ID is just another field in the event — querying it is free.

This enables the canonical O11y 2.0 question: *"Here is a thing that went wrong. What do all the events where it went wrong have in common, versus events where it went right?"* — BubbleUp (Honeycomb) or similar tools answer this automatically.

**The cost model inversion:**

In 1.0, as your system grows more complex, costs scale as a multiplier: metrics store + logs store + traces store, each growing with traffic. And as costs grow, value decreases (because high-cardinality data gets dropped to control cost).

In 2.0, you pay to store your data once. Sampling can be applied surgically (keep 100% of errors, 1% of successes) rather than bluntly. As costs grow, value grows proportionally.

**Practical implementations:**
- **Honeycomb** — built Columnar storage specifically for wide events (the original O11y 2.0 tool)
- **ClickHouse-backed platforms** — SigNoz, HyperDX, Uptrace are architecturally suited due to columnar storage
- **Facebook Scuba** — internal inspiration for Honeycomb; proved the model at massive scale

**The pragmatic view:**

The wide-events model is philosophically correct but the full replacement of metrics is overstated. Metrics remain valuable for long-term trending (cheap, small), dashboards, and alerting thresholds. The industry is converging on a hybrid: wide events for debugging/investigation, metrics for alerting and retention.

## Key Properties
- **Single source of truth** — events contain all context; correlation happens within one dataset
- **Aggregation at read time** — no need to decide upfront what questions you'll want to ask
- **Infinite cardinality** — user IDs, session IDs, feature flags are free to query
- **Analysis-first debugging** — start from user impact, not from infrastructure metrics
- **SLOs derived from the same data** — no separate SLI measurement; compute from event stream
- **Storage designed for the pattern** — requires columnar storage engine (ClickHouse, Honeycomb's proprietary DB), not time-series databases

## Relationships
- Supersedes [[observability]] three-pillars model: same domain, fundamentally different data model
- Related to [[llm-observability]]: wide events are the natural model for LLM tracing (prompt, completion, token counts all in one event)
- Related to [[slo-based-alerting]]: SLOs are derived from the event stream rather than separate metric aggregations
- Related to [[telemetry-pipeline]]: pipeline routing and sampling become key levers since you're working with a single event type
- Enabled by [[ebpf-observability]]: eBPF auto-instrumentation generates the events that feed O11y 2.0 backends

## Applications
- **High-cardinality debugging:** "Show me all requests where user tier = 'enterprise' AND latency > 2s AND feature_flag = 'new-checkout' AND error = null" — impossible in metrics, trivial in wide events
- **Outlier detection (BubbleUp):** Automatically surface what dimensions (browser version, datacenter, customer ID) are over-represented in slow/error events vs the healthy baseline
- **SLO measurement:** Count events where `latency > 500ms` / total events = SLI; same data you use for debugging becomes your reliability measurement
- **A/B testing at the telemetry layer:** Compare any metric between two event cohorts (flag=on vs flag=off) without a separate A/B testing tool

## Study
- Flashcards: [[flashcards/observability-2-0|Practice this concept]]

## Sources
- [It's Time to Version Observability — Honeycomb](https://www.honeycomb.io/blog/time-to-version-observability-signs-point-to-yes) — Charity Majors's definitive framing of O11y 2.0
- [One Key Difference Between O11y 1.0 and 2.0 — Honeycomb](https://www.honeycomb.io/blog/one-key-difference-observability1dot0-2dot0) — single source of truth argument
- [All You Need Is Wide Events — Ivan Burmistrov](https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics) — Facebook Scuba experience
- Observability Landscape Guide 2025–2026 — contextualisation across the industry

## See Also
- [[observability]]
- [[llm-observability]]
- [[slo-based-alerting]]
- [[telemetry-pipeline]]
- [[ebpf-observability]]
- [[observability-driven-development]]
