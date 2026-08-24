---
tags: [flashcards, security, mcp, oauth, proxy]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP confused-deputy and token-passthrough risk — Flashcards

#flashcards/security

## Shared root cause <!-- kb:card:8107d1 -->
What single root cause do MCP confused-deputy and token-passthrough vulnerabilities share?
?
The MCP proxy is trusted as if it were one single principal, when it is actually mediating access for many distinct clients.

## Confused-deputy mechanism <!-- kb:card:104891 -->
How does the confused-deputy attack steal an authorization code through an MCP proxy?
?
The proxy uses one static client ID with a third-party auth server while letting MCP clients register their own dynamic client IDs; the third party's consent cookie (scoped to the static ID) signals prior consent regardless of which dynamic client triggered the flow, so an attacker's crafted request with a malicious redirect URI passes without a fresh consent screen and the resulting code lands on the attacker's server.

## Token-passthrough mechanism <!-- kb:card:05c79c -->
What single missing check causes the token-passthrough vulnerability?
?
The MCP server never validates that a client-supplied token's audience claim actually names the MCP server before forwarding it, unmodified, to a downstream API.

## Token-passthrough fallout <!-- kb:card:5ff4bd -->
What breaks downstream when a passed-through token's audience is never validated?
?
Rate limiting, audit trails, and revocation all collapse, since logs now show the proxy's identity rather than the real caller's.

## The fix <!-- kb:card:57a288 -->
What two fixes does the MCP authorization spec require to close both the confused-deputy and token-passthrough paths?
?
Per-client consent state tracked and checked before delegating to the third party, and audience validation enforced on every inbound token before it is forwarded downstream.
