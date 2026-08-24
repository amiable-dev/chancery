---
title: Pre-seeded-state agent evals
date: 2026-08-24
tags:
  - concept
  - ai-agents
  - evaluation
  - testing
status: draft
sources:
  - url: https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/
---

# Pre-seeded-state agent evals

## Definition

**Pre-seeded-state evals** validate long-running agent workflows without living through their timeline: because workflow position is explicit state, a test fixture can seed that state to any checkpoint — standing in for days of idle time or an external event that has not fired — and then assert deterministically on what the agent does next, meaning which tools it invokes and in what order, whether it refuses to act while a gate is unsatisfied, and whether details captured before the gap survive the resumption.

## Explanation

The blocking problem is time: a workflow that spans two weeks cannot be validated by running it in real time, so a bug like skipping an approval gate would otherwise surface only in production. Because the architecture stores workflow position as explicit state, an eval fixture pre-seeds that state to any checkpoint — the equivalent of fast-forwarding through the idle time — and golden conversation fixtures then pin the expected tool calls per turn. The empty case is as load-bearing as the positive one: a turn asserting zero tool uses verifies the agent refuses to act while a gate is unsatisfied, even when the user asks it directly to skip ahead. A companion fixture seeds a late-stage state and confirms resumption invokes the remaining tools in sequence with the originally captured details intact, proving context survives the simulated gap. The tests run in seconds and slot into CI, catching state-machine regressions before deployment. Demonstrated in a Google ADK tutorial (vendor piece) using its evaluation-set format, but the technique requires only seedable state and recorded tool calls.

## Key Properties

- State pre-seeding replaces waiting: any checkpoint, including post-idle resumption, is reachable in seconds
- Golden fixtures assert expected tool calls per turn; an asserted-empty tool list pins refusal at a pause gate
- Late-stage seeding verifies that details captured before a simulated multi-day gap survive resumption
- Deterministic and fast enough for CI, so state-machine regressions are caught before production

## Relationships

- [[agent-checkpoint-resume]] — presupposes that architecture — a checkpoint can only be seeded because workflow position is explicit persisted state rather than implicit chat history
- [[golden-dataset-retrieval-evals]] — shares the golden-fixture-in-CI discipline, but pins agent behavior at seeded workflow states where that harness pins retrieval quality against labeled questions
- [[acceptability-envelope-evals]] — sits at the deterministic end of that framing's spectrum — workflow steps have enumerable correct actions (call this tool, refuse that one), so the acceptability envelope collapses to exact assertions

## Applications

Regression-testing multi-day agent workflows in CI — pause-gate enforcement, post-idle resumption, context retention — before changes ship; reproducing a reported mid-workflow failure by seeding the exact state it occurred in.

## Sources

- https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/

## See Also

- [[agent-checkpoint-resume]]
- [[golden-dataset-retrieval-evals]]
