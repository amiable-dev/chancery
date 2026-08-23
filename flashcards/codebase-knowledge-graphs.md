---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- codebase-knowledge-graph
- code-analysis
- graph
- ai-agents
---


# Codebase Knowledge Graph — Flashcards

#flashcards/codebase-knowledge-graph


## Definition <!-- kb:card:f08fe2 -->
What is a codebase knowledge graph?
?
A persistent, queryable graph of a software repository's structural entities (functions, classes, modules, files) and typed relationships (calls, imports, inherits, tests). Built from static AST analysis, stored locally (e.g., SQLite), and queried at AI inference time to provide token-efficient context instead of raw file content.

## Architecture <!-- kb:card:e416b3 -->
What is the pipeline from source code to AI-queryable codebase knowledge graph?
?
Source files → AST parsing (Tree-sitter) → extract nodes (functions, classes, imports) and edges (calls, inherits, imports, tests) → store in SQLite → expose via MCP tool layer → AI assistant queries graph tools instead of reading files directly.

## Property <!-- kb:card:d8cfe3 -->
Why is local SQLite a sensible storage backend for a codebase knowledge graph?
?
It requires no external infrastructure, keeps all code data on-machine (important for private/proprietary codebases), is fast enough for graphs with millions of edges, and is file-based so it can be committed to the repo or gitignored. No graph DB setup needed at small-to-medium scale.

## Application <!-- kb:card:61cea3 -->
How does a codebase knowledge graph differ from just reading files when used for AI code review?
?
Instead of reading entire source files (expensive), the AI queries the graph for the blast radius of changed files and receives compact structural summaries — function signatures, call chains, dependency edges, test coverage gaps. The benchmark result is 8.2× fewer tokens on average, preserving full recall.

## Relationship <!-- kb:card:334e2f -->
How does a codebase knowledge graph relate to a typed knowledge graph?
?
A codebase knowledge graph is a domain-specific instance of a typed knowledge graph. The entity types are code constructs (Function, Class, Module, File), and the edge types are code relationships (CALLS, IMPORTS, INHERITS, TESTS). The same graph traversal and query patterns apply — the domain is just software structure rather than general knowledge.
