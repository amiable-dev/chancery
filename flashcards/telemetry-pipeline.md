---
tags: [flashcards, observability, infrastructure, cost-management, otel]
sr-due: 2026-04-26
sr-interval: 1
sr-ease: 250
---

# Telemetry Pipeline — Flashcards

#flashcards/observability

## Definition <!-- kb:card:a3534e -->
What is a telemetry pipeline?
?
An infrastructure layer between telemetry producers (instrumented applications) and consumers (observability backends), providing a control plane for routing, filtering, transforming, sampling, and reducing observability data. It decouples *what you collect* from *where it goes* and *how much you keep*, enabling cost control and multi-destination routing without application changes.

## Why essential <!-- kb:card:005744 -->
Why are telemetry pipelines now considered essential rather than optional?
?
Telemetry data growth exceeds 250% year-over-year, and 70% of observability spend goes to logs never queried. Without a pipeline, the only cost levers are: collect less (lose coverage), pay more, or change backends (painful migration). A pipeline adds a fourth option: collect everything, then intelligently reduce before storage. 57% of observability leaders have reduced costs by adopting OTel Collector as a pipeline gateway.

## Tail sampling <!-- kb:card:bda794 -->
What is tail-based sampling and why is it more effective than head-based sampling?
?
**Head-based sampling:** Decision made at trace start (before the outcome is known) — you sample 10% of ALL requests including errors.
**Tail-based sampling:** Wait until the full trace is received, then decide based on outcome:
- Keep 100% of traces with errors or high latency
- Keep 5% of healthy traces

Result: dramatically lower storage cost while preserving the traces you actually need for debugging. Head-based sampling discards errors; tail-based sampling never does.

## Fan-out routing <!-- kb:card:408f09 -->
How does a telemetry pipeline enable fan-out routing, and why is this useful?
?
The pipeline receives one OTLP stream from the application and routes it to multiple destinations simultaneously — e.g., Grafana Tempo (infrastructure traces) + Langfuse (AI/LLM analysis) + S3 (compliance archive). Without a pipeline, you'd need multiple SDK configurations in the application or build your own multi-exporter logic. The pipeline handles fanout as a config concern, not a code concern.

## OTel Collector <!-- kb:card:8be2d0 -->
What is the OTel Collector and what does it do?
?
The de facto open-source telemetry pipeline. A single binary with a composable processor chain: **receivers** (accept OTLP, Prometheus, Jaeger) → **processors** (filter, sample, transform, enrich) → **exporters** (Tempo, Loki, Mimir, Datadog, S3). It's the standard middle layer in any OTel architecture. Key processors: `tail_sampling`, `filter`, `resource`, `metricstransform`, `batch`.

## Dynamic sampling <!-- kb:card:d18887 -->
What is dynamic (incident-aware) sampling, and which tool implements it?
?
Normally sample at a low rate (e.g., 10%). When synthetic monitors detect an incident, automatically switch to 100% sampling for full fidelity during investigation. Mezmo Pipeline implements this pattern. This minimises normal-state storage costs while ensuring complete data capture during the events that matter most.

## Cost impact <!-- kb:card:c31b44 -->
What is the typical cost reduction achievable with intelligent telemetry pipeline strategies?
?
- **Tail sampling alone:** 80–95% reduction in trace storage cost (errors kept, healthy traffic sampled)
- **Log level filtering (WARN+ only):** 60–70% reduction in log volume
- **Overall OTel Collector adoption:** 57% of observability leaders report cost reductions
- **Specific example:** Trace storage from $8K/month to $400/month using error-preserving tail sampling
