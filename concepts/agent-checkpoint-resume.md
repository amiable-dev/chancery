---
title: "Agent Checkpoint-Resume"
date: 2026-05-31
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns]
tags: [concept, ai-agents, architecture, infrastructure, persistence, resilience, long-running, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns]
status: draft
sources:
  - url: https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/
    hash: sha256:c71be0b8db2abdbf5f6dad012142dbc2b8b812ebecc05f9a910be08fe53f245f
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/GoogleCloudPlatform/generative-ai/tree/main/agents/adk/new-hire-onboarding
    hash: sha256:f49c7bfe31dd6f5fa6dc4a026178734188583098aebf71e823b8539c1263e04b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Checkpoint-Resume

## Definition
Agent checkpoint-resume is the infrastructure capability that allows an AI agent to save its complete execution state to durable storage at each significant workflow step (checkpoint), and later restore that state from storage to resume execution exactly where it paused — surviving container restarts, cold starts, crashes, and arbitrary idle periods without any loss of progress or context.

## Explanation
In containerised, cloud-native environments (Cloud Run, Kubernetes, serverless), the processes running agents are ephemeral: they can be killed by the scheduler, restart after crashes, scale to zero during idle periods, and cold-start on the next request. Any in-memory state — including agent conversation history — is lost when the process dies.

For short-lived agents this is acceptable; each session is reconstructed from a fresh user prompt. For long-running agents spanning hours, days, or weeks, process mortality is a critical reliability problem.

**The checkpoint-resume pattern solves this by separating [[agent-state|agent state]] from process lifetime:**

1. **Checkpoints** — at each significant workflow transition (tool call, state machine advance), the agent writes its full session state to a persistent store. The write happens *before* the operation is considered complete, so a crash immediately after cannot lose progress.

2. **Durable store** — session data lives in a database outside the container: SQLite for development/single-host deployments, Cloud SQL (PostgreSQL) for production. The store is the system of record.

3. **Resume on reconnect** — when a new request arrives (user turn, webhook, timer), the session service loads the persisted state into a fresh process. The agent resumes from the last checkpoint with full context: current workflow step, accumulated data, pending signals.

**ADK implementation:** The `DatabaseSessionService` replaces the default in-memory `InMemorySessionService` with a single configuration change:
```python
# In-memory (fragile):
# app = get_fast_api_app(agents_dir=AGENT_DIR)

# Checkpoint-resume (durable):
session_service_uri = "sqlite+aiosqlite:///sessions.db"
app = get_fast_api_app(
    agents_dir=AGENT_DIR,
    session_service_uri=session_service_uri,
)
```
Every `ToolContext.state` write is automatically persisted. Kill the server, restart it, load the session ID — the agent continues from `WELCOME_SENT` with the new hire's name, email, and start date intact.

**Atomic writes:** The checkpoint write is atomic — it either completes fully or doesn't happen. This prevents partial state (e.g., new hire details written but `current_step` not updated) from corrupting future runs.

**State delta on resume:** When an [[event-driven-dormancy]] webhook fires, the `state_delta` parameter applies a state transition atomically at the moment the session is hydrated. The resuming agent sees the *post-transition* state immediately; it doesn't need to re-examine what triggered the wake.

**Production considerations:**
- **SQLite** is sufficient for single-process, single-node deployments or development
- **Cloud SQL / PostgreSQL** is required when multiple agent processes serve the same sessions (horizontal scaling)
- Session IDs must be durable client-side too — the caller must retain the session ID to reconnect after an idle period
- TTL/cleanup policies prevent abandoned session accumulation

## Key Properties
- **Survival of process death** — state outlives the process; crashes and restarts are transparent to workflow progress
- **Atomic writes** — each checkpoint is written fully or not at all; no partial state corruption
- **Storage-backed, not memory-backed** — state lives in the database, not in process heap
- **Transparent to agent logic** — agent code writes to `ToolContext.state` normally; persistence is handled by the session service layer
- **Scalable** — session state can be shared across horizontally-scaled agent instances reading from the same database

## Relationships
- Required by [[durable-agent-state-machine]]: the state machine's checkpoints are only durable if the storage layer survives restarts
- Required by [[event-driven-dormancy]]: the dormancy pattern relies on session state persisting through the idle period
- Part of [[long-running-agent-architecture]]: the reliability infrastructure that makes the overall pattern production-grade
- Related to [[agent-session-distillation]]: session distillation mines *completed* sessions for reusable knowledge; checkpoint-resume keeps *in-progress* sessions alive
- Related to [[context-compaction]]: both address the cost of long-running agent contexts, but via different mechanisms — compaction reduces token volume; checkpoint-resume ensures durability

## Applications
- **Any long-running agent workflow** — the default choice whenever an agent process might be killed before workflow completion
- **Containerised/serverless deployments** — essential when the runtime scales to zero between agent turns (Cloud Run, Lambda, Fly.io)
- **Multi-user agent platforms** — multiple users each have their own persistent session; the session service handles concurrent access
- **Recovery from deployment updates** — rolling deploys kill existing processes; checkpoint-resume ensures in-flight workflows continue on new instances
- **Audit and forensics** — persisted checkpoints provide a complete record of agent state at every workflow step

## Sources
- [Build Long-Running AI Agents That Pause, Resume, and Never Lose Context with ADK](https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/) — Google ADK tutorial; DatabaseSessionService implementation details
- [Google ADK GitHub](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/agents/adk/new-hire-onboarding) — complete source code

## See Also
- [[durable-agent-state-machine]]
- [[event-driven-dormancy]]
- [[long-running-agent-architecture]]
- [[agent-session-distillation]]
- [[context-compaction]]
- [[environment-fork-primitive]]: extends single-timeline resume into many independent timelines forking from one saved state
- [[claim-check-pattern]]: checkpoints inherit the same exposure as durable workflow orchestrators — whatever gets checkpointed is durably retained, so sensitive payloads need to be offloaded to your own store with only a reference checkpointed
