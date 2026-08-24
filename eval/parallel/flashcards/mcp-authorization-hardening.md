---
tags: [flashcards, standards, security, oauth, domain/standards, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP authorization hardening — Flashcards

#flashcards/standards

## Definition <!-- kb:card:a2ba1f -->
What is MCP authorization hardening?
?
Six SEPs (2026-07-28) that align MCP's authorization with deployed OAuth 2.0/OIDC practice: mandatory iss validation against mix-up attacks, declared application_type in dynamic client registration, credentials bound to the issuing authorization server, and documented refresh-token, scope step-up, and discovery behaviour.

## Why MCP raises mix-up risk <!-- kb:card:be2f72 -->
Why does the mix-up attack risk apply especially to MCP's deployment pattern?
?
MCP's one-client-many-servers pattern means a single client holds authorization flows with many servers at once, which is exactly the condition that raises mix-up attack risk.

## application_type fix <!-- kb:card:5734c8 -->
What common failure does declaring application_type in dynamic client registration fix?
?
An authorization server defaulting a desktop or CLI client to "web" and rejecting its localhost redirect URI.

## Issuer-bound credentials <!-- kb:card:e877cc -->
What must happen when a resource migrates between authorization servers, under issuer-bound credentials?
?
Re-registration is required, since credentials are bound to the issuing server's issuer — this closes off credential reuse across issuers.

## Underlying diagnosis <!-- kb:card:2ab28f -->
What is the collective message behind these six individually small changes?
?
Agent-era authorization fails at the seams between spec and deployment practice, not in the protocol's core design — so the fix is to specify those seams rather than redesign the protocol.
