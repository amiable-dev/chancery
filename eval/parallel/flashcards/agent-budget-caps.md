---
tags: [flashcards, agents, operations, cost-control, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Budget caps for autonomous agents — Flashcards

#flashcards/agents

## Definition and the two-sided premise <!-- kb:card:f2cf84 -->
What are budget caps for autonomous agents, and what premise justifies sizing them per job rather than fixing them globally?
?
Operator-set hard limits on tokens, tool calls, re-check iterations, and wall-clock duration; sized per job because output degrades in both directions — too small cuts the agent off as a low-confidence stub, too large lets it wander, spend, and add noise.

## Time-boxed and CI runs <!-- kb:card:1423ad -->
Which caps matter most for a time-boxed engagement or CI run, and why?
?
Wall-clock and iteration caps — the requirement is that the run always finishes inside a window, even if it finishes incomplete.

## Deep single-target work <!-- kb:card:881cba -->
Why does a deep investigation of a single target loosen the token cap rather than tighten it?
?
Because the value comes from the agent being able to abandon a hypothesis and re-plan — behaviour a tight token budget would foreclose.

## Broad sweeps need per-target budgets <!-- kb:card:f638f4 -->
Why does a broad sweep across many targets need per-target budgets instead of one pooled allowance?
?
A single target that turns into a rabbit hole would otherwise consume the entire run and starve every target after it.

## Asymmetric failure modes <!-- kb:card:1c1ba1 -->
Why is overbudgeting a harder error to notice than underbudgeting, and what operating rule follows from that?
?
Underbudgeting fails visibly as a legible low-confidence stub, while overbudgeting produces plausible extra output that costs money and dilutes genuine findings — so start tight and loosen only when real work is demonstrably being cut off.
