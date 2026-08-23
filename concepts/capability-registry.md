---
title: "Capability Registry (Agentic)"
aliases: ["Capability Registry (Agentic)"]
date: 2026-06-18
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [protocols, provenance]
tags: [concept, ai-agents, protocols, discovery, standards, infrastructure, search, domain/standards, maturity/emerging, source-type/vendor-doc, topic/protocols, topic/provenance]
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
  - url: https://docs.cloud.google.com/agent-registry/overview
    hash: sha256:eb8a6adb66874671c1eb5e1e2b939e1265bf7faab16b5a952c68d29ef13ebe8c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Capability Registry (Agentic)

## Definition
An indexing and search service that crawls published [[ai-capability-catalog|AI Capability Catalogs]], indexes their contents, and responds to agent discovery queries — returning matching capabilities alongside the trust metadata needed to verify the publisher before connecting. Registries are the search engine layer of the [[agentic-resource-discovery|ARD]] ecosystem.

## Explanation
A capability registry is to the agentic web what Google Search is to the human web: it crawls the catalogs agents publish, builds an index, and answers questions like "what can help me with production observability?" — returning ranked results the querying agent can evaluate and connect to.

### What a Registry Does
1. **Crawl**: Periodically fetches `ai-catalog.json` files from known domains or discovers new domains through links in existing catalogs
2. **Index**: Stores structured representations of capabilities with semantic embeddings for intent matching
3. **Respond**: Accepts natural language or structured discovery queries; returns matching capabilities with trust metadata
4. **Propagate trust metadata**: Returns publisher identity attestations so the client can verify before connecting

### Query Modes
- **Intent-based (natural language)**: `"I need a tool that can query production metrics and return anomaly alerts"`  → registry returns ranked matches
- **Direct domain fetch**: Skip the registry entirely and fetch `/.well-known/ai-catalog.json` directly from a known partner domain (useful when you already know who to trust)

### Registry Diversity
The federated model means multiple independent registries can coexist:
- A public global registry (similar to npm or PyPI in spirit)
- A private enterprise registry (like Google Cloud's Agent Registry) with stricter governance
- A community registry focused on a specific domain (healthcare, finance)

Each registry applies its own trust, ranking, and access policies — no single registry has a monopoly.

### Google Cloud Agent Registry
The enterprise-grade ARD implementation: fully hosted discovery for agents, MCP servers, skills, and tools. Adds:
- **Namespaced URNs**: Globally unique stable identifiers for capabilities
- **Agentic egress policies**: Controls which agents can call which capabilities
- **Tool pinning**: Lock to a specific capability version for compliance
- **Agent Identity integration**: Cryptographic publisher verification built in

## Key Properties
- **Decentralised**: No central authority; multiple registries can index the same catalogs
- **Intent-aware**: Supports natural language discovery, not just keyword/slug matching
- **Trust-propagating**: Returns trust metadata with results — the registry doesn't just match, it helps you verify
- **Standards-compliant**: Registries adhere to the ARD spec; interoperable with any ARD-compatible client
- **Domain-bypass option**: Clients can fetch catalogs directly, completely bypassing registry search when the partner is already known

## Relationships
- Indexes [[ai-capability-catalog|AI Capability Catalog]] entries: the catalog is what gets crawled and indexed
- Part of [[agentic-resource-discovery|ARD]]: registries are one of ARD's two core primitives alongside catalogs
- Enables [[federated-agent-discovery|Federated Agent Discovery]]: multiple registries form the federated network
- Complements [[agent-to-agent-protocol|A2A Protocol]]: A2A handles execution after discovery; registries handle finding the right agent
- Analogous to package registries (npm, PyPI) but for agent capabilities rather than code libraries

## Applications
- **Runtime tool discovery**: An agent with an unknown task queries a registry to find the right tool on the fly, without pre-configuration
- **Enterprise governance portal**: Internal registry catalogs approved capabilities with compliance metadata; agents can only call registry-approved tools
- **Capability marketplace**: Third-party registries surface publicly-available agent capabilities from across the web, similar to an app store discovery layer
- **Federated cross-org search**: A discovery query propagates across multiple federated registries for comprehensive results

## Sources
- [Announcing the Agentic Resource Discovery specification](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/) — Google Developers Blog, June 2026
- [ARD Specification](https://agenticresourcediscovery.org/) — Federation model and registry protocol
- [Google Cloud Agent Registry](https://docs.cloud.google.com/agent-registry/overview) — Enterprise registry implementation

## See Also
- [[agentic-resource-discovery]]
- [[ai-capability-catalog]]
- [[federated-agent-discovery]]
- [[domain-as-identity-trust]]
- [[agent-to-agent-protocol]]
- [[mcp-server-portal]]
- [[llms-txt]] — content-navigation convention, not a capability registry; useful contrast for what structured discovery adds
