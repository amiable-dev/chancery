---
tags: [flashcards, mcp, security, supply-chain]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# MCP Manifest Pinning — Flashcards

#flashcards/security

## Definition <!-- kb:card:0de1de -->
What is an MCP "rug pull," and why does it evade input validation, authentication, and gateway policy simultaneously?
?
A rug pull is a server silently redefining a tool's description or parameter schema after a client already approved/trusted it — because the client re-fetches `tools/list` live on each connection. The resulting request is well-formed, schema-valid (against the new schema), and authenticated, so none of those controls detect that the tool's *meaning* has drifted from what was originally granted trust.

## Application <!-- kb:card:22af79 -->
What are the four steps of the manifest pinning mechanism?
?
1. Canonicalise the tool manifest (names, descriptions, parameter schemas) at registration. 2. Compute a SHA-256 digest of the canonical form, store as a signed baseline. 3. On every reconnect, re-fetch, re-canonicalise, re-hash, and compare to baseline. 4. Same hash → allow; different hash → route to a diff classifier rather than auto-reject.

## Relationship <!-- kb:card:69cfe6 -->
What is "capability attestation," and what specific protocol gap does its absence describe?
?
Maloyan & Namiot's term for a server's ability to prove, at enforcement time, that its currently-advertised tool definitions match what the client's trust was originally granted against. MCP has no built-in signature, client-enforced version pin, or change notification for tool definitions — capability attestation is entirely absent from the base protocol.

## Consequence <!-- kb:card:96d071 -->
Why is canonicalisation a required step before hashing, not an optional nicety?
?
Hashing raw JSON directly makes the hash sensitive to irrelevant differences like key order or whitespace, producing false-positive "drift" alerts for changes that carry no semantic meaning — canonicalisation ensures the hash only changes when the tool's actual meaning changes.
