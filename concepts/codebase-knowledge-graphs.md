---
title: "Codebase Knowledge Graph"
aliases: ["Codebase Knowledge Graph"]
date: 2026-04-14
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [static-analysis, context-engineering]
tags: [concept, code-analysis, knowledge-management, graph, ai-agents, architecture, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/static-analysis, topic/context-engineering]
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
  - url: https://rustic-ai.github.io/codeprism/blog/graph-based-code-analysis-engine/
    hash: sha256:fb3cf4c1bd3b300fba4466a61ab25448831226b68ca4474d9755d88d02801c75
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Codebase Knowledge Graph

## Definition
A persistent, queryable graph representation of a software repository's structural entities and their relationships, built from static analysis of source code. Nodes represent code constructs (functions, classes, modules, files); edges represent typed relationships (calls, imports, inherits, tests, depends-on). The graph is queried at AI inference time to provide precise, token-efficient context instead of raw file content.

## Explanation
Traditional AI coding tools scan entire files or directories for context. A codebase knowledge graph inverts this: it pre-processes the repo into a structural index, then answers queries like "what is affected by this change?" or "what does this module depend on?" in milliseconds.

**Architecture of a codebase knowledge graph:**

```
Source files
    │
    ▼ AST parsing (Tree-sitter)
Graph nodes: functions, classes, imports, files
Graph edges: calls, inherits, imports, tests, uses
    │
    ▼ Stored in SQLite (local) or graph DB
Queryable graph
    │
    ▼ MCP tool layer
AI assistant queries: review context, blast radius, architecture overview
```

**Node types (code-review-graph example):**
- `Function` — name, file, line range, parameters, return type
- `Class` — name, file, parent classes
- `Import` — source file → target module
- `File` — path, language, last-modified hash
- `Test` — test function → covered source function/file

**Edge types:**
- `CALLS` — function A calls function B
- `INHERITS` — class A inherits from class B
- `IMPORTS` — file A imports from module B
- `TESTS` — test function covers source function
- `DEPENDS_ON` — module-level dependency

**Storage:** code-review-graph uses SQLite (`.code-review-graph/` directory, local to the repo). No cloud dependency, no external graph DB required at small-to-medium scale. Optional vector embeddings (sentence-transformers or Gemini) extend the graph with semantic search capability.

**Incremental maintenance:** On every file save or git commit, a hook detects changed files via SHA-256 hash comparison, re-parses only those files with Tree-sitter, and updates the affected nodes/edges in the graph. A 2,900-file repo re-indexes in under 2 seconds.

**Community detection and architecture views:** The Leiden algorithm can cluster related code into modules that don't necessarily match the file system hierarchy — surfacing hidden coupling. The architecture overview tool generates a module-level coupling map with coupling warnings.

## Key Properties
- Persistent: survives across sessions; no re-parsing on every AI interaction
- Incremental: only changed files trigger re-indexing
- Local: no data leaves the machine; appropriate for private and proprietary codebases
- Queryable: supports structural queries (graph traversal) and semantic queries (vector search) over code
- Language-agnostic: one graph format accommodates 19+ languages via Tree-sitter parsers
- Self-contained: SQLite storage means no external graph DB infrastructure

## Relationships
- Built from [[ast-based-code-analysis]]: AST extraction produces the nodes and edges
- Enables [[blast-radius-dependency-tracing]]: impact analysis is a graph traversal query
- Exposed to AI assistants via [[mcp-tool-patterns]]: MCP tools wrap graph queries in AI-callable interfaces
- Specialisation of [[typed-knowledge-graph]]: same concept applied to code — entities are code constructs, edges have typed semantic relationships
- Related to [[agentic-sdlc]]: codebase knowledge graphs are infrastructure for AI-assisted development workflows

## Applications
- **AI code review:** Give reviewing models the minimal context needed for a PR (blast radius + structural summary). Demonstrated 8.2× average token reduction, up to 49× on monorepos.
- **Change risk scoring:** Large blast radius or high coupling → flag as higher-risk change
- **On-demand documentation:** Auto-generate architecture wikis and module-level overviews from the graph without manual effort
- **Intelligent test selection:** Run only tests in the blast radius of changed code, not the full suite
- **Codebase onboarding:** New developers query "what does this module depend on?" or "who calls this function?" without reading source
- **Conductor council reviews:** Query the graph to scope review context to the PR's blast radius before sending to 4 high-tier models — potential for meaningful cost reduction
- **Cross-repo search:** Semantic search across multiple repos via shared embedding space

## Sources
- [code-review-graph (GitHub)](https://github.com/tirth8205/code-review-graph) — reference open-source implementation; 8.2× token reduction benchmark
- [FalkorDB: CodeGraph](https://www.falkordb.com/blog/code-graph/) — alternative implementation using FalkorDB as graph backend
- [CodePrism](https://rustic-ai.github.io/codeprism/blog/graph-based-code-analysis-engine/) — architecture deep dive on graph-based code analysis

## See Also
- [[ast-based-code-analysis]]
- [[blast-radius-dependency-tracing]]
- [[mcp-tool-patterns]]
- [[typed-knowledge-graph]]
- [[agentic-sdlc]]
- [[fallow-codebase-intelligence]]
- [[module-graph-analysis]]
