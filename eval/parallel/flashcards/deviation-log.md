---
tags: [flashcards, ai-agents, software-engineering, observability, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Deviation log — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:8a07bd -->
What is a deviation log?
?
A running record an agent keeps during autonomous execution of every point where reality forced it off the agreed plan, together with the choice it made and why — governed by a standing rule to prefer the conservative option, record the departure, and keep going.

## Key mechanism <!-- kb:card:3f4b72 -->
Why can't an agent's deviations from the plan be reconstructed from the diff alone?
?
A diff shows what was written, not which of the writer's assumptions were abandoned along the way — deviations are invisible in a diff.

## Three-part instruction <!-- kb:card:fbac08 -->
What three parts does the deviation-log instruction need to actually work?
?
A named file to log to, a default policy for the moment of deviation (typically the conservative option), and an explicit rule to continue rather than stop.

## Compounding across attempts <!-- kb:card:832462 -->
How does a deviation log make a second attempt at a task better-informed than the first?
?
The plan, prototype and deviation log are compact artifacts rather than a conversation, so a fresh session can start from them with a clean context window that still carries what the previous run learned.

## Scope <!-- kb:card:f46a21 -->
Why does a deviation log stay short enough to read?
?
It records only departures from the plan, not a full narration of the run.
