---
title: "Zero-Instrumentation Observability"
date: 2026-04-29
domain: observability
maturity: emerging
source_type: practitioner
topics: [patterns]
tags: [concept, observability, ai-agents, infrastructure, architecture, domain/observability, maturity/emerging, source-type/practitioner, topic/patterns]
status: draft
sources:
  - url: https://thenewstack.io/paper-compute-agent-infrastructure/
    hash: sha256:8529036870265fb9607fa6adcfdbe80ee2c6381b086b84f75c17c1a15fc26a10
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://briandouglas.me/posts/2026/03/10/what-i-learned-running-10-pokemon-bots-in-36-seconds/
    hash: sha256:2bd9427d79700b79360d8369e00d6b75afbd881d8ea6dc1c14c88a83a3bade6a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Zero-Instrumentation Observability

## Definition
Zero-instrumentation observability is an architectural pattern where telemetry — logs, traces, session records, or metrics — is collected at the network layer (typically via a proxy or sidecar) rather than through SDK calls or code changes in the application being observed. The system under observation requires zero modifications; observability is imposed externally.

## Explanation
Conventional observability requires instrumenting application code: adding spans to functions, emitting structured log events, calling `tracer.start_span()`. This approach has real costs:

- **SDK coupling** — Your application depends on an observability vendor's library. Changing providers means refactoring.
- **Framework specificity** — Different agent frameworks (LangChain, CrewAI, OpenCode, Claude Code) need separate SDK integrations.
- **Deployment friction** — Every new service or agent requires instrumentation before it can be observed.
- **Coverage gaps** — If a developer forgets to add spans, those code paths are invisible.

Zero-instrumentation observability resolves this by moving the collection point to the infrastructure layer:

```
Without zero-instrumentation:
  Agent code  --[SDK call]-->  Observability backend

With zero-instrumentation:
  Agent code  --[HTTP]-->  Proxy  --[captures all traffic]-->  Observability backend
                     ↑
              (agent unmodified)
```

**Implementation patterns:**

1. **Reverse proxy** (Tapes pattern): Traffic is routed through a proxy sitting between the agent and the inference provider. The proxy records every request/response pair. One config change: `OPENAI_BASE_URL=https://proxy.tapes.dev/v1`.

2. **Sidecar proxy** (service mesh pattern): In Kubernetes or similar, a sidecar container (e.g., Envoy) captures all inbound/outbound traffic from the main container. No changes to the main container image.

3. **eBPF-based capture**: Kernel-level instrumentation captures syscalls and network packets from any process without code modification. Related to [[ebpf-observability]].

4. **API gateway interception**: An API gateway layer (Kong, Cloudflare Workers, etc.) instruments all traffic passing through, regardless of backend implementation.

**Trade-offs versus code instrumentation:**
- ✅ Works with any framework, language, agent type
- ✅ No vendor lock-in at the application layer
- ✅ Retroactive — can add observability to existing systems without touching code
- ✅ Captures all traffic, including paths that would be missed by manual instrumentation
- ⚠️ Cannot capture internal reasoning state (only the HTTP boundary)
- ⚠️ Proxy adds latency (typically sub-millisecond for passthrough)
- ⚠️ Requires trusted proxy placement (proxy sees all data)

## Key Properties
- Collection at network boundary, not application code
- Framework-agnostic by design
- Single deployment change (env var, DNS, or sidecar) enables full capture
- May sacrifice internal-state visibility for universal coverage
- Tamper-resistance is achievable at the proxy layer (cryptographic signing of captured records)

## Relationships
- [[tapes-agent-observability]] is the canonical example of this pattern for AI agents
- Complements [[llm-observability]]: zero-instrumentation captures the transport layer; LLM observability extends this with semantic evaluation
- [[ebpf-observability]] is a related zero-instrumentation pattern operating at the kernel level
- [[network-layer-ai-security]] also operates at the network layer but focuses on filtering/blocking rather than capture
- [[observability]] and [[observability-2-0]] provide the broader context this pattern fits into

## Applications
- **Multi-framework agent fleets**: When agents run across multiple frameworks (OpenCode, Claude Code, LangChain), a single proxy captures all sessions uniformly.
- **Brownfield observability**: Adding observability to existing agents without modifying code or redeploying with new SDKs.
- **Compliance capture**: Immutably recording all AI system inputs/outputs for audit purposes without requiring developer cooperation.
- **Cost tracking**: Capturing token usage across all agents from a single proxy point, enabling accurate cost attribution per project or team.

## Study
- Flashcards: [[flashcards/zero-instrumentation-observability|Practice this concept]]

## Sources
- [GitHub veteran Brian Douglas launches Paper Compute to fix AI agent infrastructure](https://thenewstack.io/paper-compute-agent-infrastructure/) — Tapes as the primary real-world example
- [What I Learned Running 10 Pokemon Bots in 36 Seconds](https://briandouglas.me/posts/2026/03/10/what-i-learned-running-10-pokemon-bots-in-36-seconds/) — describes the anomaly detection benefit in practice

## See Also
- [[tapes-agent-observability]]
- [[ebpf-observability]]
- [[network-layer-ai-security]]
- [[llm-observability]]
- [[observability-2-0]]
