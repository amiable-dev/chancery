---
tags: [flashcards, agents, observability, evaluation, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Outcome versus proxy metrics for agents — Flashcards

#flashcards/agents

## Outcome versus proxy metrics defined <!-- kb:card:962216 -->
What is the distinction between outcome and proxy metrics for an agent?
?
Proxy metrics (latency, cost, tool-call counts, error counts) fall out of the agent's own record; outcome evidence that the work was actually accomplished must come from artifacts the agent did not author, like a passing CI test, a merged PR, or a deploy that wasn't rolled back.

## Why self-reported completion isn't measurement <!-- kb:card:074157 -->
Why can't an agent's own claim of task completion count as an outcome signal?
?
The claim is produced by the very process whose success is in question — an agent whose objective is to finish will happily report finishing, so self-report is a claim, not a measurement.

## Why outcome anchors must sit outside the agent <!-- kb:card:d03655 -->
Why do outcome anchors like merge status and CI results have to originate outside the agent's authorship?
?
Because they need to be cheap to read and expensive to fake — an anchor the agent could influence or generate itself provides no real evidence its work succeeded.

## What proxy metrics can and can't catch <!-- kb:card:0ae326 -->
What can proxy metrics reliably catch, and what can't they tell you?
?
They reliably catch runaway cost and loops that never terminate, but say nothing about whether the work produced was any good.

## The recommended logging default <!-- kb:card:c50e28 -->
What is the recommended default for how agent session data should be logged?
?
Verbose, append-only, structured as JSON lines — keep everything and trim later, since losing the inputs to a session with an unexplained outcome costs far more than the storage bill.
