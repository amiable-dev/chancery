---
title: Attested per-agent identity
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, security, identity, ai-agents, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/agent-identity-overview
    class: external-primary
---

# Attested per-agent identity

## Definition

**Attested per-agent identity** gives each deployed agent its own cryptographically attested principal — a SPIFFE identifier bound to the agent's lifecycle and to the resource that hosts it, proven by a short-lived, auto-rotated X.509 certificate — rather than letting a fleet of agents share one service account, so that permissions, deny boundaries, and audit records attach to the individual agent instead of to the workload class it happens to run inside.

## Explanation

The pattern is a stack of four mechanisms, each removing a specific failure of shared machine identity. Identity: the agent is issued a SPIFFE ID whose path mirrors the resource URI it is deployed at, and that identifier is itself the policy principal, so least privilege becomes expressible per agent instead of per account, and no developer can mint a long-lived exportable key for it. Proof: the certificate is auto-provisioned and short-lived — twenty-four hours in the documented implementation, rotated automatically — so credential theft has a small window. Binding: access tokens are cryptographically tied to that certificate, presented over mutual TLS for first-party calls and, beyond a gateway, with a proof-of-possession header as a second binding, which makes a stolen bearer token useless to anyone lacking the private key; a default access policy enforces the binding rather than leaving it to each caller. Brokering: outbound secrets live in an auth manager the agent reaches using its own identity, holding API keys, client credentials, and delegated end-user tokens behind configured providers, with the authority model chosen by target — three-legged OAuth when acting for a user, the agent's own identity for first-party services, two-legged OAuth for machine-to-machine externals, vaulted keys otherwise, and plaintext basic auth explicitly deprecated. Paired with a gateway, the broker encrypts the end-user credential and the gateway decrypts it, so the agent exercises a permission it never holds. The governance payoff is attribution: every access is traceable to the agent's identifier, and delegated actions log both the agent and the user, which is the precondition for asking after an incident which agent did what on whose behalf. This is vendor documentation for one cloud platform, so treat the surface as product-specific; the primitives underneath — SPIFFE, mTLS, proof-of-possession tokens, brokered OAuth — are open standards and reimplementable elsewhere.

## Key Properties

- One attested principal per agent, derived from its hosting resource path, replacing shared service accounts
- Short-lived auto-rotated certificates, with no long-lived exportable keys and no impersonation path
- Tokens bound to the certificate — and double-bound with proof-of-possession past a gateway — so stolen tokens cannot be replayed
- Outbound secrets held by a broker the agent authenticates to with its own identity, never inlined into the agent
- A gateway can decrypt an end-user credential the agent itself never sees, granting use without possession
- Audit records carry both agent and user identity when the agent acts on someone's behalf

## Relationships

- [[mcp-authorization-hardening]] — solves the adjacent half of the same problem — that work fixes how a client proves authorization to a server at the protocol level, while this fixes what the calling agent is as a principal and where its outbound secrets are kept
- [[siem-agentic-visibility-gap]] — is a precondition for narrowing it, since telemetry cannot attribute a chain of tool calls to a specific agent or its delegating user unless each agent is already a distinct, attested principal
- [[mcp-control-plane-layers]] — is instantiated by the broker-plus-gateway arrangement here, which is exactly an enforcement point placed at the outbound trust boundary rather than trusted to the agent process
- [[authorization-response-issuer-identification]] — per-agent attestation and issuer identification are complementary halves of mutual identity assurance in agent-to-service calls — attestation establishes which agent is calling, issuer identification establishes which authorization server actually answered.
- [[passkey-authentication]] — per-agent attestation and passkeys apply the same anti-impersonation pattern to different principals — both bind an asymmetric credential to a lifecycle so it cannot be replayed elsewhere, passkeys to a browser origin and human presence, attestation to an agent's own lifecycle and hosting resource.

## Applications

Designing authentication for a fleet of agents so each is separately authorizable and auditable; eliminating long-lived API keys from agent runtimes by moving them behind a credential broker; granting an agent delegated access to a user's third-party accounts without letting the agent hold the user's token.

## Sources

- https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/agent-identity-overview

## See Also

- [[mcp-authorization-hardening]]
- [[siem-agentic-visibility-gap]]
- [[mcp-control-plane-layers]]
