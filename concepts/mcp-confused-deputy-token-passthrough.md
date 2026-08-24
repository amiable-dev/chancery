---
title: MCP confused-deputy and token-passthrough risk
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
topics: [mcp]
tags: [concept, security, mcp, oauth, proxy, domain/security, maturity/emerging, source-type/vendor-doc, topic/mcp]
status: draft
sources:
  - url: https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices
    hash: sha256:9abbd1c6117bd8dbe9f7d7a238cb7ced0c0640937ccb82a7fe35e90d1ace12a2
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# MCP confused-deputy and token-passthrough risk

## Definition

MCP confused-deputy and token-passthrough risk is the family of vulnerabilities that arises when an MCP proxy server mediates access to a third-party API without treating itself as a distinct trust boundary: an attacker can either replay a third-party authorization server's consent cookie against a newly registered malicious client ID to steal an authorization code meant for someone else, or exploit a server that forwards client-supplied tokens downstream without validating their intended audience, letting a token issued for one service be reused against another — both failures let an attacker borrow the MCP proxy's own trusted position rather than ever compromising it directly.

## Explanation

In the confused-deputy variant, an MCP proxy that authenticates with a third-party authorization server using one static client ID for every user, while letting MCP clients register their own dynamic client IDs, creates the gap: the third party sets a consent cookie scoped to the static ID, and because that cookie signals prior consent regardless of which dynamically registered client triggered the flow, an attacker's crafted authorization request with a malicious redirect URI sails through without a fresh consent screen, and the resulting authorization code lands on the attacker's server. In the token-passthrough variant the failure is simpler and needs no cookie trick: an MCP server accepts a client-supplied token, never checks that the token's audience claim actually names the MCP server, and forwards it unmodified to a downstream API, so the downstream service ends up trusting a credential it never intended for this caller, collapsing rate limiting, audit trails and revocation since logs now show the proxy's identity rather than the real caller's. Both mechanisms share one root cause: the proxy is being trusted as if it were a single principal when it is actually mediating for many, and the fix in each case is for the MCP server to stop assuming that identity and re-establish itself explicitly — per-client consent state tracked and checked before delegating to the third party, and audience validation enforced on every inbound token before it is ever passed on.

## Key Properties

- Two distinct exploit paths sharing one root cause: an MCP proxy treated as a single trusted principal when it actually mediates access for many distinct clients
- Confused deputy needs a specific vulnerable combination: static client ID plus dynamic client registration plus a third-party consent cookie plus missing per-client consent tracking
- Token passthrough needs only one omission: failing to validate a token's audience claim before forwarding it downstream
- Both are explicitly forbidden failure modes in the MCP authorization specification, not merely discouraged patterns

## Relationships

- [[mcp-authorization-hardening]] — hardens an adjacent seam in the same authorization flow — where authorization hardening fixes iss validation and credential-issuer binding, this concept covers the proxy-as-confused-deputy and token-forwarding failures those SEPs do not address
- [[mcp-attack-surface-taxonomy]] — gives mechanism-level depth to the taxonomy's insufficient-authentication-and-authorization category, the same expansion pattern mcp-tool-poisoning already provides for the tool-trust category
- [[authorization-response-issuer-identification]] — issuer identification stops a different confusion, which authorization server actually answered, while this concept stops the proxy itself from being tricked into acting as an unwitting go-between for a party it never validated

## Applications

Designing or auditing any MCP server that proxies to a third-party API: requiring per-client consent state checked before delegating to the third party, binding consent to a specific client_id rather than a bare user-has-consented flag, and rejecting any inbound token whose audience claim does not name the MCP server itself before it is forwarded anywhere downstream.

## Sources

- https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices

## See Also

- [[mcp-authorization-hardening]]
- [[mcp-attack-surface-taxonomy]]
