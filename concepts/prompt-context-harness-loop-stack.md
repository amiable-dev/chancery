---
title: "Prompt → Context → Harness → Loop (Engineering Stack Progression)"
aliases: ["Prompt → Context → Harness → Loop (Engineering Stack Progression)"]
date: 2026-07-26
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [agentic-coding, context-engineering]
tags: [concept, ai-agents, architecture, loop-engineering, context-engineering, agent-harness, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/agentic-coding, topic/context-engineering]
status: draft
sources:
  - url: https://machinelearningmastery.com/an-introduction-to-loop-engineering/
    hash: sha256:12827ca9008a2072a0862a8e34e4579b436864264922dd498d14c36456ee2ab3
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Prompt → Context → Harness → Loop (Engineering Stack Progression)

## Definition
A four-layer historical progression describing how the dominant skill for working with LLM-based agents shifted over 2022–2026: **prompt engineering** (wording individual instructions) → **context engineering** (curating everything the model sees at inference time) → **harness engineering** (building the scaffolding, tools, and constraints around the model) → **loop engineering** (designing the cycle that runs the harness repeatedly until a checkable goal is met). Each layer wraps and contains the ones before it rather than replacing them — a loop contains a harness, a harness contains context, and context contains prompts.

## Explanation
This progression is a useful timeline for understanding *why* loop engineering emerged when it did, and why it isn't a rejection of the earlier disciplines but a superset of them.

**Prompt engineering (~2022–2024):** the skill was wording — giving the model a role, breaking a task into steps, providing examples, asking it to reason step by step. It optimized *expression*. Its ceiling was real: even a perfectly worded prompt cannot hand the model facts it was never given.

**Context engineering (2025):** the focus moved from the words themselves to everything the model actually sees at the moment it responds — conversation history, retrieved documents, tool output, and any other assembled information. Shopify's Tobi Lütke's mid-2025 framing ("providing all the context needed for a task to be plausibly solvable by the model") and Anthropic's September 2025 formalization ("curating and maintaining the optimal set of tokens available during inference") both treat prompt engineering as one ingredient *within* context engineering rather than a separate discipline. See [[context-engineering]].

**Harness engineering (early 2026):** as agents began doing longer, more autonomous, multi-step work in production, the full environment around the model — scaffolding, tools, operating constraints, and the feedback loops that catch mistakes — became the engineering surface. The harness makes an agent *dependable* rather than merely *capable*, and it nests both prior layers: a harness contains context, and context contains prompts. See [[agent-harness]].

**Loop engineering (June 2026):** sits on top of all three. Where harness engineering asks *what environment* an agent needs, loop engineering asks a narrower, more operational question: *what cycle keeps the agent working toward the goal, and when exactly does that cycle stop?* None of the earlier layers are replaced — you still write prompts, still curate context, still build a harness — but loop engineering is the part where all of that gets put into motion and given a rhythm.

The progression is worth treating as a diagnostic tool: if an agent workflow is underperforming, the fix might live at any of the four layers, and it's easy to mistakenly try to fix a loop-level problem (bad termination logic) by tweaking a prompt, or a harness-level problem (missing tool access) by rewriting context.

## Key Properties
- **Nested, not sequential replacement** — each new layer wraps the previous ones; none of the earlier disciplines become obsolete
- **Increasing operational scope** — prompt (single utterance) → context (single inference call) → harness (single agent's full environment) → loop (repeated cycles of the harness over time)
- **Timescale correlates with layer** — prompt engineering optimizes a moment; loop engineering optimizes an unattended hour or more
- **Diagnostic utility** — failures at any layer can masquerade as failures at another; correctly locating the layer is itself a skill

## Relationships
- Culminates in [[loop-engineering]]: the outermost, most recent layer in the progression
- Builds on [[context-engineering]]: the second layer, formalized by Anthropic in 2025
- Builds on [[agent-harness]]: the third layer; the harness is what a loop repeatedly executes and observes
- Related to [[chain-of-thought-prompting]]: an example prompt-engineering-era technique that became one ingredient within later context-engineering practice rather than a standalone discipline

## Applications
- **Root-causing agent failures:** when an automation underperforms, check each layer in order — is the prompt clear? Is the right context present? Does the harness have the tools it needs? Does the loop have a correct termination/verification condition? — rather than assuming the fix is always "better prompting"
- **Explaining the "loop engineering" buzzword to skeptics:** framing it as the natural next layer in a known progression (rather than a wholesale replacement of prompting) makes the claim easier to evaluate and less prone to hype-driven dismissal
- **Planning tooling investment:** teams should identify which layer is currently the bottleneck for their agent workflows before investing further in prompt-wording or context-curation improvements that won't move the needle if the actual gap is at the harness or loop layer

## Sources
- [An Introduction to Loop Engineering — MachineLearningMastery.com (2026)](https://machinelearningmastery.com/an-introduction-to-loop-engineering/) — primary source; lays out the four-layer progression explicitly
- [Anthropic — Effective Context Engineering for AI Agents (Sept 2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — cited as the formalization of the context-engineering layer

## See Also
- [[loop-engineering]]
- [[context-engineering]]
- [[agent-harness]]
- [[chain-of-thought-prompting]]
