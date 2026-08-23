---
tags: [flashcards, mcp, security, enterprise, governance]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# MCP Server Portal — Flashcards

#flashcards/mcp

## Definition <!-- kb:card:21df35 -->
What is an MCP Server Portal?
?
A centralised gateway that aggregates multiple upstream MCP servers behind a single connection point, providing unified tool discovery, identity-based access control, audit logging, DLP guardrails, and per-group tool exposure policies.

## Core Problem <!-- kb:card:ba3eb1 -->
What problem does an MCP Server Portal solve?
?
Discovery at scale: as an organisation's MCP server estate grows, employees shouldn't need to manually manage connections to dozens of servers with separate auth flows. The portal provides one connection point that reveals all authorised tools automatically.

## Per-Group Policy <!-- kb:card:0ee5c6 -->
How can the same MCP server expose different capabilities to different teams?
?
Via portal-level group policies. Administrators configure which tools from each upstream server are exposed per-group. E.g., finance team gets read-only tools to the code repo; engineering gets read/write — without changing the upstream server.

## DLP in Portals <!-- kb:card:43eeae -->
What DLP capability do MCP Server Portals provide?
?
Administrators define rules that inspect tool inputs and outputs. Rules can prevent PII or sensitive data from being sent to certain MCP tools, or block certain results from reaching unauthorised users — enforced at the portal boundary, not per-server.

## Code Mode Activation <!-- kb:card:60636d -->
How is Code Mode activated on an MCP Server Portal?
?
By appending `?codemode=search_and_execute` to the portal URL. No client-side changes required — existing MCP clients work without modification.

## Relationship to Zero Trust <!-- kb:card:acec28 -->
How does an MCP Server Portal implement Zero Trust principles?
?
It enforces identity-based access (every connection authenticated via SSO/MFA), least-privilege tool exposure (per-group filtering), continuous audit logging (every tool call recorded), and DLP guardrails (data policy enforcement at the boundary) — applying Zero Trust to AI tool access.
