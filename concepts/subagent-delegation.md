---
title: Sub-agent delegation
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: vendor-doc
tags: [concept, ai-agents, architecture, orchestration, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/
    hash: sha256:c71be0b8db2abdbf5f6dad012142dbc2b8b812ebecc05f9a910be08fe53f245f
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Sub-agent delegation

## Definition

**Sub-agent delegation** is the pattern of splitting an agent's responsibilities between a coordinating agent that owns the workflow sequence and specialized sub-agents that each carry a focused instruction and a narrow tool set: at defined points the coordinator transfers execution to a sub-agent, which completes its specialty, writes results into shared state, and hands control back — in place of one monolithic prompt loaded with every tool and rule the whole workflow could ever need.

## Explanation

The mechanism is division of context rather than mere division of labor: the coordinator sequences the workflow and, when it reaches a state another specialty owns, transfers execution to a sub-agent whose instruction covers only that specialty and whose tool list contains only what it needs; the sub-agent works independently, updates the shared session state, and returns control. The motivation is reasoning quality under load — a single prompt carrying every tool description, workflow rule, and accumulated state variable degrades the model's tool selection and step tracking, and the degradation worsens in long-running contexts where state keeps accruing. Narrow prompts keep each model call sharp regardless of how much total machinery the system holds. The source is a Google ADK tutorial (vendor piece) where an onboarding coordinator delegates IT provisioning to a dedicated sub-agent, but the move is general — the same split-by-specialty, coordinate-through-shared-state shape appears as subagent spawning in coding harnesses.

## Key Properties

- Coordinator owns workflow sequencing; each sub-agent owns exactly one specialty
- Each agent sees a focused instruction and only the tools its job requires
- Sub-agents read and write the same shared state as the coordinator, then hand control back
- The payoff is reasoning quality: overloaded single prompts degrade tool selection and step tracking as context accumulates

## Relationships

- [[agent-checkpoint-resume]] — delegation stays coherent across pauses because coordinator and sub-agents share the same persisted state machine that architecture checkpoints

## Applications

Any agent whose workflow crosses specialties — a coordinator delegating IT provisioning, research, or review steps to focused sub-agents — and a lever to reach for when a single agent's tool list has grown large enough that it misfires on selection or sequencing.

## Sources

- https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/

## See Also

- [[agent-checkpoint-resume]]
