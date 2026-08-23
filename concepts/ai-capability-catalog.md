---
title: "AI Capability Catalog"
date: 2026-06-18
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [protocols, provenance]
tags: [concept, ai-agents, protocols, discovery, standards, interoperability, domain/standards, maturity/emerging, source-type/vendor-doc, topic/protocols, topic/provenance]
status: draft
sources:
  - url: https://github.com/ards-project/ard-spec/blob/main/spec/schemas/ai-catalog.schema.json
    hash: sha256:598da2812bf02c0ba139c82e98eeffbe3dce31b4034dfded2638c44f6693a45d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/
    hash: sha256:df3cb3c3f9e4bf2ccd9482149de102a397657e43ef3a88e94d2a46f066ac45c6
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://agenticresourcediscovery.org/how_to_publish/#step-1-create-the-manifest-ai-catalogjson
    hash: sha256:cba07ff2585bc0edaee2e7227bb4e06b59065120a2113f4eacfc49b0bab30f28
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# AI Capability Catalog

## Definition
A machine-readable manifest (`ai-catalog.json`) published at a well-known path (`/.well-known/ai-catalog.json`) on an organisation's domain that declares the AI capabilities it makes available — including MCP servers, A2A agents, OpenAPI tools, skills, and nested sub-catalogs — along with metadata and cryptographic trust attestations. The catalog is the publish-side primitive of the [[agentic-resource-discovery|ARD]] specification.

## Explanation
The AI Capability Catalog is ARD's answer to "how does an agent know what you offer?" Just as `robots.txt` tells crawlers what to index or `sitemap.xml` tells search engines what pages exist, `ai-catalog.json` tells agent registries and other agents what capabilities your domain exposes.

### Structure
A catalog entry typically contains:
- **Capability type**: `mcp_server`, `a2a_agent`, `openapi_tool`, or `catalog` (nested)
- **Endpoint/URL**: Where to connect using the native protocol
- **Description**: Human+machine-readable description of the capability
- **Trust metadata**: Publisher identity attestations, compliance tags (HIPAA, SOC2 etc.)
- **Schema reference**: Link to OpenAPI spec or MCP server manifest

### Well-Known Path
Publishing at `/.well-known/ai-catalog.json` follows the RFC 8615 "well-known URI" convention already used by `/.well-known/openid-configuration`, `/.well-known/security.txt`, etc. This placement is what allows the domain itself to serve as the trust anchor — you trust the catalog because you trust the DNS resolution of the domain.

### Example (simplified)
```json
{
  "$schema": "https://agenticresourcediscovery.org/schemas/ai-catalog.v1.json",
  "name": "Acme Corp AI Capabilities",
  "publisher": "acme.com",
  "capabilities": [
    {
      "type": "mcp_server",
      "name": "Acme Observability",
      "description": "Production metrics and log access",
      "endpoint": "https://mcp.acme.com/observability",
      "trust": { "signed_by": "acme.com", "compliance": ["SOC2"] }
    },
    {
      "type": "a2a_agent",
      "name": "Acme Ticketing Agent",
      "description": "Creates and manages support tickets",
      "endpoint": "https://agents.acme.com/ticketing"
    }
  ]
}
```

### Nested Catalogs
A catalog entry can point to another catalog, enabling hierarchical structures — a parent catalog can delegate to team-level or product-level sub-catalogs without requiring central management.

## Key Properties
- **Well-known URI placement**: `/.well-known/ai-catalog.json` — discoverable by convention, no prior coordination required
- **Protocol-agnostic entries**: Can describe any capability type (MCP, A2A, OpenAPI, custom)
- **Trust-bearing**: Each entry can carry cryptographic trust metadata for the client to verify before connecting
- **Crawlable**: Designed for [[capability-registry|registries]] to crawl and index automatically
- **Self-describing**: The catalog includes enough information for a client to understand and connect to capabilities without further negotiation
- **Nested/federated**: Catalogs can reference sub-catalogs, enabling distributed capability trees

## Relationships
- Core primitive of [[agentic-resource-discovery|ARD]]: the catalog is what publishers create; ARD defines the spec
- Crawled by [[capability-registry|Capability Registry]]: registries index catalog contents for search
- Anchors [[domain-as-identity-trust|Domain-as-Identity Trust]]: being hosted at the domain's well-known path is the trust root
- Describes [[model-context-protocol|MCP]] servers, [[agent-to-agent-protocol|A2A]] agents, and other capability types as entries
- Extends the AI Catalog data model from the Linux Foundation AI Catalog Working Group

## Applications
- **Internal service mesh discovery**: Microservices publish their agent-facing capabilities in a catalog for internal agents to discover dynamically
- **Partner integrations**: Organisations share their `ai-catalog.json` URL with partners as a machine-readable capability contract
- **Open agentic web**: Any domain can participate in the discovery ecosystem simply by publishing a well-formed catalog
- **Enterprise compliance**: Trust metadata in catalog entries lets enterprise agents verify compliance posture (HIPAA, SOC2) before connecting

## Sources
- [ARD Specification — Catalog Schema](https://github.com/ards-project/ard-spec/blob/main/spec/schemas/ai-catalog.schema.json) — JSON Schema for the full catalog format
- [Announcing the Agentic Resource Discovery specification](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/) — Google Developers Blog, June 2026
- [ARD Quickstart: Publish Your First Catalog](https://agenticresourcediscovery.org/how_to_publish/#step-1-create-the-manifest-ai-catalogjson) — Step-by-step guide

## See Also
- [[agentic-resource-discovery]]
- [[capability-registry]]
- [[domain-as-identity-trust]]
- [[agent-to-agent-protocol]]
- [[model-context-protocol]]
