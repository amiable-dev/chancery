---
tags: [flashcards, agents, architecture, multi-agent, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Multi-agent orchestration topologies — Flashcards

#flashcards/agents

## Orchestration topologies — five shapes <!-- kb:card:269bf6 -->
What are the five recurring multi-agent orchestration topologies, and what determines which one to pick?
?
Sequential pipeline, concurrent fan-out with synthesis, supervisor (central planning plus dispatch), hierarchy of supervisors, and runtime handoff — selected by the task's dependency structure, not by taste.

## Orchestration — why use a hierarchy <!-- kb:card:c006ce -->
What problem does a hierarchy of supervisors solve, as opposed to a single supervisor?
?
It bounds a supervisor's span of control when the worker count exceeds what one coordinator can effectively manage — it exists to bound span of control, not to add capability.

## Orchestration — coordination cost <!-- kb:card:d73c78 -->
Roughly how much more expensive is multi-agent coordination than a single agent doing comparable work, in tokens?
?
Up to roughly 15 times the tokens of a single agent.

## Orchestration — termination requirement <!-- kb:card:a88347 -->
What do looped multi-agent topologies require that non-looped ones don't, and what happens without it?
?
Explicit termination conditions — quality thresholds, iteration caps, or early-stop signals — or the loop does not stop.

## Orchestration — human oversight axis <!-- kb:card:ebf6a3 -->
Name the four grades of human oversight that apply as an axis orthogonal to any orchestration topology.
?
In-the-loop (direct intervention at decision points), on-the-loop (meaningful control during execution), above-the-loop (strategic governance), and behind-the-loop (post-hoc analysis).
