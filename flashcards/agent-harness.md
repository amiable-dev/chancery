---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- architecture
- agent-harness
---


# Agent Harness — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:b065ff -->
What is an agent harness?
?
The system of scaffolding that surrounds an LLM, enabling it to interact with tools, manage context, persist memory, and execute multi-step tasks. It is the runtime environment that transforms a bare model into a functioning agent.
<!--SR:!2026-04-15,1,230-->

## Scale <!-- kb:card:d23a65 -->
How large is Claude Code's agent harness?
?
512,000 lines of code — evidence that harnesses are substantial, non-trivial engineering that model improvements alone cannot replace.

## Persistence <!-- kb:card:60b629 -->
Will agent harnesses disappear as models improve?
?
No. The type of scaffolding needed changes (simple 2023 RAG chains have been absorbed), but the harness persists. Agents always require a system to orchestrate tool calls, manage context, and handle memory — that system is the harness.

## Memory <!-- kb:card:f7bf92 -->
What role does the harness play in memory?
?
The harness is responsible for all memory management: loading instruction files, compacting context, reading/writing long-term memory, and determining what survives between sessions. Memory is not a plugin — it is a core harness function.

## Application <!-- kb:card:3a4980 -->
What should you consider when choosing an agent platform?
?
Harness openness, not just model quality. A closed harness locks your agent's memory to that platform. Open-source harnesses (Deep Agents, Pi/OpenClaw) keep memory portable and under your control.
<!--SR:!2026-04-15,1,230-->
