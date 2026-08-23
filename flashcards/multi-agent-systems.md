---
tags: [flashcards, ai-agents, multi-agent, architecture]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Multi-Agent Systems — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:aa0785 -->
What is a multi-agent system?
?
An architecture where multiple autonomous AI agents operate concurrently, each with distinct capabilities or roles, and coordinate to solve tasks too complex, large, or slow for a single agent. Agents may cooperate (divide and conquer), compete (adversarial verification), or be orchestrated by a supervisor.

## Patterns <!-- kb:card:3629d6 -->
What are the five core multi-agent coordination patterns?
?
1. **Hierarchical** — supervisor decomposes goal, delegates to sub-agents, synthesises results
2. **Peer-to-peer pipeline** — agents form a directed chain; output flows through stages
3. **Parallel fan-out** — router dispatches same task to multiple agents; results aggregated
4. **Adversarial/debate** — agents critique each other; judge selects best output
5. **Swarm** — agents interact via shared state; behaviour emerges from local rules

## Failure Modes <!-- kb:card:bc176e -->
What failure modes are unique to multi-agent systems?
?
- **Cascading errors** — one agent's hallucination becomes another's ground truth
- **Circular delegation** — Agent A asks B, B asks A (deadlock/infinite loop)
- **State divergence** — agents operate on inconsistent views of shared state
- **Coordination overhead** — communication costs exceed parallelisation gains for simple tasks

## Application <!-- kb:card:b34788 -->
When does a multi-agent approach beat a single agent?
?
When the task has genuinely parallel subtasks, requires deep specialisation in multiple domains, exceeds a single context window, or benefits from adversarial checking (debate/verification patterns). Avoid for simple tasks — coordination overhead costs real tokens and latency.

## Relationship <!-- kb:card:dd5ecd -->
How do MCP and A2A enable multi-agent systems?
?
**MCP** gives each agent a standardised tool surface — what it can *do*. **A2A** gives agents a standardised way to *delegate to each other*. Together, they make heterogeneous multi-agent systems possible without custom integration for each agent pair.
