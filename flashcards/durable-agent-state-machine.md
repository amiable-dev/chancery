---
tags: [flashcards, ai-agents, state-machine, long-running, architecture]
sr-due: 2026-05-31
sr-interval: 1
sr-ease: 250
---

# Durable Agent State Machine — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:56d7d9 -->
What is a durable agent state machine?
?
An explicit, named-checkpoint schema that encodes an agent's workflow progress as first-class persisted data — decoupled from conversation history — so the agent always knows exactly where it is in a multi-step process regardless of elapsed time or idle periods.

## Problem <!-- kb:card:4675f3 -->
What are the three ways stateless agents break on long-running workflows?
?
1. **Context pollution** — old turns fill the window with irrelevant history, losing track of the current step
2. **Token cost explosion** — replaying weeks of conversation history on every inference call is wasteful
3. **Idle-time hallucination** — after long pauses, models hallucinate intermediate steps that never happened

## Mechanism <!-- kb:card:4d0975 -->
How does a durable state machine inject state into an agent's reasoning?
?
Current state variables (e.g., `{current_step}`, `{new_hire_details}`) are interpolated directly into the system prompt at each inference call. The model reads its exact status from the prompt — it never needs to reconstruct progress from conversation history.

## Atomic Transitions <!-- kb:card:c5a6e4 -->
Why must state machine transitions be atomic?
?
If a container crashes immediately after a tool call advances the workflow, the state must already be written. Atomic writes ensure there is no partial state (e.g., data updated but step counter not). The agent always resumes from a consistent checkpoint.

## Application <!-- kb:card:92c71b -->
When is a durable state machine most valuable over a stateless agent?
?
When the workflow spans hours/days/weeks, has idle periods, involves human approval gates, or must survive infrastructure restarts. The state machine is overkill for short sessions that complete in minutes.

## Relationship <!-- kb:card:eb51e8 -->
How does a durable state machine relate to context rot?
?
A durable state machine directly solves context rot for long-running workflows: by replacing conversation history with structured state data, it eliminates context pollution (irrelevant history) and idle-time hallucination (gaps in the history leading to false memories).
