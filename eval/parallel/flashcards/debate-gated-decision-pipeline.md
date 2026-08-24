---
tags: [flashcards, ai-agents, multi-agent, design-patterns]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Debate-gated decision pipeline — Flashcards

#flashcards/ai-agents

## Pipeline stages <!-- kb:card:8e5052 -->
What sequence of roles does a debate-gated decision pipeline use instead of a single model call?
?
Independent analyst agents (narrow reads) -> two adversarial researcher agents (opposing interpretations/debate) -> a risk-review agent (checks exposure limits) -> a synthesis agent (final decision).

## Why force a debate <!-- kb:card:e6c7f6 -->
What problem does forcing two agents to argue opposing sides address, versus one model deciding alone?
?
A single LLM call asked to weigh many signals tends to average or under-argue the tension between them; forcing explicit two-sided debate turns that tension into an inspectable artifact instead of a hidden internal weighting.

## Risk gate placement <!-- kb:card:d16d1a -->
Where does the risk-review stage sit in a debate-gated decision pipeline, and why does that placement matter?
?
Between the debate and the final decision, so an aggressive debate conclusion can still be vetoed or scaled back against exposure limits — keeping strategy generation and risk control as separate agents.

## Synthesis step <!-- kb:card:d2f572 -->
Does the final synthesis agent in this pipeline just pick the debate's winning side?
?
No — it recombines the debate's conclusion with the original underlying data, so the decision reflects both the qualitative argument and the quantitative record.

## Empirical result <!-- kb:card:3a9e69 -->
How did this decomposed pipeline perform against a single-model or ungated multi-agent baseline in trading backtests?
?
It outperformed both, suggesting the gain comes from the pipeline's structure itself rather than simply adding more agents.
