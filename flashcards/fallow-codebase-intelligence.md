---
tags: [flashcards, tools, static-analysis, typescript, ai-agents]
sr-due: 2026-05-02
sr-interval: 1
sr-ease: 250
---

# Fallow — Codebase Intelligence — Flashcards

#flashcards/tools

## Definition <!-- kb:card:af8b54 -->
What is Fallow?
?
A Rust-native, zero-config static analysis tool for TypeScript/JavaScript that builds a whole-project module graph to detect dead code, duplication, complexity hotspots, and architecture boundary violations. Ships with MCP, LSP, and Agent Skill interfaces as "the codebase truth layer your coding agent can call."

## Differentiator <!-- kb:card:859eed -->
What is Fallow's core differentiator vs ESLint/Biome/TypeScript?
?
It operates on the whole-project module graph rather than file-by-file. This lets it find things file-local tools cannot: unused exports (nothing imports them), orphaned files (nothing imports the file), circular dependencies, and cross-file code duplication.

## Application <!-- kb:card:76aaac -->
When would you run `fallow audit --changed-since main`?
?
As a CI/PR gate to get a pass/warn/fail verdict on only the files changed in a PR — cheap, deterministic check that catches dead exports, duplication, or boundary violations introduced by the diff (especially useful after AI coding agent sessions).

## AI Integration <!-- kb:card:3edafa -->
How do AI agents use Fallow?
?
Agents call `fallow --format json` or query the MCP server to get structured codebase facts (dead code, duplication, health, boundary violations) before generating or reviewing code. Fallow provides deterministic data; the agent provides reasoning. "No AI inside."

## Four Domains <!-- kb:card:873a96 -->
What are Fallow's four analysis domains?
?
1. Dead code (unused exports, files, dependencies, types, circular deps, boundary violations)
2. Duplication (exact to semantic code clones)
3. Health/complexity (function complexity, maintainability scores, refactor targets)
4. Architecture boundaries (layer/module boundary violation detection)

## Runtime Layer <!-- kb:card:61433e -->
What does Fallow's optional paid runtime layer add?
?
Production traffic data showing which code paths actually execute in production — hot paths (frequently called) and cold paths (never/rarely called). Cold paths with static reachability = evidence-backed deletion candidates, stronger than static-only inference.
