---
title: Remote-first MCP governance
date: 2026-08-24
tags:
  - concept
  - infrastructure
  - security
  - mcp
status: draft
sources:
  - url: https://blog.cloudflare.com/enterprise-mcp/
    hash: sha256:b6afb82e86c514d9d7c7684b8c129302c2647fefc41d29ee4d12e0d003bdca89
    retrieved: 2026-08-24
    reachability: ok
---

# Remote-first MCP governance

## Definition

**Remote-first MCP governance** is the enterprise pattern of treating locally-hosted MCP servers as a supply-chain liability and moving them to centrally-managed remote deployments — restoring administrator visibility and control over software sources, versions, and access, with portals layered on top for discovery, policy, and data-loss prevention.

## Explanation

Local MCP servers put the security decision in each employee's hands: unvetted sources and versions raise supply-chain and tool-poisoning risk (both OWASP-catalogued for MCP), and IT cannot administer what it cannot see — 'a losing game' in Cloudflare's deployment write-up. The remote-first alternative deploys servers through CI/CD to known infrastructure, fronted by an identity-aware OAuth provider that verifies SSO, MFA, and contextual attributes (device, location) before issuing tokens. Portals then solve the discovery problem growth creates: an employee connects one endpoint and sees exactly the internal and third-party servers they are authorized for, while administrators get centralized logging, consistent policy, and DLP rules — including per-audience portals that expose, say, read-only repository tools to finance but read/write tools only to engineers on corporate laptops. The architecture generalises: the control points are (1) who can run a server, (2) who can reach it and as whom, and (3) which tools each audience sees — each enforced in infrastructure rather than by asking users to behave.

## Key Properties

- Local MCP servers = unvetted supply chain plus no administrative visibility
- Remote deployment restores control over sources, versions, and telemetry
- Identity-aware OAuth front door: SSO, MFA, contextual attributes
- Portals: one connection point, per-audience server and tool exposure, central logging and DLP

## Relationships

- [[paved-road-mcp-platform]] — is enforced most cheaply by that pattern, which makes the governed path the easiest path to ship a server
- [[shadow-mcp-detection]] — is completed by that control, which finds the servers this governance did not capture
- [[code-mode-mcp]] — gains a cost rationale from that pattern, since portals are also where tool schemas collapse into two calls

## Applications

Rolling out MCP beyond an engineering org without per-employee trust decisions; passing security review for agent tooling against corporate resources.

## Sources

- https://blog.cloudflare.com/enterprise-mcp/

## See Also

- [[paved-road-mcp-platform]]
- [[shadow-mcp-detection]]
- [[code-mode-mcp]]
