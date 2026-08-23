---
title: "AST-Based Code Analysis"
date: 2026-04-14
domain: software-engineering
maturity: established
source_type: practitioner
topics: [static-analysis]
tags: [concept, code-analysis, ast, compilers, static-analysis, ai-agents, domain/software-engineering, maturity/established, source-type/practitioner, topic/static-analysis]
status: draft

sources:
  - url: https://github.com/tirth8205/code-review-graph
    hash: sha256:d7e74fb196de158125034ca9490d0bf31b49b890ea3251b3ab0e209b0d34ba0d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://tree-sitter.github.io/tree-sitter/
    hash: sha256:5535624e9b2b88bb858e4b20f63c03dc18417b51bcda891de8d3759c8db9bfc1
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

# AST-Based Code Analysis

## Definition
A static analysis technique that parses source code into an Abstract Syntax Tree (AST) — a structured, hierarchical representation of the code's syntactic structure — and then traverses or queries that tree to extract entities (functions, classes, imports), relationships (calls, inheritance, references), and structural properties without executing the code.

## Explanation
Every compiler's front-end starts with an AST. AST-based analysis repurposes that intermediate representation for tooling beyond compilation — linting, refactoring, code navigation, and increasingly, AI context generation.

**How it works:**
1. A parser (e.g., Tree-sitter) tokenises and parses source files into language-specific ASTs.
2. Tree traversal walks each node type (function definitions, class declarations, import statements, call expressions) to extract structured entities.
3. Extracted entities and their relationships (who calls whom, what inherits from what, which tests reference which functions) are stored in a queryable graph or index.

**Tree-sitter** is the dominant open-source library for this use case — it provides incremental, error-tolerant parsers for 100+ languages and is used by Neovim, GitHub, and code-review-graph. Its incremental re-parsing means only changed sub-trees need re-processing, enabling sub-second updates on large codebases.

**What can be extracted:**
- Function and method signatures (name, parameters, return type if typed)
- Class hierarchies and inheritance chains
- Import/dependency graphs (which file imports which module)
- Call sites (who calls a given function)
- Test relationships (which test file covers which source file)
- Entry points (HTTP routes, CLI handlers, main functions)

**Contrast with dynamic analysis:**  
Dynamic analysis runs the code and observes behaviour at runtime. AST analysis is purely structural — faster, no execution required, but can miss runtime-only relationships (e.g., dynamic dispatch, monkey-patching).

## Key Properties
- Language-agnostic when using multi-language parsers like Tree-sitter (19+ languages in code-review-graph)
- Produces deterministic, reproducible structural snapshots of a codebase
- Incremental updates are fast (re-parse only changed files, not the whole repo)
- Blind to runtime behaviour — cannot trace dynamic dispatch or reflect-generated relationships
- Results are queryable as graphs (nodes = entities, edges = relationships)

## Relationships
- Underpins [[codebase-knowledge-graphs]]: AST extraction populates the graph's nodes and edges
- Enables [[blast-radius-dependency-tracing]]: call graphs and dependency edges come from AST analysis
- Related to [[typed-knowledge-graph]]: a codebase knowledge graph is a domain-specific typed knowledge graph where entities are code constructs
- Powers static analysis tools (linters, IDEs, code search) — the same principle applied to different downstream uses

## Applications
- **AI context reduction:** Extract structural summaries instead of feeding raw file content to LLMs — dramatically reduces token usage while preserving semantic relevance
- **Impact analysis:** Determine which functions/files are affected by a change (requires call graph from AST)
- **Automated code review:** Surface coupling warnings, dead code, and missing test coverage from structural analysis
- **Refactoring safety:** Identify all callers before renaming a function
- **Architecture mapping:** Auto-generate module dependency diagrams from import graphs
- **Search:** Enable structural queries like "find all functions that call `save()` without calling `validate()` first"

## Study
- Flashcards: [[flashcards/ast-based-code-analysis|Practice this concept]]

## Sources
- [code-review-graph (GitHub)](https://github.com/tirth8205/code-review-graph) — production implementation using Tree-sitter across 19 languages
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) — the incremental parsing library powering most modern AST-based tooling
- [FalkorDB: CodeGraph](https://www.falkordb.com/blog/code-graph/) — walkthrough of AST → graph pipeline
- [CodePrism: Graph-Based Code Analysis Engine](https://rustic-ai.github.io/codeprism/blog/graph-based-code-analysis-engine/) — architecture deep dive

## See Also
- [[codebase-knowledge-graphs]]
- [[blast-radius-dependency-tracing]]
- [[mcp-tool-patterns]]
- [[module-graph-analysis]]
- [[code-clone-detection]]
- [[fallow-codebase-intelligence]]
- [[intent-gap-linting]]
