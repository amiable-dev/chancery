---
tags: [flashcards, agents, memory, context-management, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Memory as a harness capability — Flashcards

#flashcards/agents

## Memory as harness capability — claim <!-- kb:card:aa56d4 -->
What is the core claim of 'memory as a harness capability'?
?
An agent's memory cannot be added as an external plugin, because it emerges from decisions only the agent harness controls — what loads into context, what survives compaction, whether the agent can rewrite its own instructions/state, and whether interactions are stored queryably.

## What part of memory IS pluggable <!-- kb:card:167b6a -->
According to this claim, what is the one part of agent memory that genuinely can be a plugin, and how significant is it?
?
Retrieval (RAG) over past session data — but it's a small part of memory overall, and hard to beat grep at.

## Memory-as-harness — driving analogy <!-- kb:card:733d14 -->
What analogy does Sarah Wooders use for the idea of 'plugging memory into an agent'?
?
It's like asking to plug driving into a car — memory is a product of the harness's own context management, not a separable component.

## MemGPT as evidence <!-- kb:card:559534 -->
How does MemGPT's history support the memory-as-harness-capability claim?
?
MemGPT's memory emerged from tools for rewriting prompts and managing external state combined with the harness's context management — yet it was routinely mistaken for a pluggable RAG tool.

## Harness memory checklist <!-- kb:card:878a37 -->
Name three of the invisible harness decisions this concept lists as constituting an agent's 'memory.'
?
How instruction files (e.g. AGENTS.md) are loaded, whether the agent may modify its own system instructions, and what survives context compaction.
