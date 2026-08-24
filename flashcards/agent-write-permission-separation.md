---
tags: [flashcards, ai-agents, security, guardrails, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Read and write permission separation for agents — Flashcards

#flashcards/ai-agents

## Definition: read/write permission separation <!-- kb:card:91c6ab -->
Why must an agent's read operations and write operations be governed differently from the start?
?
Reads and writes are different risk categories — a wrong read just wastes a run, but a write to production or a message to a real user can't be undone, so guardrails sit between the agent's output and any state-changing action.

## Why the agent can't self-gate its writes <!-- kb:card:7f2e61 -->
Why can't an agent's own confidence be used to decide whether one of its writes is safe to execute?
?
Confidence and correctness are uncorrelated in a model's output — it can reason incorrectly yet answer with high confidence, so nothing in its own reasoning distinguishes a good write from a bad one.

## Permission boundaries drawn per tool <!-- kb:card:88a287 -->
How should permission boundaries be assigned across an agent's tools, under this principle?
?
Per tool, by the consequence of that tool being misused — not granted broadly on trust — giving a graded design where a read needs no gate, a scoped write needs validation, and an irreversible action needs a human in the path.

## Where validation must sit <!-- kb:card:1cb745 -->
Where must output validation sit to function as a real control, and why can't it live in the prompt?
?
Between the model's proposal and the effect, not inside the prompt — instructions the model is merely asked to follow are not a control over the model, so validation must structurally intercept the action.

## Scope constraints do the daily work <!-- kb:card:c664f3 -->
What does limiting what an agent can reach (scope constraints) accomplish in day-to-day practice?
?
It converts many potential incidents into merely failed calls — because the agent physically cannot reach the sensitive target, an incorrect write attempt fails harmlessly instead of executing.
