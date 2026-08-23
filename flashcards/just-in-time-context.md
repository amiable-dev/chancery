---
tags: [flashcards, just-in-time-context, ai-agents, llm, retrieval]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Just-in-Time Context — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:c603b0 -->
What is just-in-time context?
?
A retrieval strategy where agents maintain lightweight references (file paths, stored queries, web links) in context rather than pre-loading full content, then dynamically fetch data at runtime using tools only when needed for the current inference step.

## Human analogy <!-- kb:card:68b06b -->
What human behaviour does just-in-time context mirror?
?
How humans use filing systems, inboxes, and bookmarks. We don't memorise entire corpora — we maintain references and retrieve relevant information on demand. JIT context applies this same principle to agent context management.

## Contrast <!-- kb:card:16e72e -->
How does just-in-time context differ from RAG (Retrieval-Augmented Generation)?
?
RAG pre-computes embeddings and retrieves content *before* inference (pre-inference time retrieval). JIT context retrieves content *during* inference via tool calls at runtime. RAG is faster but may be stale; JIT is slower but always fresh and targeted to the agent's current reasoning state.

## Trade-off <!-- kb:card:262bf8 -->
What is the main trade-off of just-in-time context retrieval?
?
Speed vs. freshness and relevance. JIT retrieval is slower than pre-computed retrieval (each fetch is a real tool call), and requires well-designed exploration tools and heuristics. The payoff: fresher data, leaner context windows, and better alignment between context and current task needs.

## Hybrid strategy <!-- kb:card:2f85bd -->
What is the hybrid context strategy used by Claude Code?
?
CLAUDE.md project config files load upfront (for speed and orientation), while tools like grep and glob enable targeted just-in-time file retrieval during task execution. Upfront context provides structure; JIT retrieval provides depth when needed.
