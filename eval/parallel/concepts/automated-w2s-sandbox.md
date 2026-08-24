---
title: Automated W2S research sandbox
date: 2026-08-24
tags:
  - concept
  - ai-safety
  - ai-agents
  - research-automation
status: draft
sources:
  - url: https://github.com/safety-research/automated-w2s-research
---

# Automated W2S research sandbox

## Definition

The **automated W2S research sandbox** (safety-research) packages weak-to-strong generalization as an environment an AI agent can do research in: three datasets (chat, math, code), pre-computed baselines, a template for new ideas, and a server that holds ground truth behind an evaluation API — plus a Claude-powered automated researcher that proposes, implements, trains, and evaluates ideas against it.

## Explanation

Two design choices carry the concept. First, ground truth is held server-side: the data-preparation step strips labels from what the researcher sees, and agents submit predictions to an evaluation API that returns PGR — so an automated researcher cannot overfit to, or cheat from, answers it never holds. Second, the contribution surface is minimised: each idea is a run.py implementing one approach against a RunConfig, with pre-cached weak-model artifacts, so a new technique is tens of lines rather than a training stack. The server adds experiment management, a leaderboard across agents and ideas, and a findings forum where agent workers share and read each other's results — infrastructure that treats automated researchers as a population rather than a single loop. The sandbox is thereby also a benchmark of the automation itself: the same fixture measures how good an agent is at doing W2S research, not just how good a W2S technique is.

## Key Properties

- Ground truth server-side; agents see unlabeled data and an evaluation API returning PGR
- Idea template with pre-cached artifacts minimises the surface a contribution must implement
- Leaderboard and findings forum treat automated researchers as a population
- Doubles as a benchmark of automated research capability itself

## Relationships

- [[weak-to-strong-generalization]] — instantiates this research question as a runnable environment; PGR from its evaluation API is the sandbox's scoring function

## Applications

Running automated or human W2S experiments with anti-cheating evaluation; studying how agent researchers collaborate through shared findings.

## Sources

- https://github.com/safety-research/automated-w2s-research

## See Also

- [[weak-to-strong-generalization]]
