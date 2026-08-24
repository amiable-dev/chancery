---
tags: [flashcards, infrastructure, security, mcp, domain/infrastructure, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Remote-first MCP governance — Flashcards

#flashcards/infrastructure

## Definition <!-- kb:card:438207 -->
What is remote-first MCP governance?
?
The enterprise pattern of treating locally-hosted MCP servers as a supply-chain liability and moving them to centrally-managed remote deployments, restoring admin visibility and control over sources, versions, and access, with portals for discovery, policy, and DLP.

## Problem with local MCP servers <!-- kb:card:5f3ab9 -->
Why are locally-hosted MCP servers treated as a supply-chain liability?
?
Each employee makes the security decision themselves — unvetted sources and versions raise supply-chain and tool-poisoning risk, and IT cannot administer what it cannot see (called 'a losing game' in Cloudflare's write-up).

## Identity-aware front door <!-- kb:card:fda725 -->
What fronts remote MCP servers under this pattern before a token is issued?
?
An identity-aware OAuth provider that verifies SSO, MFA, and contextual attributes (device, location) before issuing tokens.

## Portals <!-- kb:card:df546a -->
What problem do portals solve in remote-first MCP governance, and what do they give administrators?
?
They solve discovery at scale — an employee connects one endpoint and sees only the servers they're authorized for — while giving admins centralized logging, consistent policy, and DLP rules, including per-audience exposure (e.g. read-only tools for finance, read/write for engineers on corporate laptops).

## Three control points <!-- kb:card:0d6672 -->
What are the three control points remote-first MCP governance architecture generalises to?
?
(1) who can run a server, (2) who can reach it and as whom, and (3) which tools each audience sees — each enforced in infrastructure rather than by asking users to behave.
