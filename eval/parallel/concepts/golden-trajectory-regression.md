---
title: Golden trajectory regression testing
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, testing, observability, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
    hash: sha256:7380d808df58d13eab6825b0abb44ce95b2e7e379a8882cd80acaee96625d7be
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Golden trajectory regression testing

## Definition

A **golden trajectory** is a validated recording of an agent's complete execution — not the final output alone but the reasoning chain across every model call, each tool invocation with its arguments, the decision gates taken and the surrounding captured state — retained as the baseline for behavioural regression testing: a later run of the same scenario is compared against the trajectory, and a deviation past a threshold is treated as a regression rather than as a difference of wording.

## Explanation

Output comparison fails on agentic systems for a structural reason: a nondeterministic system can produce different but equally acceptable answers to identical input, so an output-equality assertion is either flaky or vacuous. A trajectory moves the assertion up to the process. The route an agent takes is far more stable than the prose it emits, and the failures that matter are visible in the route while invisible in the answer — a tool called with the wrong arguments, a decision gate skipped, a loop that stops terminating, a retrieval step silently dropped. The prerequisite is tracing instrumentation: the platform records spans for model and tool calls, and a golden is simply a blessed trace promoted to a fixture. In use, editing a prompt or a manifest triggers replay of the scenarios, a diff against the goldens, and automatic rollback when deviation crosses the threshold. The threshold is the whole design problem — too tight and every rephrasing fails the suite, too loose and genuine drift walks through — which is why the comparison is graded rather than exact. The source presents this as accumulated practitioner experience illustrated with one traced production agent; it offers no comparative evaluation of the technique against alternatives.

## Key Properties

- The artifact under test is the whole trace: reasoning chain, tool calls with arguments, decision gates, captured state
- Trajectory comparison works where output comparison cannot, because acceptable outputs vary while routes stay stable
- Tracing instrumentation is a prerequisite — a golden is a blessed production trace
- Comparison is thresholded rather than exact, and the threshold trades flakiness against blindness
- Deviation is wired to automatic rollback of the artifact change that produced it

## Relationships

- [[agentic-artifacts-as-code]] — is the safety net that makes versioning those artifacts actionable, because a golden is what a rollback trigger compares a new run against
- [[acceptability-envelope-evals]] — attacks the same nondeterminism problem from the output side, asserting properties an acceptable answer must exhibit where a golden trajectory asserts the shape of the process that produced it
- [[preseeded-state-evals]] — shares the move of asserting on what an agent does rather than on what it says, but seeds a checkpoint to skip elapsed time instead of replaying a recorded route
- [[temporal-fakes]] — temporal fakes sit in tension with golden-trajectory regression's approach to test fidelity — a recorded baseline is exactly the kind of snapshot assertion temporal fakes are built to replace with a system that evolves state live during the test.

## Applications

Gating prompt and tool-manifest changes in CI by replaying recorded scenarios and diffing traces; building a regression suite for an agent whose outputs are legitimately variable, such as a patching or triage agent, where the sequence of tool calls is the thing worth pinning.

## Sources

- https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/

## See Also

- [[agentic-artifacts-as-code]]
- [[acceptability-envelope-evals]]
- [[preseeded-state-evals]]
