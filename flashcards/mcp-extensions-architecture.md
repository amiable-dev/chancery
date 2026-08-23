---
tags: [flashcards, mcp, protocols, governance]
sr-due: 2026-07-27
sr-interval: 1
sr-ease: 250
---

# MCP Extensions Architecture — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:075d95 -->
What is an MCP Extension (SEP-2133), and how is it identified?
?
An independently-versioned, optional protocol capability that lives in its own repo with delegated maintainers, negotiated via an `extensions` capability map. It's identified by a reverse-DNS ID (e.g. `io.modelcontextprotocol/apps`) to prevent naming collisions across maintainers.

## Application <!-- kb:card:2a7dd9 -->
Why does MCP Apps require tools to declare UI templates ahead of time instead of returning arbitrary HTML at call time?
?
So hosts can prefetch, cache, and security-review the UI before anything runs. The UI renders in a sandboxed iframe, and any user action inside it still goes through the same audit/consent path as a direct tool call — pre-declaration prevents arbitrary runtime HTML from being an implicit trust escalation.

## Relationship <!-- kb:card:64412e -->
Why was the Tasks API demoted from core to an extension in 2026-07-28, and what specifically broke?
?
Because it can't be scoped safely without a protocol-level session, and the stateless core removed sessions entirely (see [[mcp-stateless-protocol]]). `tasks/list` was removed outright — there's no session to scope "my tasks" against. Anyone using the experimental 2025-11-25 core Tasks API must migrate to the extension.

## Governance <!-- kb:card:b2daaf -->
Under MCP's new formal deprecation policy, what's the minimum time between a feature being deprecated and being removed?
?
At least 12 months. Every feature moves through Active → Deprecated → Removed states; Roots, Sampling, and Logging are the first features deprecated under this policy and remain functional during that window.
