---
tags: [flashcards, ai-agents]
sr-due: 2026-07-15
sr-interval: 1
sr-ease: 250
---

# AI Agent Anti-Patterns — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:9f9356 -->
What is the core thesis behind AI agent anti-patterns as a catalogue?
?
That agent failures are rarely caused by the underlying model — they're caused by architecture, memory design, tooling decisions, and how complexity gets introduced over the project's lifetime. Anti-patterns split into architectural (baked in at design time) and operational (only surface in production).

## Application <!-- kb:card:e14aef -->
When would you use the AI agent anti-patterns catalogue?
?
As a pre-mortem checklist before designing or scaling an agent system — especially before adding a second agent or new tool ("is this justified by measured data?") and before granting write access to a production system ("what's the blast radius, and is there a human checkpoint?").

## Relationship <!-- kb:card:8fd6af -->
How does the "tool list sprawl" anti-pattern relate to minimal viable tool set?
?
Tool list sprawl is exactly the failure mode the minimal viable tool set principle exists to prevent: every tool added is reasoned about on every turn, so overlapping/excessive tools increase the odds of bad choices. The fix is keeping tools minimal, non-overlapping, and purpose-specific.

## Relationship <!-- kb:card:e69a6f -->
How does "ignoring context drift" relate to context rot?
?
It's the same underlying mechanism (context rot: degrading recall/reasoning as tokens accumulate) applied to live task execution rather than static document retrieval — context that was accurate at task start degrades as a long-running agent task proceeds.
