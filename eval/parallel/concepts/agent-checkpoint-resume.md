---
title: Checkpoint-and-resume agents
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: vendor-doc
tags: [concept, ai-agents, architecture, reliability, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/
    hash: sha256:c71be0b8db2abdbf5f6dad012142dbc2b8b812ebecc05f9a910be08fe53f245f
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Checkpoint-and-resume agents

## Definition

**Checkpoint-and-resume** is an architecture for agents that run workflows spanning days or weeks: the agent's position lives in an explicit, durably persisted state machine rather than in accumulated conversation history — the current state is injected into the system prompt on every call, each tool call atomically advances the state and thereby records a checkpoint, and external events wake the dormant agent by applying a state transition before its next inference — so the process can pause indefinitely, survive restarts and scale-to-zero, and resume exactly where it stopped without replaying its past.

## Explanation

The failure it answers is specific: over a multi-day workflow, the stateless pattern of replaying an ever-growing conversation history breaks three ways — the history pollutes the prompt until the model loses track of its current step, token cost grows with every replayed turn, and after a days-long pause the model hallucinates intermediate steps, remembering approvals that were never given. Checkpoint-and-resume removes conversation history as the source of truth. A small closed set of named workflow states is defined up front; the current state and its associated details are template-injected into the system prompt at every inference, so the model reads its position instead of inferring it; each tool call writes the next state atomically, making every action a checkpoint; and session state lives in a database rather than process memory, so a crash, restart, or scale-to-zero costs nothing. Idle time is handled by sleeping rather than polling: when a real-world event completes, a webhook hydrates the persisted session and applies an atomic state delta before the model's next call, so the agent wakes already knowing the transition happened. The source is a Google Developers Blog tutorial demonstrating the pattern on ADK with complete runnable code — a vendor piece, but the architecture (explicit state, checkpointing transitions, event-driven wake) transfers to any framework with persistent sessions.

## Key Properties

- Workflow position is an explicit state schema read from session state, never inferred from chat history
- Tool calls double as atomic checkpoints, so a crash after any action resumes from the written state
- Session state persists in a database, letting containers restart or scale to zero through idle gaps
- External events wake the agent via webhooks that apply a state delta atomically before the next model call, replacing polling and blocked threads
- Targets three stateless failure modes: prompt context pollution, token-cost explosion, and hallucinated steps on resume

## Relationships

- [[subagent-delegation]] — the persisted state machine is the shared ground that lets a coordinator hand work to sub-agents mid-workflow and absorb their results
- [[preseeded-state-evals]] — makes those evals possible — only explicit persisted state can be seeded to an arbitrary checkpoint, where chat-history state would demand replaying the whole transcript
- [[context-layer]] — both reject accumulate-and-replay as a context strategy — the context layer composes retrieved knowledge per query, checkpoint-and-resume injects explicit workflow state per call
- [[agent-state-residence]] — checkpoint-and-resume is the concrete architecture behind state residence's second pole — a durably persisted state machine injected into the prompt each call is what 'held behind a session identifier' looks like in practice.
- [[state-authoritative-agent-ui]] — checkpoint-and-resume is exactly the backend architecture the state-authoritative UI pattern is built around — the durable state transition performed on each external event is the same commit the interface waits for before it will render anything.

## Applications

Workflow agents with human-in-the-loop pauses or multi-day timelines — HR onboarding, invoice disputes, procurement approvals, sales sequences — that must survive restarts and idle gaps of days; also the architecture to reach for when a bigger context window is being proposed as the fix for a long-running process.

## Sources

- https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/

## See Also

- [[subagent-delegation]]
- [[preseeded-state-evals]]
