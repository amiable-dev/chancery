---
tags: [flashcards, ai-agents, engineering, agentic-coding, automation]
sr-due: 2026-07-04
sr-interval: 1
sr-ease: 250
---

# Agentic Coding Loop — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:7ec0b6 -->
What is the agentic coding loop?
?
The innermost of the three loop engineering loops. An autonomous cycle in which a coding agent receives a product specification (and optionally evals), writes code, tests its own output using tools (test runners, browser, linter), and iterates until the implementation is bug-free and spec-compliant — without human intervention. Operates at sub-minute to minute timescales.

## Closing the Loop <!-- kb:card:c918d9 -->
What does "closing the loop" mean in the context of agentic coding?
?
Giving the agent tools to observe its own outputs so it can self-assess and iterate without a human in the cycle. The agent writes code, runs tests or opens a browser to check the result, reads the output, and decides whether to iterate or report completion. Without observation tools, the agent cannot close the loop.

## Evals vs Tests <!-- kb:card:61663a -->
How do evals differ from tests in the agentic coding loop?
?
**Tests** assert correctness of specific logic units (unit/integration tests; binary pass/fail). **Evals** measure behavioural fitness against a dataset — especially useful for distributional or subjective quality assessments where binary assertions don't capture the failure mode. Evals are most valuable when the agent keeps failing the same scenario in different ways across iterations.

## Application <!-- kb:card:41e937 -->
When should you add evals to an agentic coding loop?
?
When the agent repeatedly encounters the same failure class across iterations — evals convert that recurring failure into a graded self-assessment criterion, giving the agent an explicit signal to optimise against. Also useful when the spec involves qualitative output (UI, copy) where simple pass/fail assertions are insufficient.

## Loop Latency <!-- kb:card:f7d1e6 -->
Why does loop latency matter in the agentic coding loop?
?
Every iteration requires a full build-test-observe cycle. Slow tests (e.g., 5-minute suites) mean fewer iterations per unit of time, reducing how much autonomous work the agent can complete before a developer review. Optimising for fast tests and fast observation tools directly increases the number of iterations — and therefore the quality of autonomous output — per developer review cycle.
