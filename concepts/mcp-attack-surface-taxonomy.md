---
title: MCP attack surface taxonomy
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, security, mcp, threat-modeling, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://owasp.org/www-project-mcp-top-10/
    hash: sha256:57598df87fe74be083d15fdc7f89c224b5aa0dacf8cdd0cf20bab6e2ef01f252
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# MCP attack surface taxonomy

## Definition

The **MCP attack surface taxonomy** is a ten-category enumeration of the security risks that arise specifically from deploying Model Context Protocol servers and the agents that call them, spanning credential handling, permission scope, tool trustworthiness, dependency provenance, injection sinks, context as a secondary instruction channel, identity verification, audit coverage, ungoverned deployment, and context isolation. Published by OWASP as its MCP Top 10, it is built to be used the way the other OWASP Top 10 lists are — as a design checklist and an audit frame, not a ranking to be read once and filed.

## Explanation

What unifies the ten is that MCP concentrates three things at a single boundary that used to be separate: credentials for downstream systems, an instruction channel the model will obey, and an execution path into shells and APIs. Each category is a way one of those three escapes. Token mismanagement and secret exposure covers hard-coded and long-lived credentials retrievable through prompt injection, compromised context or debug traces; privilege escalation via scope creep is the slow widening of agent permissions until weak scope enforcement lets an attacker modify repositories or exfiltrate data. Tool poisoning is compromise of the tools themselves, decomposed into named sub-techniques — rug pulls, meaning a malicious update to an already-trusted tool; schema poisoning, corrupting an interface definition so the model is misled; and tool shadowing, a fake or duplicate tool that intercepts interactions. Software supply chain attacks extend that reasoning to the packages, connectors and plug-ins an MCP server depends on. Command injection is the classic sink, reached here because tool arguments arrive as typed JSON that developers trust, while the accompanying schema describes structure and says nothing about whether a value is safe to hand a shell. Intent flow subversion — called prompt injection via contextual payloads elsewhere on the same page — is the case where retrieved context acts as a secondary instruction channel and steers the agent from the user's goal to the attacker's. The remaining four are operational rather than code-level: insufficient authentication and authorization across the many agents and services that exchange data in an MCP ecosystem; absent audit and telemetry, which causes no breach itself but makes one uninvestigable; shadow MCP servers spun up outside governance with default credentials and permissive configuration, the MCP form of shadow IT; and context injection and over-sharing, where persistent or insufficiently scoped context windows leak one user's or task's data into another's working memory. The source deserves reading for what it is — an OWASP community project still at v0.1 beta, with its drafting seams visible, since one category appears under two different titles in different sections of the same page. The categories are durable; the numbering and titles are not yet stable enough to cite as identifiers.

## Key Properties

- Ten categories covering credentials, scope, tool trust, dependencies, injection sinks, context-as-instructions, identity, audit, governance and context isolation
- Tool poisoning is decomposed into three sub-techniques: rug pulls, schema poisoning and tool shadowing
- Each entry carries named controls — short-lived scoped credentials, automated scope expiry, signed components with provenance tracking, immutable audit trails
- Ungoverned shadow deployments are treated as a first-class risk class, not a governance footnote
- At v0.1 beta the numbering and titles shift between sections, so cite the category names rather than the MCPxx identifiers

## Relationships

- [[mcp-tool-poisoning]] — expands one entry of this taxonomy into mechanism — the taxonomy names rug pulls, schema poisoning and tool shadowing as sub-techniques, and that concept explains how they actually work against a model
- [[siem-agentic-visibility-gap]] — explains why the audit-and-telemetry entry is so often unmet in practice, since the gap is not that teams decline to log but that existing detection pipelines cannot see agent activity at all
- [[remote-first-mcp-governance]] — is the posture that answers this taxonomy's shadow-server entry, because ungoverned servers appear precisely where an organisation offers teams no sanctioned path to register a server instead
- [[authorization-response-issuer-identification]] — issuer identification supplies the concrete mix-up-attack mitigation for the MCP attack surface taxonomy's identity-verification category — a server naming itself in every response is the mechanical check that category otherwise leaves abstract.
- [[extension-registry-trust]] — the extension-registry trust model supplies the concrete trust posture for the MCP attack surface taxonomy's dependency-provenance category — provenance plus signing, untrusted-by-default, and curation of a small vetted set.
- [[mcp-confused-deputy-token-passthrough]] — names insufficient authentication and authorization as one of its ten categories at a level this concept fills in with mechanism — a proxy trusted as one principal when it mediates for many, exploited through consent-cookie replay or unchecked token audience.

## Applications

Using the ten categories as a design checklist while building an MCP server, as the section headings of a threat model for an agent platform, or as the audit frame for reviewing servers already running in production — citing the category names rather than the numeric identifiers while the project remains in beta.

## Sources

- https://owasp.org/www-project-mcp-top-10/

## See Also

- [[mcp-tool-poisoning]]
- [[siem-agentic-visibility-gap]]
- [[remote-first-mcp-governance]]
