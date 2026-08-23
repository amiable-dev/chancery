---
title: "MCP Tool Patterns"
date: 2026-04-14
domain: ai-agents
maturity: established
source_type: practitioner
topics: [mcp, patterns, protocols]
tags: [concept, mcp, ai-agents, integration, protocols, architecture, domain/ai-agents, maturity/established, source-type/practitioner, topic/mcp, topic/patterns, topic/protocols]
status: draft

sources:
  - url: https://github.com/tirth8205/code-review-graph
    hash: sha256:d7e74fb196de158125034ca9490d0bf31b49b890ea3251b3ab0e209b0d34ba0d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://modelcontextprotocol.io/
    hash: sha256:e78468e66c3efa9653c3b40215c930ae5d518e03eba48f9dac862dba1943567e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://modelcontextprotocol.io/docs/concepts/tools
    hash: sha256:ab497fb5a75076aa46bcecce1dfeb6f114c243e3918937280f48111cc83b192d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# MCP Tool Patterns

## Definition
Design patterns for structuring, exposing, and consuming capabilities via the Model Context Protocol (MCP) — a standardised interface that allows AI assistants to invoke typed tools, access resources, and receive structured responses from external systems. MCP tool patterns define *how* capabilities are packaged and *what contracts* they expose to AI clients.

## Explanation
MCP (Model Context Protocol, from Anthropic) defines a standard server/client protocol where an MCP server exposes a catalogue of typed tools and resources, and an AI assistant (MCP client) discovers and calls them at inference time. The protocol handles serialisation, capability negotiation, and streaming — the patterns are about how to design tools well.

**Core MCP concepts:**
- **Tool:** A named, schema-typed callable. The AI sees the name, description, and input schema; calls it with a JSON payload; gets a structured response.
- **Resource:** A URI-addressable read-only data source (files, endpoints, live data). Tools are *actions*; resources are *data*.
- **Prompt template:** Server-provided prompt snippets the AI can include in its context.
- **Sampling:** Server can ask the AI to generate content on its behalf (reverse direction).

**Key tool design patterns:**

1. **Scoped context tools** — Tools that return precisely the context an AI needs for a task, not raw data. Example: `get_review_context(files_changed)` returns structural summaries instead of raw file content. Minimises token usage while maximising signal.

2. **Impact-first tools** — Tools that answer "what's affected?" before "what is it?". Example: `get_impact_radius(file_path)` before `read_file(path)`. Lets the AI reason about scope before reading.

3. **Layered granularity** — Expose tools at multiple abstraction levels: architecture overview → module summary → function detail. AI picks the right resolution for the task.

4. **[[progressive-disclosure-agents|Progressive disclosure]]** — Start with a summary tool; include a `has_more` field and a `get_details(id)` follow-up tool. Avoids flooding context with data the AI didn't ask for.

5. **Structured outputs** — Return typed JSON with explicit fields rather than free text. AI can reliably extract fields; downstream tools can chain on the output.

6. **Idempotent reads, explicit writes** — Read tools are always safe to call. Write or mutate tools are named clearly (`update_*`, `create_*`) and carry warnings in their descriptions.

**code-review-graph's 22 MCP tools** are a good reference implementation:
- `get_review_context` — scoped context for PR review (blast radius + structural summary)
- `get_impact_radius` — blast-radius traversal from a changed file
- `semantic_search` — vector search over code entities
- `get_architecture_overview` — module-level coupling map
- `find_entry_points` — HTTP routes, CLI handlers, main functions
- `generate_wiki` — auto-generate documentation from graph
- `cross_repo_search` — multi-repository semantic search

## Key Properties
- MCP is transport-agnostic (stdio for local, SSE/HTTP for remote)
- Tools are self-describing: name + description + JSON schema — the AI reads these at connect time
- Stateless tools are easier to test and compose; stateful tools (e.g., session-scoped) require explicit lifecycle management
- Tool descriptions are part of the prompt — write them for AI readability, not human readability
- Tool count matters: 22 tools is workable; 200+ tools requires dynamic tool selection or namespacing

## Relationships
- Enables [[codebase-knowledge-graphs]] to be consumed by AI assistants: the graph lives on the server; tools expose query capabilities
- Related to [[react-agent-pattern]]: ReAct agents use tools as their action space; MCP formalises the tool contract
- Related to [[agent-harness]]: MCP servers are a form of agent harness — they define what the agent can do and how
- Related to [[prompts-as-infrastructure]]: tool descriptions and prompt templates in MCP servers are a form of infrastructure-managed prompting
- Related to [[constrained-agent-actions]]: MCP's explicit tool schema and typed inputs are a mechanism for constraining what agents can do

## Applications
- **Codebase-aware coding assistants:** Expose structural graph queries via MCP so Claude Code / Cursor / Codex get precise context without reading entire repos
- **Local-first AI tooling:** MCP over stdio lets tools run locally with no network calls — appropriate for private codebases
- **Composable agent capabilities:** Design MCP servers as building blocks; an agent can connect to multiple MCP servers and compose their tools
- **API surface design for AI:** When building any backend that AI agents will call, MCP tool patterns provide a tested vocabulary for API design
- **[[openclaw|OpenClaw]] skills as MCP servers:** Skills could be exposed as MCP servers, letting external agents call them via standard protocol

## Study

> [!tip] Flashcards
> [[flashcards/mcp-tool-patterns|Review flashcards for this concept]]

## Sources
- [code-review-graph (GitHub)](https://github.com/tirth8205/code-review-graph) — 22-tool MCP server reference implementation
- [Model Context Protocol (modelcontextprotocol.io)](https://modelcontextprotocol.io/) — official protocol specification
- [MCP Tools documentation](https://modelcontextprotocol.io/docs/concepts/tools) — tool schema, calling conventions

## See Also
- [[model-context-protocol]] — the underlying protocol these patterns build on
- [[mcp-stateless-protocol]] — the 2026-07-28 spec moves tool schemas to full JSON Schema 2020-12; tool designers should bound schema depth per the spec's injection/DoS guard
- [[mcp-code-mode]] — Code Mode takes progressive disclosure to its extreme; model writes JS to discover tools on demand
- [[mcp-server-portal]] — portals aggregate multiple MCP servers; Code Mode is activated at the portal layer
- [[codebase-knowledge-graphs]]
- [[ast-based-code-analysis]]
- [[react-agent-pattern]]
- [[constrained-agent-actions]]
- [[agent-harness]]
