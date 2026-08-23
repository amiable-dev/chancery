---
tags: [flashcards, attention-budget, ai-agents, llm, transformers]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Attention Budget — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:060771 -->
What is the attention budget?
?
The finite capacity of a transformer-based LLM to form meaningful pairwise relationships between tokens in its context window. Each additional token costs n additional pairwise computations across all existing tokens (O(n²) scaling), making attention a scarce resource that must be allocated carefully.

## Human analogy <!-- kb:card:30a010 -->
What is the human cognitive analogue to an LLM's attention budget?
?
Working memory capacity. Humans don't memorise entire reference books — we use filing systems, indexes, and retrieval because working memory is limited. Just as humans externalise to filing systems, LLMs need strategies (JIT retrieval, compaction, notes) to manage their attention budget.

## Fastest depletion <!-- kb:card:7523cc -->
What types of content deplete the attention budget fastest?
?
- Redundant tool outputs (large JSON blobs, full files when excerpts suffice)
- Stale message history no longer relevant to the current subtask
- Overlapping context (same information in multiple forms)
- Overly verbose examples in the system prompt

## Preservation <!-- kb:card:1a3bb1 -->
What are the main strategies for preserving attention budget?
?
- Tool result clearing: remove raw tool outputs from deep history
- Compaction: summarise conversation history before budget is exhausted
- Just-in-time retrieval: load data on-demand rather than pre-loading
- Lightweight references: keep file paths and queries in context, not full content

## Scaling law <!-- kb:card:3eac7b -->
How does the cost of adding one more token change as context grows?
?
It scales linearly with existing context length (not as a flat rate). Adding the 1,000th token requires 1,000 new pairwise relationships; adding the 100,000th token requires 100,000. This means large contexts become increasingly expensive to extend at the margins.
