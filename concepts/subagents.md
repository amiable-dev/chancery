---
title: "Subagents"
date: 2026-06-23
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [multi-agent, orchestration, patterns]
tags: [concept, ai-agents, architecture, multi-agent, orchestration, patterns, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/orchestration, topic/patterns]
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
  - url: https://www.anthropic.com/research/building-effective-agents
    hash: sha256:a1f2257ff438964f64caa04bbfd0b5cc1f93f3236202a67412a5990369e3433a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Subagents

## Definition

A **subagent** is a child agent instance spawned by a parent agent (or orchestrator) to handle a scoped subtask. Each subagent starts with a **fresh context window** — isolated from the parent's conversation history — receiving only a compact task brief. This isolation is the primary mechanism for managing context accumulation in long-running or wide-scope agent work.

## Explanation

Long tasks that run in a single agent accumulate context across every tool call. After dozens of iterations, [[context-rot]] degrades reasoning quality, and the context window approaches its hard limit. Subagents solve this by distributing work across isolated child sessions.

**Why fresh context windows matter:**
- The child has zero contamination from the parent's accumulated history
- The child's attention is fully focused on its scoped task, not cluttered by unrelated prior turns
- If the child fails, the parent's context is unaffected — the parent can retry with a different approach
- Children can run in parallel, each with an independent fresh context (map-reduce fan-out)

**The handoff constraint:**  
The parent must communicate the task to the child via a [[agent-handoffs|handoff]] — typically the subagent's task prompt. The discipline: **if the parent has to pass more than a few paragraphs, the split between parent and child is probably wrong.** Over-verbose task prompts indicate the subtask is too tightly coupled to the parent's accumulated context.

**Subagent taxonomy:**
- **Isolated** — completely fresh session, no shared history with parent. Default for most spawned work.
- **Forked** — inherits the parent's conversation history up to the spawn point. Higher context cost, higher coupling. Use only when the child genuinely needs prior conversation context.
- **Named session** — persisted session with a stable key. Useful for long-running background workers that need to maintain their own state across multiple jobs.

**Orchestration patterns using subagents:**
- **Planner/Executor:** Parent plans the work, passes a task file to a child executor subagent. Keeps planning and execution in separate context windows, each optimised for their role.
- **Map-Reduce:** Parent fans out to N subagents with N different scoped tasks (e.g., one per file in a PR). Subagents run in parallel; parent merges results. Wall-clock time bounded by longest individual child.
- **Router/Specialist:** A lightweight routing agent dispatches work to specialist subagents (security reviewer, test writer, docs updater). Each specialist has a smaller context, tighter system prompt, often smaller/cheaper model.

**Context isolation and state coordination:**
Since subagents have isolated context windows, any shared data must live in [[agent-state|external state]] (files, databases, shared memory). The parent typically names output files in the task brief; the child writes to them; the parent reads them after the child completes.

**In OpenClaw:**
`sessions_spawn(task="...")` creates an isolated subagent. The `task` string is the handoff. `context="fork"` inherits the parent's transcript — use only when genuinely needed. `mode="run"` for one-shot background work. The parent uses `sessions_yield` to wait for completion events rather than polling.

## Key Properties

- **Fresh context** — every subagent starts with zero inherited conversation history by default
- **Scoped** — receives only what it needs for its subtask, not the full parent context
- **Parallel-safe** — multiple subagents can run simultaneously without context interference
- **Fail-isolated** — child failures don't corrupt the parent's context
- **Composition primitive** — the building block for Planner/Executor, Map-Reduce, and Router/Specialist patterns

## Relationships

- Implements [[multi-agent-systems]] orchestration patterns: Planner/Executor, Map-Reduce, and Router/Specialist all use subagents
- Requires [[agent-handoffs]]: the parent-to-child task brief is a handoff; its quality determines the child's output quality
- Manages [[context-rot]]: splitting long work across subagents keeps each context window lean
- Operates over [[agent-state]]: subagents share external state (files, DBs) but have isolated context windows; shared file writes need coordination
- Related to [[agent-attestation-standards]]: in regulated environments, each subagent's actions may need to be attested independently
- Related to [[agent-budget-caps]]: in systems with per-agent token budgets, subagents are isolated budget units

## Applications

- **Large codebase refactor:** Parent agent reads `PLAN.md`, identifies 20 files to refactor, spawns one subagent per file in parallel. Each child has a 200-line task brief and touches only its assigned file. Parent merges PRs after all children complete.
- **Research pipeline:** Parent receives a broad research question, decomposes into 5 sub-questions, spawns 5 search subagents in parallel, synthesises their `sources.json` outputs into a final report.
- **Continuous background worker:** A named session subagent processes a queue of jobs; the parent dispatches tasks and checks results asynchronously.
- **Specialist dispatch:** A lightweight router reads a request, classifies it as "security review" or "performance review", and spawns the appropriate specialist subagent with a curated system prompt for that domain.

## Sources

- [Agentic Engineering (System Design Newsletter)](https://newsletter.systemdesign.one/p/agentic-engineering) — "Subagents" section; "fresh context window per child, parent passes only what it needs"
- [30 Core Agentic Engineering Concepts Every Developer Should Know](https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69) — subagents in the orchestration layer
- [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — multi-agent orchestration patterns

## See Also

- [[multi-agent-systems]]
- [[agent-handoffs]]
- [[agent-state]]
- [[context-rot]]
- [[react-agent-pattern]]
- [[agent-budget-caps]]
