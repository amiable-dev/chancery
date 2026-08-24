---
tags: [flashcards, infrastructure, ai-agents, cost, domain/infrastructure, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Code Mode for MCP — Flashcards

#flashcards/infrastructure

## Definition <!-- kb:card:703cb5 -->
What does Code Mode replace a large MCP tool surface with, and how?
?
Two tools instead of many: a search tool where the model writes code to explore available tool definitions, and an execute tool where it writes code that calls them — so tool schemas never enter the context window wholesale.

## Measured effect <!-- kb:card:03997d -->
What reduction did Cloudflare measure by applying Code Mode, and what's the structurally important part of the result?
?
52 tools from four internal servers, costing ~9,400 tokens in definitions, collapsed to 2 portal tools at ~600 tokens — a 94% reduction. The structurally important part: this fixed cost does not grow as more servers connect.

## Execution mechanism <!-- kb:card:6a8665 -->
What actually happens when the model uses the execute tool?
?
The model writes one program, run in a sandboxed environment, where each upstream MCP tool is a callable function — chaining operations, filtering results, and handling errors in code, rather than making many separate round-trip tool calls.

## General principle <!-- kb:card:7414ff -->
What general principle does Code Mode illustrate beyond MCP specifically?
?
For large tool or operation surfaces, give the model a programmable interface to the catalogue rather than the catalogue itself — let code do the composition that would otherwise take many round-trips.
