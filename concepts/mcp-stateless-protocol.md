---
title: "MCP Stateless Protocol"
date: 2026-07-27
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [mcp, protocols]
tags: [concept, mcp, protocols, architecture, ai-agents, scalability, domain/standards, maturity/emerging, source-type/vendor-doc, topic/mcp, topic/protocols]
status: draft
sources:
  - url: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
    hash: sha256:41ac604fbe79fbb905ca0b2bed18394fccab871c1fd521c363c5cc913881b227
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/
    hash: sha256:d2db6fe82fe844d9280048ae4546987726d70338445411e14d10968af40b6b5e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# MCP Stateless Protocol

## Definition
The architectural shift, finalized in the MCP **2026-07-28** specification, that removes the protocol-level session entirely: the `initialize`/`initialized` handshake (SEP-2575) and the `Mcp-Session-Id` header (SEP-2567) are both deleted. Every request becomes self-contained — protocol version, client info, and capabilities travel in `_meta` on each call — so any server instance can service any request without sticky routing or a shared session store.

## Explanation
Under the prior spec (2025-11-25), a client had to establish a session before calling any tool:

```
POST /mcp   {"method":"initialize", "params":{"protocolVersion":"2025-11-25", ...}}
→ Mcp-Session-Id: 1868a90c-3a3f-4f5b        # pins client to this server instance
POST /mcp   Mcp-Session-Id: 1868a90c...     {"method":"tools/call", ...}
```

That `Mcp-Session-Id` pinned the client to whichever server instance issued it — the classic sticky-session problem that forces load balancers into affinity mode and requires a shared store if the instance dies.

Under 2026-07-28, the same call is one self-contained request:

```
POST /mcp
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: search
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{...,
  "_meta":{"io.modelcontextprotocol/clientInfo":{"name":"my-app","version":"1.0"}}}}
```

A new `server/discover` method replaces the old handshake for clients that want to fetch server capabilities up front — but it's optional, not a prerequisite for calling tools.

**Stateless protocol ≠ stateless application.** The spec doesn't forbid multi-call workflows; it just stops managing that state for you. A server that needs cross-call state (e.g., a shopping basket) mints an explicit handle — `basket_id`, `browser_id` — from a tool call, and the model passes that handle back as an ordinary argument on later calls. The MCP team argues this is *better* than hidden session state: the model can compose handles across tools and reason about them explicitly, rather than state being buried invisibly in transport metadata.

**Server-to-client requests were rebuilt to fit.** A stateless protocol still needs a way for a server to ask the client something mid-call (e.g., an elicitation prompt). Two SEPs solve this without a persistent connection:
- Server-initiated requests may now *only* be issued while the server is actively processing a client request (SEP-2260) — previously a recommendation, now required. A user is never prompted out of nowhere.
- **Multi Round-Trip Requests** (SEP-2322) replace the held-open SSE stream: the server returns an `InputRequiredResult` carrying `inputRequests` plus an opaque `requestState`; the client gathers answers and re-issues the original call with `inputResponses` and the echoed state. Any server instance can pick up the retry — the "session" is now just a value threaded through requests, not a transport-level pin.

**Operability side effects:** required `Mcp-Method`/`Mcp-Name` headers (SEP-2243) let gateways and rate-limiters route without body inspection; `ttlMs`/`cacheScope` on list/read results (SEP-2549) let clients cache `tools/list` the way HTTP `Cache-Control` caches responses.

## Key Properties
- Protocol version/capabilities negotiated per-request via `_meta`, not once at connection time
- No server-side session store required; any instance can answer any request
- Cross-call application state becomes an explicit, model-visible handle instead of hidden transport state
- Server-initiated mid-call requests are scoped to the request they arose from and survive across retries via `requestState`, not a persistent connection
- Enables plain round-robin load balancing for remote MCP servers — no sticky routing infrastructure needed

## Relationships
- Revises [[model-context-protocol]]: this is the core architectural change in the 2026-07-28 spec revision
- Complements [[mcp-extensions-architecture]]: Tasks (long-running work) was demoted to an extension specifically because it couldn't be scoped safely without sessions
- Related to [[agent-sse-event-stream]]: Multi Round-Trip Requests replace the held-open SSE pattern for server-initiated mid-call requests
- Related to [[ai-llm-gateway]]: required routing headers (`Mcp-Method`/`Mcp-Name`) are designed for exactly this kind of infrastructure

## Applications
- **Horizontally-scaled remote MCP servers:** deploy behind a stock round-robin load balancer instead of building sticky-session infrastructure
- **Multi-step tool workflows:** design tools to mint and return explicit handles (order IDs, cursor tokens, session-like identifiers) rather than relying on server-side session state
- **Client migration:** any client hardcoding `Mcp-Session-Id` handling or the literal `-32002` error code needs updating before the 2026-07-28 spec finalizes
- **Gateway/observability tooling:** route and rate-limit on `Mcp-Method`/`Mcp-Name` headers instead of parsing request bodies

## Sources
- [The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) — primary announcement; stateless core mechanics, before/after examples, SEP references
- [The Future of MCP Transports (Dec 2025)](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/) — the original plan this release completes

## See Also
- [[model-context-protocol]]
- [[mcp-extensions-architecture]]
- [[mcp-oauth-mixup-hardening]]
- [[mcp-server-portal]]
- [[shadow-mcp-detection]]
- [[mcp-otel-trace-context-interlock]] — the same 2026-07-28 revision's other "delegate to a standard" move: Logging → OpenTelemetry, W3C Trace Context in `_meta`
