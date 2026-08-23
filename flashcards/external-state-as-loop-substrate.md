---
tags: [flashcards, ai-agents, loop-engineering, memory]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# External State as Loop Substrate — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:9dd2f1 -->
What is "external state" in the context of loop engineering, and why is it necessary?
?
A markdown file, board, or log that lives outside the model's weights and context window. It's necessary because the model has no memory between runs — whatever a loop learned or decided has to be written somewhere durable that the next run reads back on its own.

## Structure <!-- kb:card:7fca97 -->
In Addy Osmani's anatomy of loop-engineering building blocks, what is external memory's role relative to automations, worktrees, skills, connectors, and sub-agents?
?
It's named as the sixth, underlying piece — the layer none of the other five building blocks function without. Automations, skills, and sub-agents are all, in different ways, mechanisms for reading from and writing to this external state.

## Application <!-- kb:card:2b7db5 -->
What is the failure mode when a loop lacks proper external-state substrate, even if it appears to "improve" across runs?
?
The apparent improvement is really a human manually re-explaining context each time. The moment the human stops re-explaining, the loop reverts to zero — nothing was actually durably accumulated. (This vault's own MEMORY.md and daily notes are a concrete example of external state that avoids this failure mode.)
