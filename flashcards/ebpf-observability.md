---
tags: [flashcards, observability, ebpf, infrastructure, kubernetes]
sr-due: 2026-04-26
sr-interval: 1
sr-ease: 250
---

# eBPF Observability — Flashcards

#flashcards/observability

## Definition <!-- kb:card:d1add1 -->
What is eBPF observability?
?
The use of eBPF (extended Berkeley Packet Filter) programs running in the Linux kernel to observe processes, network traffic, and system calls without modifying application code, container images, or deployment manifests. It enables zero-code, zero-config collection of service-level distributed traces, network metrics, and CPU profiles from any workload.

## OBI project <!-- kb:card:d4795c -->
What is the OpenTelemetry eBPF Instrumentation (OBI) project and what is its current status?
?
OBI is an OTel SIG project created when Grafana Labs donated Beyla (their eBPF auto-instrumentation tool) to OpenTelemetry in May 2025. It automatically generates OTel spans for HTTP/gRPC requests, deploys as a Kubernetes DaemonSet, and emits OTLP data to any compatible backend — no application changes. Status: **Beta** (launched KubeCon EU, April 2026). GA expected late 2026.

## Capabilities vs limits <!-- kb:card:28a7ef -->
What can eBPF observability capture, and what can it NOT capture?
?
**Can capture:**
- HTTP/1.1, HTTP/2, gRPC request-response traces (network boundary)
- SQL queries, DNS queries, TCP connection events
- CPU profiling via stack sampling (1–3% overhead)

**Cannot capture:**
- Business context (user IDs, feature flags, custom span attributes)
- Internal function timing within a service
- Message queue communication (Kafka, RabbitMQ)
- Custom error classification beyond HTTP status codes

## Deployment pattern <!-- kb:card:642f84 -->
What is the recommended "baseline + enrich" pattern for eBPF observability?
?
1. **Phase 1:** Deploy OBI → get service-level traces for all services immediately, zero code changes
2. **Phase 2:** Add OTel SDK instrumentation for critical services where business context matters
3. **Phase 3:** Use the eBPF baseline to identify *which* services are hot enough to justify SDK instrumentation effort

This gets you from zero to cluster-wide distributed tracing in minutes, then adds depth where ROI justifies it.

## Constraints <!-- kb:card:543e5b -->
What are the key constraints of eBPF-based observability?
?
- **Linux only** — eBPF is a Linux kernel feature (no macOS, no Windows); kernel 5.8+ recommended
- **Privileged access** — eBPF programs need elevated privileges (CAP_BPF or root), which some security postures restrict
- **Language caveats** — compiled languages (Go, Rust, C++) profile cleanly; JIT languages (Java, .NET, Node.js) need additional mechanisms for full stack unwinding
- **No message queue visibility** — services communicating via Kafka/RabbitMQ need SDK instrumentation for trace context propagation

## Relationship to SDK <!-- kb:card:40f815 -->
How does eBPF observability relate to traditional OTel SDK instrumentation — is it a replacement?
?
No — it's complementary and additive. eBPF gives network-boundary visibility without code changes (breadth). SDK instrumentation adds business context and internal function detail (depth). The recommended approach is eBPF for baseline coverage + SDK for high-value critical paths. You don't choose one or the other.
