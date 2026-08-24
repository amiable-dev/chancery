---
tags: [flashcards, infrastructure, security, observability, domain/infrastructure, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Shadow MCP detection — Flashcards

#flashcards/infrastructure

## Definition <!-- kb:card:16768e -->
What is shadow MCP detection?
?
Discovering unauthorized MCP servers in use by a workforce by scanning egress traffic at a secure web gateway for selectors that identify MCP protocol use outside the sanctioned portal path.

## Why the authorized path isn't enough <!-- kb:card:53db7d -->
Why is governing the authorized MCP path not sufficient on its own?
?
Employees can point MCP clients directly at any remote server on the internet, re-creating the ungoverned risk the sanctioned platform was built to remove.

## Choke point and selectors <!-- kb:card:d93812 -->
What choke point does shadow MCP detection rely on, and what selectors does it scan with?
?
Secure web gateway egress traffic, scanned with host selectors for known MCP endpoints plus protocol and DLP selectors for MCP-shaped traffic.

## Response to a discovery <!-- kb:card:3c09b3 -->
What are the two possible responses once a shadow MCP server is discovered?
?
Block it, or triage it into the governed catalogue if there's legitimate demand for it.

## Blind spot <!-- kb:card:50782b -->
What is the blind spot of gateway-based shadow MCP detection?
?
It only works insofar as the gateway sees the traffic — unmanaged devices and off-network use are invisible to it.
