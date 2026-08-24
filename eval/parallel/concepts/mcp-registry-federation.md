---
title: MCP Registry federation model
date: 2026-08-24
tags:
  - concept
  - mcp
  - registries
  - governance
  - discovery
status: draft
sources:
  - url: https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/
---

# MCP Registry federation model

## Definition

The MCP Registry federation model is the architecture in which one canonical, openly governed registry serves as the single source of truth for publicly available Model Context Protocol servers, accepting self-reported publisher metadata through an open API and specification, while downstream public and private sub-registries build their own curated, augmented, or access-restricted views on top of that shared upstream rather than each maintaining an independent, disconnected catalog, with community flagging and retroactive denylisting serving as the governance backstop against spam, malicious entries, and impersonation.

## Explanation

The design choice being made explicit here is federation over centralization: rather than building one registry that tries to serve every consumer's needs, the canonical registry stays deliberately thin — self-reported server metadata, an open API, a permissive license — and pushes opinion downstream. Public sub-registries, the 'MCP marketplaces' bundled with individual clients, are free to re-rank, filter, or enrich what they pull from the upstream to serve their own users; private sub-registries inside an enterprise get the same shared schema and API surface so their internal tooling is not bespoke, while keeping their actual catalog contents private. This only works if the upstream stays a source of truth rather than a walled garden, hence the explicit design commitment to open-source the registry itself and its API specification, so anyone can stand up a compatible sub-registry rather than being dependent on the maintainers' own roadmap. The trade-off this federation buys is speed and openness at the cost of pre-publication vetting: because publication is self-reported rather than gatekept, the governance mechanism is necessarily reactive — community members flag entries that violate stated moderation guidelines such as spam, malicious code, or impersonation, and maintainers denylist retroactively — which trades a lower barrier to listing a server against the population containing entries nobody has vetted before a client can find and connect to them.

## Key Properties

- One canonical, open-source registry with a published OpenAPI spec as source of truth, not a single monolithic catalog every consumer must use directly
- Public sub-registries curate and enhance for their own audience; private sub-registries reuse the same schema for internal, access-restricted catalogs
- Publication is self-reported and open by default; moderation is reactive — community flagging plus retroactive denylisting — rather than pre-publication vetting
- The federation only holds together if the upstream specification and API stay open, so independent sub-registries can be built without depending on the maintaining organization

## Relationships

- [[remote-first-mcp-governance]] — solves a complementary half of the same discovery-and-trust problem — where remote-first governance moves servers out of local, shadow deployment into managed infrastructure, the registry federation model is how a client finds and selects which managed server to connect to in the first place
- [[mcp-exposed-by-design]] — names exactly the population this registry's self-report-then-moderate-reactively model does not vet before publication — an entry can be listed the moment a publisher submits it, so the registry's discoverability gain does not by itself close the exposure that study measured among already-running servers

## Applications

Designing a discovery layer for a decentralized ecosystem of pluggable components: deciding whether to build one canonical open registry that others federate from rather than a single closed catalog, choosing self-report-plus-reactive-moderation over pre-publication gatekeeping when low barrier to entry matters more than pre-vetted trust, and keeping the schema and API open specifically so downstream public and private consumers can build their own curated views without forking the underlying data.

## Sources

- https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/

## See Also

- [[remote-first-mcp-governance]]
- [[mcp-exposed-by-design]]
