---
tags: [flashcards, agents, architecture, taxonomy, llm]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Six-part agentic AI architecture taxonomy — Flashcards

#flashcards/agents

## The six concerns <!-- kb:card:22eb77 -->
What are the six architectural concerns in the six-part agentic AI architecture taxonomy?
?
Perception, Brain, Planning, Action, Tool Use, and Collaboration.

## Perception vs Brain <!-- kb:card:03feb1 -->
In this taxonomy, what does the 'Perception' concern cover versus the 'Brain' concern?
?
Perception is taking in state from the environment; Brain is the LLM-based reasoning core.

## Tool Use axis shift <!-- kb:card:2a4f77 -->
What shift is happening on the taxonomy's Tool Use axis?
?
A move from bespoke, fixed API integrations written per tool toward standardised protocols (e.g. Model Context Protocol, native computer-use interfaces) that let an agent discover and call capabilities it wasn't specifically coded against.

## Brain/Planning axis shift <!-- kb:card:987997 -->
What shift is happening on the taxonomy's Brain and Planning axes?
?
A move from linear, hand-coded reasoning procedures toward native inference-time reasoning models with a configurable reasoning budget.

## Collaboration's role <!-- kb:card:30861e -->
What does the Collaboration axis add when the taxonomy scales from a single agent to a multi-agent system?
?
It governs how each agent's individual Plans and Actions are coordinated with the others' — the same six concerns still apply per-agent, with Collaboration added on top.

## Evidentiary basis <!-- kb:card:21013b -->
What is the six-part taxonomy derived from, and what caveat does that leave?
?
A systematic review of published agent architectures, citing the specific systems that motivate each axis — but it remains one research group's proposed categorisation and could be displaced as designs shift.
