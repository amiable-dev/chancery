---
title: "Dead Code Detection"
date: 2026-05-02
domain: software-engineering
maturity: established
source_type: practitioner
topics: [static-analysis]
tags: [concept, static-analysis, refactoring, typescript, javascript, code-quality, domain/software-engineering, maturity/established, source-type/practitioner, topic/static-analysis]
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

# Dead Code Detection

## Definition
Static analysis that identifies code which is syntactically present in a codebase but never reachable from any live entry point at runtime — including unused exports, unreferenced files, undeclared or unimported dependencies, orphaned types, and stale suppression comments. Detection requires whole-project analysis because "unused" is a property of the entire import graph, not any single file.

## Explanation
Dead code is not just an aesthetic problem. It:
- Increases cognitive load for every reader (and AI agent) consuming the codebase
- Grows over time — abandoned features leave stubs; AI-assisted development accelerates accumulation
- Creates false targets during refactoring (you may evolve code that nothing calls)
- Bloats bundles, type-check times, and CI durations
- Signals architecture decay — circular deps and boundary violations often cluster around dead areas

**Categories of dead code in TS/JS:**

| Type | Description |
|---|---|
| Unused exports | Exported symbol with zero importing references outside its file |
| Unused files | File that nothing imports (orphan in the module graph) |
| Unused dependencies | Package listed in `package.json` but never imported in source |
| Unused types | TypeScript type/interface/enum with no usages |
| Circular dependencies | Import cycles that often indicate tangled, hard-to-dead-code-eliminate modules |
| Stale suppressions | `// @ts-ignore` or `eslint-disable` comments whose rule no longer fires |
| Unresolved imports | Import paths that resolve to nothing (broken references) |
| Duplicate exports | Two files exporting the same symbol name (barrel confusion) |

**Entry-point anchoring:** Detection starts from known live entry points (package.json `main`, `exports`, framework conventions). A file is dead if no path from any entry point reaches it. This is more precise than grepping for usages because it accounts for re-exports, barrel files, and dynamic imports.

**The AI development context:** AI coding agents generate code fast. They frequently introduce new exports, new utility functions, and new types that are never wired up. Running `fallow dead-code --changed-since main` on a PR diff is a cheap, deterministic check that catches these before merge.

```bash
fallow dead-code                          # All dead code findings
fallow dead-code --unused-exports         # Only unused exports
fallow dead-code --circular-deps          # Only circular dependencies
fallow dead-code --production             # Exclude test/dev files (stricter)
fallow dead-code --changed-since main     # PR-scoped check
fallow dead-code --group-by owner         # Assign findings to CODEOWNERS teams
```

## Key Properties
- **Whole-project scope required** — file-local linters cannot determine if an export is used elsewhere
- **Entry-point anchored** — reachability computed from `package.json` entries, not arbitrary assumptions
- **Symbol-level granularity** — flags individual exports, not just entire files
- **Framework-aware** — 91 plugin patterns handle Next.js pages, React.lazy, defineAsyncComponent, etc.
- **Suppression tracking** — detects when `@expected-unused` or `eslint-disable` comments become stale
- **Monorepo-aware** — cross-package workspace imports validated like external dependencies

## Relationships
- Depends on [[module-graph-analysis]]: dead code = nodes/edges unreachable in the module graph
- Used by [[fallow-codebase-intelligence]]: one of Fallow's four core analysis domains
- Related to [[architecture-boundary-enforcement]]: boundary violations often accompany dead code clusters
- Related to [[blast-radius-dependency-tracing]]: blast radius and dead code are complementary traversals (forward vs reachability-from-entry)

## Applications
- **Pre-merge CI gate:** `fallow audit --changed-since main` → pass/warn/fail verdict on PR
- **Post-AI-session hygiene:** check if the coding agent left orphaned exports or unused utility files
- **Cleanup sprints:** `--group-by owner` distributes work to team owners via CODEOWNERS
- **Bundle size reduction:** removing unused dependencies and files shrinks production bundles
- **Monorepo audits:** detect cross-package dead edges where one package declares another as a dep but never imports it

## Study
- Flashcards: [[flashcards/dead-code-detection|Practice this concept]]

## Sources
- [fallow-rs/fallow on GitHub](https://github.com/fallow-rs/fallow)
- [Fallow docs](https://docs.fallow.tools)

## See Also
- [[module-graph-analysis]]
- [[fallow-codebase-intelligence]]
- [[architecture-boundary-enforcement]]
- [[blast-radius-dependency-tracing]]
