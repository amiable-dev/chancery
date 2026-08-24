---
tags: [flashcards, agents, security, observability]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Observe-and-confine sandboxing — Flashcards

#flashcards/agents

## Core claim <!-- kb:card:27806d -->
What is the observe-and-confine sandboxing position on the security-vs-observability tradeoff?
?
Isolation and full observability are not inherently in tension — the tradeoff is an artifact of where capture is placed, not a property of security and observability themselves.

## Where capture must sit <!-- kb:card:462daf -->
Where must the observability layer capture from for observe-and-confine sandboxing to work?
?
From a point inside or beneath the sandbox boundary — the same boundary that contains the agent's blast radius — not bolted on from outside it.

## Why placement resolves the tension <!-- kb:card:448027 -->
Why does relocating capture inside the boundary eliminate the tradeoff between tightening isolation and losing visibility?
?
Containment and auditability are then enforced by the same boundary, so tightening isolation never removes visibility and widening visibility never requires loosening isolation.

## Deterministic replay <!-- kb:card:294852 -->
What does deterministic replay from the internal capture record change about debugging?
?
It turns failures from something reconstructed after the fact into something stepped through and resumed from, without loosening isolation to get that view.

## Prior art <!-- kb:card:a8abc4 -->
What earlier distributed-systems idea does observe-and-confine sandboxing apply to agent runtimes?
?
Durable execution logs and deterministic replay, which let a system be both fault-isolated and debuggable.

## Vendor evaluation test <!-- kb:card:4783f0 -->
How can you test whether an agent-infrastructure vendor's observability claim is compatible with real isolation?
?
Ask whether their capture point sits inside the sandbox boundary or bypasses it from outside.
