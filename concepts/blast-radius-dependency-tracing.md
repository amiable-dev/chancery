---
title: "Blast-Radius Dependency Tracing"
date: 2026-04-14
domain: software-engineering
maturity: established
source_type: practitioner
topics: [static-analysis]
tags: [concept, code-analysis, dependency-management, impact-analysis, ai-agents, domain/software-engineering, maturity/established, source-type/practitioner, topic/static-analysis]
status: draft

sources:
  - url: https://github.com/tirth8205/code-review-graph
    hash: sha256:d7e74fb196de158125034ca9490d0bf31b49b890ea3251b3ab0e209b0d34ba0d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.falkordb.com/blog/code-graph/
    hash: sha256:030278b97b8f98026960c39895d831f42c5f379ed85f9e5d86f8659a41e39c1a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Blast-Radius Dependency Tracing

## Definition
A static impact analysis technique that, given a set of changed files or functions, traverses a codebase's dependency graph to compute the full *blast radius*: every caller, dependent module, and associated test that could be affected by the change. The term borrows from disaster modelling — the radius of potential damage from a single change point.

## Explanation
When a function changes, the naive question is: "what directly calls it?" But in real codebases, the impact propagates transitively — callers of callers, modules that re-export the changed symbol, integration tests that exercise the affected path. Blast-radius tracing answers the full question.

**The algorithm (simplified):**
1. Start with the set of changed entities (modified functions, classes, files).
2. Look up direct dependents via the call graph and import graph (both extracted from AST analysis).
3. Add those dependents to the impact set, then recursively look up *their* dependents.
4. Continue until no new dependents are found (BFS/DFS over the dependency graph).
5. Collect all test files that reference any entity in the impact set.
6. Return the minimal file set an AI reviewer (or CI system) needs to read.

**code-review-graph benchmark results:**
- 100% recall across 13 commits on 6 real OSS repos — never missed an actually-impacted file
- Average F1 score of 0.54 — over-predicts rather than under-predicts (conservative bias)
- Average token reduction of 8.2× compared to reading all files naively (up to 49× on monorepos)

**The precision/recall trade-off:**  
Blast-radius analysis is deliberately conservative. A false negative (missing an affected file) could cause a reviewer to miss a breaking change. A false positive (including an unaffected file) just wastes a few tokens. The correct bias is toward over-inclusion.

**When it doesn't pay off:**  
For single-file changes in small packages, the structural metadata added by graph context can exceed the raw file size. The benefit is strongest on multi-file changes in large codebases (monorepos, layered architectures).

## Key Properties
- Transitive: follows dependency chains multiple hops, not just direct callers
- Conservative: biased toward over-inclusion (false positives OK, false negatives not)
- Fast: graph traversal at query time is milliseconds after the graph is built
- Requires a pre-built dependency graph (from AST analysis or other static analysis)
- Language-independent when the underlying graph is language-agnostic

## Relationships
- Requires [[ast-based-code-analysis]]: the call graph and import graph that are traversed come from AST extraction
- Populates [[codebase-knowledge-graphs]]: blast-radius is a query over the graph, not a separate data store
- Related to [[typed-knowledge-graph]]: in a typed code graph, blast-radius is a typed edge traversal (follow `calls`, `imports`, `tests` edges from a changed node)
- Related to [[agentic-sdlc]]: blast-radius tracing is a key primitive for AI-driven code review and CI automation

## Applications
- **AI code review context:** Give reviewing LLMs only the files in the blast radius instead of the whole repo — 8–49× token reduction
- **CI test selection:** Run only tests in the blast radius of a PR's changes instead of the full suite
- **Change risk scoring:** Large blast radius = higher-risk change; surface this to reviewers before merge
- **Dependency auditing:** "What would break if we delete or rename this function?" — run blast radius without making the change
- **Incremental graph updates:** Re-parse only files in the blast radius of changed files during graph maintenance
- **Conductor development:** Could scope council review context to the precise blast radius of each PR, cutting token costs when running 4 high-tier models in parallel

## Sources
- [code-review-graph (GitHub)](https://github.com/tirth8205/code-review-graph) — production implementation with benchmark data across 6 OSS repos
- [FalkorDB: CodeGraph](https://www.falkordb.com/blog/code-graph/) — similar approach with queryable graph backend

## See Also
- [[ast-based-code-analysis]]
- [[codebase-knowledge-graphs]]
- [[mcp-tool-patterns]]
- [[agentic-sdlc]]
- [[module-graph-analysis]]
- [[dead-code-detection]]
- [[direct-vs-transitive-vulnerability]]: the same graph traversal technique applies to tracing which vulnerable transitive dependency pulled in a CVE
