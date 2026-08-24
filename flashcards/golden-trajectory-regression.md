---
tags: [flashcards, agents, testing, observability, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Golden trajectory regression testing — Flashcards

#flashcards/agents

## Definition <!-- kb:card:aac84f -->
What is a golden trajectory, and what is it used as a baseline for?
?
A validated recording of an agent's complete execution — reasoning chain, every model call, tool invocations with arguments, decision gates, and captured state — retained as the baseline for behavioural regression testing.

## Why trajectories beat output comparison <!-- kb:card:4e30a6 -->
Why does comparing an agent's trajectory work as a regression test where comparing its final output does not?
?
A nondeterministic system can produce different but equally acceptable outputs to the same input, making output-equality assertions flaky or vacuous. The route an agent takes is far more stable than the prose it emits, and failures like wrong tool arguments or skipped gates are visible in the route but invisible in the answer.

## Prerequisite infrastructure <!-- kb:card:8d1a8a -->
What is the prerequisite infrastructure for golden trajectory regression testing, and what is a 'golden' in that context?
?
Tracing instrumentation that records spans for model and tool calls; a golden is simply a blessed production trace promoted to a fixture.

## The threshold trade-off <!-- kb:card:7f2288 -->
What is the central design problem in golden trajectory comparison, and what trade-off does it embody?
?
Setting the deviation threshold: too tight and every rephrasing fails the suite, too loose and genuine drift passes through undetected. Comparison is graded rather than exact for this reason.

## Response to deviation <!-- kb:card:c7f12f -->
What happens automatically when a replayed trajectory deviates from its golden past the threshold?
?
The artifact change (e.g. to a prompt or tool manifest) that produced the deviation is automatically rolled back.
