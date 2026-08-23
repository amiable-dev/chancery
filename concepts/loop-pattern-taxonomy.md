---
title: "Loop Pattern Taxonomy (Retry / Plan-Execute-Verify / Explore-Narrow)"
aliases: ["Loop Pattern Taxonomy (Retry / Plan-Execute-Verify / Explore-Narrow)"]
date: 2026-07-26
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, orchestration]
tags: [concept, ai-agents, architecture, loop-engineering, patterns, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/orchestration]
status: draft
sources:
  - url: https://machinelearningmastery.com/an-introduction-to-loop-engineering/
    hash: sha256:12827ca9008a2072a0862a8e34e4579b436864264922dd498d14c36456ee2ab3
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Loop Pattern Taxonomy (Retry / Plan-Execute-Verify / Explore-Narrow)

## Definition
A classification of the common *shapes* an agentic loop can take, matched to the kind of task it's suited for. The three baseline patterns are: the **retry loop** (try, check, retry on failure — no strategy change), the **plan-execute-verify loop** (generate a full plan first, then execute and check step by step), and the **explore-narrow loop** (try several approaches in parallel or sequence, converge on whichever produces the best intermediate signal). Picking the wrong shape for a given task is a common source of wasted tokens and unnecessary complexity.

## Explanation
Not every loop-shaped problem should be engineered the same way. The three patterns differ in how much structure they impose before acting, and each has a distinct failure mode when misapplied:

**Retry loop** — the simplest shape: try something, check if it worked, retry if it didn't. Suits short, atomic tasks with a clear pass/fail line — writing a function against a known test, or generating output that must match a spec exactly. Its failure mode is retrying the *same broken approach* indefinitely without varying strategy; a retry loop with no strategy variation is really just a slow way of hoping for a different random outcome from an otherwise-identical prompt.

**Plan-execute-verify loop** — generates a plan up front, then works through it step by step, checking each step before moving to the next. Fits multi-step work where *order matters* and an early mistake compounds — refactoring a shared module, standing up a new service. Its failure mode is over-committing to a plan that turns out to be wrong two steps in, rather than revising it; a plan-execute-verify loop that can't re-plan when a step's verification fails degrades back into a chain (see [[loop-vs-chain]]).

**Explore-narrow loop** — tries several approaches, either concurrently or in sequence, and narrows toward whichever is producing the best intermediate signal. It's the right shape for genuinely unfamiliar territory — debugging an error nobody's seen before, exploring an unfamiliar API's actual behavior — where committing to a single plan too early would waste the run on a dead end. Its cost is context: running several paths at once (or evaluating several candidate directions) is expensive in tokens and requires a mechanism to compare intermediate signal quality across the explored paths, which the other two patterns don't need.

The three patterns are not mutually exclusive within a single system — a larger agent workflow may use plan-execute-verify at the top level while individual steps within the plan use retry loops for their own verification.

## Key Properties
- **Task-shape dependent** — the right pattern is a function of whether the task is atomic (retry), ordered/compounding (plan-execute-verify), or genuinely unfamiliar (explore-narrow)
- **Increasing token cost** — retry is cheapest per iteration; explore-narrow is most expensive because it evaluates multiple candidate paths
- **Distinct failure signatures** — retry fails by repeating a broken approach; plan-execute-verify fails by over-committing to a wrong plan; explore-narrow fails by burning context comparing paths that never converge
- **Composable** — larger systems commonly nest these patterns (e.g., a plan-execute-verify loop whose individual steps are each retry loops)

## Relationships
- Instances of [[loop-vs-chain]]: all three patterns are loop-shaped (revisable control flow); a plan-execute-verify loop that cannot revise its plan has degraded into a chain
- Related to [[thinker-worker-verifier-pattern]]: plan-execute-verify's plan/execute/check roles map closely onto Thinker/Worker/Verifier role separation
- Related to [[agentic-coding-loop]]: the write→test→revise inner coding loop is typically a retry-loop instance
- Requires [[loop-termination-condition]]: each pattern still needs a real success/escalation exit; the taxonomy describes the *shape* of iteration, not the stopping logic

## Applications
- **Choosing a pattern for a new automation:** classify the task first — atomic and checkable (retry), ordered and compounding (plan-execute-verify), or unfamiliar territory (explore-narrow) — before designing the loop's mechanics
- **Diagnosing wasted spend:** an explore-narrow loop applied to a task that's actually atomic (should have been a retry loop) is a common source of unnecessary token cost; a retry loop applied to a compounding multi-step task (should have been plan-execute-verify) is a common source of silent, cascading errors
- **Reviewing an existing agent pipeline:** naming which pattern a given automation actually implements often surfaces a mismatch between the pattern chosen and the task's real shape

## Sources
- [An Introduction to Loop Engineering — MachineLearningMastery.com (2026)](https://machinelearningmastery.com/an-introduction-to-loop-engineering/) — primary source; introduces all three patterns with their fit criteria and failure modes

## See Also
- [[loop-engineering]]
- [[loop-vs-chain]]
- [[loop-termination-condition]]
- [[thinker-worker-verifier-pattern]]
- [[agentic-coding-loop]]
