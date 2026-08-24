---
tags: [flashcards, security, mcp, ai-agents, domain/security, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP tool poisoning — Flashcards

#flashcards/security

## MCP tool poisoning — definition <!-- kb:card:f65ce9 -->
What is MCP tool poisoning, and what structural gap in MCP makes it possible?
?
Adversarial instructions embedded in server-supplied metadata (tool descriptions, schemas, returned content) that an agent loads into its reasoning context with the same authority as trusted instructions. It's possible because clients inherit trust from servers with no cryptographic attestation of tool-definition integrity and no re-verification after onboarding.

## Four tool-poisoning variants <!-- kb:card:82a617 -->
Name the four documented variants of MCP tool poisoning.
?
Description poisoning (hidden instructions in metadata), rug pulls (definitions changed after approval), tool shadowing (one server's description manipulates use of other servers' tools), and registry-level supply-chain compromise (a malicious published package).

## Why tool poisoning evades monitoring <!-- kb:card:5a4db9 -->
Why do perimeter and access-control monitoring typically miss a tool-poisoning attack?
?
Because it redirects already-authorized, ambient access (mail, repos, databases the integration was provisioned with) rather than escalating privilege, so nothing looks like an unauthorized-access event.

## Tool poisoning — confirmed incidents <!-- kb:card:1df8da -->
Give two confirmed real-world instances of MCP tool poisoning beyond proof-of-concept research.
?
CVE-2025-54136 — a Cursor 'rug pull' (CVSS 8.8) where a one-time tool approval silently survived later malicious changes — and the postmark-mcp npm package, which posed as an email integration while blind-copying all outbound mail to the attacker.

## Core tool-poisoning mitigations <!-- kb:card:e54fec -->
What is the core defense pattern against MCP tool poisoning, given its cause is unverified trust in server metadata?
?
Hash-pin tool manifests and re-verify at session start, allowlist servers, treat all tool-returned content as untrusted input, interpose an inspecting gateway, and baseline agent behavior to catch post-approval drift.

## Tool poisoning — MCPTox benchmark <!-- kb:card:ef2276 -->
In the MCPTox benchmark, spanning more than 45 real MCP servers, what attack success rate was measured for tool poisoning?
?
Above 60% — empirical evidence the attack works at scale, not just as a proof of concept.
