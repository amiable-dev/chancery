---
tags: [flashcards, observability, infrastructure, distributed-systems]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Observability — Flashcards

#flashcards/infrastructure

## Definition <!-- kb:card:742214 -->
What is observability?
?
The property of a system that allows its internal state to be inferred from its external outputs. In software, achieved through logs, metrics, and traces — enabling engineers to understand not just *that* something is wrong, but *why*, without requiring prior knowledge of the failure mode.

## Three Pillars <!-- kb:card:94684a -->
What are the three pillars of observability and what does each capture?
?
- **Logs** — discrete events with context ("payment failed at 14:32:07 for user X")
- **Metrics** — numerical aggregates over time (request rate, p99 latency, error rate, CPU)
- **Traces** — a request's journey across distributed services as a tree of spans with timing

## Four Golden Signals <!-- kb:card:d5523c -->
What are Google SRE's four golden signals?
?
1. **Latency** — how long requests take (distinguish successful vs failed)
2. **Traffic** — demand on the system (requests/sec)
3. **Errors** — rate of failed requests
4. **Saturation** — how "full" the system is (CPU, memory, queue depth)

## Observability vs Monitoring <!-- kb:card:db42de -->
How does observability differ from monitoring?
?
**Monitoring** watches *known* failure modes — dashboards and alerts for expected problems. **Observability** handles *unknown* failure modes — rich telemetry that lets you debug arbitrary failures without predefined dashboards. Monitoring is a subset; observability is the foundation.

## Application <!-- kb:card:76c6c7 -->
When would you use traces over logs for debugging?
?
When a request crosses multiple services and you need to see causality across boundaries. Traces show the full call tree with latency at each hop — essential for "why was this request slow?" in distributed systems. Logs alone lose the cross-service relationship.
