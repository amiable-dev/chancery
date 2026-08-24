---
title: Paved-road MCP platform
date: 2026-08-24
domain: infrastructure
maturity: established
source_type: vendor-doc
tags: [concept, infrastructure, governance, platform-engineering, domain/infrastructure, maturity/established, source-type/vendor-doc]
status: draft
sources:
  - url: https://blog.cloudflare.com/enterprise-mcp/
    hash: sha256:b6afb82e86c514d9d7c7684b8c129302c2647fefc41d29ee4d12e0d003bdca89
    retrieved: 2026-08-24
    reachability: ok
    class: external-primary
---

# Paved-road MCP platform

## Definition

A **paved-road MCP platform** bakes governance into the template a team copies to ship a server: after approval, an engineer scaffolds from the shared monorepo template and inherits default-deny write controls, audit logging, auto-generated CI/CD, and secrets management 'for free' — making the governed way to deploy also the fastest way.

## Explanation

The pattern is platform engineering's paved-road idea applied to agent infrastructure. The governance problem with letting every team hand-roll MCP servers is not malice but variance: each implementation makes its own security decisions, and review cannot keep up. Centralising into a template inverts the economics — standing up a new governed server becomes minutes of scaffolding, so teams take the paved road because it is genuinely easier, and the controls come along invisibly. Cloudflare's write-up credits exactly this for company-wide adoption spreading beyond engineering: 'the governance is baked into the platform itself, which is what allowed adoption to spread so quickly.' The approval step (an AI-governance team gates what gets exposed) stays human; everything after it is inherited defaults. The transferable design rule: when adoption speed and control appear to trade off, move the control into the artifact that makes people fast, so compliance stops being a tax and becomes a side effect.

## Key Properties

- Template inheritance: default-deny writes, audit logging, CI/CD, secrets management by default
- Human approval gates exposure; automation handles everything after
- Governed path is the fastest path, so it wins by convenience rather than mandate
- Adoption speed evidences the pattern: governance stopped being the bottleneck

## Relationships

- [[remote-first-mcp-governance]] — operationalises that policy by making the governed deployment target the template's default output

## Applications

Any internal capability where security review is the adoption bottleneck; agent-tool platforms, internal APIs, data-access layers.

## Sources

- https://blog.cloudflare.com/enterprise-mcp/

## See Also

- [[remote-first-mcp-governance]]
