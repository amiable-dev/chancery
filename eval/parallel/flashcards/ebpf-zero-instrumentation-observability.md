---
tags: [flashcards, observability, kubernetes, ebpf, domain/observability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# eBPF zero-instrumentation observability — Flashcards

#flashcards/observability

## Definition <!-- kb:card:4d7216 -->
What is eBPF zero-instrumentation observability?
?
Collecting telemetry for every container on a node from sandboxed eBPF programs running in the shared kernel, without modifying application code, injecting per-pod sidecars, or requiring tracing SDKs.

## Kernel as chokepoint <!-- kb:card:c85c96 -->
Why can a single eBPF program per node observe every container's behavior on that node?
?
Containers are ordinary Linux processes whose system calls, network packets, and function calls all pass through the one shared kernel per node, which is exactly where eBPF programs attach.

## eBPF verifier safety <!-- kb:card:e53355 -->
What makes it safe to run eBPF programs inside the kernel in production?
?
An in-kernel verifier proves each program cannot crash the kernel, loop forever, or read unauthorized memory before it is allowed to load.

## Reference stack roles <!-- kb:card:a5d270 -->
In the eBPF observability reference stack, what does each of Cilium/Hubble, Pixie, Tetragon, and Beyla provide?
?
Cilium/Hubble: L3-L7 network flow visibility. Pixie: auto-captured application-protocol traces. Tetragon: syscall-level security observability with optional enforcement. Beyla: SDK-less OpenTelemetry spans.

## Kernel version gating <!-- kb:card:a41713 -->
What elevated capabilities does eBPF observability tooling need, and why does that clash with restricted PodSecurity profiles?
?
It needs BPF, PERFMON, and SYS_PTRACE capabilities (roughly kernel 6.x for CO-RE portability), which restricted PodSecurity profiles block by default, requiring an explicit exception.
