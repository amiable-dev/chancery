---
title: MCP extensions framework
date: 2026-08-24
tags:
  - concept
  - standards
  - mcp
  - governance
status: draft
sources:
  - url: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
---

# MCP extensions framework

## Definition

The **MCP extensions framework** (SEP-2133) gives protocol capabilities a home outside the core specification: extensions carry reverse-DNS identifiers, are negotiated through an extensions capability map, live in their own repositories with delegated maintainers, version independently, and follow an Extensions Track from experimental to official.

## Explanation

The framework is the protocol's pressure valve: capabilities can ship, stabilise, and even fail without the specification carrying them forever. The 2026-07-28 release demonstrates both directions. MCP Apps entered as an official extension — servers ship interactive HTML rendered in a sandboxed iframe, with UI templates declared ahead of time so hosts can prefetch and security-review them, and all UI-initiated actions travelling the same JSON-RPC path (hence the same audit and consent controls) as direct tool calls. Tasks travelled the other way: it shipped experimental in core in 2025-11-25, production use surfaced enough redesign that it was pulled out and reshaped as an extension around the stateless model — a server answers tools/call with a task handle, the client drives tasks/get/update/cancel, creation is server-directed, and tasks/list is removed because it cannot be scoped safely without sessions. Anyone who built against the experimental core API migrates. The meta-lesson the release notes draw: extensions are now the standard way capabilities ship and stabilise before, if ever, entering the specification.

## Key Properties

- Reverse-DNS IDs, capability-map negotiation, independent versioning, delegated ext-* repos
- MCP Apps: sandboxed iframe UIs, pre-declared templates, same audit path as tool calls
- Tasks: experimental-in-core → redesigned extension; server-directed creation, no tasks/list
- Extensions Track formalises experimental → official

## Relationships

- [[mcp-stateless-core]] — absorbs the features that core change displaced — Tasks' redesign exists because sessions no longer do
- [[protocol-deprecation-policy]] — pairs with that policy as the release's two evolution mechanisms: extensions add capability without core churn, deprecation removes it without breakage

## Applications

Shipping a protocol capability without a spec change; judging maturity of an MCP feature by its track position; building server-rendered agent UIs with host-side review.

## Sources

- https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/

## See Also

- [[mcp-stateless-core]]
- [[protocol-deprecation-policy]]
