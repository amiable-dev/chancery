---
tags: [flashcards, ai-agents, mcp, tool-design, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent tool ergonomics — Flashcards

#flashcards/ai-agents

## Definition: agent tool ergonomics <!-- kb:card:5b3e7b -->
What is agent tool ergonomics, and what governing constraint does it design against?
?
The design discipline for software whose caller is non-deterministic — it treats the agent's context as the scarce resource, so a tool must return the smallest high-signal result rather than mirror an existing API's shape.

## Workflow-shaped consolidation <!-- kb:card:9fe019 -->
What is the characteristic tool-design failure, and what fix does agent tool ergonomics prescribe?
?
Wrapping existing endpoints one-for-one, which forces the agent to brute-force search inside its own context — the fix is fewer, workflow-shaped tools that absorb multi-step operations into deterministic code instead of agent reasoning.

## Response shaping: identifiers & format <!-- kb:card:2a7743 -->
What two response-shaping techniques does agent tool ergonomics recommend for tool output?
?
Resolve opaque UUIDs into semantically meaningful names, and expose a response-format enum (concise vs. detailed) when both are genuinely needed — one documented case cut token use to about a third.

## Bounding response quantity <!-- kb:card:d39ce2 -->
How should tool responses be bounded by default, and how should truncation notices or errors be written?
?
By default via pagination, filtering, range selection and truncation (Claude Code caps at 25,000 tokens) — and truncation notices and errors should read as prompt surface, naming the fix rather than an opaque code.

## Tuning tool descriptions <!-- kb:card:1398ce -->
Why is the tool description called the highest-leverage lever, and how is it tuned?
?
It's the most direct instruction surface, written like briefing a new hire — and it's only tunable against an eval harness: realistic multi-call tasks with verifiable outcomes, scored on tokens, errors and accuracy together.
