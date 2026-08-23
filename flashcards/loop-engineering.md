---
tags: [flashcards, ai-agents, engineering, agentic-coding]
sr-due: 2026-07-04
sr-interval: 1
sr-ease: 250
---

# Loop Engineering — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:728aaa -->
What is loop engineering?
?
A software development discipline focused on designing and optimising the nested feedback loops through which AI coding agents iterate toward a working product. Rather than manually prompting an agent, the developer engineers the *program that prompts the agent* — structuring autonomous iteration at multiple timescales. Popularised by Boris Cherny (Claude Code) and Peter Steinberger (OpenClaw).

## Structure <!-- kb:card:44823d -->
What are the three nested loops in Andrew Ng's loop engineering framework, and at what timescales do they operate?
?
1. **Agentic coding loop** (seconds–minutes): agent writes, tests, iterates autonomously
2. **Developer feedback loop** (tens of minutes–hours): developer reviews, steers, updates spec
3. **External feedback loop** (hours–weeks): real users provide signal that informs developer vision

## Key Shift <!-- kb:card:632105 -->
What is the fundamental shift that loop engineering represents compared to prompt-driven coding agent use?
?
Moving from: developer-as-QA (manually finding bugs, prompting fixes) to: developer-as-product-steerer (making higher-level product decisions) — because the inner loop now handles autonomous testing and iteration. The developer's attention is liberated from bug-finding and directed toward higher-leverage decisions.

## Tooling Investment <!-- kb:card:6bd881 -->
Which loop is the primary target of loop engineering tooling investment, and why?
?
The agentic coding loop (inner loop) — because it runs most frequently (every few minutes) and every improvement compounds across all iterations. Tools like test runners, browser access, and evals reduce latency and increase the agent's ability to self-assess, directly improving product velocity.

## Spec Role <!-- kb:card:2e1609 -->
What is the role of the product specification in loop engineering?
?
The spec is the interface between the developer feedback loop and the agentic coding loop. It is the agent's termination criterion (iterate until spec is satisfied), the primary source of iteration efficiency (precise specs reduce iteration count), and the main artefact evolved by the developer during review cycles.
