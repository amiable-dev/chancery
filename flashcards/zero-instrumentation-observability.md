---
tags: [flashcards, observability, ai-agents, infrastructure, architecture]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Zero-Instrumentation Observability — Flashcards

#flashcards/observability

## Definition <!-- kb:card:7fb0f5 -->
What is zero-instrumentation observability?
?
An architectural pattern where telemetry (logs, traces, session records, metrics) is collected at the network layer — via a proxy or sidecar — rather than through SDK calls or code changes in the application being observed. The system under observation requires zero modifications; observability is imposed externally.

## Problems with SDK-Based Observability <!-- kb:card:d42d32 -->
What four problems does traditional SDK-based observability have that zero-instrumentation solves?
?
1. **SDK coupling** — application depends on a vendor's library; changing providers means refactoring
2. **Framework specificity** — different agent frameworks need separate SDK integrations
3. **Deployment friction** — every new service requires instrumentation before observation
4. **Coverage gaps** — if a developer forgets to add spans, those code paths are invisible

## Implementation Patterns <!-- kb:card:703d7b -->
What are the four main implementation patterns for zero-instrumentation observability?
?
1. **Reverse proxy** (Tapes pattern) — proxy between agent and inference provider captures all traffic
2. **Sidecar proxy** (service mesh) — e.g., Envoy captures all container traffic in Kubernetes
3. **eBPF-based capture** — kernel-level syscall/network capture without code modification
4. **API gateway interception** — gateway layer instruments all traffic regardless of backend

## Trade-offs <!-- kb:card:4bc665 -->
What are the key trade-offs of zero-instrumentation vs code-level instrumentation?
?
**Advantages:** Works with any framework/language, no vendor lock-in, retroactive (add to existing systems), captures all traffic including missed paths.
**Disadvantages:** Cannot capture internal reasoning state (only HTTP boundary), proxy adds latency (typically sub-ms), requires trusted proxy placement (proxy sees all data).

## Tapes as Canonical Example <!-- kb:card:c677b0 -->
How does Tapes exemplify zero-instrumentation observability for AI agents?
?
Tapes operates as a reverse proxy — one config change (`OPENAI_BASE_URL=https://proxy.tapes.dev/v1`) routes agent traffic through Tapes. Every request/response is captured with cryptographic signing. No SDK, no code changes, works across all agent frameworks.
