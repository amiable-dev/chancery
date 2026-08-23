---
tags: [flashcards, ai-agents, infrastructure, persistence, resilience, long-running]
sr-due: 2026-05-31
sr-interval: 1
sr-ease: 250
---

# Agent Checkpoint-Resume — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:ceb1bc -->
What is agent checkpoint-resume?
?
The infrastructure capability allowing an AI agent to save complete execution state to durable storage at each workflow step (checkpoint) and later restore that state to resume execution exactly where it paused — surviving container restarts, cold starts, crashes, and arbitrary idle periods without loss of progress.

## Problem <!-- kb:card:17d2b1 -->
Why is in-memory session state insufficient for long-running agents in cloud environments?
?
Containerised environments (Cloud Run, serverless, Kubernetes) are ephemeral: processes can be killed by the scheduler, restart after crashes, and scale to zero during idle periods. Any in-memory state — including conversation history — is lost when the process dies. For workflows spanning days or weeks, this is a critical reliability failure.

## Mechanism <!-- kb:card:b53f8f -->
How does ADK's DatabaseSessionService provide checkpoint-resume?
?
Every `ToolContext.state` write is automatically persisted to a configured database (SQLite or Cloud SQL). It's a single configuration change: pass a `session_service_uri` to `get_fast_api_app`. Kill the server, restart it, load the session ID — the agent resumes from the last checkpoint with all state intact.

## Atomicity <!-- kb:card:c87827 -->
Why must checkpoint writes be atomic?
?
To prevent partial state corruption. If a tool updates new hire details but crashes before updating `current_step`, the next run would see inconsistent state. Atomic writes ensure either the full checkpoint is saved or nothing is — guaranteeing a consistent state to resume from.

## Scaling <!-- kb:card:cfbce5 -->
What changes when scaling from SQLite to production?
?
Replace the SQLite URI with a Cloud SQL (PostgreSQL) connection string — the API is identical. Cloud SQL is required for horizontal scaling where multiple agent processes must share session state. SQLite only works for single-process/single-host deployments.

## Relationship <!-- kb:card:0d7dac -->
How does checkpoint-resume differ from agent session distillation?
?
Checkpoint-resume keeps *in-progress* sessions alive across process deaths — it's about durability of ongoing work. Session distillation mines *completed* sessions for reusable knowledge (skills, patterns) — it's about learning from finished work. Both treat session data as a first-class asset, but at different lifecycle stages.
