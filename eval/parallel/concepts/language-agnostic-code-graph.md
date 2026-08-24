---
title: Language-agnostic code graph
aliases:
  - Universal AST
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: vendor-doc
tags: [concept, code-intelligence, static-analysis, graphs, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://rustic-ai.github.io/codeprism/blog/graph-based-code-analysis-engine/
    class: external-primary
---

# Language-agnostic code graph

## Definition

A **language-agnostic code graph** normalizes every language's parse tree into one shared vocabulary — node kinds such as module, class, function, import, call, reference, assignment and data flow, and typed edges such as calls, imports, inherits, references, data-flow and controls — so that an entire codebase is held as a single graph rather than as a pile of per-file, per-language syntax trees. Because the representation is common across languages and spans files, relationships that a file-scoped abstract syntax tree cannot express at all, including a call that crosses a language boundary, become ordinary traversals.

## Explanation

The translation is done by per-language adapters behind one interface: each adapter parses its own language and emits universal nodes plus the edges between them, so supporting a new language means implementing that interface rather than changing the analysis engine. The graph itself is relationship-first — nodes store what exists, edges store how things connect, and side indexes on symbols, types and dependencies make traversal cheap — which converts questions that file-level analysis answers only by re-parsing everything into index lookups: every caller of a function directly or transitively, the data flow from user input to a database query, every subclass of a base class regardless of the language it is written in. The second half of the design is keeping the graph current, since rebuilding it on every edit costs time proportional to the whole repository. The engine maintains a bidirectional file-dependency graph and, when a file changes, runs a breadth-first walk over its dependents to compute the affected set, reparses only those files, replaces their nodes atomically, and rebuilds only the indexes those files touched — so update cost scales with what actually changed rather than with repository size. The pattern buys that power with a fidelity cost: dynamic features resist normalization, so a dynamic import, a metaclass, or a prototype assignment is resolved heuristically and carries a confidence rather than a fact. The source is a project's own architecture blog post for CodePrism, and the striking figures in it — over a thousand files per second indexed, sub-millisecond symbol lookup, a claimed 47-fold end-to-end speedup — are self-reported benchmarks on the project's own repositories. What transfers is the design: a universal node vocabulary, an adapter interface, dependency-driven incremental updates, and a layered query cache.

## Key Properties

- One node and edge vocabulary across all languages, produced by per-language adapters behind a common parse-and-extract interface
- Relationship-first storage: nodes hold entities, typed edges hold relations, and symbol, type and dependency indexes make traversal cheap
- Incremental updates via a bidirectional file-dependency graph and a breadth-first walk over dependents, reparsing only the affected set
- Cross-language relationships become expressible, which per-file abstract syntax trees cannot represent at all
- Dynamic imports, metaclasses and prototype assignment are resolved heuristically and carry confidence rather than certainty

## Relationships

- [[code-knowledge-graph]] — describes the same representation from the storage and query side, typed nodes and edges in a graph database, while this concept supplies the language-normalization step that lets one schema hold several languages at once
- [[graph-vs-vector-code-retrieval]] — is the argument for why building this representation is worth the effort, since multi-hop structural questions are precisely where similarity search over embedded chunks breaks down
- [[typed-knowledge-graph-layer]] — makes the same node-and-typed-edge move over prose rather than source code, with ingest-time entity extraction playing the role that language adapters play here

## Applications

Powering code intelligence that answers structural questions — the blast radius of a change, every caller of a function across languages, the data flow from an input to a sink — and keeping such an index live inside an editor or an agent tool where a full reindex per edit would be unaffordable.

## Sources

- https://rustic-ai.github.io/codeprism/blog/graph-based-code-analysis-engine/

## See Also

- [[code-knowledge-graph]]
- [[graph-vs-vector-code-retrieval]]
- [[typed-knowledge-graph-layer]]
