---
title: "Agentic Note-Taking"
date: 2026-04-29
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [memory, context-engineering]
tags: [concept, ai-agents, llm, memory, context, long-horizon, architecture, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/memory, topic/context-engineering]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: http://anthropic.com/news/context-management
    hash: sha256:babb41eae2c42a22feaaa24fea22b66a7c7845e6698868c8b19c3f78e198e21d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agentic Note-Taking

## Definition
**Agentic note-taking** (also called structured note-taking or agentic memory) is a technique where an AI agent proactively writes structured notes to persistent external memory during task execution, then reads those notes back into context in future inference steps — enabling coherent, goal-directed behaviour across context window boundaries without relying on full context preservation.

## Explanation
When an agent runs a long task, it can't keep all prior state in a single context window indefinitely. Compaction can summarise what's happened, but that summary is still bounded by the next context window. Agentic note-taking breaks the dependency on in-context memory entirely: the agent maintains its own external "working notes" that persist across context resets.

This is exactly how effective humans work on long projects — they don't rely on memory alone. They maintain to-do lists, project notes, decision logs, and scratch pads. The notes serve as an externalised working memory that can be consulted at any point.

### What agents write to notes
- **Progress state:** What has been completed, what is in progress, what is blocked
- **Decision log:** Key decisions made and the reasoning behind them (prevents re-litigating the same decision later)
- **Dependency tracking:** What other pieces of work are waiting on the current task
- **Discovered information:** Key facts found during exploration that will be needed later
- **Tactical strategies:** What approaches work/don't work in the current environment

### Example: Claude plays Pokémon
Anthropic's Claude playing Pokémon demonstrates the power of agentic note-taking in a non-coding context. Without any explicit prompting about memory structure, the agent spontaneously developed:
- Precise step tallies: *"For the last 1,234 steps I've been training in Route 1; Pikachu has gained 8 levels toward the target of 10"*
- Maps of explored regions
- Combat strategy notes tracking which attacks work against which opponents
- Objective checklists for gym badges and key items

After context resets, the agent read its own notes and seamlessly continued multi-hour training sequences. This coherence across summarisation steps enabled long-horizon strategies that would have been impossible with in-context memory alone.

### Common note formats
- `NOTES.md` / `TODO.md` files written by the agent (used in Claude Code)
- `AGENTS.md` / `MEMORY.md` / `SOUL.md` in [[openclaw|OpenClaw]] — the [[agent-harness|agent harness]] formalises this pattern as part of its bootstrap architecture
- Structured JSON state files for programmatic tasks

## Key Properties
- **Persistent** — survives context resets, compaction cycles, and session restarts
- **Agent-authored** — the agent writes notes in its own words based on what it judges important
- **Lightweight** — notes are summaries and references, not full transcripts; they spend context budget efficiently
- **Emergent** — agents often develop note-taking strategies spontaneously when given write tools and long tasks

## Relationships
- Core strategy within [[context-engineering]] for long-horizon tasks, alongside [[context-compaction]]
- Directly implements [[memory-as-harness]]: the harness defines what note-taking tools are available and when notes are loaded
- Reduces compaction burden: well-maintained notes mean compaction summaries need to capture less
- Related to [[cognitive-offloading]]: agentic note-taking is the AI equivalent of externalising cognition to paper/files
- Complements [[just-in-time-context]]: notes track *what to fetch* (references, queries); JIT context does the actual fetching

## Applications
- **Coding agents:** Maintain a TODO.md that tracks which files have been modified, which tests are passing, and what's still needed
- **Research agents:** Keep running notes of key findings, sources to follow up, and hypotheses to test
- **Autonomous assistants:** Maintain MEMORY.md / daily notes for cross-session continuity (the OpenClaw pattern)
- **[[multi-agent-systems|Multi-agent systems]]:** Notes as the handoff mechanism — one agent writes state that another reads on pickup

## Sources
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — primary source; Pokémon example and Claude Code TODO.md pattern
- [Memory tool — Anthropic Developer Platform](http://anthropic.com/news/context-management) — platform-level memory tool based on this pattern

## See Also
- [[context-engineering]]
- [[context-compaction]]
- [[memory-as-harness]]
- [[cognitive-offloading]]
- [[just-in-time-context]]
- [[agent-memory-lock-in]]
