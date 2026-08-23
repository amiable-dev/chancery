---
title: "Loop Engineering"
date: 2026-07-04
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [agentic-coding, workflow, orchestration]
tags: [concept, ai-agents, engineering, workflow, agentic-coding, product-development, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/agentic-coding, topic/workflow, topic/orchestration]
status: draft
sources:
  - url: https://x.com/AndrewYNg/status/2071988145667928442
    hash: sha256:7164c37b668f26c389f12ec9464292410010389f028521a64da7c984d85d1582
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://charonhub.deeplearning.ai/three-key-loops-for-building-great-software/
    hash: sha256:6093802d561dc863784dcd1e8cc51936a0a3fad5d34c61abec541f36cb8437ca
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Loop Engineering

## Definition

A software development discipline focused on designing, optimising, and nesting the feedback loops through which AI coding agents iterate toward a working product. Rather than manually prompting an agent for each change, the developer engineers *the program that prompts the agent* — structuring autonomous iteration at multiple timescales so that agents can work productively with minimal human intervention at the innermost loop.

Coined/popularised by Boris Cherny (Claude Code) and Peter Steinberger (OpenClaw); synthesised as a product-development framework by Andrew Ng in The Batch (June 2026).

## Explanation

Before loop engineering, developer workflows with coding agents looked like extended conversations: prompt → review output → prompt again → review → repeat. The developer was effectively the QA function — manually finding bugs and feeding corrections back to the agent. The loop was tight but slow, gated entirely by human attention.

Loop engineering is the discipline of changing that topology. The key shift: **make the agent responsible for its own inner iteration loop**, so the developer's attention is freed for higher-level, higher-leverage decisions.

**The three nested loops (Andrew Ng's framework):**

```
┌─────────────────────────────────────────────────────────┐
│  External Feedback Loop  (hours → weeks)                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Developer Feedback Loop  (mins → hours)          │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Agentic Coding Loop  (seconds → minutes)   │  │  │
│  │  │  agent writes → tests → iterates           │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  developer reviews → steers agent                 │  │
│  └───────────────────────────────────────────────────┘  │
│  alpha users, A/B tests → informs vision               │
└─────────────────────────────────────────────────────────┘
```

The innermost [[agentic-coding-loop]] operates at sub-minute to minute resolution: the agent writes code, tests it (including opening a browser to check its own output), and iterates autonomously. This is where most tooling investment currently pays off.

The middle [[developer-feedback-loop]] operates at 10 minute–hour resolution: the developer reviews the product, makes product-level decisions, and re-steers the agent. This is where "taste" or [[context-advantage]] is injected.

The outer [[external-feedback-loop]] operates at hour–week resolution: real users, alpha testers, A/B tests. Informs the developer vision, which drives the spec, which drives the agent.

**"Closing the loop"** — the phrase that originally sparked the buzzword — specifically refers to the inner loop: giving agents tools (test runners, browsers, linters) so they can observe their own outputs and iterate to completion without human intervention.

**Why timescales matter:**
Each loop runs at a different clock speed. Confusing which loop you're in leads to misallocated effort. Loop engineering is partly the discipline of recognising which loop a given activity belongs to and investing in tooling proportional to that loop's frequency.

## Key Properties

- **Nested structure** — three loops operating at orders-of-magnitude different timescales
- **Tool-dependence at the inner loop** — the agentic coding loop requires the agent to have test runners, browser access, linters, or evals to observe its own output
- **Human "context injection" at the middle loop** — the developer's job shifts from QA to product steering; their value is [[context-advantage]] over the AI
- **Spec as interface** — the product specification is the handoff artifact from developer to agent; improving spec quality is a lever on every inner-loop iteration
- **Active area of invention** — mechanisms for engineering more effective inner loops (evals, harnesses, test scaffolds) are rapidly evolving

## Relationships

- Contains [[agentic-coding-loop]]: the innermost loop that loop engineering primarily optimises
- Contains [[developer-feedback-loop]]: the middle loop where developer "context injection" happens
- Contains [[external-feedback-loop]]: the outermost loop that grounds product vision in user reality
- Related to [[context-advantage]]: the human's irreplaceable role at the developer feedback loop is explained by context advantage, not ineffable "taste"
- Related to [[spec-driven-development]]: the product specification is the primary interface between developer and agent loops
- Related to [[agentic-sdlc]]: ASDLC provides the full lifecycle governance; loop engineering is its execution-time rhythm
- Related to [[agent-harness]]: the tooling infrastructure that makes the inner loop autonomous
- Related to [[context-engineering]]: the practice of shaping agent context at each loop iteration
- [[prompt-context-harness-loop-stack]] — is the top layer of the prompt to context to harness to loop progression

## Applications

**Engineering a better inner loop:**
- Give the agent test-running tools, browser access, and linters so it can observe its own outputs
- Write evals (test datasets + expected outputs) for recurring failure patterns; the agent uses these as a self-grading mechanism
- Prefer short tests that run quickly; slow test suites increase inner-loop latency
- Keep the spec precise: vague specs increase the number of inner-loop iterations needed

**Engineering a better developer feedback loop:**
- Make product state visible at a glance so reviews are quick — screenshots, hosted previews, structured diffs
- Explicitly separate your QA activity (finding bugs) from product steering (deciding what to build next); the former should shrink as the inner loop improves
- Use AI assistance to summarise usage data, customer feedback, and competitive signals so product decisions are better-informed

**Engineering a better external feedback loop:**
- Ship to real users earlier than feels comfortable; the inner loop can fix bugs fast once you know what's wrong
- A/B test product decisions rather than relying solely on developer intuition
- Build feedback collection into the product so signal flows back to the developer automatically

## Study
- Flashcards: [[flashcards/loop-engineering|Practice this concept]]
- Lab: Building Verification Loops In Claude Code With Skills — practical treatment of the *verification* loop specifically, with a hands-on skill smoke test and four reusable deployment patterns (standalone/embedded/chained/CI)

## Sources

- [Andrew Ng, The Batch — "Three Key Loops for Building 0-to-1 Products" (June 2026)](https://x.com/AndrewYNg/status/2071988145667928442) — primary source; defines the three-loop framework for product development with coding agents
- [The Batch (deeplearning.ai)](https://charonhub.deeplearning.ai/three-key-loops-for-building-great-software/) — full letter text

## See Also

- [[agentic-coding-loop]]
- [[developer-feedback-loop]]
- [[external-feedback-loop]]
- [[context-advantage]]
- [[spec-driven-development]]
- [[agentic-sdlc]]
- [[agent-harness]]
- [[context-engineering]]
