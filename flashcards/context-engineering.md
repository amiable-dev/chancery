---
tags: [flashcards, context-engineering, ai-agents, llm]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Context Engineering — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:cb288f -->
What is context engineering?
?
The practice of curating and maintaining the optimal set of tokens available to an LLM at inference time — including system prompts, tools, external data, message history, and MCP connections — to maximise the likelihood of a desired outcome. It treats the entire context state as the engineering surface, not just individual prompts.

## Distinction <!-- kb:card:9543d7 -->
How does context engineering differ from prompt engineering?
?
Prompt engineering focuses on writing effective prompts (a discrete, one-time task). Context engineering is iterative — it happens at every inference step and manages the full context state dynamically. Prompt engineering is a component of context engineering, not the whole picture.

## Core constraint <!-- kb:card:355da2 -->
What is the fundamental constraint that makes context engineering necessary?
?
The transformer attention mechanism creates n² pairwise relationships for n tokens. This means context is a finite resource with diminishing marginal returns — adding tokens always costs attention capacity, and as context grows, the model's ability to recall and reason over information degrades (context rot).

## Right altitude <!-- kb:card:acf013 -->
What does "right altitude" mean in the context of system prompt design?
?
The Goldilocks zone between two failure modes: overly specific (brittle if-else hardcoded logic that creates fragility) and overly vague (hand-wavy guidance that fails to give the model concrete signals). The right altitude provides specific heuristics while leaving room for model flexibility.

## Application <!-- kb:card:b442e1 -->
What are the four core context engineering strategies for long-horizon tasks?
?
1. Compaction — summarise and reinitialise context windows near their limit
2. Structured note-taking — agent writes persistent notes outside the context window
3. Just-in-time retrieval — maintain references, fetch content on demand
4. Multi-agent architectures — distribute context across specialised agents
