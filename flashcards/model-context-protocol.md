---
tags: [flashcards, mcp, ai-agents, protocols]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Model Context Protocol (MCP) — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:6b0da9 -->
What is the Model Context Protocol (MCP)?
?
An open protocol by Anthropic that standardises how LLM applications connect to external tools and data sources. An MCP server exposes typed tools and resources; an MCP client (the AI) discovers and invokes them. Replaces bespoke integrations with a single shared protocol.

## Components <!-- kb:card:8bd82c -->
What are the four main MCP primitives?
?
1. **Tool** — named callable with JSON Schema input; AI invokes it with a payload, gets structured response
2. **Resource** — URI-addressable read-only data source (data, not action)
3. **Prompt template** — server-provided snippets the AI can inject into context
4. **Sampling** — server requests AI to generate content (reverse direction)

## Transport <!-- kb:card:46272d -->
What transport options does MCP support?
?
- **stdio** — local subprocess; zero network overhead; suitable for private codebases
- **SSE** — HTTP server-sent events; suitable for remote servers
- **Streamable HTTP** — bidirectional; preferred for production remote servers

## Application <!-- kb:card:5fc9ee -->
When would you choose MCP over a custom API integration?
?
When you want the AI to discover and invoke capabilities at runtime without custom glue code. MCP gives tool self-description (name + schema in the AI's context), composability (multiple servers simultaneously), and transport flexibility. Use it when building reusable tools for AI clients.

## Relationship <!-- kb:card:863907 -->
How does MCP relate to MCP Tool Patterns?
?
MCP is the protocol; MCP Tool Patterns are design principles for building good tools on top of it — e.g., scoped context tools, progressive disclosure, structured outputs, idempotent reads.

## Currency Correction (2026-07-28 spec) <!-- kb:card:eb9e59 -->
Is Sampling still an actively-recommended MCP primitive?
?
No — as of the 2026-07-28 release candidate, Sampling is deprecated in favor of direct integration with LLM provider APIs (it keeps working for ≥12 months under MCP's deprecation policy). See [[mcp-extensions-architecture]] and [[mcp-stateless-protocol]] for the full 2026 revision.
