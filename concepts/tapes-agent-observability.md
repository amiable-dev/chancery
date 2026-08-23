---
title: "Tapes Agent Observability"
date: 2026-04-29
domain: observability
maturity: emerging
source_type: announcement
topics: [provenance]
tags: [concept, ai-agents, observability, audit, security, infrastructure, paper-compute, domain/observability, maturity/emerging, source-type/announcement, topic/provenance]
status: draft
sources:
  - url: https://thenewstack.io/paper-compute-agent-infrastructure/
    hash: sha256:8529036870265fb9607fa6adcfdbe80ee2c6381b086b84f75c17c1a15fc26a10
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://briandouglas.me/posts/2026/01/31/long-term-care-for-agent-sessions/
    hash: sha256:bc0dd13572e7b66cdb999b62c3addbc58c8adcacf753779b452599fbc6d28542
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://briandouglas.me/posts/2026/03/04/claude-failed-mid-session-tapes-brought-it-back/
    hash: sha256:14b1a8ad23aa4a8fff32a3738ad44026e969539a497dc130a04583da656118b1
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Tapes Agent Observability

## Definition
Tapes is a zero-instrumentation agent observability system that operates as a reverse proxy between an AI agent and its inference provider. Every request, tool call, retry, and model response is captured as a cryptographically signed, tamper-proof session record — providing a durable audit trail without any changes to agent code or SDK dependencies.

## Explanation
Traditional [[observability|observability]] requires injecting instrumentation into application code: log statements, trace spans, custom metrics. Tapes sidesteps this entirely by intercepting agent traffic at the network layer. The agent points its API calls at the Tapes proxy endpoint instead of the inference provider directly; from the agent's perspective, nothing changes.

**What Tapes captures per session:**
- Every prompt sent to the model
- Every model completion returned
- All tool/function call invocations and results
- Retries and errors
- Token consumption and cost per step
- Timing data for latency analysis

**Beyond capture:** Tapes adds value on top of raw session recording:

1. **Anomaly detection** — Statistical comparison of sessions surfaces unusual behaviour. The canonical example: a Pokémon-playing agent was spamming inputs during battle animations; Tapes flagged the pattern automatically, leading to a targeted fix.

2. **Session replay** — Captured sessions can be played back for debugging or sharing. A broken agent run becomes reproducible evidence, not a missing moment.

3. **Skill generation** — Successful agent runs are analysed and converted into reusable skill artifacts ("dead tokens into skills"). New engineers study replay-derived skills instead of documentation.

4. **Cryptographic tamper-proofing** — Records are signed at capture time. This creates compliance-grade evidence: you can prove an agent took a specific action, not just assert it from mutable logs.

**Deployment model:** One environment variable swap — point `OPENAI_BASE_URL` (or equivalent) at the Tapes proxy. No SDK. No framework lock-in. Works with any agent that speaks standard LLM HTTP APIs.

## Key Properties
- Network-layer interception: no application code changes required
- Cryptographically signed session records for tamper-proof auditability
- Works across agent frameworks (Claude Code, OpenCode, custom ReAct loops, etc.)
- Includes anomaly detection over session behaviour patterns
- Enables skill extraction from successful sessions
- Provides cost and token tracking per session

## Relationships
- Embodies [[zero-instrumentation-observability]]: captures data at the network layer, not the application layer
- Addresses the [[agent-audit-gap]]: provides the cryptographic audit trail production agents lack
- Distinct from [[llm-observability]]: while LLM observability covers model metrics broadly, Tapes is session-centric and agent-lifecycle-focused
- Related to [[observability-driven-development]]: Tapes sessions enable evidence-based debugging loops
- Skill generation connects to [[agent-session-distillation]]: successful runs become reusable skills

## Applications
- **Production debugging:** When an agent touches production and something breaks, Tapes session data answers "what exactly happened, in what order?"
- **Compliance and audit:** Regulated industries requiring proof of AI actions can cryptographically verify session records
- **Cost attribution:** Multi-tenant or multi-agent deployments need per-session token/cost breakdown
- **New engineer onboarding:** Instead of reading docs, replay sessions from successful runs
- **Anomaly alerting:** Automated detection of agents behaving outside normal patterns (rate spikes, unusual tool call sequences)

## Study
- Flashcards: [[flashcards/tapes-agent-observability|Practice this concept]]

## Sources
- [GitHub veteran Brian Douglas launches Paper Compute to fix AI agent infrastructure](https://thenewstack.io/paper-compute-agent-infrastructure/) — primary source, covers Tapes and StereOS launch
- [Long-Term Care for Agents with Tapes](https://briandouglas.me/posts/2026/01/31/long-term-care-for-agent-sessions/) — Brian Douglas on the Tapes philosophy
- [Claude Code Failed Mid-Session. Tapes Brought It Back.](https://briandouglas.me/posts/2026/03/04/claude-failed-mid-session-tapes-brought-it-back/) — practical recovery use case

## See Also
- [[zero-instrumentation-observability]]
- [[agent-audit-gap]]
- [[agent-session-distillation]]
- [[llm-observability]]
- [[observability-driven-development]]
- [[stereos-agent-os]]
- [[agent-sse-event-stream]]: SSE event streams are a feed source for agent observability tools like Tapes
