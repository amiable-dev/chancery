---
tags: [flashcards, mcp, token-efficiency, progressive-disclosure]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# MCP Code Mode — Flashcards

#flashcards/mcp

## Definition <!-- kb:card:c6723e -->
What is MCP Code Mode?
?
A pattern that replaces static, exhaustive tool catalogues with two meta-tools (`portal_codemode_search` and `portal_codemode_execute`). The model writes JavaScript to discover and invoke underlying tools on demand, rather than having all tool schemas loaded into context upfront.

## Token Economics <!-- kb:card:b764f0 -->
What are the token savings from MCP Code Mode, and why do they stay fixed?
?
52 tools across 4 servers costs ~9,400 tokens in standard MCP; with Code Mode it costs ~600 tokens — a 94% reduction. The cost stays fixed regardless of how many more servers are added, because the model only loads schemas for tools it explicitly searches for.

## Two Tools <!-- kb:card:7cb026 -->
What do `portal_codemode_search` and `portal_codemode_execute` do?
?
- `search`: model writes JS calling `codemode.tools()` to filter and discover tool names/schemas on demand
- `execute`: model writes JS using `codemode.<tool_name>(params)` to call tools, chain operations, and handle errors — all in one invocation

## Execution Environment <!-- kb:card:3a6dc3 -->
Where does model-generated JavaScript run in Code Mode, and why does that matter?
?
In a sandboxed server-side environment (e.g., Cloudflare Dynamic Workers). The model writes code but cannot execute arbitrary operations — only calls to tools available via the `codemode` proxy are permitted. This makes Code Mode a constrained-action pattern.

## Standard vs Code Mode <!-- kb:card:28a601 -->
When is Code Mode overkill vs genuinely valuable?
?
Overkill for a single MCP server with a handful of tools — the overhead of a discovery round-trip isn't worth it. Genuinely valuable when connecting many MCP servers (>~20 tools total), because context cost stays O(1) while standard MCP is O(N tools).

## Relationship to Progressive Disclosure <!-- kb:card:c57718 -->
How does Code Mode relate to the progressive disclosure tool pattern?
?
Code Mode takes progressive disclosure to its logical extreme: instead of the server returning a summary list that the model picks from, the model writes code to query and filter tool schemas on demand. The model controls the disclosure depth, not the server.
