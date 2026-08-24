---
tags: [flashcards, security, mcp, oauth, ssrf]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# SSRF via MCP OAuth discovery — Flashcards

#flashcards/security

## Definition <!-- kb:card:65a4d0 -->
What is SSRF via MCP OAuth discovery?
?
The risk that an MCP client performing OAuth metadata discovery fetches attacker-controlled URLs supplied by a malicious server (the resource_metadata link, authorization_servers list, or token/authorization endpoints), turning the client into a server-side request forgery proxy into internal networks or cloud metadata services.

## Symmetric risk <!-- kb:card:a4190b -->
Does this SSRF risk run only from a malicious server toward a client?
?
No, it's symmetric: an authorization server that fetches a Client ID Metadata Document URL supplied by an untrusted client faces the identical fetch-what-a-stranger-told-you-to-fetch pattern, aimed at the server's own internal endpoints instead.

## DNS rebinding <!-- kb:card:84c788 -->
Why doesn't naive validate-then-fetch URL checking stop this SSRF?
?
DNS rebinding — a domain can resolve to a safe address at validation time and to a private or internal address by the time the actual fetch happens.

## Durable architectural cause <!-- kb:card:8b61df -->
What general protocol pattern is the underlying cause of this SSRF vulnerability?
?
Any step in a trust-establishing handshake where one party hands the other a URL to dereference — MCP's OAuth discovery flow has several such steps.

## Mitigations <!-- kb:card:ef4eeb -->
What mitigations close SSRF via MCP OAuth discovery?
?
Standard SSRF countermeasures applied at every discovery-time fetch: blocking private/reserved IP ranges, enforcing HTTPS, routing through an egress proxy that denies internal destinations, and pinning DNS resolution between validation and use.
