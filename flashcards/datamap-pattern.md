---
tags: [flashcards, ai-agents, architecture, data-governance]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# Datamap Pattern — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:a3fbec -->
What is a datamap, and what problem does it replace?
?
A declarative typed hierarchy describing what exists in a data source (e.g. a warehouse: connection → database → schema → table → column). It replaces writing one bespoke sync script per source — once the hierarchy is data, one mining engine can walk any source of that shape with zero vendor branching.

## Application <!-- kb:card:5e87a4 -->
Why does deriving context-item identity from (tenant, type, path) matter for idempotency?
?
It gives every mined artifact a deterministic key. If an orchestrator retries a failed step or a worker crashes mid-batch, re-mining the same path produces the same identity and safely overwrites instead of duplicating — idempotent retries without source-specific dedup logic.

## Application <!-- kb:card:832284 -->
Why do first-time mining and refresh cycles need separate queues rather than sharing one?
?
Because a backlog on a shared queue can starve a newly connected source for days — its first-time mining competes with refresh traffic from sources already established, and refresh traffic typically has priority or higher volume.
