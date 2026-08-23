---
title: "Observability"
date: 2026-04-15
domain: observability
maturity: established
source_type: practitioner
topics: [devops]
tags: [concept, observability, infrastructure, monitoring, distributed-systems, otel, domain/observability, maturity/established, source-type/practitioner, topic/devops]
status: draft
sources:
  - url: https://www.oreilly.com/library/view/observability-engineering/9781492076438/
    unreachable: true
    reason: HTTP 403
    checked: 2026-08-21
    class: unclassified
    reachability: blocked-4xx
  - url: https://opentelemetry.io/docs/
    hash: sha256:ae5b13a721ac1381b2d3d5e55f19c25689dca5c3786470ec21794ef412ae1932
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://sre.google/sre-book/monitoring-distributed-systems/
    hash: sha256:0b46517deadbdc47994f359966cc29ba0390ef5eee4f68988a189a49c73c2f3b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Observability

## Definition
The property of a system that allows its internal state to be inferred from its external outputs. In software engineering, observability is achieved through the systematic collection and analysis of three primary signals — **logs**, **metrics**, and **traces** — enabling engineers to understand not just *that* something is wrong, but *why*, without requiring code changes or prior knowledge of the failure mode.

## Explanation
The term originates in control theory: a system is "observable" if its complete internal state can be determined from outputs alone. Applied to software, it distinguishes between:

- **Monitoring** — watching known failure modes ("is the error rate above threshold?")
- **Observability** — understanding arbitrary, unanticipated failure modes from first principles ("*why* did this specific request fail at 14:32:07?")

**The three pillars:**

**1. Logs**
Structured or unstructured records of discrete events: "payment processing failed," "user authenticated," "query took 450ms." Logs are the most granular but hardest to query at scale. Structured logging (JSON with consistent fields) makes logs queryable.

**2. Metrics**
Numerical measurements aggregated over time: request rate, error rate, latency percentiles (p50/p95/p99), CPU usage, queue depth. Metrics are efficient to store and query but pre-aggregate — you lose event-level detail. Good for dashboards and alerting.

**3. Traces**
Records of a request's journey across distributed services. A trace is a tree of spans: each span captures a unit of work (service call, DB query, function) with start time, duration, and metadata. Traces reveal causality across service boundaries — the latency breakdown of a slow request.

**OpenTelemetry (OTel):** The modern standard for instrumentation. Language-agnostic SDK + Collector pipeline that emits all three signals in vendor-neutral format. Most observability platforms (Datadog, Grafana, Honeycomb, Jaeger) accept OTel.

**The four golden signals (Google SRE):**
- **Latency** — how long requests take (distinguish successful vs failed)
- **Traffic** — demand on the system (requests/sec, events/sec)
- **Errors** — rate of failed requests
- **Saturation** — how "full" the system is (CPU, memory, queue depth)

**Observability vs. monitoring:**
| | Monitoring | Observability |
|---|---|---|
| Question | "Is it down?" | "Why is it slow?" |
| Known unknowns | ✓ | ✓ |
| Unknown unknowns | ✗ | ✓ |
| Instrumentation | Predefined dashboards | Rich, queryable telemetry |
| Typical tools | Prometheus + Alertmanager | Honeycomb, Grafana Tempo, Jaeger |

## Key Properties
- **Cardinality is power** — high-cardinality dimensions (user ID, trace ID, feature flag) enable drill-down to specific requests
- **Correlation is essential** — linking a log line to its parent trace ID makes debugging tractable
- **Instrumentation is a product decision** — observability is only as good as the attributes emitted; schema governance matters
- **Push vs pull** — metrics can be pulled (Prometheus scrape) or pushed (StatsD, OTel OTLP push)
- **Sampling** — full trace retention is expensive; head or tail sampling keeps representative data while controlling costs
- **SLOs depend on observability** — SLI measurement requires accurate, low-latency signal collection

## Relationships
- Foundation for [[llm-observability]]: LLM observability extends the three pillars with LLM-specific signals (tokens, reasoning steps, hallucination)
- Implemented in [[agentic-ai-platform-architecture]] Layer 2 (Analytics & Insight): the observability stack is the entire second layer of the architecture
- Related to [[statistical-anomaly-detection-time-series]]: anomaly detection operates on metric time series produced by the observability stack
- Related to [[agentic-sdlc]]: production agent systems require observability as a prerequisite for safe continuous deployment and SLO-based rollbacks
- Supported by OTel Weaver: schema governance and code generation for OTel semantic conventions — ensures consistent attribute naming across services

## Applications
- **Production incident response:** Trace a slow API call through all service hops; find the DB query that caused it without guessing
- **SLO management:** Measure 99th-percentile latency against error budgets; alert before budgets exhaust
- **Capacity planning:** Metric trends reveal saturation before it causes failures
- **Homelab monitoring:** Homepage + Uptime Kuma provide basic metric visibility; Prometheus exporters extend this to container-level signals
- **Agent pipeline debugging:** [[llm-observability]] extends observability into the AI layer; same infrastructure (traces, logs) covers both

## Study

> [!tip] Flashcards
> [[flashcards/observability|Review flashcards for this concept]]

## Sources
- [Observability Engineering (Charity Majors et al., O'Reilly)](https://www.oreilly.com/library/view/observability-engineering/9781492076438/) — definitive book on modern observability
- [OpenTelemetry documentation](https://opentelemetry.io/docs/) — vendor-neutral instrumentation standard
- [Google SRE Book — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) — four golden signals

## See Also
- [[llm-observability]]
- [[observability-2-0]]
- [[observability-driven-development]]
- [[continuous-profiling]]
- [[ebpf-observability]]
- [[telemetry-pipeline]]
- [[slo-based-alerting]]
- [[agentic-ai-platform-architecture]]
- [[statistical-anomaly-detection-time-series]]
- [[agentic-sdlc]]
- [[otel-genai-semantic-conventions]] — the LLM/agent-specific `gen_ai.*` extension to OTel's core signals
