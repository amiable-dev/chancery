---
title: "Loop vs. Chain (Dynamic Control Flow)"
aliases: ["Loop vs. Chain (Dynamic Control Flow)"]
date: 2026-07-26
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns]
tags: [concept, ai-agents, architecture, control-flow, loop-engineering, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns]
status: draft
sources:
  - url: https://machinelearningmastery.com/an-introduction-to-loop-engineering/
    hash: sha256:12827ca9008a2072a0862a8e34e4579b436864264922dd498d14c36456ee2ab3
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Loop vs. Chain (Dynamic Control Flow)

## Definition
A **chain** is a fixed, linear sequence of steps — step A always leads to step B, which always leads to step C, regardless of the outcome of any individual step. A **loop** is dynamic control flow: the agent can discover that a step failed, revise its approach, and only then proceed, or it can backtrack to an earlier step entirely. A loop continues until a task is genuinely complete, an explicit stopping condition triggers, or the agent determines it cannot proceed further — not until a predetermined number of steps have simply executed.

## Explanation
The distinction matters because it defines what "reliability" even means for an agentic system. A chain's reliability is measured by whether each fixed step succeeds in isolation; failure at step B just means the chain produces a broken output at step C, because there is no mechanism for B's failure to change what happens next. A loop's reliability is measured by whether the *cycle as a whole* converges on a checkable, correct outcome, because the control flow itself is allowed to change shape in response to what the agent observes.

Concretely: a chain-shaped agent that writes code, then runs tests, then reports a summary will dutifully report "tests failed" and stop — the chain topology has no step for "go back and fix the code." A loop-shaped agent, seeing the same test failure, treats it as environment feedback: it revises the code and re-enters the write→test cycle, repeating until the tests pass or an explicit budget/escalation condition is hit. The topology, not the model's intelligence, is what makes the second behavior possible.

This is the load-bearing distinction underneath [[loop-engineering]]: the entire discipline exists because moving from chain-shaped to loop-shaped agent systems is what lets an agent run unattended for an hour and recover from its own mistakes, rather than needing a human to manually route around every failure.

The related "recursive goal" framing makes the same point from the developer's side: instead of writing each next instruction (chain-style, human-in-the-loop for every step), the developer defines a *purpose* — "make the test suite pass," "triage every open issue and draft fixes for the easy ones" — and the agent iterates toward it on its own: inspect, change, check, read the outcome, decide the next move. The authoring skill shifts from writing one precise instruction to designing a cycle trustworthy enough to walk away from.

## Key Properties
- **Fixed vs. conditional topology** — a chain's next step is determined by position alone; a loop's next step is determined by the *result* of the current step
- **Revision capability** — loops can backtrack to an earlier stage on failure; chains cannot, by construction
- **Checkable termination, not step-count termination** — a loop stops because a real condition was met (or explicitly failed to be met), not because a fixed sequence ran out
- **Enables unattended operation** — loop topology is the structural precondition for an agent surviving a failure without human intervention; chains require a human to notice and re-route

## Relationships
- Foundational to [[loop-engineering]]: loop engineering is the discipline of designing loop-shaped (not chain-shaped) agent systems
- Requires [[loop-termination-condition]]: a loop is only as good as its stopping logic — without one, dynamic control flow just means "runs forever" instead of "runs until fixed steps exhaust"
- Underlies [[agentic-coding-loop]]: the write→test→revise cycle is a concrete instance of loop-shaped (not chain-shaped) control flow
- Related to [[react-agent-pattern]]: ReAct's Reason→Act→Observe→repeat is the base implementation pattern for loop-shaped control flow
- [[external-state-as-loop-substrate]] — a loop only compounds if its learning is written somewhere outside the model, which is the external-state substrate
- [[loop-pattern-taxonomy]] — draws the line the loop-pattern taxonomy then subdivides into concrete shapes

## Applications
- **Diagnosing a stuck automation:** if an agent pipeline reports failure and stops instead of adapting, check whether it was built as a chain (fixed steps) rather than a loop (conditional, revisable steps) — this is often the actual root cause, not model capability
- **Designing new automations:** before building a multi-step agent workflow, explicitly decide which steps need loop-shaped revision capability (e.g., "write code, test, fix") versus which are genuinely fixed-order and chain-appropriate (e.g., "fetch, then parse, then store")
- **Explaining agent behavior to stakeholders:** "why didn't it just fix the error?" is usually answered by "it was built as a chain, not a loop"

## Sources
- [An Introduction to Loop Engineering — MachineLearningMastery.com (2026)](https://machinelearningmastery.com/an-introduction-to-loop-engineering/) — primary source; distinguishes chain (fixed A→B→C) from loop (dynamic, revisable) and introduces the "recursive goal" framing

## See Also
- [[loop-engineering]]
- [[loop-termination-condition]]
- [[agentic-coding-loop]]
- [[react-agent-pattern]]
