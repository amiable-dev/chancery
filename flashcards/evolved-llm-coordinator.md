---
tags: [flashcards, multi-agent, orchestration, evolutionary-optimization, domain/ai-agents, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Evolved lightweight LLM coordinator — Flashcards

#flashcards/multi-agent

## Definition <!-- kb:card:4cf667 -->
What is an evolved lightweight LLM coordinator?
?
A compact model (roughly 0.6B parameters plus a ~10K-parameter head), optimized with an evolutionary strategy, that delegates work across a pool of larger LLMs by assigning roles like Thinker, Worker, or Verifier at each turn.

## Coordination vs weight merging <!-- kb:card:e6fc24 -->
Why does this coordination approach work where weight merging cannot?
?
Coordination only needs each model's inputs and outputs, so it works across mismatched architectures and closed/proprietary APIs that weight merging can't touch.

## Why the coordinator stays tiny <!-- kb:card:94a72f -->
Why does the coordinator only need to be sub-1B parameters when the worker models are much larger?
?
Competence stays in the worker LLMs; the coordinator only has to learn who should play which role when, not perform the tasks itself.

## Optimization method finding <!-- kb:card:119a22 -->
What optimization method beat RL, imitation learning, and random search for training this coordinator, and under what conditions?
?
Separable CMA-ES (an evolutionary strategy), under high dimensionality and a strict evaluation budget, attributed to exploiting block-epsilon-separability of the search space.

## Results <!-- kb:card:5af694 -->
How did the coordinated system perform relative to its individual member models?
?
It outperformed every individual member model and existing methods across coding, math, reasoning, and domain-knowledge tasks, generalizing to out-of-distribution tasks and reaching 86.2% on LiveCodeBench.
