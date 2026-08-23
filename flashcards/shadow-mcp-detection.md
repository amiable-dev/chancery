---
tags: [flashcards, mcp, security, enterprise, network-monitoring]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Shadow MCP Detection — Flashcards

#flashcards/mcp

## Definition <!-- kb:card:d6fff4 -->
What is Shadow MCP Detection?
?
The practice of identifying and controlling employee use of unauthorised remote MCP servers by inspecting network traffic for MCP protocol signatures using a Secure Web Gateway. It is the AI-era equivalent of Shadow IT detection.

## Why MCP Is Detectable <!-- kb:card:eeaa2d -->
Why is MCP traffic fingerprint-able at the network boundary?
?
MCP uses JSON-RPC over HTTP/HTTPS, and every request contains a `"method"` field with predictable values (`tools/call`, `initialize`, `tools/list`, etc.). These method names appear in the HTTP body and are specific enough to detect via DLP body inspection regex, even when the URL contains no MCP signals.

## Three Detection Layers <!-- kb:card:07a6a1 -->
What are the three layers of Shadow MCP detection?
?
1. **Hostname matching** — known MCP server hostnames (e.g., `mcp.stripe.com`) and wildcard `mcp.*` subdomain patterns
2. **URI path matching** — paths like `/mcp` and `/mcp/sse`
3. **DLP body inspection** — regex on JSON-RPC method fields (`"method": "tools/call"`, `"initialize"`, etc.)

## Response Options <!-- kb:card:212b36 -->
What can an organisation do once Shadow MCP traffic is detected?
?
Log only (inventory), alert (notify security team), block (prevent connection), or redirect (route through the sanctioned MCP portal). Most organisations start with log-only to build an inventory before enforcement.

## Supply Chain Risk <!-- kb:card:9fa024 -->
Why is shadow MCP a supply chain risk, not just a policy violation?
?
Unvetted public MCP server packages may contain malicious code — undisclosed data exfiltration, tool poisoning, or supply chain attacks. An employee connecting to an unreviewed MCP server may be running adversarial code against corporate resources, not just violating policy.

## Relationship to MCP Portal <!-- kb:card:807643 -->
How do Shadow MCP Detection and MCP Server Portals complement each other?
?
The portal provides governed access to sanctioned tools (the "yes" path). Shadow MCP detection enforces the boundary around unsanctioned tools (the "no" path). Together they implement a complete governed MCP posture: all access flows through the portal, and bypass attempts are detected at the network boundary.
