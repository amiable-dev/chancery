---
title: Loop engineering
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, agentic-coding, automation, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://machinelearningmastery.com/an-introduction-to-loop-engineering/
    hash: sha256:12827ca9008a2072a0862a8e34e4579b436864264922dd498d14c36456ee2ab3
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Loop engineering

## Definition

**Loop engineering** is the practice of building the system that prompts, checks, remembers and re-runs an AI agent, so that the unit of work stops being a single prompt or conversation and becomes a repeating cycle: a person states a goal whose completion is mechanically checkable, and the agent acts, observes what the environment actually returned, uses that observation to choose its next move, and keeps going until the goal is verified, a budget is exhausted, or it hands the problem to a human. It is distinguished from a chain, which runs a fixed sequence of steps once, by being dynamic — the agent may discover a step failed, revise its approach, and revisit earlier work — and the engineering effort moves from wording one instruction well to designing a cycle trustworthy enough to leave unattended.

## Explanation

The mechanism is a division of labour: the model is treated as a fixed component in the middle and everything around it is designed — what goal is stated, which tools produce feedback, what gets remembered between iterations, what counts as done, and when the cycle stops. That design becomes worth doing only once an agent can run unattended long enough for the cycle to matter; while a run lasted three turns the sharpness of the prompt was the binding constraint, and once a run lasts an hour and touches dozens of files the binding constraint is whether the cycle keeps the agent productive, checked and correctly aimed for that whole hour. The name is recent and its popularity is a distinct fact from its substance: it spread within about a week in June 2026 from a widely-shared post by Peter Steinberger and an essay by Addy Osmani, with Anthropic's Boris Cherny quoted saying his job is now to write loops rather than prompts. The source here is a tutorial-style explainer synthesizing that moment, so the timeline is reported enthusiasm rather than measurement, but it is honest that the mechanics are older — the reason-act-observe cycle from ReAct in 2022, self-critique written into episodic memory from Reflexion in 2023, and the evaluator-optimizer and orchestrator-workers patterns Anthropic named in 2024. The term is a vocabulary for an accumulating research direction rather than a new invention, and the same article names its limits: for a genuine one-off an interactive session is faster and safer than engineering a loop around it, and a loop relocates human judgment rather than removing it, since someone still owns the goal, the definition of done, and the final call on correctness.

## Key Properties

- The unit of work is a cycle with a checkable exit, not a prompt or a conversation
- Distinguished from a chain by dynamism: the agent may revise its approach and revisit earlier steps
- Became worth engineering once unattended runs got long enough that cycle design, not prompt wording, was the constraint
- Named in June 2026; the mechanics descend from ReAct (2022), Reflexion (2023) and the 2024 evaluator-optimizer and orchestrator-workers patterns
- Not universal: a one-off task is usually cheaper to do interactively than to wrap in a loop

## Relationships

- [[react-pattern]] — supplies the base reason-act-observe cycle that essentially every engineered loop still runs at its core, so loop engineering is largely the question of what to wrap around that cycle
- [[agent-harness]] — is the layer underneath: the harness answers what environment an agent needs, while loop engineering answers the narrower operational question of what cycle keeps it working and when that cycle stops
- [[three-loops-of-agentic-development]] — was written as a direct response to this term and re-cuts the same territory by cadence — agentic coding, developer feedback, external feedback — rather than by which engineering layer is being designed
- [[agentic-engineering-layers]] — places loop engineering as the outermost of four nesting disciplines, each of which exists because the previous one hit a ceiling
- [[agent-loop-anatomy]] — specifies the parts a loop needs to be reliable rather than merely to run, and is where the abstract practice becomes a concrete structure
- [[deterministic-agent-verification]] — is the discipline that keeps a loop honest, since without an external check the cycle can terminate on the agent's own unverified claim of success
- [[workflows-versus-agents]] — loop engineering is the engineering practice behind the workflows-versus-agents split's 'agent' pole — a dynamic loop that can discover a failed step and revise its approach is what it means, in implementation terms, for a model to direct its own process.
- [[agentic-ai-architecture-taxonomy]] — names Planning and Action as the architectural concerns this practice's act-observe-decide cycle actually implements at runtime.

## Applications

Turning a recurring, low-stakes task into an unattended cycle — a nightly issue triage pass, a scheduled report, a lint-and-fix sweep over one directory — and deciding, for any given piece of agent work, whether it warrants a designed loop at all or is better done interactively.

## Sources

- https://machinelearningmastery.com/an-introduction-to-loop-engineering/

## See Also

- [[react-pattern]]
- [[agent-harness]]
- [[agentic-engineering-layers]]
- [[agent-loop-anatomy]]
- [[deterministic-agent-verification]]
