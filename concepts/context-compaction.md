---
title: "Context Compaction"
date: 2026-04-29
domain: llm
maturity: emerging
source_type: practitioner
topics: [context-engineering, memory]
tags: [concept, ai-agents, llm, context, long-horizon, memory, architecture, domain/llm, maturity/emerging, source-type/practitioner, topic/context-engineering, topic/memory]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/news/context-management
    hash: sha256:babb41eae2c42a22feaaa24fea22b66a7c7845e6698868c8b19c3f78e198e21d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Context Compaction

## Definition
**Context compaction** is the practice of summarising a conversation or agent trace that is approaching its context window limit, then reinitiating a fresh context window with the summary in place of the full history — enabling agents to operate over time horizons longer than any single context window allows.

## Explanation
Every context window has a finite capacity. In long-horizon tasks (large codebase migrations, multi-hour research projects, extended autonomous work), an agent's context will eventually fill. Without compaction, the agent hits a hard stop.

Compaction solves this by *distilling* the context: passing the full message history to the model, asking it to summarise the critical information, then starting a new context window containing only that summary plus a small set of recent files. The agent continues from this compressed state with minimal performance degradation — if the compaction is well-tuned.

### What to keep vs. discard
The art of compaction is the selection function:

**Keep:**
- Architectural decisions made during the task
- Unresolved bugs, open questions, and blockers
- Implementation details still relevant to next steps
- Key findings and conclusions
- The most recently accessed files (Claude Code uses the last 5)

**Discard:**
- Redundant tool outputs (once the data was used, the raw result is often no longer needed)
- Step-by-step turn history that's been superseded by later decisions
- Intermediate reasoning that led to a conclusion already captured in the summary

**Tool result clearing** is the safest, lowest-overhead form of compaction: simply removing raw tool call results from deep message history. It's "lightest touch" because the agent already acted on those results, so losing the raw output has minimal impact on future reasoning.

### Compaction tuning
Anthropic recommends a two-phase approach for compaction prompt development:
1. **Maximise recall first** — ensure the compaction prompt captures every relevant piece of information
2. **Iterate on precision** — eliminate superfluous content while keeping recall high

Overly aggressive compaction loses subtle context whose importance only becomes apparent later ("we decided to use X library because of Y constraint" is easy to discard but painful to lose).

### Compaction vs. structured note-taking
These are complementary:
- **Compaction** is reactive — triggered when the context window is near full
- **[[agentic-note-taking|Agentic Note Taking]]** is proactive — the agent maintains persistent notes *throughout* the task, reducing what compaction needs to preserve

## Key Properties
- **Lossless intent** — good compaction preserves all task-relevant context even as it dramatically reduces token count
- **Triggered, not continuous** — compaction fires at threshold events, not every turn
- **Model-performed** — the LLM itself performs the summarisation, leveraging its own understanding of what's important
- **Composable** — can be combined with structured note-taking and [[just-in-time-context|just-in-time context]] for comprehensive long-horizon coverage

## Relationships
- Core strategy within [[context-engineering]] for long-horizon tasks
- Directly counters [[context-rot]]: by restarting with a summary, the model operates on a fresh, high-signal context
- Depletes and then restores the [[attention-budget]]: compaction pays a one-time summarisation cost to buy back a full fresh budget
- Complements [[agentic-note-taking]]: notes reduce what must be preserved in the summary; summaries capture what notes missed
- Related to [[just-in-time-context]]: JIT keeps context lean during a session; compaction handles when it fills despite JIT usage
- Related to [[memory-as-harness]]: compaction is a harness-level design decision — the harness defines when and how compaction fires

## Applications
- **Coding agents:** Trigger compaction when approaching ~70-80% of context window; preserve architectural decisions and unresolved bugs in the summary
- **Research agents:** Compact after each major research phase, keeping summaries of findings while discarding intermediate web fetches
- **Monitoring agents:** Roll up logs and tool outputs periodically; maintain only actionable state in compressed context
- **[[openclaw|OpenClaw]]/Claude Code:** Built-in compaction on the Claude Developer Platform via the Context Management API; can also be implemented manually via custom compaction prompts

## Sources
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — primary definition with Claude Code compaction implementation details
- [Context Management API — Anthropic Developer Platform](https://www.anthropic.com/news/context-management) — tool result clearing and compaction as platform features

## See Also
- [[context-engineering]]
- [[context-rot]]
- [[attention-budget]]
- [[agentic-note-taking]]
- [[just-in-time-context]]
- [[memory-as-harness]]
