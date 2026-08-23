---
title: "Blind Spot Pass"
date: 2026-07-08
domain: llm
maturity: emerging
source_type: practitioner
topics: [context-engineering, workflow]
tags: [concept, llm, prompt-engineering, workflows, agentic-coding, pre-task, domain/llm, maturity/emerging, source-type/practitioner, topic/context-engineering, topic/workflow]
status: draft
sources:
  - url: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
    hash: sha256:ddab0eb45dd176c5a5d118c577770304f076a84b2d8a65d68ed5670f43f44198
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.theaimarketers.ai/guidetofable5/
    hash: sha256:4407852af47b2bd452276f789b7ad23bb1374093994e758c8bb26c73ce6c31b8
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Blind Spot Pass

## Definition
A **blind spot pass** is a pre-task prompt technique where you explicitly ask an AI model to enumerate the traps, failure modes, prerequisites, and questions you didn't know to ask before beginning unfamiliar work — treating the model as a domain expert who can surface the map of unknowns you can't see from your current vantage point.

## Explanation
When starting work in an unfamiliar domain, most failures don't come from executing the wrong solution well — they come from not knowing what the right questions were in the first place. The gap between "what I asked for" and "what actually needed to happen" is where most projects go wrong.

A blind spot pass inverts the usual prompting direction. Instead of asking the model to *do* the task, you ask it to tell you *what you should have asked* before doing the task. This externalises unknown unknowns into explicit known unknowns you can address upfront.

**Example in practice:** Thariq Shihipar (Anthropic, Claude Code team) used a blind spot pass to colour-grade Claude Fable's launch video himself — with zero professional grading experience. Before touching any tooling, he asked the model to map the domain: what are the things someone without grading knowledge gets wrong? What are the decisions they don't know they need to make? The resulting map let him execute confidently in a domain he'd never touched.

**How to run one:**
1. Describe the task you're about to start
2. Describe your level of experience in the domain
3. Ask: "What are the questions I should be asking but haven't thought to ask? What are the traps and wrong turns for someone at my level? What assumptions am I probably making incorrectly?"
4. Use the output to refine your requirements and approach before writing a single line of code or making any structural decisions

The technique is especially valuable at the start of projects, before architectural choices, and whenever entering a new domain or codebase.

## Key Properties
- **Pre-task phase only** — happens before any implementation begins, not during
- **Domain-agnostic** — applies to code, design, writing, research, operations, any domain the model understands well
- **Asymmetric value** — a 2-minute blind spot pass can prevent hours of wrong-direction work
- **Recursive** — can be applied to sub-tasks as they emerge, not just top-level projects
- **Externalises unknown unknowns** — converts things you don't know you don't know into things you know you don't know

## Relationships
- Implements the Map Territory Gap strategy of closing the distance between requested task and actual task
- Complements [[show-dont-tell-prompting]]: both are pre-task techniques for surfacing what you don't know
- Precedes [[mockup-first-workflow]]: after a blind spot pass surfaces structural concerns, mockups test directional choices
- Relates to [[agentic-pipeline-verification]]: multi-model verification is a different form of unknown-surfacing applied post-implementation
- Supports Agent Autonomy Management by reducing the chance that a long autonomous run goes in the wrong direction from the start

## Applications
- **Entering an unfamiliar codebase:** Ask the model to enumerate the architectural gotchas, non-obvious abstractions, and common mistakes made by developers new to the codebase
- **Starting a new domain project:** Ask for the vocabulary, common failure modes, and unstated assumptions in the domain
- **Designing a system:** Ask what the model would have wanted to know before designing a similar system — what tradeoffs get discovered too late
- **Debugging a hard bug:** Ask what categories of bugs are commonly misdiagnosed as the symptom you're seeing
- **Writing or editing:** Ask what structural weaknesses typically appear in drafts of this type of content

## Sources
- [A Field Guide to Claude Fable 5: Finding Your Unknowns](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns) — original Anthropic blog post by Thariq Shihipar introducing the blind spot pass technique
- [AI Marketers summary](https://www.theaimarketers.ai/guidetofable5/) — newsletter summary with key insights from the guide

## See Also
- [[show-dont-tell-prompting]]
- [[mockup-first-workflow]]
- [[agentic-drift]]
- [[prompt-altitude]]
- [[prompts-as-infrastructure]]
