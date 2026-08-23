---
tags: [flashcards, context-compaction, ai-agents, llm, long-horizon]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Context Compaction — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:2b7eff -->
What is context compaction?
?
The practice of summarising a conversation or agent trace approaching its context window limit, then reinitiating a fresh context window with the summary in place of the full history — enabling agents to operate over time horizons longer than any single context window allows.

## Keep vs. discard <!-- kb:card:c483a5 -->
During compaction, what should be kept vs. discarded?
?
**Keep:** Architectural decisions, unresolved bugs/blockers, implementation details still needed, key findings, recently accessed files.
**Discard:** Redundant tool outputs whose data was already used, superseded step-by-step turn history, intermediate reasoning that led to a conclusion already captured.

## Lightest touch <!-- kb:card:65ae25 -->
What is the lightest-touch form of compaction?
?
Tool result clearing — removing raw tool call results from deep message history. Since the agent already acted on those results, losing the raw output has minimal impact on future reasoning but recovers significant context tokens.

## Tuning approach <!-- kb:card:bad615 -->
What is Anthropic's recommended two-phase approach for tuning a compaction prompt?
?
1. **Maximise recall first** — ensure the compaction prompt captures every relevant piece of information from the trace
2. **Iterate on precision** — eliminate superfluous content while maintaining high recall

Starting with maximum recall prevents the subtle-but-critical information loss that only becomes apparent later.

## Relationship to note-taking <!-- kb:card:325544 -->
How do compaction and agentic note-taking complement each other?
?
They address different parts of the problem. Compaction is reactive — it fires when the context window fills, summarising what happened. Agentic note-taking is proactive — the agent maintains external notes throughout the task, reducing what compaction needs to preserve. Well-maintained notes make compaction summaries more reliable.
