---
tags: [flashcards, mcp, registries, governance, discovery]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP Registry federation model — Flashcards

#flashcards/mcp

## Definition <!-- kb:card:c8920e -->
What is the MCP Registry federation model?
?
An architecture where one canonical, openly governed registry is the single source of truth for public MCP servers via self-reported metadata and an open API, while downstream public and private sub-registries build their own curated or access-restricted views on top of it.

## Federation over centralization <!-- kb:card:64dfb5 -->
What architectural trade-off does the federation model deliberately choose?
?
Federation over centralization — the canonical registry stays deliberately thin (self-reported metadata, open API, permissive license) and pushes curation downstream to sub-registries, rather than one registry serving every consumer's needs directly.

## Public vs private sub-registries <!-- kb:card:378c50 -->
What's the difference between a public and a private sub-registry in this model?
?
Public sub-registries (client-bundled "marketplaces") re-rank, filter, or enrich the upstream catalog for their users; private sub-registries reuse the same shared schema and API for internal, access-restricted enterprise catalogs.

## Governance mechanism <!-- kb:card:22e9f4 -->
Since publication is self-reported, how are spam, malicious entries, and impersonation policed?
?
Reactively — community members flag entries that violate stated moderation guidelines, and maintainers denylist retroactively, rather than vetting before publication.

## Federation precondition <!-- kb:card:a1c893 -->
What must remain true of the upstream registry for the federation model to keep working?
?
The registry itself and its API specification must stay open source, so anyone can build a compatible sub-registry without depending on the maintaining organization's own roadmap.
