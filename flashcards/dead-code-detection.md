---
tags: [flashcards, static-analysis, code-quality, typescript]
sr-due: 2026-05-02
sr-interval: 1
sr-ease: 250
---

# Dead Code Detection — Flashcards

#flashcards/static-analysis

## Definition <!-- kb:card:04c79c -->
What is dead code detection?
?
Static analysis that identifies code present in a codebase but never reachable from any live entry point — unused exports, orphaned files, undeclared/unimported dependencies, orphaned types, and stale suppression comments. Requires whole-project module graph analysis.

## Categories <!-- kb:card:0ea534 -->
Name 4 categories of dead code in TypeScript/JavaScript codebases.
?
1. Unused exports — exported symbol with no importing references
2. Unused files — file that nothing imports (orphan in the graph)
3. Unused dependencies — package in package.json but never imported
4. Circular dependencies — import cycles that block tree-shaking and indicate tangled design

## Entry-Point Anchoring <!-- kb:card:31f13f -->
Why is entry-point anchoring important for dead code detection?
?
"Dead" means unreachable from live entry points. Without anchoring, every file looks potentially reachable. Entry points (package.json main/exports, framework conventions) define the live roots; anything not reachable from them is genuinely dead.

## AI Context <!-- kb:card:3aad93 -->
Why does dead code detection matter more in AI-assisted development workflows?
?
AI coding agents generate code fast and frequently introduce exports, utilities, and types that are never wired up. Running `fallow dead-code --changed-since main` on each PR is a cheap, deterministic check to catch orphaned code before it accumulates.

## Stale Suppressions <!-- kb:card:a8c82d -->
What are stale suppression comments and why detect them?
?
`// @ts-ignore`, `eslint-disable`, or `@expected-unused` comments added when a warning fired, but the underlying issue was later fixed — so the suppression now silences nothing (or worse, hides a new real warning). Detecting them keeps signal-to-noise high.
