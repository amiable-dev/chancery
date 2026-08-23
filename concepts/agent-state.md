---
title: "Agent State"
date: 2026-06-23
domain: ai-agents
maturity: established
source_type: practitioner
topics: [memory, context-engineering]
tags: [concept, ai-agents, architecture, memory, context-window, state, domain/ai-agents, maturity/established, source-type/practitioner, topic/memory, topic/context-engineering]
status: draft
sources:
  - url: https://newsletter.systemdesign.one/p/agentic-engineering
    hash: sha256:4348e1666b2fd47113aea3b3b5bceb8dfcaf370266ef152e866b36e38742d0d4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69
    hash: sha256:f041e2f6202d4dad79856cbe698f460cc51ae46eb6d8b13a8a4353d5a638e51e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent State

## Definition

The totality of information an agent can reason over or retrieve, split into two structurally different halves: the **context window** (what the model sees right now — ephemeral, hard-capped by token limit) and **external state** (persistent data outside the model — files, databases, memory systems — fetched on demand).

## Explanation

Every agent operates with a fundamental split in where information lives:

**Context window (in-context state)**
- Everything the model can see *right now*: system prompt, conversation history, prior tool results, loaded skills
- Has a hard ceiling (the model's token limit) and a soft ceiling ([[context-rot]]: performance degrades as context fills)
- When the session ends, the context window is gone — no persistence across sessions without explicit memory mechanisms
- Each new tool result is appended to the context, so the context grows with each iteration of the [[react-agent-pattern|agent loop]]

**External state (out-of-context state)**
- Everything the model cannot see until the agent fetches it: files on disk, database entries, vector memory, prior session transcripts, knowledge bases
- Survives session endings; can be indexed, searched, versioned
- The agent must explicitly pull pieces into the context window before the model can reason over them
- Shared across agents (but requires coordination — two agents writing the same file is the canonical race condition)

**Choosing where state lives** is one of the most important decisions in agent design:

| State type | When to use |
|-----------|-------------|
| **Files** | Default. Diffable, versionable, easy for both agent and human to read/edit. Use for working artifacts, plans, scratch pads, outputs |
| **Memory (vector/KV)** | Facts that should survive across sessions but don't need git history. User preferences, learned patterns, cross-session context |
| **Database** | When state must be queried by structure, shared across multiple processes, or at scale |
| **Context window only** | Purely ephemeral data: intermediate reasoning, tool call arguments, data that's only meaningful for this session |

**State in multi-agent settings:**
Multiple agents reading the same file is fine. Multiple agents writing to it is a race condition. Solutions include git worktrees (each agent gets its own working copy) or explicit coordination protocols. Child [[subagents]] receive a fresh context window with only what the parent passes — if the parent must pass more than a few paragraphs, the agent split is probably wrong.

## Key Properties

- **Bifurcated** — agent state is always split between in-context (ephemeral) and external (persistent) halves
- **Hard-bounded** — the context window has a hard token ceiling that cannot be exceeded
- **Performance-degrading** — model performance drops as context fills; more context ≠ better reasoning (see [[context-rot]])
- **Fetch-on-demand** — external state is never automatically in scope; the agent must actively retrieve it
- **Shared** — external state can be read by multiple agents simultaneously, but writes require coordination

## Relationships

- Directly shapes [[react-agent-pattern]]: each Observe phase appends tool results to context, growing the in-context state
- Root cause of [[context-rot]]: as in-context state accumulates, model attention quality degrades
- Related to [[durable-agent-state-machine]]: long-running agents replace implicit conversational state tracking with explicit named checkpoints persisted externally
- Related to [[agent-harness]]: the harness manages the context window lifecycle, appending tool results and truncating when needed
- Enables [[subagents]]: spawning a child with a fresh context window is the primary tool for managing state accumulation in long tasks
- Connected to [[agent-session-distillation]]: extracting structured knowledge from a completed session's state into persistent external memory
- [[external-state-as-loop-substrate]] — persists only within a run; durable learning across runs needs an external substrate instead

## Applications

- **Debugging context window overflow:** When an agent starts losing track of earlier work, the context is saturating. Solution: distil to external state (files/memory) and spawn a fresh subagent with a compact briefing.
- **Cross-session continuity:** Implement long-term memory by periodically writing key facts from the context window to files/vector DB. Future sessions start fresh but can fetch relevant context.
- **Parallel agent coordination:** Give each parallel agent a dedicated working directory (git worktree or isolated namespace) so they can write external state without conflicts.
- **OpenClaw pattern:** `MEMORY.md` + `memory/YYYY-MM-DD.md` files are the external state. Skills are fetched on demand. The context window is kept lean by using skills instead of always-loaded instructions.

## Sources

- [Agentic Engineering (System Design Newsletter)](https://newsletter.systemdesign.one/p/agentic-engineering) — "State" section; defines context window vs. external state dichotomy
- [30 Core Agentic Engineering Concepts Every Developer Should Know](https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69) — concept taxonomy overview

## See Also

- [[react-agent-pattern]]
- [[context-rot]]
- [[durable-agent-state-machine]]
- [[agent-harness]]
- [[subagents]]
- [[agent-session-distillation]]
- [[agent-memory-lock-in]]
- [[agent-checkpoint-resume]]
