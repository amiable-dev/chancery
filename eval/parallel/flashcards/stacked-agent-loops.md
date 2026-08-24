---
tags: [flashcards, ai-agents, architecture, continuous-improvement, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Stacked production agent loops — Flashcards

#flashcards/ai-agents

## Stacked agent loops: definition <!-- kb:card:b6f3ec -->
What is the 'stacked agent loops' architecture in a production agent?
?
Four nested cycles: an agent loop (calls tools until the task is done), a verification loop (scores against a rubric, retries with feedback), an event-driven loop (real events trigger runs), and a hill-climbing loop (analyzes batches of run traces to rewrite the harness). Each outer layer automates progressively more.

## Hill-climbing loop's outer arrow <!-- kb:card:3d2b23 -->
How does the hill-climbing loop's feedback direction differ from the other three loops?
?
The other loops' feedback re-enters the top of their own cycle. The hill-climbing loop's output does not re-enter its own cycle — it reaches into and edits the inner loops instead, so each pass leaves them measurably better.

## Verification loop's cost <!-- kb:card:ebd6d5 -->
What cost does the verification loop add to every run, and when is that cost worth paying?
?
Added latency and tokens on every run; worth paying specifically where quality matters more than speed.

## Event-driven loop's effect <!-- kb:card:b9f45b -->
What triggers runs in the event-driven loop, and what does that make the agent become?
?
Webhooks, schedules, or arriving messages (not a person) trigger runs — the agent becomes a standing system component rather than a tool someone opens.

## What the hill-climbing loop rewrites <!-- kb:card:c65aa6 -->
What does the hill-climbing loop analyze, and what can it rewrite as a result?
?
It analyzes batches of run traces (tools called, grader feedback) and can rewrite the prompt, the grader, or a tool description.
