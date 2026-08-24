---
tags: [flashcards, ai-agents, evaluation, testing, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Pre-seeded-state agent evals — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:c87b89 -->
What do pre-seeded-state evals validate, and how do they avoid living through a workflow's real timeline?
?
They validate long-running agent workflows by seeding a test fixture's workflow-position state directly to any checkpoint — standing in for days of idle time or an unfired external event — then asserting deterministically what the agent does next: which tools it calls, in what order, and whether it refuses to act while a gate is unsatisfied.

## Why this is needed <!-- kb:card:675524 -->
Why can't a workflow that spans two weeks be validated by simply running it in real time?
?
The blocking problem is time itself — you can't wait two weeks in CI. Because the architecture stores workflow position as explicit, seedable state, a fixture can jump straight to any checkpoint instead of waiting, which is what makes the eval possible at all.

## The empty-case assertion <!-- kb:card:216514 -->
Why is a turn asserting zero tool calls just as important as one asserting the expected tool calls?
?
Because it verifies the agent refuses to act while a gate is unsatisfied — even when the user directly asks it to skip ahead — pinning refusal behavior, not just success behavior.

## Late-stage seeding and context survival <!-- kb:card:eabdc8 -->
What does a fixture that seeds a late-stage workflow state confirm?
?
That resumption invokes the remaining tools in the correct sequence with the details captured before the gap still intact — proving context survives a simulated multi-day gap.

## Speed and CI fit <!-- kb:card:f9ee9a -->
Why can pre-seeded-state evals run in CI, when the workflows they test span days or weeks?
?
Seeding state and asserting on it is deterministic and runs in seconds, catching state-machine regressions before deployment instead of only in production.
