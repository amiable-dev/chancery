---
title: Continuous profiling
aliases:
  - Always-on CPU profiling
  - Profiles versus traces
date: 2026-08-24
domain: observability
maturity: emerging
source_type: practitioner
tags: [concept, observability, performance, profiling, domain/observability, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://fatihkoc.net/posts/ebpf-parca-observability/
    hash: sha256:674f28b20265746a4cef528f99068cf25a3376b210896056770ed879fd8a482e
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Continuous profiling

## Definition

**Continuous profiling** is always-on statistical sampling of a fleet's stack traces, taken from outside the process so no application code changes and every language is covered equally, aggregated over time into flamegraphs that answer which functions a service actually spends its CPU on — the question metrics and traces both leave open, since one says a pod is hot and the other says which request was slow.

## Explanation

A per-node agent samples the stack of every running process at a low fixed rate, on the order of nineteen samples per second per logical CPU, and ships aggregates to a central store where sampled stacks are retained as time series much as metrics are; a flamegraph is then a view over which stacks were on-CPU during a window, with each box's width proportional to the time attributed to it. The affordability comes from the statistics rather than from clever engineering: because the output is a distribution and not a ledger, missing samples cost precision instead of correctness, which is why sampling can be left running permanently where per-request tracing at the same coverage could not. The distinction worth carrying away is between profiles and traces. A trace follows one request across services with timing and context and answers why that request was slow; a profile describes aggregate on-CPU behaviour and answers where a service's compute goes. The two decouple in both directions — a slow request can have a cheap profile because it spent its time waiting on I/O, and a fast request can have an expensive one because it is CPU-bound well inside its latency budget — so neither substitutes for the other. The real limit is semantic. A profile knows a symbol, not who owns it, what it costs, or which user-facing objective it threatens, and supplying that remains the job of deliberate instrumentation and its metadata, which is why the claim that kernel-side collection replaces instrumentation inverts the relationship: it extends it. The findings tend to be unglamorous and repeatable — serialisation, logging formatters that pretty-print on every request, and regular expressions recompiled in loops consuming tens of percent of CPU in code nobody suspected. The source is a practitioner blog post organised around one open-source profiler, so its tool comparison and its speculative section on AI tooling will date long before the sampling economics do.

## Key Properties

- Statistical sampling makes always-on collection affordable: dropped samples cost precision, not correctness
- Collected outside the process, so no SDK or rebuild is needed and polyglot services produce comparable profiles
- Profiles answer where compute goes in aggregate; traces answer why one request was slow; neither substitutes
- Latency and CPU cost decouple in both directions, so a fast request can be the expensive one
- Profiles carry no ownership or business context — that remains the job of explicit instrumentation

## Relationships

- [[ebpf-zero-instrumentation-observability]] — fills the one gap that stack leaves open, since network-flow visibility, protocol-level traces and syscall observation all stop short of saying which function inside a process is burning the CPU
- [[four-golden-signals]] — picks up where saturation stops — that signal tells you a service is consuming a resource, while a profile tells you which code is consuming it
- [[targeted-profiling-rollout]] — is the capability that rollout discipline governs, being cheap enough to enable everywhere and therefore easy to waste

## Applications

Finding the function behind a CPU bill or a saturation alert without instrumenting every call; comparing compute cost across polyglot services on one footing; catching a runaway loop or a noisy neighbour in a shared cluster.

## Sources

- https://fatihkoc.net/posts/ebpf-parca-observability/

## See Also

- [[ebpf-zero-instrumentation-observability]]
- [[four-golden-signals]]
- [[targeted-profiling-rollout]]
