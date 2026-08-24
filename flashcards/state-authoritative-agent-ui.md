---
tags: [flashcards, agents, interface-design, state-management, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# State-authoritative agent interface — Flashcards

#flashcards/agents

## State-authoritative UI: definition <!-- kb:card:0b3e7e -->
What does a state-authoritative interface render, and what does it deliberately refuse to do?
?
It renders only transitions the backend has actually committed (persisted agent state); it refuses the optimistic update a conventional front end would apply the instant a button is clicked.

## Routing user actions as events <!-- kb:card:523464 -->
How does a state-authoritative interface route a user action to the backend?
?
As an external event posted through the same resume path a real external callback (e.g. a signature webhook or delivery notification) would take, so the demo path and production path are the same code.

## Why optimistic rendering fails here <!-- kb:card:f7013e -->
Why is optimistic rendering unsound for an agent turn, unlike a deterministic backend write?
?
An agent turn may refuse, stall against an unmet gate's precondition, or take a different route than the button implied — and a resume from dormancy costs a cold start plus inference, so latency is unbounded, not just variable.

## The cost of state-authoritative UI <!-- kb:card:238685 -->
What visible cost does a state-authoritative interface impose, and why is that cost diagnostic rather than defective?
?
Several seconds where a click appears to do nothing; that wait is the only way pause-and-resume behaviour becomes observable from outside.

## How artifacts are displayed <!-- kb:card:cfc179 -->
How does a state-authoritative interface display agent-produced artifacts, as opposed to using client-side placeholders?
?
It fetches the backend's real outputs by identifier and displays those — never a client-side placeholder standing in for them.
