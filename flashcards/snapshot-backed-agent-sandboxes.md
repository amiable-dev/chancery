---
tags: [flashcards, infrastructure, virtualization, ai-agents, domain/infrastructure, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Snapshot-backed agent sandboxes — Flashcards

#flashcards/infrastructure

## Definition and speed <!-- kb:card:3805bd -->
What are snapshot-backed agent sandboxes, and roughly how fast are pause/resume/snapshot operations?
?
Isolated microVM environments whose complete state (guest memory plus filesystem deltas) can be captured, paused, resumed, and forked in tens of milliseconds (boot/resume under 50ms, pause under 100ms, incremental snapshot under 100ms) — so idle costs nearly nothing and fleet capacity depends on how cheaply state moves, not on how many machines are kept warm.

## Forking as the key capability <!-- kb:card:ab458f -->
Why is forking described as more consequential than pause/resume, and what workload does it match?
?
One prepared environment can branch into many independent sandboxes, so N parallel rollouts share one setup instead of repeating it — matching the access pattern of reinforcement-learning sampling and any fan-out needing identical starting state.

## Density-sustaining mechanisms <!-- kb:card:59a8cb -->
What three supporting mechanisms keep density from collapsing at scale in this design?
?
Lazy loading of OCI images with local disk as a bounded hot cache, storage and memory-snapshot data sharing the host page cache via a high-performance block path, and memory ballooning that returns reclaimable guest memory to the host as environments diverge.

## Security caveat <!-- kb:card:6a4e22 -->
What transport-security gap does the concept flag, and why is it notable given the platform's purpose?
?
The API authenticates but does not encrypt, so transport security must be terminated in front of it — a real concern given the service's whole purpose is executing untrusted agent-generated code.

## Evidence caveat <!-- kb:card:a90812 -->
What caveat applies to the reported production figures (about 1.5 million images, 9.6x memory overcommit)?
?
They come from the same organization's own model tech report, are not independently reproduced, and the platform is explicitly tuned to serve one lab's agentic RL training.
