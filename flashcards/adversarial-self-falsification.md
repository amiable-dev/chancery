---
tags: [flashcards, ai-agents, security]
sr-due: 2026-07-21
sr-interval: 1
sr-ease: 250
---

# Adversarial Self-Falsification — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:d3f033 -->
What is adversarial self-falsification?
?
A quality-control pattern where an agent, after producing a candidate finding, is explicitly tasked with trying to disprove its own argument — searching for flawed assumptions, logic gaps, or blocking controls — and discards the finding if that search succeeds. The finding is reported only if it survives its own author's attempt to break it.

## Application <!-- kb:card:4c62c0 -->
When would you use adversarial self-falsification instead of (or alongside) independent multi-agent revalidation?
?
Use it as a cheaper first filter that catches errors the same reasoning chain can recognise once explicitly told to look for them (assumption gaps, logic errors) — then pair it with independent revalidation, which catches errors the original agent's own frame is structurally blind to. They compose rather than substitute for each other.

## Relationship <!-- kb:card:f8e3b6 -->
How does adversarial self-falsification differ from simply prompting a model to "double-check its work"?
?
A generic double-check invites confirmation because the model reviews its own output in the same mindset that produced it. Self-falsification changes the task framing: the agent must actively search for specific failure classes (unsupported assumptions, logic gaps, unmodeled controls) and treat "I couldn't find a way to break it" — not "it looks fine" — as the only passing condition.
