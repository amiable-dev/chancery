---
tags: [flashcards, mcp, observability]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# MCP↔OTel Trace Context Interlock — Flashcards

#flashcards/mcp

## Definition <!-- kb:card:4b2981 -->
What is the MCP↔OTel trace context interlock?
?
The pairing, in the MCP 2026-07-28 revision, of (a) deprecating MCP's own Logging feature in favour of OpenTelemetry and (b) fixing W3C Trace Context key names (`traceparent`, `tracestate`, `baggage`) inside MCP's `_meta` field — so a trace can propagate through an MCP server call and appear as one span tree in an OTel backend instead of disconnected fragments.

## Application <!-- kb:card:966d86 -->
What problem existed before this interlock that it directly fixes?
?
An MCP server call was a place a distributed trace could silently break — there was no standard field for propagating trace context across that protocol boundary, so a request crossing into and out of an MCP server produced separate, disconnected traces on each side.

## Relationship <!-- kb:card:8f7b7e -->
How does this interlock relate to MCP's other 2026-07-28 changes (stateless core, deprecated Sampling/Roots)?
?
It's part of the same spec revision and shares its theme: replacing bespoke MCP-specific mechanisms with standard, externally-defined ones. The stateless core adopts plain HTTP statelessness; the trace interlock adopts W3C Trace Context — see [[mcp-stateless-protocol]] and [[model-context-protocol]].
