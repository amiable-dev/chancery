---
title: "Agent Handoffs"
date: 2026-06-23
domain: ai-agents
maturity: established
source_type: practitioner
topics: [multi-agent, orchestration, patterns]
tags: [concept, ai-agents, architecture, multi-agent, coordination, patterns, domain/ai-agents, maturity/established, source-type/practitioner, topic/multi-agent, topic/orchestration, topic/patterns]
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

# Agent Handoffs

## Definition

A handoff is the structured transfer of work between agents in a multi-agent pipeline, accomplished via a **compressed summary** that gives the receiving agent enough context to proceed without access to the originating agent's full conversation history. The seams between agents — where handoffs occur — are where multi-agent workflows most frequently break.

## Explanation

In a single-agent system, all state accumulates in one context window. In multi-agent systems, work must pass between agents whose context windows are isolated from each other. The handoff is the protocol that bridges these gaps.

**Why compression is essential:**
- The receiving agent cannot read the originating agent's conversation history (it's a separate context window)
- Passing the full history would quickly exhaust the receiving agent's token budget
- Excessively long handoffs cause [[context-rot]] in the receiver from the start
- A rule of thumb: if the handoff summary is more than a few paragraphs, the agent split is probably wrong — the agents are too tightly coupled

**What a good handoff contains:**
1. **Goal achieved** — what the originating agent accomplished
2. **Key outputs** — references to files written, decisions made, external state changes
3. **Open questions / dependencies** — what the receiving agent needs to resolve
4. **Constraints discovered** — anything learned that constrains the next agent's work
5. **Failure modes seen** — approaches tried that didn't work (prevents the receiver from repeating them)

**Handoff formats in practice:**
- **Inline text summary** — brief paragraph in the next agent's system prompt or first user message
- **Structured file** — a YAML or JSON handoff spec written to disk, read by the receiving agent at startup (survives restarts, diffable)
- **Shared scratchpad** — a shared file both agents read/write with a defined schema (higher coupling, but enables richer back-channel)

**Why seams break:**
- Information loss in compression: the originating agent decides what to include; crucial context may be deemed unimportant
- Implicit assumptions not surfaced: the originating agent knows the rationale; the receiver only sees the output
- State divergence: if the originating agent wrote files but the handoff doesn't enumerate them, the receiver may not find them
- Format mismatch: receiver expects structured output, originator produces prose

**Handoffs in common multi-agent patterns:**
- **Planner/Executor:** planner writes a structured plan file + brief; executor reads and implements
- **Router/Specialist:** router passes a scoped task brief tailored to each specialist's prompt format
- **Map-Reduce:** mapper agents each write partial results; the reduce agent receives a list of paths to merge
- **Pipeline stages:** each stage writes its outputs to named files; next stage receives a manifest of what to read

## Key Properties

- **Compression** — handoffs must distil, not relay; passing full history is both expensive and counterproductive
- **Seam-critical** — the quality of the handoff determines the quality of downstream agents' work; errors compound
- **Format-sensitive** — receiving agents work best when handoffs match their expected input format
- **Fail-visible** — good handoffs include what failed, not just what succeeded, so receivers don't repeat dead ends
- **Minimal** — "if the parent has to pass more than a few paragraphs, the split between the two is probably wrong"

## Relationships

- Central to [[multi-agent-systems]]: all multi-agent coordination patterns (hierarchical, fan-out, pipeline) rely on handoffs
- Governed by [[agent-state]]: handoffs bridge isolated context windows; only external state (files, shared DB) can be accessed by both sides without being in the handoff itself
- Produces [[context-rot]] risk if too verbose: an over-detailed handoff pollutes the receiver's context from the start
- Implemented by [[subagents]]: spawning a child agent in OpenClaw requires crafting a handoff as the subagent's task prompt
- Related to [[agent-session-distillation]]: session distillation is a specialised handoff — distilling a long session into a compact summary for future use
- Related to [[agent-to-agent-protocol|A2A Protocol]]: A2A defines a standard envelope for inter-agent messages, including handoff payloads

## Applications

- **Code review pipeline:** Planner agent produces `PLAN.md` listing files to change → Coder agent implements and writes `IMPLEMENTATION_NOTES.md` → Reviewer receives a handoff pointing to the PR diff + implementation notes, not the full planning transcript
- **Research pipeline:** Search agent writes `sources.json` with retrieved articles → Synthesiser receives a handoff: "Find 8 sources in sources.json; synthesise into a 500-word summary; focus on X"
- **OpenClaw subagent pattern:** `sessions_spawn(task="...")` where the task string is the handoff — concise goal, key constraints, output target, verification criteria
- **Failure recovery:** If the receiver produces low-quality output, the first diagnosis is the handoff quality — not the receiver model

## Sources

- [Agentic Engineering (System Design Newsletter)](https://newsletter.systemdesign.one/p/agentic-engineering) — "Multi-Agent Patterns" section; "Each handoff carries a compressed summary… Those seams are where work tends to break."
- [30 Core Agentic Engineering Concepts Every Developer Should Know](https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69) — handoffs as the binding mechanism between multi-agent patterns

## See Also

- [[multi-agent-systems]]
- [[agent-state]]
- [[subagents]]
- [[agent-session-distillation]]
- [[agent-to-agent-protocol]]
- [[context-rot]]
