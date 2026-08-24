---
title: Shadow MCP detection
date: 2026-08-24
tags:
  - concept
  - infrastructure
  - security
  - observability
status: draft
sources:
  - url: https://blog.cloudflare.com/enterprise-mcp/
    hash: sha256:b6afb82e86c514d9d7c7684b8c129302c2647fefc41d29ee4d12e0d003bdca89
    retrieved: 2026-08-24
    reachability: ok
---

# Shadow MCP detection

## Definition

**Shadow MCP detection** is the discovery of unauthorized MCP servers in use by a workforce — the agent-era analogue of shadow IT — by scanning egress traffic at a secure web gateway with selectors (such as host patterns and DLP signatures) that identify MCP protocol use outside the sanctioned portal path.

## Explanation

Governing the authorized path is only half the control; employees can point MCP clients at any remote server on the internet, re-creating the ungoverned risk the platform was built to remove. Because all MCP traffic ultimately egresses the corporate network, the existing secure-web-gateway choke point can find it: multi-layer scans over gateway telemetry — host selectors for known MCP endpoints, protocol and DLP selectors for MCP-shaped traffic — surface remote servers being accessed directly rather than through a portal. Detection feeds policy: discovered servers can be blocked, or triaged into the governed catalogue if legitimate demand exists. The pattern's premise is worth keeping explicit: it works exactly insofar as the gateway sees the traffic, so unmanaged devices and off-network use are its blind spots, and it complements rather than replaces making the governed path attractive. Detect-and-catalogue beats prohibit-and-hope: the shadow usage is information about unmet need, not just a violation.

## Key Properties

- Choke point: secure web gateway egress, scanned with host, protocol, and DLP selectors
- Finds MCP use that bypasses the sanctioned portal path
- Response is block or absorb into the governed catalogue
- Blind spots: unmanaged devices and traffic the gateway never sees

## Relationships

- [[remote-first-mcp-governance]] — closes that architecture's escape hatch by finding the servers employees adopted outside it

## Applications

Security-team inventory of real agent-tool usage; converting shadow adoption into a prioritised intake list for the governed platform.

## Sources

- https://blog.cloudflare.com/enterprise-mcp/

## See Also

- [[remote-first-mcp-governance]]
