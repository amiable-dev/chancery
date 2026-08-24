---
title: Agent Skills format
date: 2026-08-24
tags:
  - concept
  - standards
  - ai-agents
  - context
status: draft
sources:
  - url: https://agentskills.io/home
---

# Agent Skills format

## Definition

**Agent Skills** is an open format — originated by Anthropic, released as an open standard — for packaging agent capabilities as a folder containing a SKILL.md file (name and description metadata plus task instructions), optionally bundling scripts, templates, and reference material, portable across any skills-compatible agent.

## Explanation

The format answers a context problem: agents are capable but lack the procedural and organisational knowledge to do real work reliably. Skills package that knowledge as version-controlled folders loaded through **progressive disclosure** in three stages — discovery (at startup only each skill's name and description load, enough to spot relevance), activation (a matching task pulls the full SKILL.md into context), and execution (the agent follows the instructions, running bundled code or reading referenced files as needed). Because full instructions load only on demand, an agent can hold many skills with a small standing context footprint. The design trades eager capability for context economy, and its portability claim — write once, use in any compliant client — depends on the format staying minimal: a folder and one markdown file.

## Key Properties

- A skill is a folder with SKILL.md: name + description metadata and instructions
- Three-stage progressive disclosure: discovery, activation, execution
- Standing context cost is names and descriptions only; instructions load on demand
- Open standard with multi-product adoption beyond its originator

## Relationships

- _No relationships recorded yet._

## Applications

Encoding a team's review checklist, deploy procedure, or house style as a reusable agent capability. Distributing domain expertise across different agent products without per-product rewrites.

## Sources

- https://agentskills.io/home

## See Also

- _None yet._
