---
title: "Fallow — Codebase Intelligence"
date: 2026-05-02
domain: software-engineering
maturity: emerging
source_type: announcement
topics: [static-analysis, agentic-coding]
tags: [concept, tools, static-analysis, typescript, javascript, ai-agents, dead-code, refactoring, domain/software-engineering, maturity/emerging, source-type/announcement, topic/static-analysis, topic/agentic-coding]
status: draft
sources:
  - url: https://github.com/fallow-rs/fallow
    hash: sha256:c9d8e33f047bc6cf1b0c52852a16031767a6b31545548f3a889cb58f44251b43
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.fallow.tools
    hash: sha256:e21629f777f02488472613e4a212628641a324c6b34e2fcefb422ae66554d777
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Fallow — Codebase Intelligence

## Definition
Fallow is a Rust-native, zero-config static analysis tool for TypeScript and JavaScript that builds a whole-project module graph to detect dead code, duplication, complexity hotspots, and architecture boundary violations. It ships with MCP, LSP, and Agent Skill interfaces, positioning itself explicitly as "the codebase truth layer your coding agent can call" — deterministic graph-based analysis consumed by AI agents rather than being an AI tool itself.

## Explanation
Most TS/JS tooling — ESLint, Biome, TypeScript's type checker — operates file-by-file. Fallow's key insight is that whole-project problems require whole-project analysis. It builds a complete module graph from all source files, then uses that graph to answer questions no single-file linter can:

- Is this export used *anywhere* in the project?
- Does anything *import* this file?
- Is there a *circular dependency* across these modules?
- Does this file contain logic that *already exists* somewhere else?

The tool is Rust-native, runs sub-second even on large codebases, and requires no configuration for a first run. It installs via npm but the analysis binary is Rust — no Node.js needed for the static layer.

**The AI integration angle is distinctive:** Fallow ships with an MCP server, LSP server, and an Agent Skill file that land in `node_modules` on install. This means Claude Code, Cursor, Codex and other agents can call `fallow --format json` or query the MCP server directly to get structured codebase facts before generating or reviewing code. The positioning is "no AI inside" — Fallow is a data layer, not an agent.

```bash
npx fallow --summary        # Dead code + duplication + health overview
fallow dead-code            # Unused exports, files, deps, types, cycles
fallow dupes                # Repeated logic blocks
fallow health               # Complexity hotspots and refactor targets
fallow audit                # Verdict on changed files (pass/warn/fail)
fallow fix --dry-run        # Preview automatic cleanup
```

## Key Properties
- **Whole-project scope** — module graph spans entire codebase, not single files
- **Rust-native, sub-second** — no JS runtime overhead for analysis; CI and pre-commit friendly
- **Zero config start** — auto-detects entry points from package.json, framework conventions, 91 plugins
- **Structured output** — `--format json` for agent/CI consumption
- **Four analysis domains** — dead code, duplication, complexity/health, architecture boundaries
- **MCP + LSP + Agent Skill** — three integration interfaces included on install
- **Optional runtime layer** — paid addon uses production traffic to provide hot/cold path evidence

## Relationships
- Built on [[module-graph-analysis]]: the whole-project module graph is Fallow's core data structure
- Enables [[dead-code-detection]]: cross-file unused symbol detection is the primary use case
- Implements [[code-clone-detection]]: duplication analysis from exact to semantic clones
- Enforces [[architecture-boundary-enforcement]]: layer/module boundary violation detection
- Optional [[runtime-production-intelligence]]: paid runtime layer adds production traffic signal
- Complements [[ast-based-code-analysis]]: AST is used at the file level; Fallow links ASTs into a graph
- Relates to [[codebase-knowledge-graphs]]: Fallow is a specialized codebase graph for AI agent consumption
- Relates to [[mcp-tool-patterns]]: the MCP server exposes Fallow's analysis to AI agents via standard protocol

## Applications
- **AI-assisted development hygiene:** Run after every Claude Code / Codex session to check if generated code introduced dead exports or duplicated logic
- **Pre-commit / CI gate:** `fallow audit --changed-since main` gives a pass/warn/fail verdict on a PR diff
- **Dead code cleanup sprints:** `fallow dead-code --group-by owner` assigns findings to CODEOWNERS teams
- **Monorepo health:** circular dep detection across workspace packages; boundary enforcement between layers
- **Agent onboarding:** The fallow compliance happy path defines an end state (zero findings or all documented) and includes a copy-paste agent prompt to drive a cleanup campaign
- **Architecture documentation enforcement:** Define `fallow.json` boundary rules; violations become CI failures

## Study
- Flashcards: [[flashcards/fallow-codebase-intelligence|Practice this concept]]

## Sources
- [fallow-rs/fallow on GitHub](https://github.com/fallow-rs/fallow) — primary source, README + docs
- [Fallow docs](https://docs.fallow.tools) — full reference

## See Also
- [[module-graph-analysis]]
- [[dead-code-detection]]
- [[code-clone-detection]]
- [[architecture-boundary-enforcement]]
- [[runtime-production-intelligence]]
- [[ast-based-code-analysis]]
- [[codebase-knowledge-graphs]]
- [[mcp-tool-patterns]]
- [[intent-gap-linting]]
- [[ai-code-slop]]
