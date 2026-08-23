---
title: "Model Context Protocol (MCP)"
aliases: ["Model Context Protocol (MCP)"]
date: 2026-04-15
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [mcp, protocols]
tags: [concept, mcp, ai-agents, protocols, integration, anthropic, domain/standards, maturity/emerging, source-type/vendor-doc, topic/mcp, topic/protocols]
status: draft
sources:
  - url: https://modelcontextprotocol.io/
    hash: sha256:e78468e66c3efa9653c3b40215c930ae5d518e03eba48f9dac862dba1943567e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/news/model-context-protocol
    hash: sha256:8e1c6f1036c4140457594868deacdcbcfab81240e8e105b5fa8f4128eecaf1a4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://modelcontextprotocol.io/docs/concepts/tools
    hash: sha256:ab497fb5a75076aa46bcecce1dfeb6f114c243e3918937280f48111cc83b192d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
    hash: sha256:41ac604fbe79fbb905ca0b2bed18394fccab871c1fd521c363c5cc913881b227
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Model Context Protocol (MCP)

## Definition
An open protocol developed by Anthropic (2024) that standardises how LLM-based applications connect to external tools, data sources, and services. MCP defines a client/server contract through which an AI assistant (MCP client) discovers, invokes, and receives results from typed tools and resources exposed by MCP servers — enabling composable, transport-agnostic AI integrations without custom glue code.

## Explanation
Before MCP, every AI integration was bespoke: a coding assistant would need custom connectors for GitHub, Jira, Postgres, Slack, etc. MCP replaces this M×N integration problem with a single protocol both sides implement once.

**Protocol structure:**

- **MCP Server** — exposes capabilities (tools, resources, prompt templates) via a defined schema. Can be a local process (stdio) or a remote service (SSE/HTTP).
- **MCP Client** — the AI host (Claude, Cursor, Codex, etc.) that connects to one or more servers at session start, discovers their capabilities, and invokes tools at inference time.
- **Tool** — a named callable with a JSON Schema input spec. The AI reads the description and schema, decides when to call it, and receives a structured response.
- **Resource** — a URI-addressable read-only data source (e.g., file contents, database views, API responses). Distinct from tools: resources are *data*, tools are *actions*.
- **Prompt template** — server-provided prompt snippets the AI can inject into its context.
- **Sampling** — server can request the AI generate content on its behalf (reverse direction).

**Discovery flow:**
1. Client connects → server returns capability manifest (tools list + schemas)
2. AI includes tool descriptions in its context window
3. AI calls a tool → server executes → returns result → AI continues reasoning
4. Repeat until task complete

**Transport options:**
- `stdio` — local subprocess, zero network overhead; suitable for private codebases
- `SSE` — HTTP server-sent events; suitable for remote or shared servers
- `Streamable HTTP` — newer bidirectional variant; preferred for production remote servers

The protocol is language-agnostic: Anthropic publishes SDKs for Python, TypeScript, and others.

## Key Properties
- **Transport-agnostic** — same protocol over local stdio or remote HTTPS
- **Self-describing** — tool schemas are part of the AI's context; discovery is automatic
- **Composable** — AI can connect to multiple MCP servers simultaneously, combining their tools
- **Capability-scoped** — each server declares only what it exposes; AI can't call what isn't declared
- **Stateless tools by default** — simplifies testing and composition; stateful sessions require explicit lifecycle design
- **Open standard** — not Anthropic-exclusive; Claude, Cursor, Codex, VS Code, and others support it

## Relationships
- Foundation for [[mcp-tool-patterns]]: MCP is the protocol; tool patterns are how to design good tools on top of it
- Enables [[agentic-ai-platform-architecture]] Layer 1 (orchestration): tool catalogs are implemented as MCP servers
- Related to [[agent-harness]]: MCP servers are a form of agent harness — they define the agent's action space
- Related to [[constrained-agent-actions]]: typed schemas and explicit tool declarations constrain what agents can invoke
- Related to [[react-agent-pattern]]: ReAct agents treat tools as their action space; MCP formalises the tool contract

## Applications
- **Coding assistants:** Connect Claude/Cursor/Codex to local codebases, databases, or internal APIs without custom plugins
- **Enterprise tool catalogs:** Central MCP server registry; agents discover approved tools dynamically
- **Homelab automation:** [[openclaw|OpenClaw]] skills can expose capabilities as MCP servers consumable by any MCP-compatible agent
- **Multi-agent coordination:** Agents expose their own capabilities as MCP servers, allowing other agents to invoke them with a standard contract
- **Codebase-aware AI:** [[codebase-knowledge-graphs]] exposed via MCP tools; agents query structure rather than reading raw files

## 2026-07-28 Update: Protocol Becomes Stateless

The **2026-07-28** release candidate (finalizing July 28, 2026; current in-force spec is still 2025-11-25) is the largest revision since launch and changes several claims above:

- **Discovery flow is no longer a one-time handshake.** The `initialize`/`initialized` exchange and `Mcp-Session-Id` are both removed. Protocol version, client info, and capabilities now travel in `_meta` on every request; any server instance can handle any request. See [[mcp-stateless-protocol]] for the full mechanics.
- **Sampling is deprecated**, not just a "reverse-direction" primitive — replaced by direct integration with LLM provider APIs. Roots and Logging are deprecated too (replaced by tool parameters/resource URIs, and OpenTelemetry, respectively). All three keep working for at least 12 months under the new formal deprecation policy. The Logging→OTel handoff is paired with W3C Trace Context (`traceparent`/`tracestate`/`baggage`) getting fixed key names in `_meta`, so a trace can propagate through an MCP call as one span tree — see [[mcp-otel-trace-context-interlock]].
- **Prompt templates are joined by first-class Extensions** — reverse-DNS-namespaced, independently versioned add-ons living in their own repos. MCP Apps (sandboxed-iframe UIs) and Tasks (long-running work, demoted from core) are the first two. See [[mcp-extensions-architecture]].
- **Authorization is hardened against OAuth mix-up attacks** (`iss` validation per RFC 9207, OIDC `application_type` declaration, issuer-bound credentials). See [[mcp-oauth-mixup-hardening]].
- **Tool schemas move to full JSON Schema 2020-12**, and the missing-resource error code changes from custom `-32002` to standard JSON-RPC `-32602` — a breaking change for clients matching the old literal.

Net effect: "stateless tools by default... stateful sessions require explicit lifecycle design" (above) now applies to the *entire protocol*, not just tools — a remote MCP server can sit behind a plain round-robin load balancer with no shared session store.

## Study

> [!tip] Flashcards
> [[flashcards/model-context-protocol|Review flashcards for this concept]]

## Sources
- [Model Context Protocol (modelcontextprotocol.io)](https://modelcontextprotocol.io/) — official specification and SDK documentation
- [Introducing the Model Context Protocol (Anthropic blog)](https://www.anthropic.com/news/model-context-protocol) — original announcement, November 2024
- [MCP Tools documentation](https://modelcontextprotocol.io/docs/concepts/tools) — tool schema and calling conventions
- [The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) — stateless core, extensions, auth hardening; RC published ~2026-07-24

## See Also
- [[mcp-tool-patterns]]
- [[mcp-server-portal]] — enterprise governance layer for MCP access; centralised discovery, DLP, audit logging
- [[mcp-code-mode]] — token-efficient tool discovery via model-generated JS; 94%+ context reduction
- [[shadow-mcp-detection]] — detecting unauthorised MCP server usage via network traffic inspection
- [[platform-baked-governance]] — embedding MCP governance into monorepo templates
- [[mcp-stateless-protocol]] — the 2026-07-28 stateless core: handshake/session removal, explicit-handle state pattern
- [[mcp-extensions-architecture]] — first-class Extensions, MCP Apps, Tasks demotion
- [[mcp-otel-trace-context-interlock]] — Logging deprecation + W3C Trace Context in `_meta`, tying MCP calls into OTel traces end-to-end
- [[otel-genai-semantic-conventions]] — the OTel vocabulary MCP delegates observability to
- [[mcp-oauth-mixup-hardening]] — RFC 9207 `iss` validation and OIDC hardening for MCP auth
- [[agent-harness]]
- [[constrained-agent-actions]]
- [[agentic-ai-platform-architecture]]
- [[react-agent-pattern]]
- [[codebase-knowledge-graphs]]
