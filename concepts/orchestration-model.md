---
title: "Orchestration Model"
date: 2026-06-25
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [orchestration, multi-agent]
tags: [concept, ai-agents, llm, architecture, multi-agent, orchestration, learned-coordination, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/orchestration, topic/multi-agent]
status: draft
sources:
  - url: https://sakana.ai/fugu-release/
    hash: sha256:f862841a63c87fc89dbadf5d0f8e55231b6975674636da3941343f8952f31a2a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://arxiv.org/abs/2512.04695
    hash: sha256:cc8d59184e820e3a0c0924eb0dec3762b452fa565c57039da1179887f1fd002b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://arxiv.org/abs/2512.04388
    hash: sha256:5a0ce48b04e65d556cfc31be2c78c6aeb94dd1b2e5228242e2b1541a3b25e974
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://arxiv.org/abs/2606.21228
    hash: sha256:3809de17c51652b950014d9219eab2dbf499025c8c74b58fb790fea1d5cf2121
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Orchestration Model

## Definition
An **orchestration model** is a language model trained end-to-end specifically to coordinate a pool of other AI models — deciding when to delegate, which specialist model to use, how agents should communicate, and how to synthesise their outputs into a single response. Unlike hardcoded pipelines or rule-based supervisors, the orchestration logic is *learned from training* rather than hand-engineered.

## Explanation
Traditional multi-agent systems are built by humans who explicitly wire agents together: "if the task is about code, call the code agent; if it's about retrieval, call the search agent." These pipelines are brittle — they encode the designer's current understanding of task decomposition, can't generalise to unanticipated cases, and must be manually updated when the underlying model pool changes.

An orchestration model takes a different approach: the coordination strategy itself is treated as something to be *learned*. The model is trained on examples of successful multi-agent coordination, developing an internal policy for:
- **Delegation decisions** — should I answer this myself or hand it off?
- **Model selection** — given this sub-task, which agent in the pool is best suited?
- **Communication format** — how should I frame the instructions to maximise the downstream agent's accuracy?
- **Synthesis** — how do I combine multiple partial answers into a coherent whole?

**Sakana Fugu as the canonical example:**
Fugu is the first commercially deployed orchestration model. From the outside it behaves like a single model (OpenAI-compatible API, one endpoint). Internally, it calls agents from a swappable [[agent-pool]] — including recursive calls to itself — applying learned coordination logic. The agent pool can include models from any provider; if one is unavailable due to export controls, Fugu routes around it dynamically.

**Research foundations (ICLR 2026):**
- **TRINITY** — Uses an evolved coordinator (itself a small LM) that assigns Thinker, Worker, and Verifier roles to downstream agents. See [[thinker-worker-verifier-pattern]].
- **Conductor** — Learns coordination strategies in natural language via reinforcement learning; the agent discovers *how* to instruct and sequence sub-agents.

**Contrast with supervisor agent pattern:**
The [[supervisor-agent-pattern]] describes an *architectural pattern* where a supervisor agent decomposes tasks and delegates — but the supervisor's logic is typically a prompted general-purpose LLM following handwritten instructions. An orchestration model has coordination logic baked into weights through training, making it more robust and capable at complex multi-step delegation.

## Key Properties
- **Learned coordination** — orchestration policy is trained, not hardcoded; generalises beyond designer anticipation
- **Pool-aware** — operates against a dynamic, swappable set of specialist models rather than fixed sub-agents
- **Recursive** — can call itself (as a sub-agent) enabling hierarchical depth without additional model types
- **Opaque internally** — callers see a single model interface; internal agent interactions are invisible to the caller
- **Pool-agnostic API** — surface is a standard model API (e.g., OpenAI-compatible) regardless of what's in the pool
- **Resilient by design** — if a pool member becomes unavailable, the model reroutes without caller-side changes

## Relationships
- Requires [[agent-pool]]: the swappable collection of specialist models the orchestration model can delegate to
- Implements [[multi-agent-api-abstraction]]: the pattern of hiding multi-agent complexity behind a single model API
- Related to [[supervisor-agent-pattern]]: the rule-based predecessor; orchestration models replace handwritten supervisor logic with learned coordination
- Enables [[ai-sovereignty]]: dynamic routing around unavailable vendors is the practical anti-lock-in mechanism
- Implements [[thinker-worker-verifier-pattern]]: TRINITY's Thinker/Worker/Verifier role structure is one learned coordination strategy
- Related to [[multi-agent-systems]]: orchestration models are a learned implementation of multi-agent coordination; see [[multi-agent-systems]] for architectural patterns

## Applications
**When to prefer an orchestration model over a hardcoded pipeline:**
- Tasks where optimal sub-task decomposition isn't known in advance
- Long-horizon, open-ended workflows (automated research, sustained code review, patent investigation)
- Environments where the model pool changes frequently (new models arriving, vendor restrictions)
- Production systems requiring vendor resilience without caller-side routing logic

**Current deployment (Fugu):**
- **Fugu** (standard tier): low-latency everyday work — coding, code review, chatbots
- **Fugu Ultra** (max quality): deep coordination loop for sustained multi-step reasoning — scientific research, cybersecurity analysis, literature investigation

## Study
- Flashcards: [[flashcards/orchestration-model|Practice this concept]]

## Sources
- [Sakana Fugu Release Announcement](https://sakana.ai/fugu-release/) — primary source; architecture, benchmarks, user testimonials
- [TRINITY: An Evolved LLM Coordinator](https://arxiv.org/abs/2512.04695) — ICLR 2026; evolved coordinator assigning Thinker/Worker/Verifier roles
- [Learning to Orchestrate Agents (Conductor)](https://arxiv.org/abs/2512.04388) — ICLR 2026; RL-based natural language coordination strategy learning
- [Sakana Fugu Technical Report](https://arxiv.org/abs/2606.21228) — benchmarks and architecture details

## See Also
- [[agent-pool]]
- [[multi-agent-api-abstraction]]
- [[thinker-worker-verifier-pattern]]
- [[ai-sovereignty]]
- [[supervisor-agent-pattern]]
- [[multi-agent-systems]]
- [[cross-vendor-agent-review]]
