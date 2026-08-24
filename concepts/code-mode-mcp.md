---
title: Code Mode for MCP
aliases: ["Code Mode for MCP"]
date: 2026-08-24
domain: infrastructure
maturity: emerging
source_type: vendor-doc
tags: [concept, infrastructure, ai-agents, cost, domain/infrastructure, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://blog.cloudflare.com/enterprise-mcp/
    hash: sha256:b6afb82e86c514d9d7c7684b8c129302c2647fefc41d29ee4d12e0d003bdca89
    retrieved: 2026-08-24
    reachability: ok
    class: external-primary
---

# Code Mode for MCP

## Definition

**Code Mode** collapses an MCP surface of many tools into two — a search tool where the model writes code to explore available tool definitions, and an execute tool where it writes code that calls them — so tool schemas never enter the context window wholesale and the context cost stays fixed as servers are added.

## Explanation

Standard MCP defines one tool per operation and ships every schema to the client up front, which exhausts context for large surfaces: Cloudflare measured 52 tools from four internal servers costing roughly 9,400 tokens in definitions alone. Under Code Mode the model instead calls search to run code against a tools() listing — filtering and projecting definitions to find exactly what it needs — then writes one execute program in which each upstream tool is a callable function, chaining operations, filtering results, and handling errors in code, run in a sandboxed environment on the portal. The measured effect: 52 tools collapse to 2 portal tools at ~600 tokens, a 94% reduction, and — the structurally important part — the cost does not grow as more servers connect. A three-step workflow (find a ticket, fetch a document, update the ticket) becomes two tool calls: one discovery program, one execution program. The general principle extends beyond MCP: for large tool surfaces, give the model a programmable interface to the catalogue rather than the catalogue itself, and let code do the composition that would otherwise be many round-trips.

## Key Properties

- Two tools replace N: code-driven search over definitions, code-driven execute over calls
- Measured: 52 tools / ~9,400 tokens → 2 tools / ~600 tokens (94% reduction)
- Context cost is fixed regardless of how many servers connect
- Composition, filtering, and error handling move into sandboxed model-written code

## Relationships

- [[remote-first-mcp-governance]] — deploys at that architecture's portal layer, where progressive disclosure and audit already live
- [[agent-skills-format]] — both apply progressive disclosure to agent capability: skills load full instructions only when a task matches, Code Mode loads tool schemas only when model-written code requests them
- [[mcp-abstraction-tax]] — Code Mode is a specific mitigation for one of the costs the MCP abstraction tax names — collapsing the tool surface keeps the translation layer's context overhead fixed rather than compounding as servers are added.

## Applications

Connecting agents to platforms with hundreds or thousands of operations; keeping per-request context cost flat while the tool estate grows.

## Sources

- https://blog.cloudflare.com/enterprise-mcp/

## See Also

- [[remote-first-mcp-governance]]
