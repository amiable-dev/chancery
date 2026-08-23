---
tags: [flashcards, ai-agents, architecture, multi-agent]
sr-due: 2026-06-15
sr-interval: 1
sr-ease: 250
---

# Meta-Harness Pattern — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:4ae2ce -->
What is a meta-harness?
?
An architectural layer that sits *above* individual agent harnesses (Claude Code, Codex, Pi, etc.) and provides a unified interface for composition, governance, and collaboration across them — without modifying the harnesses themselves. Each harness is treated as an interchangeable, swappable part of a richer system.

## Problem <!-- kb:card:831cf2 -->
What problem does the meta-harness pattern solve?
?
The **harness silo problem**: each agent harness only understands its own sessions. Engineers copy-paste context between tools, re-implement governance per harness, and can't collaborate on live sessions. The meta-harness adds a shared layer where composition, control, and collaboration live.

## Key Insight <!-- kb:card:931b53 -->
What is the architectural insight that makes a meta-harness possible?
?
"However a harness calls its model internally, the user-facing interface is the same: messages and files go in, text streams and tool calls come out." This uniformity means a single wrapper API can sit above *all* harnesses without understanding their internals.

## Three Capabilities <!-- kb:card:13cdf0 -->
What are the three core capabilities a meta-harness adds?
?
1. **Composition** — combine harnesses without rewriting code; swap with one-line config change
2. **Control** — stateful contextual policies at the meta-harness layer, not in prompts
3. **Collaboration** — live session sharing via URL across terminal, web, desktop, and mobile

## Infrastructure Analogy <!-- kb:card:6d3976 -->
What infrastructure analogy explains the meta-harness pattern?
?
Kubernetes sits above individual containers and manages a fleet — a meta-harness sits above individual agents and manages a team. Just as Kubernetes adds cross-cutting concerns (scheduling, health, policy) without modifying each container, a meta-harness adds composition and governance without modifying each harness.

## Application <!-- kb:card:f9f435 -->
How does cross-vendor code review become possible with a meta-harness?
?
The meta-harness can route work from one harness to another — e.g. code written by a Claude Code sub-agent is automatically reviewed by a Codex agent. This is the Polly orchestrator pattern: plan → delegate to parallel sub-agents → cross-vendor review → merge. Each harness is a worker the meta-harness coordinates.

## Relationship <!-- kb:card:ca4c9d -->
How does the meta-harness differ from a supervisor agent?
?
A supervisor agent (in the [[supervisor-agent-pattern]]) coordinates other agents at the *logical* level — it sends tasks and collects results. A meta-harness coordinates at the *infrastructure* level — it wraps harnesses, manages sessions, applies policies, and provides shared interfaces. The meta-harness may *run* a supervisor agent, but they are different layers.
