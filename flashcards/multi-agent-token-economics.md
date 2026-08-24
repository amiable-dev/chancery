---
tags: [flashcards, ai-agents, orchestration, inference-cost, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Multi-agent token economics — Flashcards

#flashcards/ai-agents

## Multi-agent token economics — thesis <!-- kb:card:e3013c -->
What is the core finding of multi-agent token economics about where an orchestrator-plus-workers architecture's performance gain comes from?
?
Mainly from spending more tokens across separate context windows — parallel subagents each hold their own context and return compressed findings — not from any coordination magic.

## Token economics — variance decomposition <!-- kb:card:578b5d -->
In the browsing-benchmark study behind this concept, roughly what share of performance variance did token usage alone explain?
?
Roughly 80% (about 95% combined with tool-call count and model choice).

## Token economics — cost multiples <!-- kb:card:f674a2 -->
Roughly how many times more tokens do (a) a single agent and (b) a multi-agent system use compared to a plain chat exchange?
?
Roughly 4 times for a single agent, and roughly 15 times for a multi-agent system.

## Token economics — fit test <!-- kb:card:b3c74b -->
What task profile justifies the cost of a multi-agent system, and what kind of work is a poor fit?
?
It fits breadth-first work with independent directions, heavy tool use, and information exceeding one context. It's a poor fit for work requiring shared context or dependence on each other's intermediate results — which is why most coding tasks don't suit it.

## Token economics — where budget leaks <!-- kb:card:990d12 -->
What two prompting failures waste a multi-agent system's token budget, per this concept?
?
Vague delegation (causing duplicated work and coverage gaps) and missing effort ceilings (causing agents to misjudge scale) — both are prompting problems, not architecture problems.
