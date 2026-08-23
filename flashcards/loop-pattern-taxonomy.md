---
tags: [flashcards, ai-agents, loop-engineering, patterns]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Loop Pattern Taxonomy — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:75e8e8 -->
What are the three baseline loop patterns and the task shape each one fits?
?
1. **Retry loop** — try, check, retry; fits atomic tasks with a clear pass/fail line
2. **Plan-execute-verify loop** — plan first, then execute and check step by step; fits ordered, multi-step work where an early mistake compounds
3. **Explore-narrow loop** — try several approaches, narrow toward the best intermediate signal; fits genuinely unfamiliar territory

## Failure Modes <!-- kb:card:d591a7 -->
What is the distinct failure mode for each of the three loop patterns?
?
- **Retry loop:** repeats the same broken approach indefinitely without varying strategy
- **Plan-execute-verify loop:** over-commits to a plan that turns out wrong partway through, instead of revising it
- **Explore-narrow loop:** burns context/tokens comparing multiple candidate paths, which is expensive by design

## Application <!-- kb:card:0c6b6e -->
When would applying an explore-narrow loop to a task be wasteful, and what pattern should have been used instead?
?
When the task is actually atomic and well-specified (e.g. writing a function against a known test) — an explore-narrow loop's cost of running/comparing multiple paths is unnecessary overhead. A retry loop would suffice.
