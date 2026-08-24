---
tags: [flashcards, security, mcp, measurement]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Internet-facing MCP servers are exposed by design — Flashcards

#flashcards/security

## Core finding <!-- kb:card:65910e -->
What does it mean that internet-facing MCP servers are "exposed by design"?
?
The population of publicly reachable MCP servers is insecure not from isolated misconfiguration but as the predictable outcome of a deployment pace that outruns security review.

## OAuth prevalence <!-- kb:card:4491b1 -->
What percentage of dynamically audited internet-facing MCP servers had no OAuth authentication at all?
?
91.8%.

## Unrestricted shell exposure <!-- kb:card:492f5d -->
How many individual tool instances did the study find exposing shell execution with no access control?
?
687 tool instances.

## Churn rate as evidence <!-- kb:card:02c8ab -->
What percentage of confirmed MCP servers disappeared within days between measurement runs, and why does that matter?
?
41.6% — this churn rate is what distinguishes "exposed by design" from "exposed by neglect": servers are stood up and torn down faster than any security review process could reach them, rather than sitting unpatched for years.

## Measurement methodology <!-- kb:card:6f61d0 -->
What two techniques did the study combine to find and confirm these servers?
?
Passive discovery (certificate transparency logs, package registries, MCP directories, and scanners like Shodan/Censys/FOFA) combined with active dynamic testing via Corvus, an open-source framework running 34 test modules across 10 MCP-specific vulnerability classes.
