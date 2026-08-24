---
title: RL-learned agent orchestration
date: 2026-08-24
tags:
  - concept
  - multi-agent
  - orchestration
  - reinforcement-learning
status: draft
sources:
  - url: https://arxiv.org/abs/2512.04388
---

# RL-learned agent orchestration

## Definition

**RL-learned agent orchestration** is the approach of training a dedicated coordinator model with reinforcement learning to discover, end-to-end from task reward, how a pool of worker LLMs should collaborate — which agent-to-agent communication topology to wire between them and what targeted instructions to send each worker — instead of hand-designing the multi-agent workflow.

## Explanation

The reference demonstration is the Conductor (arXiv 2512.04388, an ICLR 2026 paper): a 7B model whose action space is the design of the collaboration itself. At inference it composes a communication topology over the available workers and prompt-engineers focused instructions for each one; during training the only signal is end-to-end reward on the task, so coordination strategies emerge from reward maximization rather than from human workflow design. Training over randomized agent pools makes the learned policy portable — it adapts to arbitrary mixes of open- and closed-source workers rather than overfitting one roster. Two results give the idea its force: the small conductor coordinating strong workers beat every individual worker, reaching state-of-the-art on LiveCodeBench and GPQA; and allowing the conductor to select itself as a worker produced recursive topologies, a form of dynamic test-time scaling through online iterative adaptation. Because this is a research paper, the durable content is the demonstrated possibility — coordination is learnable, and hand-built orchestration graphs are a stand-in for something a model can optimize — while the specific benchmark numbers will age; adopting the pattern means RL-training a conductor, which puts it out of reach of most application teams today.

## Key Properties

- A 7B conductor trained with RL outperformed every individual worker LLM in its pool
- Learns both the communication topology and per-worker prompt instructions end-to-end from task reward alone
- Randomized agent pools during training let the policy adapt to arbitrary open- and closed-source workers
- The conductor selecting itself as a worker yields recursive topologies — dynamic test-time scaling
- Reported state-of-the-art on LiveCodeBench and GPQA (ICLR 2026)

## Relationships

- _No relationships recorded yet._

## Applications

Reframes orchestration-framework design: treat agent wiring and per-agent prompts as a learnable policy rather than configuration, and expect trained conductors to replace hand-tuned multi-agent graphs where task reward is measurable.

## Sources

- https://arxiv.org/abs/2512.04388

## See Also

- _None yet._
