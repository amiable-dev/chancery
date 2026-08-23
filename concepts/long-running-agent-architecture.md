---
title: "Long-Running Agent Architecture"
date: 2026-05-31
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, orchestration]
tags: [concept, ai-agents, architecture, patterns, infrastructure, long-running, production, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/orchestration]
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

# Long-Running Agent Architecture

## Definition
Long-running agent architecture is a systems design pattern for building AI agents that execute reliably over hours, days, or weeks — surviving infrastructure restarts, arbitrary idle periods, and multi-step handoffs — by combining three interlocking pillars: a durable state machine for explicit workflow tracking, persistent session storage for checkpoint-resume across process deaths, and event-driven dormancy for zero-cost waiting between active steps.

## Explanation
The standard conversational agent pattern — append every turn to a growing context, feed the whole blob back to the LLM — is optimised for sessions that complete in minutes. Enterprise workflows don't fit this mould. Consider:

- **HR onboarding**: 2 weeks, 5 active steps, ~13 days of idle waiting
- **Invoice dispute resolution**: days to weeks, waiting on vendor replies and AP routing
- **Sales prospecting sequences**: weeks, waiting between outreach touchpoints

These processes share a structure: short bursts of active work separated by long idle periods, human approval gates, and cross-system handoffs. A stateless chatbot fails all three failure modes when applied here (see [[durable-agent-state-machine]] for the full breakdown).

**The three architectural pillars:**

### Pillar 1: Durable State Machine
Replace conversation-history-based progress tracking with an explicit, named-checkpoint state schema. The agent's current step is stored as structured data (e.g., `current_step = "DOCUMENTS_SIGNED"`), injected into the system prompt at each inference call. The model reads its status directly from the prompt — no reconstruction from history required. Tool calls advance the machine atomically.

→ See [[durable-agent-state-machine]]

### Pillar 2: Persistent Sessions (Checkpoint-Resume)
State machine checkpoints are only durable if they survive process death. The session service writes every `ToolContext.state` update to a database (SQLite in dev, Cloud SQL in prod) before returning. Containerised environments can cold-start, scale to zero, or restart without corrupting in-flight workflows. The session is hydrated from the database on reconnect.

→ See [[agent-checkpoint-resume]]

### Pillar 3: Event-Driven Dormancy
During idle periods, the agent genuinely sleeps — no polling, no blocked threads. External systems trigger resumption via webhook. The webhook endpoint hydrates the session, applies a `state_delta` (advancing the state machine), and wakes the agent programmatically. The container may have been completely absent during the dormancy period; the workflow is unaffected.

→ See [[event-driven-dormancy]]

### Optional Pillar: Multi-Agent Delegation
For complex workflows, a coordinator agent delegates domain-specific sub-tasks to specialised sub-agents (IT provisioning, compliance checks, etc.). This keeps each agent's context focused and its reasoning clean. The coordinator's state machine records sub-agent handoffs as checkpoints.

→ See [[multi-agent-systems]]

**Reference architecture (Google ADK HR Onboarding):**
```
External System         Agent Process           Persistent Store
(e-sign, courier)       (Cloud Run)             (Cloud SQL)
       │                      │                      │
       │  webhook fire        │                      │
       ├─────────────────────►│                      │
       │                      │  hydrate session     │
       │                      ├─────────────────────►│
       │                      │◄─────────────────────┤
       │                      │  apply state_delta   │
       │                      │  run_async(...)      │
       │                      │  write checkpoint    │
       │                      ├─────────────────────►│
       │                      │  scale to zero       │
       │                      │  (idle period)       │
```

**When to use this pattern:**
The architecture adds complexity (webhook infrastructure, database dependency, state schema design). It's justified when:
- Workflow duration exceeds a single HTTP request lifetime
- Idle periods make active polling or blocking impractical
- Process death during workflow execution is unacceptable
- Multiple external systems must be coordinated

**Framework support:** Google ADK provides `DatabaseSessionService`, `ToolContext.state`, `state_delta`, and the `Runner` resumption API as first-class primitives. Similar patterns can be built on LangGraph (persistent checkpointers), Temporal (durable execution), or OpenClaw's own isolated session + cron + webhook patterns.

## Key Properties
- **Idle-dominant workflows supported** — 95% idle, 5% active is a perfectly valid profile
- **Infrastructure-transparent** — cold starts, container restarts, scale-to-zero are invisible to workflow correctness
- **Explicit over implicit** — progress is queryable structured data, not hidden in conversation tokens
- **Composable** — the three pillars are independently useful but most powerful in combination
- **Auditable** — each checkpoint is a timestamped record; full workflow history is queryable from the database

## Relationships
- Built from [[durable-agent-state-machine]] + [[agent-checkpoint-resume]] + [[event-driven-dormancy]]
- Often combined with [[multi-agent-systems]] for complex sub-task delegation
- Directly addresses [[context-rot]]: by eliminating conversation-history-based tracking
- Related to [[agentic-ai-platform-architecture]]: the long-running pattern is a key component of enterprise-grade agent platforms
- Contrast with [[agent-harness]]: a harness defines the execution envelope; long-running architecture defines the persistence and resumption strategy within it
- Enabled by [[agent-to-agent-protocol]] when sub-agents span different systems or organisations

## Applications
- **Enterprise process automation** — any multi-day workflow currently handled by humans via email chains and ticket queues
- **Approval-gated pipelines** — compliance, legal review, procurement workflows with [[human-in-the-loop-pattern|human-in-the-loop]] gates
- **Cross-system orchestration** — workflows that must coordinate 3+ SaaS systems, each with its own event timeline
- **Background agent services** — agents that run continuously as business process monitors, not just one-shot assistants
- **OpenClaw / self-healing parallels** — OpenClaw's own isolated session + cron + webhook patterns implement this architecture for task flows

## Sources
- [Build Long-Running AI Agents That Pause, Resume, and Never Lose Context with ADK](https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/) — Google ADK tutorial; HR onboarding coordinator worked example covering all three pillars
- [Google ADK GitHub](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/agents/adk/new-hire-onboarding) — complete source code

## See Also
- [[durable-agent-state-machine]]
- [[event-driven-dormancy]]
- [[agent-checkpoint-resume]]
- [[multi-agent-systems]]
- [[context-rot]]
- [[agentic-ai-platform-architecture]]
- [[agent-harness]]
