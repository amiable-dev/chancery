---
tags: [flashcards, ai-agents, architecture, reliability, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Checkpoint-and-resume agents — Flashcards

#flashcards/ai-agents

## State lives in a machine, not history <!-- kb:card:15015f -->
In checkpoint-and-resume agent architecture, what holds the agent's position instead of accumulated conversation history?
?
An explicit, durably persisted state machine — the current state is injected into the system prompt on every call, and each tool call atomically advances (checkpoints) that state.

## Three stateless failure modes fixed <!-- kb:card:1db633 -->
What three failure modes does checkpoint-and-resume fix that the stateless replay-history pattern suffers over multi-day workflows?
?
Prompt context pollution (history grows until the model loses track), token-cost growth from replaying every turn, and hallucinated intermediate steps (remembering approvals never given) after a long pause.

## Sleeping, not polling <!-- kb:card:ceff7e -->
How does a checkpoint-and-resume agent handle idle time and external events, instead of polling?
?
It sleeps; when a real-world event completes, a webhook hydrates the persisted session and applies an atomic state delta before the model's next call, so the agent wakes already knowing the transition happened.

## Tool calls double as checkpoints <!-- kb:card:beacbc -->
Why does making every tool call an atomic state transition matter for reliability?
?
Each tool call functions as a checkpoint, so a crash after any action resumes from the exact written state rather than losing progress or replaying history.

## Session state lives in a database <!-- kb:card:1776e4 -->
Where does session state live in this architecture, and what does that enable?
?
In a database rather than process memory, so a crash, restart, or scale-to-zero costs nothing — the process can pause indefinitely and resume exactly where it stopped.
