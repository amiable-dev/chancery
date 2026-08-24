---
tags: [flashcards, standards, mcp, governance, domain/standards, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP extensions framework — Flashcards

#flashcards/standards

## MCP extensions framework — definition <!-- kb:card:04e5d3 -->
What is the MCP extensions framework (SEP-2133) and what four structural features distinguish an extension from a core protocol capability?
?
It gives protocol capabilities a home outside the core spec: extensions carry reverse-DNS identifiers, are negotiated via an extensions capability map, live in their own delegated-maintainer repositories, and version independently.

## Extensions Track stages <!-- kb:card:15f7e0 -->
What is the Extensions Track, and what progression does it formalize?
?
A staged maturity path for extensions, formalizing progression from experimental to official before (if ever) entering the core specification.

## MCP Apps as official extension <!-- kb:card:87cda3 -->
How does the MCP Apps extension let servers ship interactive UI safely?
?
Servers ship interactive HTML rendered in a sandboxed iframe; UI templates are pre-declared so hosts can prefetch and security-review them, and all UI-initiated actions travel the same JSON-RPC path (same audit/consent controls) as direct tool calls.

## Why Tasks became an extension <!-- kb:card:fad2b6 -->
Why was Tasks pulled out of MCP core, where it shipped experimental in 2025-11-25, and reshaped as an extension?
?
Production use surfaced enough redesign need that it was rebuilt around the stateless core model: a server returns a task handle from tools/call, the client drives tasks/get/update/cancel, creation is server-directed, and tasks/list was removed because it can't be scoped safely without sessions.

## Extensions framework — meta-lesson <!-- kb:card:2cf21a -->
What lesson do the 2026-07-28 MCP release notes draw about how capabilities should ship going forward?
?
Extensions are now the standard way capabilities ship and stabilize before, if ever, entering the core specification.
