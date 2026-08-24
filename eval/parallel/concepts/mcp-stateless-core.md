---
title: MCP stateless protocol core
date: 2026-08-24
tags:
  - concept
  - standards
  - mcp
  - protocols
status: draft
sources:
  - url: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
    hash: sha256:41ac604fbe79fbb905ca0b2bed18394fccab871c1fd521c363c5cc913881b227
    retrieved: 2026-08-24
    reachability: ok
---

# MCP stateless protocol core

## Definition

The **MCP stateless core** (specification 2026-07-28) removes the protocol-level session — no initialize handshake, no Mcp-Session-Id — so every request is self-contained, any server instance can handle any call, and remote MCP servers run behind ordinary round-robin load balancers with no sticky routing or shared session store.

## Explanation

Under 2025-11-25, calling a tool meant establishing a session whose ID pinned the client to one instance; horizontal deployments needed sticky routes and shared stores. In 2026-07-28 the client info, protocol version, and capabilities that the handshake exchanged now travel in _meta on every request, with server/discover for up-front capability fetch. Statelessness is at the protocol layer only: applications needing cross-call state mint explicit handles (a basket_id) from tools and have the model pass them back as arguments — which the release notes argue is stronger than hidden session state, since the model can compose, reason about, and hand off visible handles. Server-initiated requests survive without persistent connections via two changes: servers may only issue them while actively processing a client request (a consent property — no prompt arrives from nowhere), and multi-round-trip requests return an input_required result carrying opaque requestState, which the client echoes back with answers so any instance can resume the call. Operations get three affordances: mandatory Mcp-Method/Mcp-Name headers for body-blind routing and rate-limiting, ttlMs/cacheScope on list results modeled on Cache-Control, and W3C Trace Context key names fixed in _meta so spans correlate across SDKs and gateways.

## Key Properties

- No handshake, no session header; per-request _meta carries what the handshake exchanged
- Application state via explicit handles the model threads between calls — visible, composable state
- Multi-round-trip: input_required plus echoed requestState lets any instance resume
- Mcp-Method/Mcp-Name routing headers; ttlMs/cacheScope caching; W3C Trace Context in _meta

## Relationships

- [[mcp-extensions-framework]] — forced the redesign of Tasks that framework absorbed, because task lifecycles could no longer lean on sessions
- [[remote-first-mcp-governance]] — simplifies the infrastructure that architecture deploys — remote MCP servers stop needing sticky sessions and shared stores

## Applications

Scaling remote MCP servers on commodity HTTP infrastructure; routing and rate-limiting MCP at gateways without body inspection; client-side caching of tools/list.

## Sources

- https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/

## See Also

- [[mcp-extensions-framework]]
- [[remote-first-mcp-governance]]
