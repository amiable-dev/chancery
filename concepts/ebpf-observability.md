---
title: "eBPF Observability"
date: 2026-04-26
domain: observability
maturity: established
source_type: practitioner
topics: [devops]
tags: [concept, observability, ebpf, infrastructure, kubernetes, zero-instrumentation, otel, domain/observability, maturity/established, source-type/practitioner, topic/devops]
status: draft
sources:
  - url: https://opentelemetry.io/blog/2025/obi-announcing-first-release/
    hash: sha256:d857adc17953ed28e61700f155cc593689b6350ffd85adb1f84282d70c551f89
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://dev.to/x4nent/opentelemetry-ebpf-instrumentation-obi-the-complete-guide-kubecon-eu-2026-beta-launch-5e2o
    hash: sha256:ae1e8458e771d30598879ba7666b6b9d133042d6fee1526eafba32762e976d89
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://grafana.com/blog/2025/05/07/opentelemetry-ebpf-instrumentation-beyla-donation/
    hash: sha256:1e5ee8e2676e66fbaa06af4d906db04ca157242874600d04e9090d86f28eb5e6
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://devops.gheware.com/blog/posts/ebpf-kubernetes-observability-2026.html
    hash: sha256:7914b748dc238ee8c518794c7172368c174ef5e5fa05e06b387ab507761bc702
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# eBPF Observability

## Definition
The use of eBPF (extended Berkeley Packet Filter) programs attached to the Linux kernel to observe running processes, network traffic, and system calls without modifying application code, container images, or deployment manifests. eBPF observability enables zero-code, zero-config telemetry collection — service-level distributed traces, network metrics, and CPU profiles — from any workload by observing at the kernel level.

## Explanation
eBPF allows sandboxed programs to run in the Linux kernel without modifying kernel source or loading kernel modules. For observability, this means the kernel can be instrumented to intercept: network packets, system calls, function entries/exits, CPU scheduling events — all without touching the application.

**Why this matters for observability:**
- Retrofitting legacy services with OTel SDKs requires code changes, dependency updates, and redeployments
- Polyglot environments (Go + Python + Java + PHP in the same cluster) each need different SDK instrumentation
- Some services are third-party (databases, proxies) and can't be modified at all
- eBPF sees all of these equally, from the kernel

**The OpenTelemetry eBPF Instrumentation (OBI) project:**

The most significant development in 2025–2026. Grafana Labs donated Beyla (their eBPF auto-instrumentation tool) to the OpenTelemetry project in May 2025. OBI is now a collaborative effort between Grafana, Splunk, Coralogix, Odigos, and others.

Timeline:
- May 2025: SIG launched, code donated
- November 2025: First alpha release
- April 2026 (KubeCon EU): **Beta launch**
- Late 2026: 1.0 GA expected

OBI automatically generates OTel spans for HTTP/gRPC requests, deploys as a Kubernetes DaemonSet, and emits OTLP data to any OTel-compatible backend. No application changes. No SDK. No restart.

**What eBPF can observe:**
- HTTP/1.1, HTTP/2, gRPC request-response cycles
- SQL queries (via syscall inspection)
- TCP connection establishment and teardown
- DNS queries and responses
- Network flow statistics (bytes in/out, packet counts, retransmits)
- CPU scheduling and profiling (stack sampling)

**What eBPF cannot observe:**
- Business logic context (user IDs, feature flags, custom span attributes)
- Internal function timing *within* a service (only network boundaries)
- Message queue/event-driven communication (Kafka, RabbitMQ messages don't go through HTTP)
- Custom error classification (it sees HTTP 500, not "payment declined")

**The ecosystem:**

| Tool | What it does | Depth |
|---|---|---|
| **OBI (OTel eBPF Instrumentation)** | HTTP/gRPC auto-tracing, OTel OTLP output | Network boundary |
| **Grafana Alloy + Pyroscope** | eBPF-based CPU profiling via pyroscope.ebpf component | CPU call stacks |
| **Odigos** | eBPF networking + runtime injection of OTel SDK | Network + application |
| **Cilium + Hubble** | Kubernetes network policy + L3/L4/L7 flow visibility | Network only |
| **Coroot** | Kubernetes service map, SLO monitoring via eBPF | Service topology |
| **Parca** | eBPF CPU profiler, Kubernetes-native | CPU call stacks |

**The recommended pattern — "baseline + enrich":**

```
Phase 1: Deploy OBI → baseline service-level traces for all services (zero effort)
Phase 2: Add SDK instrumentation for critical services where you need business context
Phase 3: Use eBPF baseline to identify WHERE manual instrumentation adds the most value
```

This approach gets you from zero visibility to service-level distributed tracing in minutes, without touching application code. Then SDK instrumentation adds depth where ROI justifies the effort.

**Constraints:**
- **Linux only** — eBPF is a Linux kernel feature. Kernel 5.8+ recommended (5.4+ minimum for many features). No macOS or Windows support.
- **Compiled languages profile cleanly** — Go, Rust, C/C++ unwind perfectly with eBPF. JIT languages (Java, .NET, Node.js) require helper mechanisms. Python/Ruby via interpreter hooks.
- **W3C context propagation** — OBI can read/write W3C Trace Context headers, enabling cross-service trace correlation. But services behind message queues need SDK instrumentation to propagate context.
- **Root/privileged DaemonSet** — eBPF programs need elevated privileges (CAP_BPF or root), which some security postures restrict.

## Key Properties
- **Zero code changes** — observe any process by deploying a DaemonSet, not modifying application code
- **Language-agnostic** — the kernel sees all processes equally; polyglot environments get uniform coverage
- **Network-level visibility** — captures inter-service communication as it actually occurs, not as code believes it occurs
- **Sub-second detection** — kernel-level hooks trigger before user-space; latency measurement is precise
- **OTel-native output** — OBI emits OTLP; works with any OTel-compatible backend (Grafana, Jaeger, Datadog, etc.)
- **Complements SDK instrumentation** — the two approaches are additive, not competing

## Relationships
- Enables zero-config baseline for [[observability]]: service-level traces without SDK instrumentation
- Related to [[continuous-profiling]]: eBPF is the mechanism for always-on production profiling (Pyroscope's eBPF component, Parca)
- Related to [[observability-2-0]]: OBI can feed wide event stores with service-level trace data; eBPF events are the raw material
- Deployed via [[telemetry-pipeline]]: OBI emits OTLP to the Collector, which routes to backends
- Related to [[zero-trust-architecture]]: eBPF's privileged execution in kernel requires careful security posture (Tetragon uses eBPF for security enforcement)

## Applications
- **Legacy service observability:** A 10-year-old Java monolith with no OTel SDK gets distributed traces immediately via OBI DaemonSet
- **Kubernetes cluster-wide tracing:** Deploy OBI once, all services (including third-party Helm charts) emit traces without per-service changes
- **Incident investigation with no prior instrumentation:** eBPF captures the network-level view of an incident even if application telemetry is absent
- **Profiling homelab services:** Grafana Alloy `pyroscope.ebpf` component gives CPU flamegraphs for all running Docker containers with one config change
- **Gradual OTel adoption:** Use OBI for baseline, then progressively add OTel SDK to high-value services — the eBPF baseline immediately shows which services are "hot" and worth the instrumentation effort

## Study
- Flashcards: [[flashcards/ebpf-observability|Practice this concept]]

## Sources
- [OTel eBPF Instrumentation First Release — OpenTelemetry Blog](https://opentelemetry.io/blog/2025/obi-announcing-first-release/)
- [OBI Complete Guide: KubeCon EU 2026 Beta Launch](https://dev.to/x4nent/opentelemetry-ebpf-instrumentation-obi-the-complete-guide-kubecon-eu-2026-beta-launch-5e2o)
- [Grafana Beyla Donation to OTel](https://grafana.com/blog/2025/05/07/opentelemetry-ebpf-instrumentation-beyla-donation/)
- [eBPF for K8s Observability 2026](https://devops.gheware.com/blog/posts/ebpf-kubernetes-observability-2026.html)
- Observability Landscape Guide 2025–2026

## See Also
- [[observability]]
- [[continuous-profiling]]
- [[observability-2-0]]
- [[telemetry-pipeline]]
