---
title: MCP authorization hardening
date: 2026-08-24
tags:
  - concept
  - standards
  - security
  - oauth
status: draft
sources:
  - url: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
---

# MCP authorization hardening

## Definition

**MCP authorization hardening** (six SEPs in 2026-07-28) aligns the protocol's authorization with deployed OAuth 2.0 and OpenID Connect practice — mandatory iss validation against mix-up attacks, declared application_type in dynamic client registration, credentials bound to the issuing authorization server, and documented refresh-token, scope step-up, and discovery behaviour.

## Explanation

The changes read as a catalogue of where MCP's deployment pattern — one client talking to many servers — stresses OAuth's assumptions. Mix-up attacks matter more when a single client holds authorization flows with many servers, so clients must validate the iss parameter on authorization responses per RFC 9207, with future versions expected to reject responses that omit it — servers should start supplying it now. Dynamic client registration gains a declared OpenID Connect application_type, fixing the common failure where an authorization server defaults a desktop or CLI client to web and rejects its localhost redirect URI. Registered credentials bind to the issuing server's issuer, with re-registration required when a resource migrates between authorization servers — closing credential reuse across issuers. The remainder documents what implementations were already improvising: how to request refresh tokens from OIDC-style servers, how scopes accumulate during step-up, and the well-known discovery suffix. Individually small, collectively the message is that agent-era authorization fails at the seams between spec and deployment practice, and the fix is to specify the seams.

## Key Properties

- iss validation (RFC 9207) mandatory; MCP's one-client-many-servers pattern raises mix-up risk
- application_type in DCR fixes localhost redirect rejection for native clients
- Credentials bound to issuer; migration between authorization servers forces re-registration
- Refresh tokens, scope step-up accumulation, and discovery suffix specified rather than improvised

## Relationships

- [[mcp-stateless-core]] — hardens the authorization layer of the same release whose transport that change reshaped

## Applications

Implementing or reviewing MCP client/server auth; anticipating the future mandatory-iss rejection; debugging native-client registration failures.

## Sources

- https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/

## See Also

- [[mcp-stateless-core]]
