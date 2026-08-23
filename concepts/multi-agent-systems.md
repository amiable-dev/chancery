---
title: "Multi-Agent Systems"
date: 2026-04-15
domain: ai-agents
maturity: established
source_type: practitioner
topics: [multi-agent, orchestration, patterns]
tags: [concept, ai-agents, architecture, multi-agent, coordination, patterns, domain/ai-agents, maturity/established, source-type/practitioner, topic/multi-agent, topic/orchestration, topic/patterns]
status: draft
sources:
  - url: https://www.anthropic.com/research/building-effective-agents
    hash: sha256:a1f2257ff438964f64caa04bbfd0b5cc1f93f3236202a67412a5990369e3433a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
    hash: sha256:55f07564b0ccc171b138511c32ec95c934d491c38382df24f5f413aa16f502ae
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Multi-Agent Systems

## Definition
An architecture in which multiple autonomous AI agents operate concurrently, each with distinct capabilities, roles, or knowledge domains, and coordinate to solve tasks that would be too complex, large, or slow for a single agent. Agents may cooperate (divide and conquer), compete (adversarial verification), or be orchestrated by a supervisor that decomposes goals and delegates subtasks.

## Explanation
Single-agent systems hit practical limits: context windows cap how much reasoning can happen in one pass; a generalist agent performs worse than specialists at domain-specific tasks; parallelisation is impossible when everything is sequential.

Multi-agent systems address these limits by distributing work across specialised agents that communicate and coordinate.

**Core coordination patterns:**

**1. Hierarchical (Supervisor/Sub-Agent)**
A supervisor agent decomposes a goal into subtasks and delegates each to a specialised sub-agent. The supervisor synthesises results. This is the most common production pattern.
→ See [[supervisor-agent-pattern]]

**2. Peer-to-peer pipeline**
Agents form a directed chain: Agent A produces output → Agent B refines it → Agent C validates it. No central supervisor; output flows through the pipeline.

**3. Parallel fan-out**
A router dispatches the same task to multiple agents simultaneously (e.g., for independent analysis). Results are aggregated or the best is selected.
→ Similar to [[hybrid-search-reciprocal-rank-fusion]]: diversity before aggregation

**4. Adversarial / debate**
Agents argue opposing positions or critique each other's outputs. A judge agent (or human) evaluates. Better calibration than single-agent outputs on high-stakes decisions.

**5. Swarm / emergent**
Agents interact via shared state (blackboard, message bus) without central orchestration. Behaviour emerges from local rules. Harder to debug; rare in enterprise production.

**Coordination infrastructure:**
- **Task delegation protocol** — [[agent-to-agent-protocol|A2A]] or custom messaging (e.g., NATS, shared queue)
- **Shared state / memory** — agents read/write a common context store; needs locking or eventual consistency
- **Orchestration engine** — tracks task lifecycle, retries, timeouts, result aggregation
- **Agent registry** — tracks which agents exist, their capabilities, and how to route to them

**Failure modes unique to multi-agent:**
- **Cascading errors** — one agent's hallucination becomes another's ground truth
- **Circular delegation** — Agent A asks B, B asks A (deadlock or infinite loop)
- **State divergence** — agents operate on inconsistent views of shared state
- **Coordination overhead** — communication costs exceed single-agent efficiency gains for simple tasks

## Key Properties
- **Parallelism** — independent subtasks run concurrently, reducing wall-clock time
- **Specialisation** — each agent optimised for a narrow domain outperforms a generalist on that domain
- **Scalability** — agents can be scaled independently based on load
- **Fault isolation** — a failing sub-agent can be retried or replaced without restarting the whole system
- **Complexity cost** — debugging, tracing, and testing are harder than single-agent systems; [[llm-observability|LLM observability]] becomes essential
- **Non-determinism amplified** — stochastic outputs compound across agent hops

## Relationships
- Enabled by [[agent-to-agent-protocol|A2A]]: standardised inter-agent communication makes multi-agent systems interoperable across vendors
- Enabled by [[model-context-protocol|MCP]]: agents expose and consume tools via MCP; multi-agent systems compose these tool surfaces
- Implements [[supervisor-agent-pattern]]: the hierarchical coordination pattern is the most common multi-agent topology
- Requires [[llm-observability]]: tracing agent chains end-to-end is essential for debugging and compliance
- Supported by [[agentic-ai-platform-architecture]]: the three-layer architecture is designed explicitly for multi-agent production deployments
- Related to [[constrained-agent-actions]]: agent action constraints are more critical in multi-agent systems because errors propagate

## Applications
- **Complex research tasks:** Planner agent breaks down a research question → specialist agents gather domain knowledge → synthesiser agent produces final report
- **Software development pipelines:** Architect agent designs → coder agents implement → reviewer agents critique → test agent validates
- **Enterprise automation:** Multi-step workflows (contract review → legal analysis → risk scoring → approval routing) each handled by domain-specific agents
- **LLM Council pattern:** Multiple independent LLMs analyse the same problem; outputs peer-reviewed and synthesised — adversarial multi-agent for high-stakes decisions
- **Homelab:** Autobot (orchestrator) + Hermes (execution) is a two-agent system; NATS message bus provides the coordination layer

## Study

> [!tip] Flashcards
> [[flashcards/multi-agent-systems|Review flashcards for this concept]]

## Sources
- [Multi-agent systems overview (Anthropic)](https://www.anthropic.com/research/building-effective-agents) — practical multi-agent design
- [A2A Protocol announcement (Google)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) — inter-agent coordination standard

## See Also
- [[supervisor-agent-pattern]]
- [[agent-to-agent-protocol]]
- [[model-context-protocol]]
- [[llm-observability]]
- [[agentic-ai-platform-architecture]]
- [[constrained-agent-actions]]
- [[react-agent-pattern]]
- [[automated-alignment-researchers]]: Anthropic's nine-instance AAR setup is a peer-style multi-agent system with a shared forum as coordination layer; illustrates how diversity of starting points dramatically improves collective exploration
- [[reward-hacking]]: a key risk in automated multi-agent research pipelines — agents can game shared evaluation metrics
- [[agent-handoffs]]: the compressed summaries that connect agents at the seams of all multi-agent patterns; handoff quality determines downstream quality
- [[subagents]]: the child agent primitive underlying Planner/Executor, Map-Reduce, and Router/Specialist patterns
- [[orchestration-model]]: a trained LLM whose coordination policy is learned rather than hardcoded — Sakana Fugu is the first commercial deployment; represents the next evolution of the supervisor/orchestration pattern
- [[thinker-worker-verifier-pattern]]: a specific multi-agent role decomposition (TRINITY, ICLR 2026) where Thinker plans, Worker executes, and Verifier independently checks — a structured variant of adversarial multi-agent patterns
- [[agent-pool]]: the swappable resource layer of specialist models that an orchestration model delegates to; pool diversity determines maximum achievable quality
- [[ai-sovereignty]]: multi-vendor resilience as an architectural property of multi-agent systems — dynamic rerouting around unavailable providers
