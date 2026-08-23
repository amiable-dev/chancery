---
tags: [flashcards, observability, profiling, ebpf, performance]
sr-due: 2026-04-26
sr-interval: 1
sr-ease: 250
---

# Continuous Profiling — Flashcards

#flashcards/observability

## Definition <!-- kb:card:bcedd5 -->
What is continuous profiling?
?
The practice of collecting CPU, memory, and execution profiles from production systems continuously and automatically, with minimal overhead (typically 1–3% CPU). Unlike traditional profiling (a dev-time activity), continuous profiling captures function-level resource consumption in live production workloads, enabling retrospective investigation of performance regressions.

## Gap filled <!-- kb:card:0c15b5 -->
What question does continuous profiling answer that metrics, logs, and traces cannot?
?
"Which specific code is consuming resources?" Metrics tell you *that* CPU spiked. Traces tell you *which requests* were slow. Only profiling tells you *which functions* were burning CPU or allocating memory — the information needed to actually fix the problem.

## Mechanism <!-- kb:card:e8c715 -->
How does eBPF-based continuous profiling work at a high level?
?
1. An eBPF program attaches to the CPU's perf event subsystem
2. At each sampling interval (e.g., 100Hz), it interrupts the CPU and captures the current call stack
3. Stack traces are accumulated in kernel-space ring buffers
4. A user-space agent reads, symbolises, and aggregates them into flamegraphs
5. Profiles are shipped to a backend (Pyroscope, Parca) with timestamps and labels — no app code changes required

## OTel status <!-- kb:card:addb6c -->
What is the status of Continuous Profiling in the OpenTelemetry ecosystem as of April 2026?
?
Alpha. The OTel Profiles signal was announced Alpha in March 2026, making profiling the official fourth OTel signal alongside metrics, logs, and traces. The OTLP Profiles protocol is defined but still evolving. Beta is expected late 2026, GA timeline TBD. The OTel eBPF Profiler (donated by Elastic) supports C/C++, Go, Rust, Python, Java, Node.js, .NET, PHP, Ruby, Perl.

## Trace integration <!-- kb:card:579b36 -->
What is the most powerful integration pattern for continuous profiling?
?
Trace-to-profile linking: click on a slow span in the tracing UI → jump to the CPU flamegraph for that exact time window and process. This answers "what code was running during this specific slow request?" — a question traces alone cannot answer. Grafana Pyroscope and Grafana natively support this cross-signal linking.

## Application <!-- kb:card:54cfbd -->
When would you reach for continuous profiling over other observability signals?
?
When you know *something* is consuming too many resources (you can see this in metrics) but don't know *what code* is responsible. Typical triggers: unexplained CPU spike post-deploy, memory leak over time, p99 latency regression with no obvious trace culprit, or over-provisioned Kubernetes pods you want to right-size based on actual usage.
