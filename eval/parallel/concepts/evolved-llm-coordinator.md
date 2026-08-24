---
title: Evolved lightweight LLM coordinator
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: research
tags: [concept, multi-agent, orchestration, evolutionary-optimization, domain/ai-agents, maturity/emerging, source-type/research]
status: draft
sources:
  - url: https://arxiv.org/abs/2512.04695
    class: external-primary
---

# Evolved lightweight LLM coordinator

## Definition

An **evolved lightweight LLM coordinator** is a way to combine heterogeneous foundation models without merging their weights: a compact coordinator — in the reference system a roughly 0.6B-parameter language model plus a roughly 10K-parameter head — is optimized with an evolutionary strategy to delegate work across a pool of larger LLMs, assigning one of a small set of roles such as Thinker, Worker, or Verifier to a chosen model at each turn of a multi-turn loop.

## Explanation

Weight merging cannot combine models with mismatched architectures or behind closed APIs; coordination sidesteps both because delegation needs only each model's inputs and outputs. Trinity (arXiv 2512.04695, an ICLR 2026 paper) makes the coordinator cheap by offloading skill: the workers carry the competence, and the coordinator only learns who should play which role when, so a sub-1B model with a tiny head suffices. Its optimization finding is the durable part — under high dimensionality and a strict evaluation budget, separable Covariance Matrix Adaptation Evolution Strategy beat reinforcement learning, imitation learning, and random search, which the authors attribute to exploiting block-epsilon-separability of the search space — along with the observation that the coordinator's hidden-state representations richly contextualize inputs, which is why a language model rather than a plain policy net does the coordinating. Empirically the system outperformed its individual member models and existing methods across coding, math, reasoning, and domain-knowledge tasks, generalized to out-of-distribution tasks, and reported 86.2% on LiveCodeBench. As a research paper its scores will age; what transfers is the design point — tiny evolved coordinator, per-turn role delegation, evolution strategies over RL when the evaluation budget is tight.

## Key Properties

- Coordinator is ~0.6B parameters plus a ~10K-parameter head; competence stays in the worker LLMs
- Per-turn delegation assigns one of three roles — Thinker, Worker, or Verifier — to a selected model
- Separable CMA-ES beat RL, imitation learning, and random search under high dimensionality and strict budget
- Works across closed APIs and mismatched architectures where weight merging cannot
- Reported 86.2% on LiveCodeBench and robust out-of-distribution generalization (ICLR 2026)

## Relationships

- [[rl-learned-orchestration]] — attacks the same learned-coordination problem with a different optimizer and action space — an evolved sub-1B coordinator assigning per-turn roles, where the RL Conductor designs communication topologies and per-worker prompts

## Applications

Combining commercial API models with open models into one system when weight access is impossible; choosing evolution strategies over RL when tuning a small controller under a tight evaluation budget.

## Sources

- https://arxiv.org/abs/2512.04695

## See Also

- [[rl-learned-orchestration]]
