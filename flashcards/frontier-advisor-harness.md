---
tags: [flashcards, ai-agents, orchestration, inference-cost, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Frontier model as callable advisor — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:79af47 -->
What is a frontier advisor harness, and how does it decide when to call the expensive model?
?
It runs the agent loop on a cheaper open-weights worker model and exposes a stronger model as a callable tool. The worker itself decides mid-trajectory, at its own points of uncertainty, when to escalate — there is no external router.

## Asymmetric trace signature <!-- kb:card:982cf3 -->
What asymmetric signature does this pattern leave in execution traces?
?
Advisor calls are sparse (about 0.83 per task in the reported run), while the worker's turn count rises noticeably downstream of each call — the strong model steers rather than writes.

## Why it's a cost dial, not a dependency <!-- kb:card:2cd5e7 -->
Why does self-invoked escalation turn the frontier model into a per-workload cost dial rather than a load-bearing component?
?
The expensive model is billed for a few short steering turns rather than the whole trajectory, so the advisor call rate can be tuned up for complex workloads and down for routine ones.

## Reported benchmark result <!-- kb:card:babeaf -->
In the Fireworks/Harvey reported benchmark, how did the open worker plus frontier advisor compare to running the frontier model end to end?
?
18/100 all-pass for $368, versus 14/100 all-pass for $954 running the frontier model end to end (the worker alone scored 12/100 for $121).

## Strength of the evidence <!-- kb:card:abf927 -->
How strong is the statistical evidence behind the reported margin over the frontier-only baseline?
?
Weak in size but consistent in direction: the benchmark's all-pass standard error is about 2.5 tasks per 100, so the 4-task margin over the frontier baseline is roughly one standard error.
