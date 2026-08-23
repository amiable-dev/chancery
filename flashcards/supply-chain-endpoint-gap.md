---
tags: [flashcards, supply-chain-endpoint-gap, security, supply-chain, threat-modelling]
sr-due: 2026-05-25
sr-interval: 1
sr-ease: 250
---

# Supply Chain Endpoint Gap — Flashcards

#flashcards/security

## Definition <!-- kb:card:e9af89 -->
What is the Supply Chain Endpoint Gap?
?
The blind spot where neither SBOM tools nor EDR systems can answer which developer machines currently have a known-compromised package, extension, or AI tool config installed on-disk — leaving incident responders unable to rapidly assess exposure during an active supply chain attack.

## SBOM Limitation <!-- kb:card:18593b -->
Why can't SBOMs close the Supply Chain Endpoint Gap?
?
SBOMs document what went into a *build artifact*. They don't capture: packages installed globally on dev laptops (outside any project), editor extensions, browser add-ons, MCP configs, locally-installed packages not committed to a lockfile, or state that has drifted since the last build.

## EDR Limitation <!-- kb:card:493474 -->
Why can't EDR close the Supply Chain Endpoint Gap?
?
EDR monitors what *runs* — process execution, network connections, filesystem writes. It can't detect a malicious package sitting dormant on disk if it hasn't executed recently, or if it only ran once during install and left no ongoing suspicious behaviour.

## Gap Diagram <!-- kb:card:b35d4c -->
Visualise the gap between SBOM, EDR, and developer disk state:
?
```
SBOM covers:   [build artifacts ← source]
EDR covers:                         [running processes → network]
Gap:                   [developer disk state]
```
Developer disk state = installed packages, extensions, MCP configs — present on disk but not currently running and not part of any specific build.

## Why MCP Amplifies It <!-- kb:card:082e53 -->
Why does the rise of MCP make the Supply Chain Endpoint Gap more severe?
?
MCP server configs reference code that runs in the context of AI agents with elevated permissions. They're a new high-value attack surface (yield agent-level access, not just a compromised library). Neither SBOM nor EDR covers which MCP servers are configured across developer machines — this is a gap that grows as MCP adoption grows.

## Response Window <!-- kb:card:87c32d -->
Why does the Supply Chain Endpoint Gap matter for incident response timing?
?
When a malicious package is reported, security teams often have a 30-minute to few-hour window before attackers move laterally or exfiltrate credentials. Without endpoint inventory tooling, asking 500 developers to self-report, waiting for EDR queries, or SSHing into machines one by one is too slow. The gap translates directly into unacceptable mean-time-to-triage.
