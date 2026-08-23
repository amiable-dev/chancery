---
tags: [flashcards, developer-endpoint-inventory, security, supply-chain]
sr-due: 2026-05-25
sr-interval: 1
sr-ease: 250
---

# Developer Endpoint Inventory — Flashcards

#flashcards/security

## Definition <!-- kb:card:061745 -->
What is a Developer Endpoint Inventory?
?
A systematic collection of structured records describing every package, editor extension, browser extension, and AI tool configuration present on a developer's machine — gathered by reading on-disk metadata directly, without invoking package managers or executing any code.

## Gap <!-- kb:card:c4b1d7 -->
What security gap does Developer Endpoint Inventory fill?
?
The gap between SBOM (which covers build artifacts) and EDR (which covers runtime processes). Neither captures the *local on-disk state* of developer machines — installed packages, extensions, and MCP configs that haven't necessarily run recently and aren't part of any build.

## Scan Profiles <!-- kb:card:b11d0a -->
What are Bumblebee's three scan profiles and when is each used?
?
- **Baseline** — global packages, language toolchains, editor/browser extensions, MCP configs (routine scanning)
- **Project** — dev directories like ~/code or ~/src (catches locally installed packages)
- **Deep** — full sweep of operator-specified roots (active incident response)

## Output Format <!-- kb:card:ad7ff5 -->
What format does developer endpoint inventory output use, and why?
?
NDJSON (newline-delimited JSON), one record per component. This allows streaming into pipelines without loading the whole file into memory, and is grep-compatible for quick filtering.

## Confidence Levels <!-- kb:card:749ee5 -->
What do the three confidence levels in an inventory record mean?
?
- **High** — exact identity and version from canonical metadata
- **Medium** — identity reliable but version or source is partially inferred
- **Low** — only a config path or spec reference found (e.g., a package name in an MCP config with no installed version)

## MCP Handling <!-- kb:card:487969 -->
How does Bumblebee handle MCP config files in its inventory?
?
It reads MCP server entries (which servers are configured) but intentionally omits environment variable values and key names from `env:` blocks — preventing credential leakage while still inventorying which MCP servers are configured.
