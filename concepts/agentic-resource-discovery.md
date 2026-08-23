---
title: "Agentic Resource Discovery (ARD)"
aliases: ["Agentic Resource Discovery (ARD)"]
date: 2026-06-18
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [protocols, mcp, multi-agent, provenance]
tags: [concept, ai-agents, protocols, discovery, interoperability, standards, multi-agent, domain/standards, maturity/emerging, source-type/vendor-doc, topic/protocols, topic/mcp, topic/multi-agent, topic/provenance]
status: draft
sources:
  - url: https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/
    hash: sha256:df3cb3c3f9e4bf2ccd9482149de102a397657e43ef3a88e94d2a46f066ac45c6
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://agenticresourcediscovery.org/
    hash: sha256:47cac8a6ab67d9c46f73f62a58fb4c3e92a30f51304c36aea541fd0e6bde5efe
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/ards-project/ard-spec
    hash: sha256:5d59906e06c45cedb9b70eb9d2a07df69059f40dd76d0f2583dc6e22a5cc6fb8
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agentic Resource Discovery (ARD)

## Definition
An open specification (Apache 2.0, developed with Linux Foundation partners) that standardises how AI capabilities — tools, MCP servers, A2A agents, skills, and OpenAPI endpoints — are **published, discovered, and cryptographically verified** across organisational and platform boundaries. ARD is a discovery layer only: it hands off to native protocols once a capability is found.

## Explanation
Today's agent ecosystems are fragmented: every platform has its own registry, every organisation hardcodes its tool connections, and there is no standard way to ask "which agent can handle X?" across organisational boundaries.

ARD solves this with two primitives:

1. **Catalogs** — Organisations publish `ai-catalog.json` at `/.well-known/ai-catalog.json` on their domain. The catalog describes available capabilities (MCP servers, A2A agents, OpenAPI tools, nested catalogs) with metadata and trust attestations.

2. **Registries** — Search engines that crawl published catalogs, index their contents, and respond to plain-language discovery queries. Multiple registries can coexist independently, similar to how web search engines work.

### Four-Phase Flow
```
1. Publish   → Organisation hosts ai-catalog.json at well-known path
2. Discover  → Agent queries registry ("I need an observability tool") OR fetches catalog directly from a known partner domain
3. Verify    → Client confirms publisher's cryptographic identity via trust manifest before connecting
4. Connect   → Agent connects directly using the capability's native protocol (MCP, A2A, REST, etc.)
```

ARD deliberately steps out of the picture after step 3 — it doesn't own the execution channel.

### What ARD Is Not
- **Not an execution runtime** — it doesn't replace MCP, A2A, or OpenAPI
- **Not a central registry** — federated by design; no single authority
- **Not protocol-specific** — works with any capability type

## Key Properties
- **Domain-as-identity**: Hosting the catalog under your domain provides the cryptographic trust anchor — no central certificate authority needed
- **Protocol-agnostic**: Catalog can point to MCP servers, A2A agents, OpenAPI tools, or nested catalogs
- **Federated**: Multiple registries can index the same catalogs with different trust policies
- **Plain-language discovery**: Registries accept intent-based natural language queries, not just keyword matching
- **Cryptographic verification**: Trust manifests let clients verify publisher identity before connecting
- **Apache 2.0 licensed**: Built on the AI Catalog data model from the Linux Foundation AI Catalog Working Group

## Relationships
- Enables discovery for [[model-context-protocol|Model Context Protocol (MCP)]]: MCP servers are a primary catalog entry type; ARD becomes the standard way agents *find* MCP servers rather than relying on hardcoded config
- Works alongside [[agent-to-agent-protocol|Agent-to-Agent (A2A) Protocol]]: A2A handles agent-to-agent *communication*; ARD handles *discovery* of which agents exist
- Complements [[agent-attestation-standards|Agent Attestation Standards]]: ARD's trust manifest is one instantiation of the broader pattern of cryptographic capability attestation
- Uses [[ai-capability-catalog|AI Capability Catalog]] and [[capability-registry|Capability Registry]] as its two core primitives
- Implements [[domain-as-identity-trust|Domain-as-Identity Trust]] as its cryptographic foundation
- Enables [[federated-agent-discovery|Federated Agent Discovery]] through its multi-registry model

## Applications
- **Cross-org tool sharing**: A production incident agent can dynamically discover an observability tool from a different organisation's domain without pre-configuration
- **MCP server discoverability**: Instead of hardcoding MCP server URLs, agents query a registry at runtime
- **Enterprise governance**: Agent Registry (Google Cloud's enterprise implementation) enforces egress policies, namespaced URNs, and HIPAA compliance on top of ARD catalogs
- **Open ecosystem building**: Any organisation publishing an `ai-catalog.json` joins the global federated discovery network — similar to publishing a website joins the web
- **Agent composition**: Multi-agent systems can assemble capability chains at runtime by discovering and verifying components from multiple providers

## Sources
- [Announcing the Agentic Resource Discovery specification](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/) — Google Developers Blog, June 2026. Primary announcement with architecture overview and demo
- [ARD Specification](https://agenticresourcediscovery.org/) — Full spec including schemas, federation model, trust architecture, reference implementations
- [GitHub: ards-project/ard-spec](https://github.com/ards-project/ard-spec) — Apache 2.0 source, schemas, trust manifest JSON schema

## See Also
- [[ai-capability-catalog]]
- [[capability-registry]]
- [[domain-as-identity-trust]]
- [[federated-agent-discovery]]
- [[agent-to-agent-protocol]]
- [[model-context-protocol]]
- [[agent-attestation-standards]]
- [[mcp-server-portal]]
- [[llms-txt]] — a narrower, ungoverned discovery convention (content navigation, not capability discovery) worth contrasting with ARD's structured approach
