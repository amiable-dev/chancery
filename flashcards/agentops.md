---
tags: [flashcards, agent-ops, observability, multi-agent-systems, reliability]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# AgentOps — Flashcards

#flashcards/agent-ops

## Intra- vs inter-agent <!-- kb:card:78dbc2 -->
In AgentOps, what is the difference between an 'intra-agent' anomaly and an 'inter-agent' anomaly?
?
Intra-agent: a fault arising inside a single agent's own reasoning or tool use. Inter-agent: a fault arising from interactions between multiple agents in a multi-agent system.

## Four-stage lifecycle <!-- kb:card:8a31b8 -->
What are the four stages of the AgentOps operational lifecycle?
?
Monitoring, anomaly detection, root cause localization, and resolution.

## Why root cause localization is hard <!-- kb:card:76fe3c -->
Why is root cause localization harder for agent systems than for traditional software?
?
Because the causal chain runs through natural-language reasoning steps rather than a deterministic stack trace.

## Distinct from MLOps <!-- kb:card:a89eff -->
Why does AgentOps position itself as a discipline distinct from general MLOps or single-model LLM monitoring?
?
Neither MLOps (built for model drift and data pipelines) nor single-model monitoring is built for multi-agent interaction failures.

## Anomaly detection's challenge <!-- kb:card:d11071 -->
What must the anomaly detection stage distinguish, given how agent systems normally behave?
?
A genuine fault from ordinary variance in an inherently non-deterministic system.
