---
tags: [flashcards, security, mcp, architecture, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP control-plane layers — Flashcards

#flashcards/security

## Definition <!-- kb:card:3f64de -->
What are the four MCP control-plane layers, and what claim do they support?
?
Safe tool execution, an isolated management plane, a bounded outbound trust boundary, and semantic integrity of tool definitions over time — supporting the claim that securing MCP is a question of where enforcement sits, not a feature a gateway can supply.

## What a gateway actually covers <!-- kb:card:628236 -->
How much of the four-layer model does a typical MCP gateway (auth, authorization, audit, rate limiting) actually cover?
?
Only two of the four layers, and only partially — it does not address safe tool execution or the semantic integrity of tool definitions.

## Execution layer rule <!-- kb:card:3b1530 -->
What is the single rule for the safe tool execution layer, and how is it enforced?
?
A tool handler must treat its arguments as data, never as instructions — enforced by passing arguments as arrays instead of interpolating them into shell strings, and gated in CI by static rules flagging dynamic interpreters and shell-invoking calls.

## Why the management plane is isolated <!-- kb:card:147646 -->
Why does the management plane (inspectors, testing harnesses, admin consoles) get its own enforcement layer?
?
Development environments usually hold more access than production — source, secrets, build systems, deployment credentials — so compromising the management plane hands over where trust is granted, not just a single tool call.

## Outbound trust boundary <!-- kb:card:b23897 -->
Why isn't inbound authentication enough to secure what a running MCP server can reach outbound?
?
Inbound authentication does nothing about a server tricked into making an outbound call with its own managed identity; the fix is a network-layer egress allow-list plus per-purpose scoped credentials.

## Manifest pinning <!-- kb:card:f9d199 -->
How does manifest pinning address semantic integrity, the layer with "no ready-made answer"?
?
It canonicalises a tool's name, description and parameter schema at registration, hashes them as a signed baseline, and on reconnect compares against that hash — routing differences to a classifier that separates cosmetic from material change, rather than a binary allow/deny gate.
