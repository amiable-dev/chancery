---
title: MCP tool poisoning
aliases:
  - Tool poisoning attack
  - Tool description poisoning
  - MCP03:2025
date: 2026-08-24
domain: security
maturity: emerging
source_type: research
tags: [concept, security, mcp, ai-agents, domain/security, maturity/emerging, source-type/research]
status: draft
sources:
  - url: https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-tool-poisoning-ai-agent-exfiltration-2/
    class: external-primary
---

# MCP tool poisoning

## Definition

**MCP tool poisoning** is the attack class in which adversarial instructions are embedded in the metadata an MCP server supplies — tool descriptions, parameter schemas, or returned content — so that a connected AI agent, which loads that metadata into its reasoning context with the same authority as trusted system instructions, executes the attacker's directives; the structural cause is that MCP clients inherit trust from the servers they connect to, with no cryptographic attestation of tool-definition integrity, no re-verification after onboarding, and no reliable way for current language models to distinguish a tool's operational description from an adversarial instruction written in the same natural language.

## Explanation

The attack targets the capability supply chain rather than user input: unlike classical prompt injection, a poisoned description arrives at session initialization — before any user request or retrieved data — and shapes every interaction for the session's lifetime with no further trigger. The documented variants share that single cause: description poisoning (instructions hidden in metadata, sometimes concealed with Unicode homoglyphs or zero-width characters so review interfaces show benign text), rug pulls (definitions changed server-side after security review, formalized as CVE-2025-54136 in Cursor, CVSS 8.8, where a user's one-time approval silently survived later malicious changes), tool shadowing (one server's description carrying meta-instructions about how the agent should use other servers' tools, so the legitimate tool executes normally while the agent's behavior around it is modified), and registry-level supply-chain compromise (the npm package postmark-mcp posed as an email integration while blind-copying all outbound mail to the attacker). Invariant Labs' April 2025 proof of concept exfiltrated private repository contents and message histories with no user interaction, and the MCPTox benchmark across more than 45 real MCP servers measured attack success rates above 60%. The enterprise stakes follow from ambient authority: MCP integrations are provisioned at platform level with standing access to mail, repositories and databases, so a poisoned definition redirects already-authorized access rather than escalating privilege — which is why perimeter and access monitoring miss it. The defenses follow from the cause: SHA-256 hash-pin tool manifests and re-verify at session start, allowlist servers, treat all tool-returned content as untrusted input, interpose an inspecting gateway between agents and servers, baseline agent behavior to catch post-approval drift, and log every definition load for forensics. The source is a Cloud Security Alliance research note — analysis anchored to NVD-listed CVEs, a public proof-of-concept repository and an arXiv benchmark, though its framework-alignment sections also serve CSA's own programs.

## Key Properties

- Four variants, one cause: description poisoning, rug pulls, tool shadowing and registry supply-chain compromise all exploit unverified trust in server-supplied metadata
- Executes from session initialization with no user action, and a poisoned description persists for the session's lifetime
- Redirects ambient, already-authorized access instead of escalating privilege, evading perimeter and access-control monitoring
- Confirmed beyond theory: CVE-2025-54136 (Cursor rug pull, CVSS 8.8), CVE-2025-6514 (mcp-remote shell injection, CVSS 9.6), the malicious postmark-mcp npm package, and >60% success in the MCPTox benchmark
- Core mitigations: hash-pinned manifests re-verified per session, server allowlists, untrusted-by-default tool output, inspecting gateways, behavioral baselining and definition-load audit logs

## Relationships

- [[remote-first-mcp-governance]] — supplies the concrete threat model that governance pattern cites as a one-line motivator — poisoning is the mechanism that makes unvetted, locally-installed servers a supply-chain liability, and its allowlist-and-central-review prescriptions are what that architecture enforces in infrastructure
- [[mcp-authorization-hardening]] — shows that a different trust seam of the same protocol remains open: authorization hardening binds credentials and issuers, but tool metadata still enters the agent's context with no integrity verification at the protocol layer
- [[siem-agentic-visibility-gap]] — the audit trail this note prescribes — structured logs of tool-definition loads and invocations — is exactly the AI-native security event stream that gap argues traditional SIEMs cannot produce on their own

## Applications

Threat-modeling any MCP rollout before granting agents ambient authority over mail, repositories or data stores; immediate hardening of existing deployments — inventory every server connection, hash-pin manifests with re-verification at session start, allowlist servers, and treat tool output as hostile input; adding tool-poisoning and rug-pull cases to red-team exercises against agentic systems.

## Sources

- https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-tool-poisoning-ai-agent-exfiltration-2/

## See Also

- [[remote-first-mcp-governance]]
- [[mcp-authorization-hardening]]
