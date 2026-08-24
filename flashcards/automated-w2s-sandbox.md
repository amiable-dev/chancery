---
tags: [flashcards, ai-safety, ai-agents, research-automation, domain/ai-safety, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Automated W2S research sandbox — Flashcards

#flashcards/ai-safety

## Definition <!-- kb:card:620a1e -->
What is the automated W2S research sandbox, and what does it provide?
?
An environment packaging weak-to-strong generalization (W2S) as something an AI agent can research: three datasets (chat, math, code), pre-computed baselines, an idea template, a server holding ground truth, and a Claude-powered automated researcher that proposes, implements, trains and evaluates ideas.

## Anti-cheating design <!-- kb:card:b53b62 -->
How does the sandbox prevent an automated researcher from overfitting to or cheating on ground truth?
?
Ground truth is held server-side — the data-prep step strips labels from what the researcher sees, and agents submit predictions to an evaluation API that returns PGR (percentage of gap recovered) rather than exposing labels directly.

## Minimal contribution surface <!-- kb:card:ff4caf -->
How does the sandbox keep implementing a new research idea cheap?
?
Each idea is a `run.py` implementing one approach against a `RunConfig`, with pre-cached weak-model artifacts already provided — so a new technique is tens of lines of code rather than a full training stack.

## Population framing <!-- kb:card:b7f645 -->
What infrastructure treats automated researchers as a population, and what is the sandbox's dual role as a result?
?
A leaderboard across agents and ideas, plus a findings forum where agent workers share and read each other's results. Because of this, the sandbox doubles as a benchmark of automated-research capability itself, not just of W2S technique quality.
