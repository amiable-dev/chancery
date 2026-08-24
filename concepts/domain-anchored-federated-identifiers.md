---
title: Domain-anchored federated identifiers
date: 2026-08-24
domain: standards
maturity: emerging
source_type: vendor-doc
tags: [concept, architecture, identity, distributed-systems, naming, domain/standards, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://agenticresourcediscovery.org/spec/
    hash: sha256:d8b14ff11ae7f3d4fe9bb90bf2a90c59974f6e1487764055fa6966348b9417d2
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
  - url: https://github.com/ards-project/ard-spec
    hash: sha256:5d59906e06c45cedb9b70eb9d2a07df69059f40dd76d0f2583dc6e22a5cc6fb8
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Domain-anchored federated identifiers

## Definition

A domain-anchored federated identifier names a resource by embedding a verifiable domain name as its root, for example urn:scheme:example.com:namespace:resource-name, rather than by its network location or its cryptographic security identity, so the name stays stable and globally collision-free across independent, federated registries even as the resource's hosting, transport, and authentication mechanisms change underneath it.

## Explanation

Two identifier roles get conflated by default when a system reaches for a plain URL as its primary key: the logical identity of a thing, what it is for the purposes of search and reference, and its physical location, where to fetch it right now. A URL collapses both into one string, so migrating infrastructure, changing cloud providers, or restructuring an API gateway breaks every reference to the resource even though the resource itself did not change. A domain-anchored identifier separates these: the identifier is an abstract, permanent name, and the actual fetch location travels alongside it as a separate, freely-changeable field. Anchoring that permanent name to a domain rather than inventing a private namespace also solves the trust problem for federation: because domain names are already globally unique and independently verifiable through DNS, any registry merging catalogs from multiple untrusted upstream sources can check that a claimed identifier's domain segment is cryptographically backed by that same domain's own security credentials, rejecting claims to a namespace the claimant does not control, without needing a central naming authority to arbitrate disputes. This also keeps a third role, the cryptographic security principal used to authenticate the resource at runtime, a certificate, a SPIFFE ID, a DID, cleanly decoupled from the discovery identifier itself, since a system that needs a stable search key and a system that needs to verify a live credential have different requirements and should not be forced to share one string.

## Key Properties

- Decouples logical identity, a stable permanent name, from physical location, a URL or endpoint, so infrastructure migration does not break existing references
- Anchoring the identifier's root to a verifiable domain name lets any federated registry check a claimed namespace against that domain's own cryptographic credentials, without a central naming authority
- Also decouples the discovery identifier from the runtime security principal, such as a certificate, SPIFFE ID or DID, since search-key stability and live credential verification are different needs
- Guarantees cross-registry uniqueness for free by reusing DNS's existing global uniqueness guarantee, rather than inventing a new namespace-allocation scheme

## Relationships

- [[search-first-agent-discovery]] — search-first discovery needs a stable way to name what it finds across independent registries; this identifier scheme is the naming layer the specification pairs with search-first discovery so results stay portable and verifiable across federated indexes.

## Applications

Designing the primary key for any system that must reference resources across independently-operated, federated registries: anchor the identifier to a domain the publisher controls rather than to a URL, keep the fetch location in a separate field so it can change freely, and keep any cryptographic security identity in a third, separate field rather than overloading one string for naming, location and authentication at once.

## Sources

- https://agenticresourcediscovery.org/spec/
- https://github.com/ards-project/ard-spec

## See Also

- [[search-first-agent-discovery]]
