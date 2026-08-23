---
tags: [flashcards, ai-agents, protocols, discovery, standards]
sr-due: 2026-06-18
sr-interval: 1
sr-ease: 250
---

# AI Capability Catalog — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f1a497 -->
What is an AI Capability Catalog?
?
A machine-readable manifest (`ai-catalog.json`) published at `/.well-known/ai-catalog.json` on an organisation's domain that declares the AI capabilities it makes available — MCP servers, A2A agents, OpenAPI tools, skills, and nested sub-catalogs — along with metadata and cryptographic trust attestations.

## Well-Known Path <!-- kb:card:1851d4 -->
Where is an AI Capability Catalog published, and why does the location matter?
?
At `/.well-known/ai-catalog.json`. This follows RFC 8615 convention (like `/.well-known/openid-configuration`). The location matters because hosting at the domain's well-known path means the domain owner controls the file — the domain itself becomes the trust anchor without needing a central certificate authority.

## What Goes In It <!-- kb:card:d19976 -->
What kinds of entries can an AI Capability Catalog describe?
?
- **MCP servers** — tool servers with a native MCP protocol endpoint
- **A2A agents** — agent endpoints using the Agent-to-Agent protocol
- **OpenAPI tools** — REST APIs described by an OpenAPI spec
- **Skills** — discrete capability units
- **Nested catalogs** — references to sub-catalogs for hierarchical structures

## Application <!-- kb:card:bf17ef -->
How would an organisation use an AI Capability Catalog in practice?
?
They publish `ai-catalog.json` at their domain's well-known path describing their internal tools. ARD registries crawl and index it. External agents querying a registry for "observability tools" can discover and verify the catalog's entries before connecting. No pre-coordination with partner agents is needed.

## Relationship to Registries <!-- kb:card:c89719 -->
How does a catalog relate to a capability registry?
?
The catalog is what the publisher creates and hosts. A registry crawls, indexes, and makes catalog entries searchable. The catalog is the source of truth; the registry is the search layer on top of it.
