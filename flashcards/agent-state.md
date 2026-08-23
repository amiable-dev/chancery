---
tags: [flashcards, ai-agents, architecture, memory, context-window]
sr-due: 2026-06-23
sr-interval: 1
sr-ease: 250
---

# Agent State — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:afefe2 -->
What is agent state?
?
The totality of information an agent can reason over or retrieve, split into two halves: the **context window** (what the model sees right now — ephemeral, token-capped) and **external state** (files, databases, memory — persisted, fetched on demand).

## Context window properties <!-- kb:card:104625 -->
What are the key properties of an agent's context window?
?
- Contains everything the model can see right now: system prompt, conversation history, tool results, loaded skills
- Has a hard ceiling (model token limit) and a soft ceiling (context rot)
- Ephemeral — lost when the session ends
- Grows with each tool call in the agent loop

## External state: defaults <!-- kb:card:ba45e1 -->
Where should external agent state live by default, and why?
?
**Files** are usually the right default.
- Diffable and versionable (git)
- Both agent and human can read/edit them
- Survive session endings
Use memory for cross-session facts without git history; databases when state needs structured queries or multi-process sharing.

## Concurrency problem <!-- kb:card:838ff4 -->
What problem arises when multiple agents share external state?
?
Two agents reading the same file is fine. Two agents **writing** to the same file is a race condition. Solutions: git worktrees (each agent gets its own working copy) or explicit coordination protocols.

## Relationship <!-- kb:card:791953 -->
What is the relationship between agent state and context rot?
?
Context rot is caused by the accumulation of in-context state. As the context window fills with tool results and conversation history, the model's attention quality degrades. External state (files, memory) is the remedy — move completed work out of context and fetch only what's needed.

## Application <!-- kb:card:18bba3 -->
If a subagent receives a task brief that's several pages long, what does this suggest?
?
The agent split is probably wrong. The child agent should receive only a few paragraphs. A long task brief means the child is too tightly coupled to the parent's accumulated context — restructure the task decomposition.
