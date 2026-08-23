---
title: "Agent Pool"
date: 2026-06-25
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [multi-agent, orchestration]
tags: [concept, ai-agents, llm, architecture, multi-agent, orchestration, composability, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/orchestration]
status: draft
sources:
  - url: https://sakana.ai/fugu-release/
    hash: sha256:f862841a63c87fc89dbadf5d0f8e55231b6975674636da3941343f8952f31a2a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://arxiv.org/abs/2606.21228
    hash: sha256:3809de17c51652b950014d9219eab2dbf499025c8c74b58fb790fea1d5cf2121
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Pool

## Definition
An **agent pool** is the named, bounded collection of AI models (or model-backed agents) that an [[orchestration-model]] or supervisor can dynamically select from, delegate tasks to, and combine outputs from — where the membership of the pool is *swappable at runtime* without requiring changes to the orchestration layer or the calling application.

## Explanation
A multi-agent system needs a way to describe "who can do work." The agent pool is that registry of available workers — each with their own capabilities, latency, cost, and compliance characteristics.

What distinguishes an *agent pool* from a simple list of models is the **swappability property**: models enter and leave the pool without the orchestrator needing to be retrained or reconfigured. The orchestration policy is learned against a *distribution* of possible pool compositions rather than a fixed set, enabling true runtime flexibility.

**Pool membership dynamics:**
- **Addition** — a new frontier model is released; it's folded into the pool as a specialist for specific task classes
- **Exclusion** — a model from a restricted vendor is removed due to export controls, privacy policy, or compliance requirements; the orchestrator routes around it
- **Substitution** — a deprecated model is replaced with a successor; callers are unaffected

**Compliance and privacy controls:**
Pools can be filtered per-deployment. An enterprise with data sovereignty requirements can exclude any cloud-hosted model and constrain the pool to on-prem or approved providers. This filtering happens at the pool level, not inside the orchestration model's weights.

**Pool composition in Fugu:**
Sakana Fugu's pool includes diverse LLMs from multiple providers, plus recursive calls to Fugu itself. Anthropic's Fable 5 and Mythos Preview are *not* in the pool (not publicly accessible), yet Fugu Ultra matches their benchmark performance — demonstrating that pool quality and coordination quality together determine output quality.

**Relationship to agent registries:**
An agent pool is a runtime composition concept. An agent registry (e.g., a capability catalog) is the persistent store describing what agents exist and what they can do. A pool may be dynamically assembled from a registry based on task context, policy filters, and availability.

## Key Properties
- **Swappability** — members can be added, removed, or substituted without affecting the orchestration layer or callers
- **Heterogeneity** — pool members may come from different providers, run different models, and excel at different domains
- **Recursive membership** — the orchestrator itself can be a pool member (enabling hierarchical depth via self-calls)
- **Policy-filterable** — compliance, privacy, or cost constraints can exclude specific pool members at runtime
- **Transparent to callers** — pool composition is invisible from outside; callers interact with one endpoint
- **Coordination-substrate** — the pool's diversity is what enables ensemble-like quality gains over single-model approaches

## Relationships
- Consumed by [[orchestration-model]]: the pool is the resource the orchestration model delegates to; pool quality determines maximum achievable output quality
- Enables [[ai-sovereignty]]: swappability means no single pool member is a hard dependency; regulatory restrictions trigger dynamic rerouting
- Implements [[multi-agent-api-abstraction]]: the pool is the "hidden complexity" that the abstraction conceals from callers
- Related to [[multi-agent-systems]]: agent pools are the resource layer for any multi-agent architecture; see [[multi-agent-systems]] for coordination patterns
- Related to [[capability-registry]]: an agent pool may be assembled dynamically from a broader capability registry filtered by task and policy

## Applications
**Designing an agent pool:**
- Define specialisations clearly — a "code review" specialist vs a "science reasoning" specialist have different optimal model choices
- Include at least one model per specialisation from each vendor you want resilience against; pool diversity = resilience
- Version the pool — record which model versions were in the pool for a given job (important for reproducibility and audit)
- Implement exclusion lists at the pool layer, not baked into prompt instructions

**When pool diversity matters most:**
- Long-horizon tasks where different sub-tasks require different strengths (code writing + literature review + synthesis)
- Adversarial verification — using independent pool members to cross-check each other catches correlated model errors (see [[cross-vendor-agent-review]])
- Tasks under regulatory uncertainty — maintaining multiple viable providers means one restriction doesn't block the workflow

## Study
- Flashcards: [[flashcards/agent-pool|Practice this concept]]

## Sources
- [Sakana Fugu Release Announcement](https://sakana.ai/fugu-release/) — pool design, exclusion controls, recursive self-calls
- [Sakana Fugu Technical Report](https://arxiv.org/abs/2606.21228) — benchmark comparisons with and without specific pool members

## See Also
- [[orchestration-model]]
- [[ai-sovereignty]]
- [[multi-agent-api-abstraction]]
- [[multi-agent-systems]]
- [[capability-registry]]
- [[cross-vendor-agent-review]]
- [[thinker-worker-verifier-pattern]]
