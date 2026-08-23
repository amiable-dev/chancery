---
tags: [flashcards, ai-agents, protocols, discovery, standards]
sr-due: 2026-06-18
sr-interval: 1
sr-ease: 250
---

# Agentic Resource Discovery (ARD) — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:e124c2 -->
What is Agentic Resource Discovery (ARD)?
?
An open specification (Apache 2.0) that standardises how AI capabilities — MCP servers, A2A agents, OpenAPI tools, and skills — are published, discovered, and cryptographically verified across organisational and platform boundaries. It is a discovery layer only; it hands off to native protocols once a capability is found.

## Two Primitives <!-- kb:card:9c61b3 -->
What are the two core primitives of ARD?
?
1. **Catalogs** — Organisations publish `ai-catalog.json` at `/.well-known/ai-catalog.json` describing their capabilities
2. **Registries** — Search engines that crawl published catalogs, index them, and respond to agent discovery queries

## Four Phases <!-- kb:card:8bafd4 -->
What are the four phases of ARD's discovery flow?
?
1. **Publish** — Host `ai-catalog.json` at a well-known path on your domain
2. **Discover** — Agent queries a registry (natural language intent) OR fetches a catalog directly from a known domain
3. **Verify** — Client confirms publisher's cryptographic identity via trust manifest before connecting
4. **Connect** — Agent connects using the capability's native protocol (MCP, A2A, REST, etc.)

## Scope Limits <!-- kb:card:2ba7d1 -->
What does ARD explicitly *not* do?
?
- It is not an execution runtime — doesn't replace MCP, A2A, or OpenAPI
- It is not a central registry — federated by design, no single authority
- It steps out of the picture after verification; it doesn't own the communication channel

## Application <!-- kb:card:3a554c -->
When would an agent use ARD at runtime?
?
When a production incident agent needs an observability tool it wasn't pre-configured with — it queries an ARD registry with a plain-language intent ("I need a production metrics tool"), gets back a ranked list of verified capabilities, verifies the publisher, then connects directly using MCP or A2A.

## Relationship to MCP <!-- kb:card:1787a9 -->
How does ARD relate to the Model Context Protocol (MCP)?
?
MCP defines how agents *communicate* with tool servers. ARD defines how agents *find* MCP servers in the first place. ARD's catalog can list MCP servers as entries; ARD handles discovery, then MCP handles execution.
