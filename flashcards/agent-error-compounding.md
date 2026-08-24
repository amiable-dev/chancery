---
tags: [flashcards, ai-agents, reliability, failure-modes, domain/reliability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Compounding failure in agentic systems — Flashcards

#flashcards/ai-agents

## Agent mistakes differ in kind <!-- kb:card:93e78b -->
How does an agent's mistake differ in kind (not just degree) from a single-response chatbot's mistake?
?
A chatbot's bad answer ends the exchange; an agent that goes wrong mid-task keeps executing, and every subsequent step inherits the faulty state, so the blast radius grows with each iteration.

## The loop is the mechanism <!-- kb:card:e933ae -->
What mechanism turns a single bad agent output into a compounding problem?
?
The reasoning loop itself (choose action, act, read result, adjust) — the same loop that makes an agent useful also turns a bad output into an input for the next decision, so errors propagate and combine.

## Cause and symptom drift apart <!-- kb:card:e34db7 -->
Why is post-hoc debugging of agents harder than debugging request-response systems?
?
The interval between the causal mistake and the visible symptom stretches — by the time anything looks wrong, several actions have already been taken on an uninspected bad premise.

## Undetected stuck state loops instead of stopping <!-- kb:card:5ca8d1 -->
What happens when an agent cannot recognize that it is stuck?
?
It loops rather than stops, converting a recoverable error into unbounded cost.

## Severity scales with tool reach <!-- kb:card:85d846 -->
Why does the severity of a compounding error depend on tool reach?
?
A compounding error that only reads is a wasted run; one that writes is an incident — so risk scales with what the tools can actually change.

## Fixes belong at the architecture layer <!-- kb:card:9261da -->
At what layer does the source argue agent reliability work belongs, and what specific fixes does it name?
?
The architecture layer, not the model layer — narrow scope, small tool surfaces, deliberate memory design, recorded execution traces, and guardrails between outputs and irreversible actions.
