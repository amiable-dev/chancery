---
tags: [flashcards, static-analysis, architecture, dependency-management]
sr-due: 2026-05-02
sr-interval: 1
sr-ease: 250
---

# Module Graph Analysis — Flashcards

#flashcards/static-analysis

## Definition <!-- kb:card:dd0262 -->
What is module graph analysis?
?
Static analysis that constructs a directed graph of an entire codebase's import/export structure (files as nodes, imports as edges), then queries it to detect cross-file problems that cannot be found by examining any single file.

## Why Needed <!-- kb:card:10b9ad -->
Why can't a linter tell you if an export is unused?
?
A linter sees one file at a time. Whether an export is used depends on whether *other* files import it — a question only answerable by building the complete import graph across all files.

## Construction <!-- kb:card:870d91 -->
What are the steps to build a module graph?
?
1. Resolve all entry points (package.json, framework conventions)
2. Parse each file; extract imports/exports via AST
3. Resolve import paths to actual files
4. Build directed graph nodes (files) and edges (imports)
5. Run graph algorithms: reachability, cycle detection, subgraph queries

## Use Case <!-- kb:card:81d933 -->
How does the module graph enable dead file detection?
?
Compute reachability from all known entry points. Any file not reachable from any entry point has no live path to it — it's an orphan/dead file.

## Relationship <!-- kb:card:e1b159 -->
How does module graph analysis relate to blast-radius dependency tracing?
?
They're complementary traversals of the same graph. Dead code uses forward reachability from entry points. Blast radius uses reverse traversal from a changed file to find all dependents.
