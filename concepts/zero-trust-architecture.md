---
title: "Zero Trust Architecture"
date: 2026-04-15
domain: security
maturity: established
source_type: practitioner
topics: [enterprise]
tags: [concept, security, architecture, zero-trust, identity, governance, domain/security, maturity/established, source-type/practitioner, topic/enterprise]
status: draft
---

# Zero Trust Architecture

## Definition
A security model and architectural approach premised on the principle "never trust, always verify." Zero Trust eliminates the concept of a trusted internal network perimeter; instead, every access request — regardless of network location, user, or device — must be continuously authenticated, authorised, and validated before access is granted. Trust is never implicit; it must be explicitly established and continuously re-evaluated.

## Explanation
The traditional perimeter model assumed that anything inside the corporate firewall was safe. This assumption collapsed as workloads moved to cloud, remote work became ubiquitous, and attackers learned to exploit lateral movement once inside the perimeter.

Zero Trust was formalised by John Kindervag at Forrester (2010) and adopted widely via NIST SP 800-207 (2020).

**Core Zero Trust principles:**

**1. Verify explicitly**
Authenticate and authorise every request based on all available data points: identity, location, device health, service or workload, data classification, and anomaly signals. No implicit trust from network location.

**2. Use least-privilege access**
Grant only the minimum permissions necessary for the specific task, for the minimum time. Just-in-time (JIT) and just-enough-access (JEA) patterns limit blast radius of compromised credentials.

**3. Assume breach**
Design as if attackers are already inside. Segment networks microscopically, encrypt all traffic (even internal), log everything, and build response playbooks assuming lateral movement is occurring.

**Zero Trust pillars (CISA model):**
- **Identity** — verify who is requesting (MFA, SSO, conditional access)
- **Device** — verify the health/posture of the requesting device
- **Network** — microsegmentation; encrypt everything; no implicit trust on VLAN membership
- **Application/Workload** — authenticate at the application layer, not just network
- **Data** — classify data, control access by classification, monitor data flows
- **Visibility & Analytics** — collect telemetry across all pillars; detect anomalies

**In practice — key technologies:**
- **Identity Provider (IdP):** Centralised authentication (Okta, Azure AD, Authentik) + MFA
- **Service mesh:** mTLS between all services — every service-to-service call is authenticated
- **Policy engine:** Centralised policy evaluation (OPA/Rego) separate from enforcement points
- **SASE / SSE:** Network access via identity-aware proxy rather than VPN
- **Secrets management:** No static credentials; short-lived tokens via Vault, AWS IAM, or similar

**Zero Trust for AI agents:**
AI agents are non-human principals. Applying Zero Trust to agents means:
- Each agent has its own identity (service account or SPIFFE SVID)
- Agents receive only the tool permissions needed for the current task (least-privilege per invocation, not per session)
- All agent actions are logged with sufficient attribution for audit
- Agent credentials are short-lived and automatically rotated

## Key Properties
- **Identity is the new perimeter** — strong identity verification replaces network location as the trust anchor
- **Continuous verification** — trust is re-evaluated on each request, not established once at login
- **Least privilege is mandatory** — broad permissions are a vulnerability; scope access tightly in time and resource
- **Visibility is non-negotiable** — Zero Trust without full telemetry is theatre; you can't verify what you can't see
- **Microsegmentation limits blast radius** — compromise of one segment does not automatically grant access to others
- **Encryption everywhere** — internal traffic is not more trusted than external; encrypt all communications

## Relationships
- Applied in [[agentic-ai-platform-architecture]]: identity propagation and least-privilege per tool invocation echo Zero Trust applied to non-human agents
- Related to [[data-governance]]: Zero Trust's data pillar and data governance overlap significantly — classification, access control, and lineage are shared concerns
- Related to [[observability]]: Zero Trust requires comprehensive telemetry for continuous verification; observability infrastructure provides this
- Related to [[constrained-agent-actions]]: tool-scoped permissions and typed action constraints are a Zero Trust application to agent systems
- Related to [[model-context-protocol|MCP]]: MCP server capability declarations are a tool-scoping mechanism that aligns with least-privilege principles

## Applications
- **Enterprise cloud migration:** Replace VPN-based perimeter with identity-aware access proxy; all internal services require authentication regardless of source
- **AI agent access control:** Each agent gets a scoped identity; tool permissions granted per-task and revoked when complete
- **Homelab:** Authentik as SSO IdP + Traefik forward auth implements a lightweight Zero Trust pattern — no service accepts unauthenticated requests even on the internal network
- **Secrets management:** Infisical + short-lived machine identity tokens (rotating) implements Zero Trust for application secrets — no long-lived static credentials on disk
- **Multi-agent pipelines:** Each agent-to-agent call authenticated; A2A protocol's auth support enables Zero Trust between agents

## Study

> [!tip] Flashcards
> [[flashcards/zero-trust-architecture|Review flashcards for this concept]]

## Sources
- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/publications/detail/sp/800-207/final) — definitive US government standard
- [CISA Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model) — pillar-based maturity framework
- [BeyondCorp: A New Approach to Enterprise Security (Google)](https://research.google/pubs/pub43231/) — Google's original Zero Trust implementation

## See Also
- [[data-governance]]
- [[agentic-ai-platform-architecture]]
- [[constrained-agent-actions]]
- [[observability]]
- [[model-context-protocol]]
- [[mcp-server-portal]] — Zero Trust applied to AI tool access; identity-based, per-group, audited tool exposure
- [[shadow-mcp-detection]] — network boundary enforcement against unauthorised MCP (assume breach applied to AI tooling)
- [[platform-baked-governance]] — the delivery mechanism for Zero Trust controls in platform templates
- [[device-bound-licensing]] — Zero Trust device pillar applied to commercial licensing: device identity cryptographically proven before license is issued, no implicit trust from network location
- [[network-layer-ai-security]] — network controls as outermost Zero Trust enforcement for public endpoints
- [[ai-llm-gateway]] — identity-aware LLM access controls consistent with Zero Trust principles
- [[reputation-based-extortion]] — IBM's Cost of a Data Breach report cites trusted identity controls for users, data and machine agents as the recommended mitigation against this extortion pattern
