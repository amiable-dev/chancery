---
tags: [flashcards, ai-agents, context, failure-modes, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Context drift in long-running agent tasks — Flashcards

#flashcards/ai-agents

## Context drift: definition <!-- kb:card:b7053d -->
What is context drift in long-running agent tasks?
?
The failure where accumulated context silently stops describing the world being acted on — early tool outputs are retained verbatim, the underlying data changes, and the model has no way to tell which remembered observations have expired.

## Drift vs. context rot <!-- kb:card:7fbd42 -->
How does context drift differ from a model's declining reliability over long inputs (context rot), and how do the two interact?
?
Context rot is a property of the model; drift is a property of the run — stale content in the window also makes the still-valid facts harder to attend to, so the two compound.

## Why drift happens: append-only context <!-- kb:card:a59ad3 -->
Why does agent context drift happen mechanically?
?
Agent context is append-only by default while the environment is not — every tool call adds a snapshot timestamped nowhere useful, and nothing in the transcript marks a result as superseded, so a stale observation keeps its original authority.

## Three bounding mitigations <!-- kb:card:2f3c74 -->
What three mitigations bound context drift?
?
Clearing stale tool results as token limits approach (while preserving the conversational thread), extracting only the fields actually needed from a tool response, and capping the size of any single tool output.

## A design condition, not an edge case <!-- kb:card:e6220e -->
Why should drift bounds be set at design time rather than discovered during incident review?
?
Because for agents designed to run long, drift is a normal operating condition, not an edge case — so the bounds belong in the design.
