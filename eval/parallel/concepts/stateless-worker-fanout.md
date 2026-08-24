---
title: Stateless worker fan-out
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, orchestration, parallelism, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/
    hash: sha256:5d5840265dd039f68b02b7b1f8435c3f04f7323eab1f4b8ccf982079197a0c1c
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Stateless worker fan-out

## Definition

**Stateless worker fan-out** is an orchestration shape for bulk maintenance work in which a coordinator partitions a large backlog into independent single-unit tasks, holds only task metadata and result summaries rather than the payload itself, and dispatches each unit to a short-lived agent process that loads exactly one unit, acts on it, and exits; capacity is then increased by raising the number of concurrent workers rather than by enlarging any single agent's context window.

## Explanation

The mechanism is a deliberate inversion of where complexity accumulates. A coordinator that never reads the source material stays constant in size no matter how large the backlog grows — it manipulates a list of units, a prompt template, and per-unit outcomes — while each worker sees one unit and nothing else, so its reasoning never degrades under accumulated context. A bounded worker pool (a semaphore over N slots) caps concurrency, and because workers share nothing, each can be placed in its own sandbox with credentials injected into the sandbox rather than left on the host, and torn down identically on success or failure. The argument this shape makes is that for work which decomposes cleanly into independent units, context length is the wrong scaling axis: a bigger window lets one agent hold ninety-nine files, but holding ninety-nine files is what makes it worse at each one. The source is a practitioner war story about the author's own open-source tool, so its enthusiasm for the pattern is not disinterested, but the reported run is checkable — 842 lint errors across 99 files cleared by five concurrent workers over three rounds, 54 minutes wall clock against 270 minutes of agent time, with the resulting pull request public.

## Key Properties

- The coordinator holds task metadata and outcomes only; payload never enters its context
- Each worker is a short-lived process scoped to exactly one unit of work, then exits
- Concurrency is bounded by a worker pool; wall-clock time falls roughly by the pool size
- Shared-nothing workers permit per-worker sandboxing and identical teardown on success or failure
- Applies only where the backlog decomposes into units that can be fixed independently

## Relationships

- [[subagent-delegation]] — divides work along the opposite axis — delegation splits by specialty and coordinates through shared state, whereas fan-out splits by unit and shares nothing between workers
- [[parallel-automated-researchers]] — applies the same many-cheap-workers-over-one-large-worker economics to open-ended research rather than to a finite maintenance backlog
- [[partitioned-edit-consistency-debt]] — is the failure mode this shape buys its scaling with — independent workers cannot see the invariants that span their units
- [[retry-escalation-ladder]] — supplies the policy for units that fan-out leaves unfixed, since a stateless worker that fails carries nothing forward on its own
- [[snapshot-backed-agent-sandboxes]] — snapshot-backed sandboxes and stateless worker fan-out share a cheap-to-spin-up-many-independent-units logic applied to different resources — microVM state in one case, worker processes in the other — so fleet capacity becomes a function of how cheaply a fresh isolated unit can be created, not how many machines are kept warm.

## Applications

Mechanical codebase-wide work where each file can be fixed on its own — lint and type cleanups, dependency migrations, doc rewrites — and any batch job where the unit of work fits comfortably in one agent's context but the whole backlog does not.

## Sources

- https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/

## See Also

- [[subagent-delegation]]
- [[partitioned-edit-consistency-debt]]
- [[retry-escalation-ladder]]
