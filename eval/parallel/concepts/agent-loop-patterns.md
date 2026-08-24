---
title: Agent loop patterns
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, design-patterns, architecture, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://machinelearningmastery.com/an-introduction-to-loop-engineering/
    class: external-secondary
---

# Agent loop patterns

## Definition

The **agent loop patterns** are four recurring shapes an agentic cycle takes, each fitted to a different kind of task and each carrying its own characteristic failure. The retry loop tries something, checks it, and tries again, and suits short atomic tasks with a clean pass-or-fail line. The plan-execute-verify loop generates a plan and works it step by step with a check between steps, and suits multi-step work where order matters and an early mistake compounds. The explore-narrow loop runs several approaches and converges on whichever produces the best intermediate signal, and suits genuinely unfamiliar territory. Human-in-the-loop runs until real ambiguity or a consequential decision and then waits for a person, and suits anything whose wrong assumption is expensive to unwind.

## Explanation

The patterns matter because their failure modes are distinct and predictable, so choosing the shape is really choosing which failure you are prepared to manage. A retry loop fails by repeating the same broken approach indefinitely without varying strategy, which is why the pattern needs an explicit variation or escalation rule rather than a bare retry counter. Plan-execute-verify fails by over-committing to a plan that turns out to be wrong two steps in, so it needs permission to revise the plan rather than only to execute it. Explore-narrow fails on cost, because running several paths at once consumes context and tokens in parallel, which makes early and aggressive pruning matter more here than in any other shape. Human-in-the-loop fails in the opposite direction, by interrupting so often that the person saves no time at all by having an agent involved. Naming human-in-the-loop as a first-class pattern rather than a fallback bolted onto the others is the useful move in this taxonomy: it makes the interruption points a deliberate design decision, chosen for stakes, instead of the thing that happens when the automation gives up. The taxonomy comes from a practitioner explainer and is an organizing scheme rather than a measured comparison, and real systems mix shapes rather than picking one.

## Key Properties

- Retry loop: short atomic tasks with a clear pass-or-fail line; fails by retrying an unchanged broken approach
- Plan-execute-verify: multi-step ordered work; fails by over-committing to a plan that is already wrong
- Explore-narrow: unfamiliar territory such as a novel bug or an undocumented API; fails on context and token cost without early pruning
- Human-in-the-loop: high-stakes or ambiguous decisions; fails by interrupting so often the human saves no time
- Choosing the wrong shape shows up as wasted tokens and unnecessary complexity rather than as an error

## Relationships

- [[agent-loop-anatomy]] — supplies the parts every one of these shapes is assembled from, so the patterns differ in control flow rather than in components
- [[loop-engineering]] — is the practice of which pattern selection is one design decision, made before the loop is built rather than discovered while it runs
- [[subagent-delegation]] — is how the explore-narrow shape is usually implemented in practice, giving each candidate approach its own agent and clean context window so the paths do not contaminate each other
- [[workflows-versus-agents]] — the agent loop patterns supply the concrete menu the workflows-versus-agents split's add-complexity-only-when-justified rule chooses from once a workflow's fixed path stops fitting the task — which of the four recurring shapes to reach for next.

## Applications

Choosing a loop shape deliberately for a new agent task rather than defaulting to retry, and diagnosing an underperforming loop by checking whether it is exhibiting its pattern's known failure mode.

## Sources

- https://machinelearningmastery.com/an-introduction-to-loop-engineering/

## See Also

- [[agent-loop-anatomy]]
- [[loop-engineering]]
- [[subagent-delegation]]
