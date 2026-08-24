---
title: Retry escalation ladder
date: 2026-08-24
domain: reliability
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, reliability, orchestration, domain/reliability, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/
    hash: sha256:5d5840265dd039f68b02b7b1f8435c3f04f7323eab1f4b8ccf982079197a0c1c
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Retry escalation ladder

## Definition

A **retry escalation ladder** is a failure policy for agent loops in which each further attempt on a stalled task changes strategy instead of repeating the previous prompt: successive rungs widen the context the agent may read, the changes it is permitted to make, and the cost it may spend, a stall counter decides when to climb, and a terminal rung ends the task rather than looping on it indefinitely.

## Explanation

The policy rests on a simple observation about repeated sampling: re-issuing an identical prompt against a task that already failed re-samples the same distribution, so it spends tokens to buy mostly the same answer. Escalation changes the input instead. A worked three-rung version runs a standard prompt first (here is the problem, fix it without changing behaviour); on a stalled unit, a retry prompt that includes the previous attempt's output — truncated, in the reported implementation to two thousand characters, so the failure informs the next try without bloating the prompt — and instructs a different approach; then an exploration prompt that lifts the blast-radius constraint, allowing the agent to refactor surrounding code and pull in neighbouring files. Two counters make the ladder safe: per-unit history across rounds tracks consecutive rounds with no improvement, and a stale threshold triggers the climb, so cheap attempts are not abandoned prematurely and expensive ones are not spent on units still making progress. The final rung is termination, not another retry — once exploration fails, the unit is dropped from the queue and surfaced for a human, which is what stops the loop from being unbounded.

## Key Properties

- Each rung changes strategy — wider context, broader permitted edits, higher cost — rather than repeating the prompt
- A per-unit stall counter, not a fixed round number, decides when to escalate
- Failed attempts are fed forward in truncated form so the next rung learns from them
- The top rung is terminal: after it fails the unit is dropped and surfaced, guaranteeing the loop ends
- Cost discipline comes from the ordering — the expensive strategy is only reached by units that earned it

## Relationships

- [[stateless-worker-fanout]] — is the orchestration this policy governs, since fan-out produces exactly the residue of stalled units a ladder is needed to resolve
- [[cross-run-observational-memory]] — turns the ladder from a fixed schedule into an evidence-driven one, because recorded per-rung outcomes tell the next run which rung to start on

## Applications

Any agent loop that retries — code fixes, test repair, data extraction, tool-call recovery — where the cheap attempt should be tried first, the expensive one reserved for what resists it, and the whole thing bounded so no task can consume budget forever.

## Sources

- https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/

## See Also

- [[stateless-worker-fanout]]
- [[cross-run-observational-memory]]
