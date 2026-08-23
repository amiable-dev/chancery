---
title: "Event-Driven Dormancy"
date: 2026-05-31
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, cost-control, orchestration]
tags: [concept, ai-agents, architecture, patterns, webhooks, long-running, event-driven, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/cost-control, topic/orchestration]
status: draft
sources:
  - url: https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/
    hash: sha256:c71be0b8db2abdbf5f6dad012142dbc2b8b812ebecc05f9a910be08fe53f245f
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Event-Driven Dormancy

## Definition
Event-driven dormancy is an architectural pattern for long-running agents in which the agent genuinely suspends execution during idle periods and resumes only when an external event (delivered via webhook or message queue) signals that the next step can proceed — eliminating active polling, blocked threads, and wasted inference calls during waits.

## Explanation
Long-running workflows have a defining characteristic: most of their elapsed time is *idle time*. An HR onboarding process might span two weeks, with 95% of that time spent waiting — waiting for a contract to be signed, a laptop to ship, an approval to be granted. The challenge is: how does an agent handle that waiting period?

**Three naive approaches and why they fail:**

1. **Active polling** — the agent periodically calls a status API ("has the document been signed yet?"). Wastes compute, burns tokens, and costs money for zero productive work. Also scales poorly: 100 active onboarding runs means 100 agents all polling simultaneously.

2. **Blocked threads** — the agent process stays alive, sleeping with `time.sleep()`. Doesn't scale in containerised environments (Cloud Run, etc.) that scale to zero, cold-start on traffic, and restart unexpectedly.

3. **Rehydrated from history** — the agent is re-run from scratch on a timer, replaying the full conversation history. Falls into [[context-rot]] and idle-time hallucination problems.

**Event-driven dormancy does none of these.** Instead:
1. After advancing to a waiting checkpoint, the agent returns control to the framework. The container may scale to zero or restart freely.
2. External systems (e-signature platforms, shipping providers, approval workflows) are configured to POST to a webhook endpoint when their event completes.
3. When the webhook fires, the endpoint hydrates the persisted session, applies a `state_delta` (advancing the state machine to the next checkpoint), and calls `runner.run_async` — waking the agent with its exact context intact.

**ADK implementation sketch:**
```python
# Webhook endpoint (FastAPI)
@app.post("/webhooks/document_signed")
async def trigger_document_signed(payload: WebhookPayload):
    await resume_handler.receive_signed_documents_callback(
        user_id=payload.user_id,
        session_id=payload.session_id
    )
    return {"status": "success"}

# Resume handler — applies state delta and wakes agent
async def receive_signed_documents_callback(self, user_id, session_id):
    async for event in self.runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=types.Content(role="user", parts=[...]),
        state_delta={
            "current_step": OnboardingStep.DOCUMENTS_SIGNED,
            "pending_signals": [],
        },
    ):
        logger.info(event)
```

The `state_delta` parameter is the key mechanism: it atomically transitions the state machine *before* the agent's next inference call, so the model sees the correct `current_step` in its system prompt immediately upon waking.

**What "truly sleeping" means:** Between the webhook registrations, there are no running processes, no scheduled polling jobs, no held connections. Infrastructure can cold-start and the workflow continues correctly because all state is in the database, not in-process memory.

## Key Properties
- **Zero-cost idle time** — no compute consumed while the agent waits; infrastructure can scale to zero
- **Push-based wake** — external systems drive resumption; the agent doesn't know or care how long it was dormant
- **Atomic state transition on wake** — `state_delta` ensures the agent sees the correct checkpoint before its first inference call after resuming
- **Decoupled from chat history** — resumption doesn't require replaying old conversation; the current state is sufficient
- **Scalable** — N concurrent dormant workflows cost O(storage), not O(N * polling_interval * compute)

## Relationships
- Requires [[durable-agent-state-machine]]: dormancy is only safe if the agent has a persistent state checkpoint to resume from
- Requires [[agent-checkpoint-resume]]: the session must survive the dormancy period in durable storage
- Part of [[long-running-agent-architecture]]: the "wait" mechanism that makes multi-week agents practical
- Contrast with polling-based patterns: [[approval-fatigue]] describes the human equivalent of constant check-ins; event-driven dormancy is the machine-side solution
- Related to event-driven architecture broadly: same push/pull inversion as event queues, pub/sub, and reactive systems

## Applications
- **Document signature gates** — agent pauses after sending contract links; resumes when e-signature platform POSTs completion
- **Shipping/logistics waits** — agent idles after ordering hardware; courier webhook triggers resumption on delivery scan
- **Human approval gates** — agent submits request to approval system; approval platform webhooks resume the workflow
- **Inter-system orchestration** — any workflow that spans multiple external SaaS tools, each firing webhooks on completion
- **Scheduled resumption** — same pattern works with scheduled events (cron webhooks) for time-based wake-ups without polling

## Sources
- [Build Long-Running AI Agents That Pause, Resume, and Never Lose Context with ADK](https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/) — Google ADK tutorial; primary source for this pattern

## See Also
- [[durable-agent-state-machine]]
- [[agent-checkpoint-resume]]
- [[long-running-agent-architecture]]
- [[approval-fatigue]]
- [[context-rot]]
- [[agent-sse-event-stream]]: SSE events are the trigger mechanism for waking dormant environment workers in managed agent systems
- [[idle-cost-sandbox-design]]: same idle-waste economics applied at the infrastructure layer instead of the orchestration layer
