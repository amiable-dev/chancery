---
title: "Agentic Coding Loop"
date: 2026-07-04
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [agentic-coding, workflow]
tags: [concept, ai-agents, engineering, workflow, agentic-coding, automation, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/agentic-coding, topic/workflow]
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

# Agentic Coding Loop

## Definition

The innermost of three nested [[loop-engineering]] loops; the autonomous cycle in which a coding agent receives a product specification (and optionally a set of evals), writes code, tests its own output, and iterates until the implementation is bug-free and spec-compliant — all without requiring human intervention. Operates at sub-minute to minute timescales.

## Explanation

The agentic coding loop is the atomic unit of agentic software development. Before this loop existed as a deliberate engineering target, most coding-agent workflows required constant human intervention: the developer would watch the agent produce code, manually test it, describe the failures, and prompt again. The human was the feedback signal.

"Closing the loop" — the phrase that crystallised into the [[loop-engineering]] buzzword — specifically means giving the agent tools to observe its own outputs so it can complete this cycle without human involvement:

**The cycle:**
```
  ┌──────────────────────────────────────────────────────┐
  │                  Agentic Coding Loop                 │
  │                                                      │
  │  Read spec / evals                                   │
  │       ↓                                              │
  │  Write code                                          │
  │       ↓                                              │
  │  Run tests / open browser / lint                     │
  │       ↓                                              │
  │  Observe output ──── pass? ──→ DONE (report to dev)  │
  │       │                                              │
  │       └─── fail? ──→ analyse failure → back to Write │
  └──────────────────────────────────────────────────────┘
```

**What makes the loop autonomous:**
The agent needs *tools* to close the loop. Andrew Ng's example: while building a typing-practice app, his coding agent used a web browser to check what it had built "multiple times" before returning to him — working autonomously for ~1 hour. The browser was the observation mechanism.

Common tools that enable loop closure:
- **Test runners** — run unit/integration tests and read pass/fail output
- **Browser access** — visually inspect the running application
- **Linters/type-checkers** — catch syntax and type errors before running
- **Evals** — structured datasets with expected outputs; the agent grades its own implementation against them. Evals are particularly valuable when the same failure class recurs across iterations

**Loop frequency:**
Every few minutes, the coding agent may build and test a new version. The faster the inner loop runs, the more iterations the agent completes before needing the developer's attention. Loop latency is therefore a key engineering metric — slow tests, slow builds, or expensive browser checks all add friction to every iteration.

**Evals vs. tests:**
Tests assert correctness of specific logic units. Evals measure behavioural fitness against a dataset. Evals are more valuable for loop engineering when: (a) the spec involves subjective output quality (UI, copy), (b) the failure mode is distributional rather than binary, or (c) the agent keeps failing the same scenario in different ways.

## Key Properties

- **Autonomous** — no human intervention required between iterations
- **Self-observing** — agent uses tools (browser, test runner, linter) to assess its own output
- **Spec-anchored** — the product specification is the loop's termination condition; the agent iterates until spec is satisfied
- **Fast-cadence** — operates at sub-minute to ~minute intervals; iteration frequency is a key performance metric
- **Eval-augmentable** — evals convert recurring failure patterns into graded self-assessment, reducing ambiguity in termination conditions

## Relationships

- Part of [[loop-engineering]]: the innermost of three nested loops; primary target of loop engineering tooling investment
- Enabled by [[agent-harness]]: the harness provides test runners, browser access, and environment isolation that make the loop autonomous
- Driven by [[spec-driven-development]]: the product spec is the loop's input and termination criterion
- Informed by [[developer-feedback-loop]]: when the developer reviews and re-steers, they update the spec or evals — new inputs to the next inner-loop run
- Related to [[context-engineering]]: the quality of context injected into each iteration (spec clarity, eval quality, tool docs) directly affects how many iterations are needed
- Related to [[agentic-pipeline-verification]]: the loop's test/eval phase is a lightweight inline form of pipeline verification

## Applications

**Setting up an effective agentic coding loop:**
1. Write a precise spec before starting — vague specs increase iteration count
2. Configure tool access: at minimum, a test runner; ideally browser access for UI work
3. Build evals for any recurring failure pattern: if the agent keeps making the same kind of mistake, encode the correct behaviour as an eval
4. Use fast tests; a 30-second test suite per iteration is fine; a 5-minute suite creates friction
5. Set a budget — Ng's ~1-hour autonomous run is a reasonable upper bound before a developer review; longer runs risk drift from the developer's current intent

**Signs the loop is working well:**
- Agent returns with a passing implementation after several unsupervised iterations
- Failure reports are specific and actionable (test names, browser screenshots, lint output)
- Developer QA time is shrinking; fewer "I found a bug you missed" cycles

**Signs the loop needs attention:**
- Agent keeps cycling without converging (spec is too vague, or evals contradict the spec)
- Agent returns after one iteration with "done" when it clearly isn't (missing observation tools)
- Test suite is too slow for useful iteration frequency

## Study
- Flashcards: [[flashcards/agentic-coding-loop|Practice this concept]]

## Sources

- [Andrew Ng, The Batch — "Three Key Loops for Building 0-to-1 Products" (June 2026)](https://x.com/AndrewYNg/status/2071988145667928442) — primary source
- [The Batch (deeplearning.ai)](https://charonhub.deeplearning.ai/three-key-loops-for-building-great-software/) — full letter text

## See Also

- [[loop-engineering]]
- [[developer-feedback-loop]]
- [[agent-harness]]
- [[spec-driven-development]]
- [[context-engineering]]
- [[agentic-pipeline-verification]]
