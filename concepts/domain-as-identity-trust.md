---
title: "Domain-as-Identity Trust"
date: 2026-06-18
domain: security
maturity: emerging
source_type: practitioner
topics: [protocols, provenance]
tags: [concept, ai-agents, security, cryptography, trust, identity, standards, protocols, domain/security, maturity/emerging, source-type/practitioner, topic/protocols, topic/provenance]
status: draft
sources:
  - url: https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/
    hash: sha256:df3cb3c3f9e4bf2ccd9482149de102a397657e43ef3a88e94d2a46f066ac45c6
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/ards-project/ard-spec/blob/main/spec/schemas/ai-catalog.schema.json
    hash: sha256:598da2812bf02c0ba139c82e98eeffbe3dce31b4034dfded2638c44f6693a45d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/agent-identity-overview
    hash: sha256:415f39a5b75650c5c7dbdb822d158da95b9c15535b4c3caa6d8262456097a143
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Domain-as-Identity Trust

## Definition
A trust model in which **ownership of a DNS domain serves as the primary identity anchor** for cryptographically verifying the publisher of AI capabilities. By hosting a capability manifest (e.g., `ai-catalog.json`) at a well-known path on a controlled domain, the publisher leverages existing DNS/TLS infrastructure — rather than a central certificate authority or identity broker — to assert "I am who I say I am."

## Explanation
The challenge in open, federated agent ecosystems is trust: when an agent dynamically discovers a new capability at runtime, how does it know the capability actually comes from the claimed organisation and hasn't been tampered with or spoofed?

Domain-as-Identity solves this by reusing the PKI infrastructure the web already runs on:

1. **Domain ownership is already verified** — DNS registrars and TLS certificate authorities (Let's Encrypt, etc.) ensure that `acme.com`'s TLS cert is held by the actual owner of `acme.com`
2. **Hosting at well-known path is a proof of control** — if `https://acme.com/.well-known/ai-catalog.json` exists and is served over TLS, the domain owner put it there
3. **Trust manifest extends this** — the catalog can include a cryptographically signed `trust_manifest` that binds specific capability claims to the domain identity, enabling additional verification beyond TLS

### Trust Manifest
The ARD trust manifest is a structured JSON document (defined in ARD's catalog schema) that:
- Asserts the publisher's identity tied to the domain
- Lists compliance certifications (HIPAA, SOC2, etc.)
- Can be verified by clients or by registries before they index the catalog
- Enables enterprise compliance gating — agents can refuse to connect to capabilities whose trust manifest doesn't meet required standards

### Why No Central Authority?
The web itself has no single trust authority — instead it has a distributed PKI ecosystem with many CAs, all anchored to domain ownership. ARD deliberately mirrors this design:
- Any organisation can publish a catalog without asking permission from a central registry
- Trust is earned through verifiable domain control + TLS, not through registration in a single database
- Different registries can apply different trust thresholds — some require verified manifests, others accept self-attested claims

### Relationship to Agent Attestation
Domain-as-Identity trust operates at the *publisher* level (is this organization who they claim to be?). It complements but is distinct from [[agent-attestation-standards|Agent Attestation Standards]], which operate at the *artifact* level (was this agent binary built from the claimed source?).

## Key Properties
- **No central identity broker**: Trust is derived from DNS + TLS infrastructure, not a proprietary identity provider
- **Domain = identity anchor**: Hosting at `/.well-known/ai-catalog.json` on your domain is a verifiable proof of control
- **Cryptographic**: Trust manifests can be cryptographically signed, enabling offline verification
- **Composable with existing PKI**: Works with any CA-issued TLS cert; no ARD-specific CA required
- **Compliance-extensible**: Trust metadata can include compliance certifications, allowing registries and clients to filter by compliance posture

## Relationships
- Foundation of [[agentic-resource-discovery|ARD]]: every ARD catalog relies on domain-as-identity for its trust root
- Verified by [[capability-registry|Capability Registries]]: registries check trust manifests before indexing catalogs
- Related to [[agent-attestation-standards|Agent Attestation Standards]]: both are mechanisms for cryptographic provenance, but operating at different levels (publisher vs artifact)
- Related to [[zero-trust-architecture|Zero Trust Architecture]]: ZTA assumes no implicit trust; domain-as-identity provides the explicit trust mechanism that ZTA requires before granting access
- Leverages [[ai-capability-catalog|AI Capability Catalog]] as the manifest vehicle

## Applications
- **Cross-organisation capability sharing**: Company A can trust a capability from Company B because they can verify B's domain identity before connecting
- **Enterprise compliance gating**: Agents configured to only connect to HIPAA-compliant capabilities can verify this from the trust manifest before making any calls
- **Phishing/spoofing resistance**: An attacker who doesn't control `acme.com` cannot publish a catalog that impersonates Acme's capabilities under that domain
- **Supply chain provenance**: Enterprise tools can record which domain-verified publisher provided each capability used in an agent workflow — equivalent to a software SBOM for agent components

## Sources
- [Announcing the Agentic Resource Discovery specification](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/) — Google Developers Blog, June 2026
- [ARD Trust Manifest Schema](https://github.com/ards-project/ard-spec/blob/main/spec/schemas/ai-catalog.schema.json) — JSON schema including trust manifest fields
- [Google Cloud Agent Identity](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/agent-identity-overview) — Enterprise implementation of trust manifest verification

## See Also
- [[agentic-resource-discovery]]
- [[ai-capability-catalog]]
- [[agent-attestation-standards]]
- [[zero-trust-architecture]]
- [[capability-registry]]
