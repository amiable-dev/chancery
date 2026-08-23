---
sr-due: 2026-04-12
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- architecture
---

§
# Agentic AI Platform Architecture — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:fb503f -->
What is the three-layer agentic AI platform architecture?
?
A structured architectural pattern for enterprise multi-agent AI systems, organising platform concerns into three interdependent layers — **Application & Orchestration**, **Analytics & Insight**, and **Data & Knowledge** — with security and governance embedded throughout. Designed for nondeterministic, connected agents that discover tools dynamically, share persistent state, and coordinate via A2A protocols.

## Application <!-- kb:card:1c654c -->
When would you use a three-layer agentic AI platform architecture?
?
When deploying multi-agent systems that coordinate or hand off context; in regulated environments requiring full reasoning-path auditability; when agents need dynamic tool discovery at runtime (MCP); when managing many agent versions across teams with independent rollout/rollback; and whenever data governance (masking, lineage, retention) must be enforced programmatically.

## Layers <!-- kb:card:cf65f0 -->
What are the three layers of an agentic AI platform?
?
1. **Application & Orchestration** — command centre: workflow control, agent registry, tool catalog (MCP), skill library, A2A coordination, identity/policy enforcement, canary rollouts
2. **Analytics & Insight** — observability: real-time metrics/logs/traces, full reasoning-path traceability (prompt → tool → output), alignment monitoring (drift, hallucination, bias), token management
3. **Data & Knowledge** — data foundation: unified access to relational/vector/graph stores, real-time streaming, schema/data contract governance, federated catalog, built-in masking/retention/lineage

## Agent Registry <!-- kb:card:ad0d65 -->
What is an agent registry and what does it contain?
?
A centralised catalog (part of Layer 1) where every agent is logged as a **versioned service** with defined capabilities, tool entitlements, and policy constraints. Enables independent scaling, updating, and rollback of individual agents without affecting the rest of the platform.

## MCP Role <!-- kb:card:36b10f -->
What role does Model Context Protocol (MCP) play in the orchestration layer?
?
MCP is the integration standard for **dynamic tool discovery**. External tools and APIs are exposed as MCP servers with consistent schemas and invocation semantics. Agents query a tool catalog at runtime to discover available capabilities — replacing static API configurations with governed, lifecycle-managed tool registries.

## Legacy Mismatch <!-- kb:card:bf21dc -->
Why do legacy enterprise AI platforms fail for agentic systems?
?
Legacy platforms were built for isolated, deterministic single-model deployments with static API endpoints and human-session role-based IAM. Agentic systems break these assumptions because agents: discover tools dynamically (MCP), share persistent memory across sessions, invoke other agents (A2A), execute generated code in sandboxes, and operate nondeterministically — requiring per-invocation least-privilege permissions and continuous evaluation, not per-session human roles.

## Governance Principle <!-- kb:card:1b8ff9 -->
What does "governance by design" mean in the three-layer architecture?
?
Security, auditability, and policy enforcement are **embedded at every layer** rather than applied post-deployment. Control points (identity propagation, audit tooling, data masking, prompt-injection filtering) are intrinsic to normal operations — making compliance the default rather than a retrospective add-on.
<!--SR:!2026-04-15,1,230-->
