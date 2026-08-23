---
title: "Plugin Extension Trust Model"
date: 2026-05-29
domain: security
maturity: established
source_type: practitioner
topics: [supply-chain, patterns]
tags: [concept, security, architecture, plugins, trust, sandboxing, open-source, domain/security, maturity/established, source-type/practitioner, topic/supply-chain, topic/patterns]
status: draft
sources:
  - url: https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/
    hash: sha256:db47a3a23c8db34574379ae1c5cfd4ced48717fb33c56242b3fea87efae9620d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/vigolium/vigolium
    hash: sha256:b387e7b00f9203a8583c50ca541e01a95adb04047570713a6348e741874e2e12
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Plugin Extension Trust Model

## Definition
A Plugin Extension Trust Model defines the rules, mechanisms, and assumptions that govern the execution of third-party code (extensions, plugins, modules) within a host system. It explicitly addresses: what permissions extensions have, whether execution is sandboxed, how provenance is established, and whether a curated registry or open marketplace approach is used for distribution.

## Explanation
When a platform allows user-authored extensions, it inherits the security posture of every extension that runs within it. The trust model determines whether this risk is bounded or unbounded.

Vigolium's JavaScript extension system illustrates the unsandboxed pole of the spectrum clearly: extensions "execute arbitrary commands with no sandbox." Jessie Ho (the author) is candid about the implications — a community extension registry would effectively be a distribution mechanism for arbitrary executables:

> "Extensions run arbitrary code with no sandbox, so a registry is really just distributing executables, and signing only tells you who wrote it, not whether it's safe."

He identifies three requirements for any trustworthy sharing mechanism:
1. **Provenance and signing** — knowing who wrote it (necessary but not sufficient)
2. **Untrusted-by-default posture with explicit opt-in** — extensions don't run unless the user actively enables them
3. **Curation over open submission** — a small vetted set beats a large unvetted marketplace

This framing applies beyond security tools to any plugin ecosystem: VS Code extensions, browser extensions, OpenClaw skills, npm packages, Obsidian community plugins.

### Trust Model Spectrum

| Approach | Sandboxing | Distribution | Trust Assumption |
|---|---|---|---|
| **Fully sandboxed** (e.g., WebAssembly plugins) | Process/memory isolated | Open marketplace | Plugin can't escape sandbox |
| **Signed, no sandbox** | None | Registry with signing | Author identity is known |
| **Curated, no sandbox** | None | Vetted list | Curator has reviewed code |
| **Open, no sandbox** | None | Open marketplace | User must audit code themselves |

Vigolium sits between "signed, no sandbox" and "curated, no sandbox" — signing alone is rejected as insufficient, and Ho argues that curation is the meaningful safety lever.

### The Registry Trilemma
Open plugin registries face a fundamental tension: openness (anyone can publish) conflicts with safety (arbitrary code runs in the host) and quality (curation doesn't scale to thousands of packages). Most ecosystems implicitly accept one of:
- Safety via sandboxing (limits what plugins can do)
- Safety via curation (limits what plugins exist)
- Neither (transfers all risk to the user)

## Key Properties
- **Sandboxing is a binary architectural decision:** Once removed, it cannot be partially restored by signing or curation — both are trust signals, not isolation mechanisms
- **Signing establishes identity, not safety:** Knowing who wrote malicious code is useful for attribution, not prevention
- **Curation doesn't scale:** Small, vetted sets are safe; large registries with nominal review are not meaningfully curated
- **Opt-in posture is necessary but not sufficient:** Users enabling extensions without understanding the trust model provide a false sense of safety
- **Extension scope determines blast radius:** A plugin with full host access (arbitrary commands, network, filesystem) has maximum blast radius; scope reduction is the only effective mitigation if sandboxing isn't available

## Relationships
- Related to [[zero-trust-architecture]]: the "untrusted by default, explicit opt-in" posture is a zero-trust principle applied to extension distribution
- Related to [[supply-chain-endpoint-gap]]: plugins/extensions are a supply chain vector — an unvetted extension in a security tool is ironic but real
- Related to [[model-context-protocol]]: MCP servers face the same trust model question — arbitrary code running with access to the host agent's context
- Contrast with [[mcp-server-portal]]: portal pattern attempts to mediate MCP server trust via a managed interface layer
- Related to [[shadow-mcp-detection]]: detecting unsanctioned MCP plugins is the reactive complement to proactive extension trust model design
- Related to [[plugin-marketplace]]: a marketplace is a concrete distribution mechanism that sits at the open end of this trust model's spectrum by default — curation (screening submissions) and reserved names are the trust levers a marketplace operator can layer on top of the base git-distribution schema

## Applications
- **Security tools:** Defining whether user-authored scan modules can execute arbitrary code (Vigolium, Burp Suite extensions, Nuclei templates)
- **AI agent frameworks:** OpenClaw skills, LangChain tools, MCP servers — all run third-party code with host-level access
- **IDE plugins:** VS Code extensions are unsigned, sandboxed only by Electron; the extension marketplace is nominally reviewed but not curated
- **Browser extensions:** Manifest V3 introduced sandboxing restrictions precisely because open extension distribution + full DOM/network access was exploited at scale
- **Package managers:** npm, pip, and similar registries are open-distribution, no-sandbox systems; supply chain attacks (typosquatting, dependency confusion) exploit this

## Study
- Flashcards: [[flashcards/plugin-extension-trust-model|Practice this concept]]

## Sources
- [Vigolium: Open-source vulnerability scanner](https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/) — author's first-person analysis of extension trust model and registry design
- [Vigolium GitHub](https://github.com/vigolium/vigolium) — implementation context

## See Also
- [[zero-trust-architecture]]
- [[supply-chain-endpoint-gap]]
- [[model-context-protocol]]
- [[shadow-mcp-detection]]
- [[mcp-server-portal]]
- [[plugin-marketplace]]
