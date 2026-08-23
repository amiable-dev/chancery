---
title: "Spec-Driven Development"
date: 2026-05-21
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [workflow, agentic-coding]
tags: [concept, ai-agents, engineering, workflow, process, specifications, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/workflow, topic/agentic-coding]
status: draft
sources:
  - url: https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts
    hash: sha256:48cbeb1d2cba082fd5540d215f39ae992c00da84156ad65c22a798933b87a9e0
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Spec-Driven Development

## Definition

A development approach in which a human author creates explicit specifications — defining the "why" and "what" — before handing off to an AI agent for implementation. Specs include constraints and validation criteria that guide the agent toward more consistent, less-debugging-intensive outputs than pure prompt-driven development. The second of three levels in the [[agentic-agile|Agentic-Agile]] maturity ladder.

## Explanation

Spec-Driven Development addresses the primary failure mode of prompt-driven development: nondeterminism born of ambiguity. By writing explicit specifications before inviting agent execution, developers:

- Define the expected outputs and constraints upfront
- Give the agent a reference to check its work against
- Reduce the surface area of "emergent" behaviour

**Why it works better than prompt-driven:**
A spec is a shared contract — the developer and agent both hold the same reference. Prompt-driven sessions end when the developer feels satisfied; spec-driven sessions end when the spec is satisfied. That's a more objective, reproducible completion condition.

**Where it breaks down at scale:**
Spec-Driven Development doesn't provide a backlog lifecycle or change governance. As the project grows:

1. **Spec drift** — Agents tasked with implementing against a spec will also *update* the spec if not explicitly constrained. Design docs written by agents drift from original intent, creating conflicting information that confuses subsequent agents.
2. **No phased delivery** — Specs describe a target state but don't structure work into incremental deliverables. Everything is attempted at once.
3. **No parallelism support** — Multiple agents working from different specs can collide on the same files without explicit ownership constraints.
4. **No retrospective loop** — There's no structured mechanism for improving specifications or process over time.

The upgrade from Spec-Driven to [[agentic-agile|Agentic-Agile]] addresses all four failure modes: backlog lifecycle, phased delivery, file ownership per wave, and retrospectives.

**The key insight:** Spec-Driven Development is a significant improvement over prompt-driven for individual tasks, but treating a collection of specs as a substitute for a managed backlog misses the coordination and governance layer that makes teams (human or hybrid) function reliably at scale.

## Key Properties

- Specs define "why" and "what", not just "do this"
- Validation criteria are explicit — the agent has a pass/fail reference, not just a vibe
- Improvement over prompt-driven for bounded tasks; insufficient for multi-module or long-horizon projects
- Spec maintenance is its own unaddressed failure mode — specs drift unless explicitly locked or governed

## Relationships

- Superseded by [[agentic-agile|Agentic-Agile]]: Agentic-Agile adds backlog lifecycle and governance that Spec-Driven lacks at scale
- Prerequisite for [[contract-driven-execution|Contract-Driven Execution]]: contracts are specs that have been promoted to formal commitments with explicit invariants and exit conditions
- Related to [[agentic-sdlc|Agentic SDLC]]: Spec-Driven is an informal precursor to the structured specification phases in ASDLC

## Applications

**When Spec-Driven Development is sufficient:**
- Solo projects with a single agent, single developer, bounded scope
- Short-lived tasks: generating a module, prototyping an API, writing tests for a known interface
- Situations where parallelism, long context windows, and change governance aren't required

**Signs you've outgrown it:**
- Agents are updating specs during implementation (spec drift)
- Two agents working in parallel are touching the same files
- You're discovering scope during implementation, not during planning
- Review loops are getting longer as the codebase grows

## Sources

- [Agentic-Agile: Why Agent Development Needs Agile (Not Just Prompts)](https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts) — Microsoft; defines the three-level maturity ladder: Prompt-Driven → Spec-Driven → Agentic-Agile

## See Also

- [[agentic-agile]]
- [[contract-driven-execution]]
- [[agentic-sdlc]]
- [[specification-driven-development]]: related concept — focuses on the DevOps practice of versioned spec files rather than the maturity ladder framing
