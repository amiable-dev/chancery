---
tags: [flashcards, mcp, security, oauth]
sr-due: 2026-07-27
sr-interval: 1
sr-ease: 250
---

# MCP OAuth Mix-Up Hardening — Flashcards

#flashcards/security

## Definition <!-- kb:card:655507 -->
What is an OAuth "mix-up attack," and what MCP change (SEP-2468) mitigates it?
?
A mix-up attack tricks a client into sending credentials meant for one authorization server to a different (attacker-controlled) one. MCP 2026-07-28 requires clients to validate the `iss` (issuer) parameter per RFC 9207, confirming the authorization response actually came from the server the client believes it's talking to.

## Application <!-- kb:card:34ad74 -->
Why is MCP's "single-client/many-server" topology disproportionately exposed to mix-up attacks?
?
One AI client routinely connects to many independent MCP servers, each potentially with its own authorization server — exactly the many-authorization-servers-one-client shape that mix-up attacks target, unlike a typical OAuth deployment where a client talks to one well-known authorization server.

## Relationship <!-- kb:card:69eee0 -->
What real interoperability bug does declaring OIDC `application_type` (SEP-837) during Dynamic Client Registration fix, beyond its security benefit?
?
Authorization servers commonly default an unlabeled client to `"web"`, which then rejects that client's localhost redirect URI. Declaring `application_type` (e.g. "native") up front avoids that rejection — a compatibility fix as much as a hardening measure.

## Consequence <!-- kb:card:46a4ba -->
Under SEP-2352, what has to happen if an MCP server migrates to a different OAuth issuer?
?
Clients must re-register — credentials are bound to the issuing server's issuer identity, so a credential issued under the old issuer cannot silently carry over to the new one.
