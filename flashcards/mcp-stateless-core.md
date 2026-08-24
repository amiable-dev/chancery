---
tags: [flashcards, standards, mcp, protocols, domain/standards, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP stateless protocol core — Flashcards

#flashcards/standards

## MCP stateless core — definition <!-- kb:card:38adb0 -->
What does the MCP stateless core (spec 2026-07-28) remove from the protocol, and what does that enable operationally?
?
It removes the protocol-level session — no initialize handshake, no Mcp-Session-Id — so every request is self-contained, any server instance can handle any call, and remote servers run behind ordinary round-robin load balancers with no sticky routing or shared session store.

## Where handshake info now travels <!-- kb:card:ac955d -->
Since MCP 2026-07-28 dropped the session handshake, where do client info, protocol version, and capabilities now travel?
?
In _meta on every request, with server/discover available for up-front capability fetch.

## Application state under stateless MCP <!-- kb:card:d2a7ee -->
How does an application maintain cross-call state (e.g. a shopping basket) under the stateless MCP core, and why is this considered stronger than session state?
?
Tools mint explicit handles (like a basket_id) that the model passes back as arguments on later calls — visible, composable state the model can reason about and hand off, unlike hidden session state.

## Server-initiated requests, no sessions <!-- kb:card:420b2a -->
Under the stateless core, when may a server issue a server-initiated request, and how does a multi-round-trip request survive without persistent connections?
?
A server may only issue one while actively processing a client request (a built-in consent property). Multi-round-trip requests return an input_required result carrying opaque requestState, which the client echoes back so any server instance can resume.

## Stateless core operational affordances <!-- kb:card:ed35d5 -->
Name the three operational affordances the stateless core spec adds for routing, caching, and tracing.
?
Mandatory Mcp-Method/Mcp-Name headers for body-blind routing and rate-limiting, ttlMs/cacheScope on list results (modeled on Cache-Control), and W3C Trace Context key names fixed in _meta.
