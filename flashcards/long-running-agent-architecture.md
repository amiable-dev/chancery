---
tags: [flashcards, ai-agents, architecture, infrastructure, patterns, long-running, production]
sr-due: 2026-05-31
sr-interval: 1
sr-ease: 250
---

# Long-Running Agent Architecture — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:7cb80d -->
What is long-running agent architecture?
?
A systems design pattern for building AI agents that execute reliably over hours, days, or weeks by combining three pillars: a durable state machine (explicit workflow tracking), persistent session storage (checkpoint-resume across process deaths), and event-driven dormancy (zero-cost waiting between active steps).

## Three Pillars <!-- kb:card:15ab1f -->
Name and briefly describe the three pillars of long-running agent architecture.
?
1. **Durable state machine** — named checkpoints replace conversation history for progress tracking; state injected into system prompt
2. **Persistent sessions (checkpoint-resume)** — session state written to a database so process death doesn't lose in-flight workflows
3. **Event-driven dormancy** — agent genuinely sleeps between steps; external webhooks trigger resumption when events complete

## When to Apply <!-- kb:card:a28b83 -->
When is long-running agent architecture justified vs. over-engineered?
?
Justified when: workflow duration exceeds a single HTTP request lifetime, idle periods make polling impractical, process death would be unacceptable, or multiple external systems must be coordinated over time. Over-engineered for sessions completing in minutes with no human-in-the-loop gates.

## Idle Profile <!-- kb:card:506e11 -->
What does "idle-dominant workflow" mean and why does it matter?
?
An idle-dominant workflow spends most of its elapsed time waiting — e.g., 13 of 14 days in an onboarding run. Standard stateless agents try to "stay alive" during this time, which is wasteful. Long-running architecture assumes idle periods are the norm and makes them free, scaling infrastructure to zero during waits.

## Relationship to Conversational Agents <!-- kb:card:dd1f93 -->
How does long-running agent architecture fundamentally differ from standard conversational agents?
?
Conversational agents track state implicitly via conversation history (the transcript *is* the state). Long-running architecture makes state *explicit* (named checkpoints in a database), separates it from the process lifetime, and adds webhook-based wake mechanisms. The LLM is only invoked during active steps, not to reconstruct history.

## Real-World Example <!-- kb:card:c310d8 -->
Describe the Google ADK HR onboarding agent as an example of this architecture.
?
A 5-step workflow (START → WELCOME_SENT → DOCUMENTS_SIGNED → IT_PROVISIONED → HARDWARE_DELIVERED → COMPLETED) with ~13 days of idle time. State machine tracks exact step in SQLite; webhooks from the e-sign platform and courier fire when contracts are signed / hardware delivered; agent wakes, advances state machine via `state_delta`, and executes the next step. Container scales to zero during all idle periods.
