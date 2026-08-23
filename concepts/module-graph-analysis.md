---
title: "Module Graph Analysis"
date: 2026-05-02
domain: software-engineering
maturity: established
source_type: practitioner
topics: [static-analysis]
tags: [concept, static-analysis, architecture, dependency-management, typescript, javascript, domain/software-engineering, maturity/established, source-type/practitioner, topic/static-analysis]
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

# Module Graph Analysis

## Definition
A static analysis technique that constructs a directed graph representing the entire import/export structure of a codebase — with source files as nodes and import statements as directed edges — and then traverses or queries this graph to detect cross-file problems that cannot be found by examining any single file in isolation.

## Explanation
File-local tools (linters, type checkers) see a file and its declared types but not the complete usage picture. Module graph analysis inverts this: first build the full graph of who imports what, then ask questions across the whole structure.

**What the graph enables:**

| Question | File-local tool | Module graph |
|---|---|---|
| Is this local variable used? | ✅ Yes | — |
| Is this exported function imported anywhere? | ❌ No | ✅ Yes |
| Is this file imported by anything? | ❌ No | ✅ Yes |
| Is there a cycle A → B → C → A? | ❌ No | ✅ Yes |
| Does this dependency in package.json get imported? | ❌ No | ✅ Yes |

**Construction process:**
1. Resolve all entry points (package.json `main`/`exports`, framework conventions, plugin patterns)
2. Parse each file into an AST; extract all import/require/dynamic-import statements and export declarations
3. Resolve each import path to a file (applying tsconfig paths, aliases, framework magic)
4. Build the directed graph incrementally; track both the exporting symbol and the importing reference
5. Once complete, run graph algorithms: reachability (dead file detection), cycle detection (circular deps), subgraph queries (boundary violations)

**Performance:** Rust-native implementations parse and link large TypeScript monorepos in sub-second time because the Rust borrow checker eliminates allocation churn during graph construction.

## Key Properties
- **Directed** — edges flow from importer to importee (A imports B → edge A→B)
- **Symbol-level resolution** — tracks individual exports, not just file-level deps
- **Entry-point anchored** — reachability is measured from known entry points, not arbitrary roots
- **Incremental friendly** — file changes only require re-parsing affected nodes and re-traversing affected edges
- **Foundational** — dead code, circular deps, and boundary violations all derive from the same underlying graph

## Relationships
- Used by [[fallow-codebase-intelligence]]: Fallow's entire analysis layer rests on its module graph
- Enables [[dead-code-detection]]: unreachable nodes from entry points = dead files/exports
- Enables [[architecture-boundary-enforcement]]: boundary rules are predicates over graph edges
- Builds on [[ast-based-code-analysis]]: AST parsing extracts the import/export data that populates graph edges
- Related to [[codebase-knowledge-graphs]]: both are graph representations of codebases; module graph focuses on dependency topology, knowledge graph on semantic relationships
- Related to [[blast-radius-dependency-tracing]]: blast radius traversal is a reverse-direction query on the module graph

## Applications
- **Unused export detection:** symbols with zero in-edges from non-test files
- **Orphan file detection:** files with zero in-edges from entry-reachable nodes
- **Cycle detection:** find strongly connected components (Tarjan's or Kosaraju's algorithm)
- **Circular dependency breaking:** traverse cycles to find the best edge to sever
- **Package audit in monorepos:** cross-package import edges validate against `package.json` `dependencies` declarations
- **Change impact analysis:** reverse-traverse from changed files to find all affected dependents (blast radius)

## Study
- Flashcards: [[flashcards/module-graph-analysis|Practice this concept]]

## Sources
- [fallow-rs/fallow on GitHub](https://github.com/fallow-rs/fallow) — module graph is Fallow's core data structure
- [Fallow docs](https://docs.fallow.tools)

## See Also
- [[fallow-codebase-intelligence]]
- [[dead-code-detection]]
- [[architecture-boundary-enforcement]]
- [[ast-based-code-analysis]]
- [[codebase-knowledge-graphs]]
- [[blast-radius-dependency-tracing]]
