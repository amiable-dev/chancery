---
title: ReAct pattern
aliases:
  - ReAct
  - Reason + Act
date: 2026-08-24
tags:
  - concept
  - ai-agents
  - prompting
  - reasoning
status: draft
sources:
  - url: https://arxiv.org/abs/2210.03629
---

# ReAct pattern

## Definition

The **ReAct pattern** has a language model generate reasoning traces and task-specific actions in an interleaved loop: a thought induces, tracks and updates the plan, an action queries an external source such as an API or environment, and the returned observation grounds the next thought — so reasoning steers acting while acting feeds real information back into reasoning.

## Explanation

The pattern repairs complementary failure modes. Chain-of-thought reasoning alone is a closed book: the model reasons over its own internal state, hallucinated premises included, and errors propagate unchecked through the chain. Action-only policies touch the world but cannot decompose goals, track progress or handle exceptions. Interleaving the two lets each discipline the other — the trace plans and recovers, the observations anchor the trace to facts the model did not invent. The source is the ICLR 2023 paper by Yao et al., with quantified results: on HotpotQA question answering and FEVER fact verification, giving the reasoner a simple Wikipedia API curbed the hallucination and error propagation of pure chain-of-thought; on the interactive benchmarks ALFWorld and WebShop, ReAct beat imitation and reinforcement learning baselines by 34 and 10 absolute percentage points respectively while being prompted with only one or two in-context examples. The trajectories also read as human-like task solving, which the authors argue improves interpretability and trust over baselines lacking either component. The thought-action-observation loop the paper named is now the core control loop of most production tool-using agents.

## Key Properties

- Interleaves free-form reasoning traces with actions; each action's observation grounds the next reasoning step
- Reasoning maintains and revises plans and handles exceptions; actions gather external information
- Curbed chain-of-thought hallucination and error propagation on HotpotQA and FEVER using only a simple Wikipedia API
- Beat imitation and RL baselines by 34 points absolute on ALFWorld and 10 on WebShop, from one or two in-context examples
- Trajectories are human-readable, making the agent's path auditable rather than opaque

## Relationships

- [[retrieval-augmented-generation]] — generalizes RAG's grounding move from architecture to policy — instead of one retrieval step wired before generation, the model decides when and what to retrieve as actions inside its reasoning loop
- [[code-mode-mcp]] — established the thought-action-observation loop whose act step Code Mode later optimizes, replacing schema-per-tool calls with model-written code over a tool catalogue

## Applications

The default control loop for tool-using agents: question answering that consults search or a knowledge base mid-reasoning, and multi-step interactive tasks where plans must adapt to what each action reveals. Implementable at the prompt level with a handful of in-context examples, no fine-tuning required.

## Sources

- https://arxiv.org/abs/2210.03629

## See Also

- [[retrieval-augmented-generation]]
- [[code-mode-mcp]]
