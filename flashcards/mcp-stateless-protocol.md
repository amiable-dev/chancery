---
tags: [flashcards, mcp, protocols, architecture]
sr-due: 2026-07-27
sr-interval: 1
sr-ease: 250
---

# MCP Stateless Protocol — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:5eebe7 -->
What changed to make MCP "stateless at the protocol layer" in the 2026-07-28 spec?
?
The `initialize`/`initialized` handshake (SEP-2575) and the `Mcp-Session-Id` header/session (SEP-2567) were both removed. Protocol version, client info, and capabilities now travel in `_meta` on every request, so any server instance can handle any request without sticky routing.

## Application <!-- kb:card:0f5a09 -->
If a stateless MCP server still needs to track state across multiple tool calls (e.g., a shopping basket), how should it do that?
?
Mint an explicit handle (e.g. `basket_id`) from a tool call and have the model pass it back as an ordinary argument on later calls — the same pattern ordinary HTTP APIs use. The state becomes visible to the model instead of hidden in transport-level session metadata.

## Relationship <!-- kb:card:13487e -->
How do Multi Round-Trip Requests (SEP-2322) let a server ask the client for input mid-call without a persistent connection?
?
The server returns an `InputRequiredResult` with `inputRequests` and an opaque `requestState`; the client collects answers and re-issues the original call with `inputResponses` plus the echoed state. Any server instance can pick up the retry, since the "session" is just a value threaded through requests rather than a transport-level pin.

## Consequence <!-- kb:card:8c4e1c -->
Why does the stateless core let a remote MCP server run behind a plain round-robin load balancer?
?
Because no request depends on hitting the same server instance as a prior request — there's no session store to keep in sync and no sticky-session affinity required at the load balancer.
