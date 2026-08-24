---
title: Reachability-based dead code detection
date: 2026-08-24
tags:
  - concept
  - static-analysis
  - dead-code-detection
  - dependency-graph
status: draft
sources:
  - url: https://knip.dev/explanations/how-knip-works
    hash: sha256:11e97a5e0e1f164e706bc0a1e43c79670cb74f2793183a93f039e47427784327
    retrieved: 2026-08-24
    reachability: ok
---

# Reachability-based dead code detection

## Definition

Reachability-based dead code detection treats a codebase as a directed graph of import and reference edges rooted at a declared set of entry points, and marks any file, export, or dependency the graph cannot reach from those roots as unused — proving code is dead by showing no path connects it to anything that runs, rather than by pattern-matching for suspicious code file by file.

## Explanation

The build phase is separate from the query phase: a graph is constructed once by parsing every file reachable from the declared entry points and recording its imports and exports, and every subsequent classification (this file is unused, this export is unused, this dependency is unused) is answered by walking edges already recorded rather than re-parsing anything. Because the graph's extent is set entirely by the entry points, a missing entry point does not produce a wrong analysis of what exists — it produces a correct analysis of a smaller, incomplete graph, so everything reachable only from the missing entry appears unused. That failure mode cascades: one unlisted entry file can surface as dozens of separate unused-file, unused-export and unused-dependency findings, all of which disappear at once when the true root is added back. The practical consequence is a debugging discipline: treat a surprising unused result as evidence the root set is incomplete, such as a missing entry, an unresolvable dynamic import, or an implicit transitive dependency, rather than as a bug in the tool, and read cascades from the root down instead of silencing each downstream finding individually.

## Key Properties

- Two phases: a build phase constructs the graph by resolving every import outward from the entry files; a query phase classifies files, exports and dependencies as unused by walking that already-built graph, with no re-parsing.
- Accuracy is bounded by entry-point completeness rather than analysis sophistication — an unlisted entry silently shrinks the graph instead of producing a visible error.
- Findings cascade downward from a missing root: one unreached entry can present as dozens of unused-file, unused-export and unused-dependency results that all collapse together once the root is restored.
- Differs from local dead-code heuristics such as flagging an unused variable within one file, since proving non-reachability requires the whole-program graph rather than any single file's contents.

## Relationships

- [[code-knowledge-graph]] — both represent a codebase as a graph of code relationships, but code-knowledge-graph answers arbitrary structural retrieval queries while this technique answers only one question — is this node reachable from a declared root — to prove code safe to delete.
- [[graph-vs-vector-code-retrieval]] — shares the premise that graph structure over code beats flat text matching, but applies it to proving non-reachability for deletion rather than to retrieving relevant context for an LLM.
- [[attacker-first-forward-analysis]] — both trace forward from a declared set of roots through a code graph rather than reasoning backward from a target, but attacker-first analysis follows attacker-controlled entries to find reachable danger while this technique follows program entries to find the unreachable, and therefore deletable, remainder.

## Applications

Powers zero-config unused-code and unused-dependency linters for JavaScript and TypeScript monorepos, such as Knip, that gate CI on newly introduced dead files and exports; the same forward-reachability-from-roots idea underlies tree-shaking in JS bundlers stripping code unreachable from the bundle's entry point, mark-and-sweep garbage collectors tracing live objects from GC roots, and equivalent dead-code checkers in other language ecosystems, in every case because proving something unreachable requires seeing the whole program rather than any single file in isolation.

## Sources

- https://knip.dev/explanations/how-knip-works

## See Also

- [[code-knowledge-graph]]
- [[graph-vs-vector-code-retrieval]]
- [[attacker-first-forward-analysis]]
