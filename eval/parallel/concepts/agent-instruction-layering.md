---
title: Agent instruction layering
aliases:
  - Config files versus skills
  - Always-on versus on-demand instructions
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, prompting, context, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://newsletter.systemdesign.one/p/agentic-engineering
    class: external-secondary
---

# Agent instruction layering

## Definition

**Agent instruction layering** is the discipline of separating an agent's standing instructions by when they should occupy context: an always-on project configuration file holding the few rules that apply to every task, on-demand procedure files that load only when their declared trigger matches the work at hand, and the live prompt carrying whatever is unique to the current task. The split exists because every resident token competes with every other for the model's finite attention, so an instruction has to earn its residence rather than merely be true.

## Explanation

An agent's system prompt comes from whoever built the harness and covers tool use and that harness's own conventions; it knows nothing about a specific project. Absent a project-level file, the model falls back on whatever was most plausible in its training data — the wrong package manager, the wrong formatter, defensive boilerplate wrapped around every change — because plausibility is what it optimises. The always-on file corrects that but pays rent on every single turn, which is why the useful version is short and specific: the tooling stack actually in use, hard limits, a few behavioural rules, and nothing generic. On-demand files invert the economics using metadata: a name and description declare when the procedure is relevant, optionally narrowed by file-path patterns, so the routing decision costs a line and the body enters context only when it applies. The evidence that this is about instruction quality rather than instruction volume comes from a skills benchmark of eighty-six tasks across eleven domains, where a small cheap model supplied with human-curated written procedures outscored the flagship model working without them — and, in the same data, letting a model generate its own procedures erased the gain entirely. Self-generated boilerplate adds tokens without adding signal, which is the exact failure mode the layering is meant to prevent. The practical consequence is to treat the always-on file as code rather than documentation: keep it short, review it when it changes, and cut anything not visibly improving outcomes. The source is a survey newsletter, guest-written and carrying sponsor placements, which synthesises published tools and linked primary studies; the benchmark numbers come from those sources, while the three-tier scheme is the author's organising frame rather than a measured result.

## Key Properties

- Three tiers by residence: always-on project rules, on-demand procedures gated by declared triggers, and the live task prompt
- With no project file the model defaults to the most common patterns in its training data, not to the project's actual stack
- On-demand files route on metadata — name, description, optional path globs — so the body costs nothing until it matches
- Benchmark evidence: curated procedures let a cheap model beat a flagship without them, and model-written procedures erased the gain
- The always-on file is reviewed like code and cut when it stops improving outcomes; generic content actively dilutes the rest

## Relationships

- [[context-engineering]] — is the loading policy that practice implies: if the window is a depleting resource curated per turn, standing instructions have to be tiered by whether they earn residence every turn or only when their trigger fires
- [[skill-enforced-development-workflow]] — pushes the on-demand tier to its limit by chaining procedure files into a mandatory process, which is only affordable because those files arrive at phase boundaries instead of sitting resident and diluting attention throughout the session
- [[agent-harness]] — supplies the tier underneath this one — the harness author's system prompt covers tool use and harness conventions and is project-blind, which is precisely the gap these layers fill
- [[current-state-grounding]] — instruction layering names the alternative current-state grounding argues against for closing the same knowledge gap — layering more standing instructions into context, rather than querying a live source at the moment the gap opens.

## Applications

Auditing an oversized project config file by asking which lines have ever changed an outcome; deciding whether a new instruction belongs in the always-on file, in a triggered procedure file, or in the prompt for one task; resisting the temptation to have an agent generate its own instruction files.

## Sources

- https://newsletter.systemdesign.one/p/agentic-engineering

## See Also

- [[context-engineering]]
- [[skill-enforced-development-workflow]]
- [[agent-harness]]
