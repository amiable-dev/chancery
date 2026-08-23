---
tags: [flashcards, ai-agents, infrastructure, sandbox, cost-management]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# Idle-Cost Sandbox Design — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:752807 -->
What is idle-cost sandbox design?
?
An architectural stance for agent execution infrastructure that optimizes for the cost of an environment sitting idle — the gap between "environment exists" and "environment is doing work" — rather than optimizing primarily for cold-start latency.

## Application <!-- kb:card:a1d4f5 -->
When does idle-cost design become more important than cold-start optimization?
?
At scale where most environments, most of the time, are neither actively computing nor destroyed — they exist holding state while waiting. When idle time dominates the fleet's total resource footprint, minimizing idle cost matters more than minimizing individual cold starts.

## Relationship <!-- kb:card:fe6972 -->
How does idle-cost sandbox design relate to event-driven dormancy?
?
Both address the economics of idle waste, but at different layers. Event-driven dormancy is an orchestration-layer pattern: suspending a long-running workflow and resuming it on an external event. Idle-cost sandbox design is an infrastructure-layer pattern: reclaiming a running sandbox's physical CPU/memory while it exists in a paused state.

## Failure Mode <!-- kb:card:2c4458 -->
What structural risk does "pause instead of delete by default" create, and what does it resemble?
?
Paused environments accumulate indefinitely unless something actively reaps them — the same failure shape as a soft-delete that nobody ever vacuums. Safe against losing expensive state, but a standing cost liability if nothing enforces cleanup.
