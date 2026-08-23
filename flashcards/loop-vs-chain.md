---
tags: [flashcards, ai-agents, loop-engineering]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Loop vs. Chain — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:03dcd5 -->
What is the difference between a "chain" and a "loop" in agent control flow?
?
A chain runs a fixed, linear sequence (A→B→C) regardless of any step's outcome. A loop is dynamic: the agent can discover a step failed, revise its approach, and only then proceed, or backtrack entirely. A loop continues until a task is genuinely complete, a stopping condition triggers, or the agent determines it can't proceed — not until a fixed number of steps have run.

## Why It Matters <!-- kb:card:d3f2a3 -->
Why can't a chain-shaped agent system recover from its own mistakes the way a loop-shaped one can?
?
A chain has no step for "go back and fix it" — its topology is fixed at design time, so a failure at step B just produces a broken output at step C. A loop treats failure as environment feedback and re-enters an earlier stage, which is a structural (not intelligence) precondition for unattended recovery.

## Recursive Goal <!-- kb:card:caf2e4 -->
What is the "recursive goal" framing, and how does it change the developer's role?
?
Instead of writing each next instruction (chain-style), the developer defines a purpose ("make the test suite pass") and the agent iterates toward it on its own — inspect, change, check, decide next move. The skill shifts from writing one precise instruction to designing a cycle trustworthy enough to walk away from.
