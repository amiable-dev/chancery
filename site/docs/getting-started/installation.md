# Installation

Chancery ships as an npm package with two binaries: `kb` (the CLI) and `kb-mcp` (a local MCP facade).

## Requirements

- **Node 22 or 24** (the supported LTS lines — `kb` refuses older runtimes with a clear message)
- git (the corpus is a git repository; several safety rails use it)

## Install

```console
$ npm install -g @amiable-dev/chancery
$ kb --help
```

The package is published with [npm provenance](https://www.npmjs.com/package/@amiable-dev/chancery) — verify it with `npm audit signatures`. The tarball contains the engine and its default ontology only: no corpus content, no operational state, ever.

## Initialise a repository

In an empty directory (or a fresh subdirectory of an existing project):

```console
$ mkdir knowledge && cd knowledge
$ kb init
$ kb verify
```

`kb init` lays down the default ontology (`.kb/` — config, schemas, the promotion rubric with its exemplars, harness skills for Claude Code / Copilot / Windsurf / Devin), the empty collections (`concepts/`, `staging/`, `flashcards/`), and a first index. **`kb verify` is green from the first minute** — zero errors, zero warnings.

The installed `kb` governs the repository it runs *in*: it walks up from your working directory to the nearest `.kb/kb.config.yaml`. You can run it from any subdirectory.

!!! note "Commit `.kb/` with the repo"
    The ontology is part of your canon — schemas, rubric, and facet axes are versioned with the content they govern.

## In CI

```yaml
- run: npm install -g @amiable-dev/chancery
- run: kb verify --format json
```

The gate is hermetic — no network, no API keys, no model calls — so it runs anywhere Node runs, and its exit code is the contract.
