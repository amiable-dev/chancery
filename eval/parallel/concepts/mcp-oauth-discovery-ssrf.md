---
title: SSRF via MCP OAuth discovery
date: 2026-08-24
tags:
  - concept
  - security
  - mcp
  - oauth
  - ssrf
status: draft
sources:
  - url: https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices
    hash: sha256:9abbd1c6117bd8dbe9f7d7a238cb7ced0c0640937ccb82a7fe35e90d1ace12a2
    retrieved: 2026-08-24
    reachability: ok
---

# SSRF via MCP OAuth discovery

## Definition

SSRF via MCP OAuth discovery is the risk that an MCP client performing OAuth metadata discovery will fetch attacker-controlled URLs — the resource_metadata link, the authorization_servers list, or the token and authorization endpoints named inside those documents — and thereby be induced by a malicious or compromised MCP server to make requests into internal networks, cloud metadata services, or local-only endpoints it was never meant to reach, turning the client into a server-side request forgery proxy for the attacker.

## Explanation

Because MCP's OAuth discovery flow has the client trust several URLs supplied by the server it is connecting to, a malicious server can populate any of those fields with a private IP, a cloud metadata address, a localhost service, or a domain that resolves safely during validation and then rebinds to an internal address by the time the client actually fetches it, and because the client is initiating these as ordinary outbound HTTPS requests during a protocol handshake, none of the network-perimeter controls that would stop a browser-driven SSRF attempt necessarily apply. The same exposure exists in reverse for an authorization server that accepts Client ID Metadata Documents, since fetching an untrusted client's metadata URL is the identical fetch-what-a-stranger-told-you-to-fetch pattern aimed at the server's own internal administration endpoints instead of the client's. The durable point is architectural rather than incidental: any protocol step where one party hands the other a URL to dereference during a trust-establishing handshake reproduces classic SSRF, and MCP's discovery flow has several such steps.

## Key Properties

- Reproduces classic SSRF (cloud-metadata exfiltration, internal reconnaissance, firewall bypass) inside an OAuth discovery handshake rather than a browser-facing form
- Symmetric risk: MCP clients fetching server-supplied discovery URLs, and authorization servers fetching client-supplied Client ID Metadata Document URLs, are the same vulnerable pattern aimed in opposite directions
- DNS rebinding defeats naive validate-then-fetch checks, since a domain can resolve safely at validation time and to a private address at request time
- Mitigated by the standard SSRF countermeasures — private-IP blocking, enforced HTTPS, egress proxies, DNS-pinned validation — applied specifically at every discovery-time fetch

## Relationships

- [[mcp-attack-surface-taxonomy]] — is a mechanism the taxonomy's ten categories do not yet name individually, arising from the same credential-and-trust boundary the taxonomy identifies as unusually concentrated in MCP
- [[mcp-authorization-hardening]] — targets a different stage of the same authorization handshake — hardening fixes what a client does with a discovery response it trusts, this concept covers what happens when the URLs inside that response are never safe to trust in the first place

## Applications

Implementing an MCP client's OAuth discovery step: enforcing HTTPS and blocking private or reserved IP ranges on every server-supplied discovery URL and its redirect targets, routing discovery fetches through an egress proxy that denies internal destinations, and pinning DNS resolution between validation and use; the identical checks apply to an authorization server fetching a Client ID Metadata Document.

## Sources

- https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices

## See Also

- [[mcp-attack-surface-taxonomy]]
- [[mcp-authorization-hardening]]
