---
tags: [flashcards, ai-agents, event-driven, webhooks, long-running, architecture]
sr-due: 2026-05-31
sr-interval: 1
sr-ease: 250
---

# Event-Driven Dormancy — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:c474b3 -->
What is event-driven dormancy in the context of AI agents?
?
An architectural pattern where an agent genuinely suspends execution during idle periods and resumes only when an external event (webhook/message queue) signals the next step can proceed — eliminating polling, blocked threads, and wasted inference calls during waits.

## Problem <!-- kb:card:0821fa -->
Why does active polling fail as a waiting strategy for long-running agents?
?
Polling wastes compute and tokens for zero productive work. At scale, N concurrent dormant workflows means N agents all polling simultaneously. It also doesn't work in serverless/scale-to-zero environments where the process itself may not be running.

## Mechanism <!-- kb:card:53edcb -->
What happens at the infrastructure level when an agent enters dormancy?
?
Nothing — the container may scale to zero or restart freely. All state is in the database. When a webhook fires, a new process hydrates the session from storage, applies a `state_delta` to advance the state machine, and wakes the agent via `runner.run_async`. The agent sees the correct checkpoint immediately.

## Key Primitive <!-- kb:card:f32a2a -->
What is a `state_delta` and why is it important for event-driven resumption?
?
A `state_delta` is a parameter passed to `runner.run_async` that atomically applies state transitions before the agent's first inference call after waking. It ensures the agent sees the correct `current_step` immediately upon resumption — without needing to re-examine why it was woken or replay old history.

## Application <!-- kb:card:fb85f0 -->
Name three real-world scenarios where event-driven dormancy applies.
?
1. **Document signature gates** — agent pauses after sending contract; e-sign platform POSTs on completion
2. **Hardware delivery waits** — agent idles after ordering laptop; courier webhook fires on delivery scan
3. **Human approval gates** — agent submits request to approval system; approval platform webhooks resume the flow

## Relationship <!-- kb:card:0de236 -->
How does event-driven dormancy depend on the durable agent state machine?
?
Dormancy is only safe if the agent has a persistent state checkpoint to resume from. Without a durable state machine, the agent would have no reliable way to know where it was in the workflow when it wakes — it would need to reconstruct progress from conversation history, reintroducing the hallucination and pollution problems the state machine solves.
