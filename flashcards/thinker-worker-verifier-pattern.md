---
tags: [flashcards, ai-agents, architecture, patterns, multi-agent]
sr-due: 2026-06-25
sr-interval: 1
sr-ease: 250
---

# Thinker-Worker-Verifier Pattern — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:832eef -->
What is the Thinker-Worker-Verifier (TWV) pattern?
?
A multi-agent role decomposition that assigns a task to three specialised roles: a **Thinker** (plans and reasons), a **Worker** (executes the plan), and a **Verifier** (independently checks correctness and flags errors) — coordinated by a lightweight orchestrator, enabling systematic quality control without self-review bias.

## Role responsibilities <!-- kb:card:f42117 -->
What are the three TWV roles and their primary responsibilities?
?
- **Thinker** — decomposes the goal; produces a reasoning chain, plan, or intermediate representation
- **Worker** — executes against the plan (writes code, calls tools, retrieves data)
- **Verifier** — independently assesses the Worker's output against the Thinker's plan; flags errors, requests correction

## Core problem solved <!-- kb:card:3650da -->
Why is separating Thinker from Worker cognitively important?
?
A single model asked to "think then do" in one context window tends to abbreviate thinking once it starts executing, especially under token pressure. Separate agents allow each to use their full context for their specific cognitive task, and allows assigning *different* models with complementary strengths to each role.

## Contrast <!-- kb:card:d6c25c -->
How does the TWV Verifier differ from multi-agent revalidation?
?
Multi-agent revalidation re-runs output through a second agent that re-judges it from scratch. The TWV Verifier also sees the Thinker's *original intent/plan*, enabling it to check whether the Worker faithfully executed the plan — a more precise check than judging output in isolation.

## Research origin <!-- kb:card:6a816b -->
What paper introduced the Thinker-Worker-Verifier pattern and where was it published?
?
**TRINITY: An Evolved LLM Coordinator** by Xu, Sun, Schwendeman, Nielsen, Cetin, Tang — published at ICLR 2026. TRINITY evolves a lightweight coordinator LM that learns which model to assign to each role for each task type.

## Application <!-- kb:card:cd1832 -->
When is the TWV pattern most valuable, and when should you NOT use it?
?
**Best for:** Tasks with objectively verifiable outputs (code, maths, structured extraction); long-horizon reasoning; situations where self-review bias is a concern.
**Avoid when:** Tasks are simple/single-turn (planning overhead exceeds benefit); verification is subjective (creative writing); latency is critical (3× LLM calls is too slow for interactive use).
