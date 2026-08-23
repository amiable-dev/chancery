---
tags: [flashcards, ai-agents, architecture, multi-agent, orchestration]
sr-due: 2026-06-23
sr-interval: 1
sr-ease: 250
---

# Subagents — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:5aa103 -->
What is a subagent?
?
A child agent instance spawned by a parent agent (or orchestrator) to handle a scoped subtask. Each subagent starts with a **fresh context window** — isolated from the parent's conversation history — receiving only a compact task brief. Fresh context is the primary mechanism for managing context accumulation in long-running agent work.

## The handoff constraint <!-- kb:card:ded272 -->
What is the "few paragraphs" rule for subagent task briefs?
?
If the parent must pass **more than a few paragraphs** to give the child enough context to proceed, the agent split is probably wrong. Verbose task briefs indicate the subtask is too tightly coupled to the parent's accumulated context — the decomposition should be redesigned.

## Context types <!-- kb:card:111b2d -->
What are the three subagent context types and when should you use each?
?
- **Isolated** (default) — completely fresh session, no shared history. Use for the vast majority of spawned work.
- **Forked** — inherits parent's conversation history up to spawn point. Use only when the child genuinely needs prior conversation context. Higher cost and coupling.
- **Named session** — persisted session with a stable key. Use for long-running background workers that maintain state across multiple jobs.

## Orchestration patterns <!-- kb:card:9d489c -->
What three multi-agent patterns rely on subagents?
?
1. **Planner/Executor** — parent plans, passes task file to child executor; keeps planning and execution in separate context windows
2. **Map-Reduce** — parent fans out to N parallel subagents with N scoped tasks; merges results after all children complete
3. **Router/Specialist** — lightweight router dispatches work to specialist subagents with curated prompts and smaller/cheaper models

## State sharing <!-- kb:card:623c2a -->
How do subagents share data with the parent or each other?
?
Subagents cannot see each other's context windows. Shared data must live in **external state** (files, databases). The parent typically names output paths in the task brief; children write there; parent reads after completion. This is why output file paths must be specified in the handoff.
