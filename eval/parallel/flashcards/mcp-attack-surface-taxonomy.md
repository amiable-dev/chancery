---
tags: [flashcards, security, mcp, threat-modeling, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP attack surface taxonomy — Flashcards

#flashcards/security

## Definition <!-- kb:card:454f7f -->
What is the MCP attack surface taxonomy?
?
OWASP's MCP Top 10 — a ten-category enumeration of security risks specific to deploying MCP servers and the agents that call them, meant to be used as a design checklist and audit frame, not a one-time ranking.

## What unifies the ten categories <!-- kb:card:cf90fc -->
What three things does MCP concentrate at a single boundary that used to be separate, unifying all ten risk categories?
?
Credentials for downstream systems, an instruction channel the model will obey, and an execution path into shells and APIs — each category is a way one of those three escapes.

## Tool poisoning sub-techniques <!-- kb:card:b4ebd4 -->
What are the three named sub-techniques of tool poisoning in this taxonomy?
?
Rug pulls (a malicious update to an already-trusted tool), schema poisoning (corrupting an interface definition to mislead the model), and tool shadowing (a fake or duplicate tool intercepting interactions).

## Why typed JSON doesn't stop injection <!-- kb:card:d84a0b -->
Why is command injection still a risk even though tool arguments arrive as typed JSON?
?
The schema describes structure but says nothing about whether a value is safe to hand to a shell, so developers trust arguments whose safety was never actually validated.

## Shadow MCP servers <!-- kb:card:2ac889 -->
What is a "shadow MCP server" in this taxonomy?
?
An MCP server spun up outside governance with default credentials and permissive configuration — the MCP-specific form of shadow IT, treated as a first-class risk category rather than a governance footnote.

## Citation caveat <!-- kb:card:3af311 -->
What caveat applies to citing this taxonomy by its numeric MCPxx identifiers?
?
It is an OWASP community project at v0.1 beta with drafting seams still visible; the categories are durable but the numbering and titles are not yet stable, so cite category names instead.
