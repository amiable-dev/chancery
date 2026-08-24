---
title: Agent harness
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: vendor-doc
tags: [concept, ai-agents, architecture, context, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.langchain.com/blog/the-anatomy-of-an-agent-harness
    hash: sha256:ec5b45fc8e270eeaa1a074e13524209f6fff056e41c93584127f32fa5aad1c50
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Agent harness

## Definition

An **agent harness** is everything in an agent system that is not the model — system prompts, tools and their descriptions, bundled infrastructure such as filesystems, sandboxes, and browsers, orchestration logic for spawning and routing subagents, and hooks or middleware for deterministic steps like compaction and lint checks — under the framing agent = model + harness: the model supplies raw intelligence, and the harness supplies every capability models lack out of the box, from durable state to code execution to verification.

## Explanation

The definition is a boundary rule — if it is not the model, it is the harness — and its value is the design method it forces: start from a behavior the raw model cannot produce and derive the feature that supplies it. Models take in data and emit tokens; out of the box they cannot hold durable state, execute code, reach past their training cutoff, or configure an environment. So harnesses ship a filesystem (workspace, context offload, cross-session persistence, and a coordination surface for multiple agents and humans), a bash tool (code execution as the general-purpose action, so no one pre-builds every tool), sandboxes with default tooling (safe isolated execution plus browsers, logs, and test runners that close self-verification loops), memory files and search (context injection is the only way to add knowledge without touching weights), and context-rot countermeasures — compaction when the window nears full, offloading bulky tool outputs to disk, progressive disclosure of skill instructions. For long-horizon work these primitives compound: plan files, verification hooks, and continuation loops that restart a clean context against the same completion goal. The source is a LangChain essay — a vendor that sells a harness library — but the framing is mechanism-level: each component is derivable from a named model limitation, and the harness is what turns model intelligence into completed work.

## Key Properties

- Boundary rule: every piece of code, configuration, and execution logic that is not the model is harness
- Component classes: system prompts, tools and skills, bundled infrastructure, orchestration logic, deterministic hooks and middleware
- Design method: work backwards from a desired behavior the raw model lacks to the harness feature that produces it
- The filesystem is the foundational primitive — workspace, context offload, persistence, and multi-agent coordination surface
- Much of a harness is context management: compaction, tool-output offloading, and progressive disclosure against context rot

## Relationships

- [[model-harness-coevolution]] — explains why the same model performs differently across harnesses — the harness is a large enough share of the system to be post-trained into
- [[agent-skills-format]] — skills are one of its named context-management primitives — the harness loads only skill metadata at start and pulls full instructions on demand
- [[code-mode-mcp]] — instantiates its bash-and-code principle — rather than pre-building every tool, hand the model a programmable interface and let written code compose the actions

## Applications

Scoping what to build around a chosen model — sandbox, tools, memory files, compaction, and verification loops become explicit design decisions; diagnosing agent failures by asking which missing harness feature (durable state, verification, context management) the model is being forced to compensate for.

## Sources

- https://www.langchain.com/blog/the-anatomy-of-an-agent-harness

## See Also

- [[model-harness-coevolution]]
- [[agent-skills-format]]
