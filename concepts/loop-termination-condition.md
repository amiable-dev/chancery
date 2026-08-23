---
title: "Loop Termination Condition"
date: 2026-07-26
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, safety, cost-control]
tags: [concept, ai-agents, architecture, loop-engineering, safety, verification, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/safety, topic/cost-control]
status: draft
sources:
  - url: https://machinelearningmastery.com/an-introduction-to-loop-engineering/
    hash: sha256:12827ca9008a2072a0862a8e34e4579b436864264922dd498d14c36456ee2ab3
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Loop Termination Condition

## Definition
A **loop termination condition** is an explicit, mechanically checkable criterion that determines when an agentic loop stops — as opposed to an implicit or subjective goal that gives the agent nothing to check itself against. Reliable loops require *two* distinct exit conditions: a **success condition** (a deterministic verifier confirms the goal is met) and an **escalation condition** (a failure signal — exhausted iteration budget, exhausted time/token budget, or repeated identical errors with no progress — that hands the problem to a human rather than allowing the loop to continue indefinitely).

## Explanation
Termination is one of the three hardest problems in [[loop-engineering]] (alongside [[context-rot|context management]] and [[deterministic-grounding|verification]]), because getting it wrong produces two distinct and equally damaging failure modes: a loop with no real termination condition either runs forever, burning cost with no convergence, or stops arbitrarily on a guess that may be wrong.

**The difference a testable goal makes:** "make the app better" gives an agent nothing to check against — there is no state in which the condition is unambiguously true, so the loop either never stops or stops on vibes. "Make every test in the auth module pass" is checkable in a literal, mechanical sense: a test runner returns pass/fail, and that is the whole ballgame. The quality of a loop's termination condition is largely a restatement of how testable its underlying goal is.

**Two real exits, not one:** a well-designed loop's pseudocode skeleton has exactly two ways out:
1. `verifier.passes(state)` → **success** — a deterministic check, explicitly *not* a self-report from the same model that did the work. This is the same principle behind Claude Code's `/goal` primitive, which uses a separate small model to verify completion rather than letting the acting model grade its own homework.
2. `no_progress(state) or budget.exhausted()` → **escalate to human** — triggered by a hard iteration cap, a token or time budget, or detecting that the last several steps produced the same error or left state unchanged.

Without the second exit, a loop with only a success condition has no way to stop cleanly when it *can't* succeed — it will either loop forever or the process will simply time out with no readable signal about why. The escalation path is what makes a loop's failure mode legible instead of silent.

**"No progress" detection** is a specific, practical sub-problem: the mechanism usually works by noticing that the last few steps produced the same error or left the state functionally unchanged. A loop that retries the exact same action after the exact same error isn't adapting — it's spinning, and spinning is the signature failure mode that a no-progress check exists to catch.

## Key Properties
- **Dual-exit design** — success (deterministic verification passed) and escalation (budget/progress failure) are both required; a loop with only one is incomplete
- **Externally checkable, not self-reported** — the success check should not be performed by the same model/agent instance that did the work being checked
- **Testability is upstream of termination quality** — a vague goal ("make it better") cannot produce a good termination condition regardless of how the loop is engineered; the goal itself must be checkable
- **No-progress detection prevents silent spinning** — repeated identical errors or unchanged state, not just elapsed time, is a distinct signal that should trigger escalation
- **Multi-dimensional budgets** — iteration count, token spend, and wall-clock time are each independent limits; hitting any one should trigger escalation

## Relationships
- One of the three hardest problems in [[loop-engineering]], alongside context management and verification
- Implemented via [[agent-budget-caps]]: token, tool-call, iteration, and wall-clock caps are the concrete mechanism behind the "budget.exhausted()" branch of a termination check
- Related to [[loop-vs-chain]]: a loop's dynamic revision capability is only safe if paired with a real termination condition — otherwise "dynamic" becomes "unbounded"
- Related to [[human-in-the-loop-pattern]]: the escalation exit is a structured hand-off point to a human, not an ad-hoc failure
- Related to [[deterministic-grounding]]: both concepts share the principle that a check should be traceable and mechanically reproducible, not a model's self-assessment
- Related to [[spec-driven-development]]: a precise spec is what makes a termination condition testable in the first place
- [[loop-pattern-taxonomy]] — varies by loop shape; the taxonomy is what tells you which condition a given loop needs

## Applications
- **Auditing an existing automation:** ask "what is the deterministic success check, and what is the escalation trigger?" — if either answer is "the agent decides," the loop is under-engineered
- **Setting cron/agent job budgets:** always pair a success verifier with an explicit iteration/time/token cap, never rely on the model to self-terminate gracefully on a difficult task
- **Debugging a stuck agent:** check for the no-progress signature (repeated identical errors, unchanged state) before assuming the task itself is unsolvable — the loop may simply be missing the check that would have escalated it already

## Sources
- [An Introduction to Loop Engineering — MachineLearningMastery.com (2026)](https://machinelearningmastery.com/an-introduction-to-loop-engineering/) — primary source; defines the anatomy of a reliable loop and its two-exit pseudocode skeleton, and names termination as one of the three hardest problems

## See Also
- [[loop-engineering]]
- [[agent-budget-caps]]
- [[loop-vs-chain]]
- [[human-in-the-loop-pattern]]
- [[deterministic-grounding]]
- [[spec-driven-development]]
