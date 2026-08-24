---
title: Tiered execution gating for AI agents
date: 2026-08-24
tags:
  - concept
  - security
  - ai-agents
  - agent-harness
  - domain/security
  - maturity/emerging
  - source-type/vendor-doc
status: draft
sources:
  - url: https://github.com/0xSteph/pentest-ai-agents
---

# Tiered execution gating for AI agents

## Definition

Tiered execution gating for AI agents is a permission design for AI agents with access to potentially dangerous tools, in which every capability defaults to advisory-only — the agent analyzes and recommends but a human runs the tool — and only a declared subset of agents is upgraded to direct execution, conditioned on the operator first declaring an authorized scope that every target is validated against, with each individual command still surfaced for human approval immediately before it runs.

## Explanation

The design solves a specific problem: an agent whose job is to run offensive security tools needs enough autonomy to be useful — chaining a scan into a follow-up exploit attempt without a human retyping every command — while the exact same autonomy, applied to the wrong target or without the operator's knowledge, is what turns a research assistant into unauthorized access. The two-tier split resolves this by making autonomy opt-in per capability rather than a single global switch: the default state for every agent is advisory, where the agent's output is analysis and recommended commands that a human copies and runs themselves, so nothing is exposed by default. A capability only crosses into direct execution after the operator declares the scope they are authorized to test, and from that point every target the agent proposes to touch is checked against that declared scope before the corresponding command is allowed to run, with the command itself still shown for approval immediately before execution rather than fired silently. The gate is enforced per command, not per session, so one approval does not grant standing execution rights for the rest of an engagement.

## Key Properties

- advisory is the default state for every capability; execution is opt-in per agent, not a global switch
- execution-capable agents require an operator-declared scope before any command runs
- every proposed target is validated against the declared scope before a command executes
- approval happens per command, not per session — one approval does not grant standing execution rights

## Relationships

- [[classifier-mediated-approval]] — both gate a risky agent action behind an approval step, but classifier-mediated approval delegates the decision to a trained model while tiered execution gating keeps every command in front of a human and restricts up front which agents can even reach that gate
- [[layered-agent-guardrails]] — tiered execution gating is one concrete instance of a layered guardrail: it stacks a capability-level tier restriction, a scope-validation check, and a per-command approval prompt rather than relying on any single control

## Applications

Anyone building an AI agent with access to tools that can cause real-world effect — running exploits, executing database queries, sending network traffic, modifying infrastructure — can apply the same split: ship every capability as advisory by default, require an explicit human-declared scope before any agent may execute directly, validate each proposed target against that scope, and keep a human in the loop on every individual command rather than trusting a single up-front grant.

## Sources

- https://github.com/0xSteph/pentest-ai-agents

## See Also

- [[classifier-mediated-approval]]
- [[layered-agent-guardrails]]
