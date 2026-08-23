---
title: "Federated Agent Discovery"
date: 2026-06-18
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [multi-agent, protocols]
tags: [concept, ai-agents, protocols, discovery, distributed-systems, standards, multi-agent, interoperability, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/protocols]
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
  - url: https://agenticresourcediscovery.io/
    unreachable: true
    reason: ENOTFOUND
    checked: 2026-08-21
    class: unclassified
    reachability: dns-transient
---

# Federated Agent Discovery

## Definition
A discovery architecture in which **no single authority owns the index of AI capabilities**. Instead, multiple independent registries crawl and index the same published catalogs, serve different communities with different trust policies, and collectively form a global discovery network — analogous to how multiple competing web search engines all index the same public web.

## Explanation
The alternative to federated discovery is a centralised registry — one canonical database that all capabilities must be registered in. This is how many current ecosystems work (npm, the App Store, AWS Marketplace), and it creates well-known problems: a single point of control, censorship risk, vendor lock-in, and a governance bottleneck.

ARD's federated model takes inspiration from the DNS ecosystem and the web search landscape:

- **DNS is federated**: No single entity owns all DNS records; any registrar can issue domains, any resolver can query them
- **Web search is federated** (in practice): Google, Bing, DuckDuckGo all index the same public web independently, with different ranking and policy choices
- **Email (SMTP) is federated**: Any domain can send and receive email; no central email authority

ARD applies this model to AI capabilities:

### How Federation Works in ARD
```
                     ┌─────────────────────┐
                     │  acme.com           │
                     │  /.well-known/      │
                     │  ai-catalog.json    │
                     └──────────┬──────────┘
                                │ crawled by
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                  ▼
       [Public Registry]  [Enterprise        [Community
        (global index)     Registry:          Registry:
                           stricter trust,    healthcare
                           governance]        domain]
              │                 │                  │
       any agent          internal agents     healthcare
       queries            with HIPAA req.     agents only
```

### Key Design Consequences

**No registration required to publish**: An organisation can publish a catalog and immediately be crawlable by any registry — no approval process, no account creation.

**Registry diversity is a feature**: Different registries can serve different needs:
- A community registry might index only open-source capabilities
- A compliance-focused registry might only list capabilities with verified HIPAA attestations
- An enterprise-internal registry controls exactly which capabilities internal agents can discover

**Direct domain fetch as escape hatch**: Any client can bypass all registries entirely and fetch a catalog directly from a partner domain. This means you can always connect to a known partner even if no registry indexes them.

**Catalogue propagation**: Catalogs can link to sub-catalogs, enabling organic discovery — finding one catalog can lead to discovering many others, similar to link-following web crawlers.

## Key Properties
- **No central authority**: No single registry controls what can be discovered
- **Open publishing**: Anyone can publish a catalog; no gatekeeping
- **Parallel indexing**: Multiple registries index the same sources independently
- **Policy diversity**: Each registry applies its own trust, ranking, and access rules
- **Direct bypass**: Clients can always skip registries and fetch catalogs directly
- **Self-healing**: If one registry goes down, others continue serving discovery queries

## Relationships
- Implemented by [[agentic-resource-discovery|ARD]]: federation is a core architectural decision in the ARD spec
- Depends on [[ai-capability-catalog|AI Capability Catalog]]: catalogs are the shared artifact all registries crawl
- Served by [[capability-registry|Capability Registries]]: each registry is a node in the federated network
- Anchored by [[domain-as-identity-trust|Domain-as-Identity Trust]]: federation works without a central authority because domain ownership provides the trust root
- Contrasts with [[mcp-server-portal|MCP Server Portal]]: a server portal is typically a centralised catalog; federated discovery is the decentralised alternative

## Applications
- **Ecosystem bootstrapping without lock-in**: AI platforms can adopt ARD discovery without committing to any single registry provider
- **Regulatory segmentation**: A healthcare consortium runs its own registry that only indexes HIPAA-verified capabilities; general registries are never consulted
- **Resilience**: A production agent's discovery path doesn't break if a single registry is unavailable
- **Competitive diversity**: Multiple registries competing to provide the best index incentivises quality and comprehensiveness
- **Enterprise + open coexistence**: An enterprise can run a private registry for internal capabilities while also querying public registries for external tools — both coexist on the same ARD protocol

## Sources
- [Announcing the Agentic Resource Discovery specification](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/) — Google Developers Blog, June 2026
- [ARD Specification — Federation model](https://agenticresourcediscovery.org/) — Full federation design including trust propagation
- [ARD Working Group participants](https://agenticresourcediscovery.io/) — Microsoft, Google, Hugging Face, GoDaddy and others

## See Also
- [[agentic-resource-discovery]]
- [[ai-capability-catalog]]
- [[capability-registry]]
- [[domain-as-identity-trust]]
- [[multi-agent-systems]]
- [[agent-to-agent-protocol]]
