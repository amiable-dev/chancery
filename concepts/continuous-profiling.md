---
title: "Continuous Profiling"
date: 2026-04-26
domain: observability
maturity: established
source_type: practitioner
topics: [devops]
tags: [concept, observability, profiling, performance, ebpf, otel, domain/observability, maturity/established, source-type/practitioner, topic/devops]
status: draft
sources:
  - url: https://www.polarsignals.com/blog/posts/2026/03/26/opentelemetry-profiling-goes-alpha
    hash: sha256:2065d792312f7d32df9f7d0e1abfae636543c74d1d95b19843aab84aee99f16e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://grafana.com/blog/pyroscope-2-0-release/
    hash: sha256:062cefb7401785fd9ec9c1cb40cb6f5da1dad1ba73de12fa2998f822102a4242
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://fatihkoc.net/posts/ebpf-parca-observability/
    hash: sha256:674f28b20265746a4cef528f99068cf25a3376b210896056770ed879fd8a482e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Continuous Profiling

## Definition
The practice of collecting CPU, memory, and execution profiles from production systems continuously and automatically, with minimal overhead (typically 1–3% CPU). Unlike traditional profiling which is a development-time activity, continuous profiling captures function-level resource consumption in live production workloads, enabling engineers to answer "which code is consuming resources?" — a question that metrics, logs, and traces cannot answer.

## Explanation
Traditional profiling is a deliberate, one-shot operation: attach a profiler to a process, run it for a while, collect a flamegraph, optimise the hot function. This has major limitations in production systems:
- The observer effect: full profiling overhead (often 5–20%) makes it unsuitable for production
- Manual operation: you have to know to run it before you can use it
- Point-in-time: you can't investigate a performance regression that happened 6 hours ago

**Continuous profiling** solves this by sampling at low frequency (e.g., 100Hz interrupts, yielding ~1% CPU overhead) continuously, accumulating and aggregating stack traces over time, then making them queryable retrospectively.

**What it captures:**

| Profile Type | Question It Answers |
|---|---|
| **CPU profile** | Which functions are consuming CPU time? |
| **Memory/heap profile** | Which allocations are growing the heap? |
| **Wall-clock profile** | Which code paths are blocking (I/O, locks)? |
| **Goroutine/thread profile** | How many goroutines/threads exist and what are they doing? |
| **Block/mutex profile** | Which mutex contention or channel blocks are causing latency? |

**How eBPF-based profiling works:**
1. An eBPF program attaches to the CPU's perf event subsystem
2. At each interval (e.g., 100Hz = every 10ms), it samples the current call stack
3. Stack traces are accumulated in kernel-space ring buffers
4. A user-space agent reads them, symbolises function names, and aggregates into flamegraphs
5. Profiles are shipped to a backend (Pyroscope, Parca) with timestamps and labels

This avoids modifying application code or containers — the profiler observes from the kernel.

**Flamegraphs:**
The primary visualisation. The x-axis shows stack population (how often a function appeared), the y-axis shows call depth. Wide bars = hot functions. You can immediately see which function is consuming the most CPU, and which call paths lead to it.

**Integration with traces (the killer pattern):**

The highest-value integration is trace-to-profile linking: click on a slow span in your tracing UI → jump directly to the CPU flamegraph for that time window and process. This answers "what code was running during this specific slow request?" — something traces alone cannot answer.

**The OTel Profiles signal (Alpha, March 2026):**
OpenTelemetry is standardising continuous profiling as a fourth signal alongside metrics, logs, and traces. The OTLP Profiles protocol defines a vendor-neutral format for profile data. The OTel eBPF Profiler (donated by Elastic's Universal Profiling team) supports C/C++, Go, Rust, Python, Java, Node.js, .NET, PHP, Ruby, Perl. Protocol still evolving toward Beta (expected late 2026).

**Tooling:**
- **Grafana Pyroscope** — open-source continuous profiling database. Part of the LGTM stack. Pyroscope 2.0 (April 2025) processed 19.5PB of profiling data in production. Deployed via Grafana Alloy's `pyroscope.ebpf` component.
- **Parca** — open-source eBPF-based profiler from Polar Signals. Active OTel Profiling SIG contributor. Kubernetes-native.
- **Grafana Alloy** — unified collector; embeds OTel eBPF profiler + routes to Pyroscope. Enables zero-config profiling via one config change.
- **Polar Signals Cloud** — managed offering from Parca creators.
- **Datadog Continuous Profiler**, **Pyroscope in Grafana Cloud** — managed options.

## Key Properties
- **Low overhead** — 1–3% CPU cost makes always-on production use viable
- **Retrospective querying** — profiles are stored with timestamps; investigate past events
- **No code changes required** — eBPF-based profilers work on any language without SDK
- **Flamegraph output** — stack trace aggregations rendered as interactive flame charts
- **Labels/attributes** — profiles tagged with service, instance, region, version for filtering
- **Trace correlation** — profile data can be linked to trace spans via timestamps and process IDs

## Relationships
- Complements [[observability]] three pillars as the emerging "fourth signal" — fills the gap metrics/logs/traces leave around resource consumption
- Related to [[ebpf-observability]]: eBPF is the primary mechanism for zero-overhead continuous profiling
- Related to [[observability-2-0]]: profiles are the next signal being added to the O11y ecosystem; OTel Profiles signal is Alpha
- Related to [[slo-based-alerting]]: profiling identifies the code responsible for SLO violations, not just that a violation occurred

## Applications
- **Post-deploy regression detection:** CPU usage spiked 40% after deploy v1.2.3 → flamegraph shows new code path in hot loop → targeted fix without guessing
- **Memory leak investigation:** Heap profile shows allocation accumulation at specific call site → traced without restarting the service
- **SLO violation diagnosis:** "p99 latency exceeded SLO for 30 minutes at 02:30" → profiling data from that window shows lock contention in DB connection pool
- **Kubernetes cost optimisation:** CPU profiles across pods reveal over-provisioning; resource requests tuned based on actual consumption, not guesses
- **eBPF zero-config profiling in homelab:** Enable Grafana Alloy's `pyroscope.ebpf` → immediate flamegraphs for all running processes with one config change

## Study
- Flashcards: [[flashcards/continuous-profiling|Practice this concept]]

## Sources
- [OTel Profiling Goes Alpha — Polar Signals](https://www.polarsignals.com/blog/posts/2026/03/26/opentelemetry-profiling-goes-alpha) — technical detail on OTLP Profiles protocol
- [Pyroscope 2.0 Release — Grafana Labs](https://grafana.com/blog/pyroscope-2-0-release/) — production scale and capabilities
- [eBPF Observability and Continuous Profiling with Parca — Fatih Koç](https://fatihkoc.net/posts/ebpf-parca-observability/) — hands-on implementation
- Observability Landscape Guide 2025–2026 — fourth pillar context

## See Also
- [[observability]]
- [[ebpf-observability]]
- [[observability-2-0]]
- [[slo-based-alerting]]
