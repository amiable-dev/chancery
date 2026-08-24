---
title: Cross-run observational memory
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, memory, observability, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/
    class: external-primary
---

# Cross-run observational memory

## Definition

**Cross-run observational memory** is the practice of having an agent system record, for each session, a compressed observation of what it attempted and how that turned out — the strategy chosen, the attempt number, the outcome, the tokens spent — and read that accumulated history back on later runs, so that a system which is stateless within a run still improves across runs instead of restarting from zero every time.

## Explanation

The distinction that gives the idea its force is between hauling raw context forward and carrying observations forward. Raw transcripts are large, mostly irrelevant, and grow without bound; an observation is a small structured record — which prompt strategy ran, on which unit, in which round, with what result and at what cost — that is cheap to store as an append-only event log and cheap to query. Because the records are structured rather than prose, the next run can select on them: a unit that stalled under a particular strategy last time can start higher on its escalation ladder, and aggregate queries answer whether the system is trending toward more fixes for fewer tokens. This is what separates running experiments from accumulating knowledge, and it is precisely what a purely stateless evaluate-keep-or-revert loop lacks — such a loop can run a hundred experiments overnight without knowing which strategies worked last week. The source is a practitioner post advertising the author's own recording tool, so treat the specific stack as illustration; the transferable requirement is that the harness emit per-attempt structured telemetry at all, since a system that records nothing between input and output cannot learn between runs by any means.

## Key Properties

- Observations are compressed structured records — strategy, round, outcome, cost — not raw transcripts
- Storage is an append-only event log, so cost grows with attempts rather than with context length
- The value is selective read-back: prior outcomes steer the next run's strategy choice
- Aggregates over the log answer whether the system is getting cheaper or better over time
- Requires the harness to instrument attempts; an unobserved agent run cannot inform any later one

## Relationships

- [[memory-as-harness-capability]] — is the same claim applied across sessions — memory belongs to the harness that records and replays it, not to the model, which is why a stateless model can still improve run over run
- [[retry-escalation-ladder]] — is the first consumer of this history, since knowing which rung previously failed on a unit lets the next run skip straight past it
- [[stateless-worker-fanout]] — creates the need for it, because workers that exit after one unit carry nothing forward unless the orchestrator records their outcomes

## Applications

Instrumenting an agent harness so each attempt emits a structured outcome event; tuning retry and strategy policy from that log rather than from intuition; measuring whether a fleet of agents is improving in cost per completed task.

## Sources

- https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/

## See Also

- [[memory-as-harness-capability]]
- [[retry-escalation-ladder]]
- [[stateless-worker-fanout]]
