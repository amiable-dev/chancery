---
title: "Developer Endpoint Inventory"
date: 2026-05-25
domain: security
maturity: emerging
source_type: practitioner
topics: [supply-chain]
tags: [concept, security, supply-chain, developer-tools, mcp, endpoint-security, domain/security, maturity/emerging, source-type/practitioner, topic/supply-chain]
status: draft
sources:
  - url: https://www.marktechpost.com/2026/05/23/perplexity-open-sources-bumblebee-a-read-only-supply-chain-scanner-for-developer-endpoints/
    hash: sha256:15fe0fcf0d429c982865c7713bf80c85898b8e512175f26db9a06198c289c22a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/perplexityai/bumblebee
    hash: sha256:ee78cdb69f095f1cc2a9c5c8d545052a89b75121ea1d2d113afdd09e4c56d19d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.perplexity.ai/hub/blog/perplexity-is-open-sourcing-bumblebee
    hash: sha256:a760b962b03d6ef7e9301f4f76fc32a676a1888feeceebb2312ac756ffdc9b42
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Developer Endpoint Inventory

## Definition
Developer Endpoint Inventory is the systematic collection of structured records describing every package, editor extension, browser extension, and AI tool configuration present on a developer's machine — gathered by reading on-disk metadata directly, without invoking package managers or executing any code.

## Explanation
Developer machines are a distinct attack surface from production systems and CI builds. They accumulate packages from npm, PyPI, Go modules, RubyGems, Composer, Bun, and pnpm; dozens of VS Code/Cursor/Windsurf extensions; browser extensions in Chrome, Firefox, Brave, Arc; and increasingly, MCP server configs from tools like Claude Desktop, Gemini CLI, and Cline.

When a supply chain compromise lands — a malicious package version, a backdoored extension, an attacker-controlled MCP server — security teams face an immediate question: *which developer machines are affected right now?* SBOM tools answer "what shipped," EDR tools answer "what ran," but neither answers "what is sitting on each developer's disk at this moment." That is the gap developer endpoint inventory fills.

**How inventory is built:**

Inventory tools read directly from the filesystem rather than querying package managers:

| Surface | Sources read |
|---|---|
| npm/pnpm/Yarn | `package-lock.json`, `pnpm-lock.yaml`, `node_modules/.package-lock.json` |
| Bun | `bun.lock` (text format; binary `bun.lockb` not yet parsed in Bumblebee v0.1) |
| PyPI | `*.dist-info/METADATA`, `*.dist-info/RECORD` |
| Go | `go.sum`, `go.mod` |
| RubyGems | `Gemfile.lock`, gem install metadata |
| Composer | `composer.lock` |
| VS Code / Cursor / Windsurf | Extension manifests in `~/.vscode/extensions/*/package.json` |
| Chromium browsers | `Extensions/*/manifest.json` in the browser profile |
| Firefox | `extensions.json` in the profile directory |
| MCP configs | `claude_desktop_config.json`, `mcp.json`, `.mcp.json`, `mcp_settings.json`, `~/.gemini/settings.json` |

Each record includes: hostname, OS, architecture, ecosystem, package name, version, source file path, and a **confidence level** (high/medium/low) reflecting how reliably the version was determined.

**Scan profiles:**

Bumblebee (Perplexity's open-source implementation) defines three profiles:
- **baseline** — global package roots, language toolchains, editor extensions, browser extensions, MCP configs
- **project** — dev directories like `~/code`, `~/src` (catches locally-installed packages not globally visible)
- **deep** — full sweep of operator-specified roots, typically the entire home directory during active incident response

**Output format:** NDJSON (newline-delimited JSON), one record per component. This is designed for streaming into a SIEM, S3, or a grep-compatible pipeline without requiring a JSON parser that can hold the whole file in memory.

**MCP config inventory specifics:**

Bumblebee reads MCP server entries from host config files but intentionally omits env values and env key names found in `env:` blocks — preventing credential leakage while still inventorying which MCP servers are configured. This is relevant as MCP config files increasingly contain API tokens and secrets.

## Key Properties
- **Read-only by design** — never executes install scripts, never invokes `npm`, `pip`, `bun`, or any package manager binary
- **Broad ecosystem coverage** — maps to the ecosystems targeted in active supply-chain campaigns (npm, PyPI, RubyGems, Go, Composer)
- **Structured output** — NDJSON enables downstream filtering, aggregation, and matching
- **Confidence-rated records** — explicitly marks how certain the version determination is, preventing false positives from partial metadata
- **MCP-aware** — inventories AI tool configs as a first-class surface, not an afterthought

## Relationships
- Fills the [[supply-chain-endpoint-gap]]: the gap between what SBOM covers (build artifacts) and what EDR covers (runtime processes)
- Works against an [[exposure-catalog]]: the inventory itself is inert; matching it against a catalog produces actionable findings
- Related to [[shadow-mcp-detection]]: both address MCP config surfaces; shadow detection operates at the network layer, endpoint inventory operates at the filesystem layer
- Related to [[model-context-protocol]]: MCP server configs are a first-class inventory surface because they're increasingly targeted in supply-chain attacks
- Contrast with [[agent-powered-sast]]: SAST analyses source code for vulnerabilities; developer endpoint inventory analyses installed artefacts for known-compromised versions

## Applications
- **Rapid exposure triage after a CVE drops:** Run a baseline scan fleet-wide with an updated exposure catalog. Get findings in minutes rather than waiting for EDR telemetry or manual review.
- **Homelab/personal use:** Schedule weekly scans with launchd or cron to maintain a current inventory of installed packages; diff output over time to detect unexpected additions.
- **MCP security auditing:** Inventory which MCP servers are configured across all machines before an organisation adopts MCP broadly — baseline for governance.
- **Incident response (deep profile):** During an active compromise, sweep the full home directory to catch packages installed to non-standard locations.
- **Fleet hygiene monitoring:** Build a dashboard from NDJSON output showing packages by version, flagging outdated or duplicate installs across developers.

## Study
- Flashcards: [[flashcards/developer-endpoint-inventory|Practice this concept]]

## Sources
- [Perplexity Open-Sources Bumblebee (marktechpost.com)](https://www.marktechpost.com/2026/05/23/perplexity-open-sources-bumblebee-a-read-only-supply-chain-scanner-for-developer-endpoints/) — overview article with architecture details
- [perplexityai/bumblebee (github.com)](https://github.com/perplexityai/bumblebee) — canonical implementation; README covers supported ecosystems and output format
- [Perplexity blog: open-sourcing Bumblebee](https://www.perplexity.ai/hub/blog/perplexity-is-open-sourcing-bumblebee) — Perplexity's internal use case and workflow

## See Also
- [[supply-chain-endpoint-gap]]
- [[exposure-catalog]]
- [[read-only-security-scanning]]
- [[shadow-mcp-detection]]
- [[model-context-protocol]]
- [[zero-trust-architecture]]
