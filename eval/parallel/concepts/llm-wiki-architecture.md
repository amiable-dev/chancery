---
title: LLM wiki architecture
date: 2026-08-24
tags:
  - concept
  - knowledge-management
  - ai-agents
  - memory
status: draft
sources:
  - url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
---

# LLM wiki architecture

## Definition

The **LLM wiki architecture** is the three-layer design specified in Andrej Karpathy's llm-wiki idea file for a knowledge base an LLM maintains: an immutable collection of raw sources the model reads but never edits, a wiki of model-generated, interlinked markdown pages the model owns entirely, and a schema document (a CLAUDE.md/AGENTS.md-style instruction file) encoding the wiki's structure, conventions and workflows — operated through three recurring operations, ingest, query and lint, and navigated by a content index and an append-only log.

## Explanation

Ownership boundaries do the work. Raw sources are the human-curated ground truth, so the model never modifies them; the wiki layer is written only by the model, so integration and cross-referencing stay consistent; and the schema file is what turns a general agent into a disciplined maintainer — human and model co-evolve it as they learn what the domain needs. Ingest is integration, not indexing: the model reads a new source, writes a summary page, updates the index, and revises the entity and concept pages the source touches — a single source may change 10-15 pages. Query reads the index first, drills into relevant pages, and synthesizes an answer with citations; answers worth keeping are filed back into the wiki as pages, so explorations compound exactly as sources do. Lint is the periodic health check for contradictions, superseded claims, orphan pages, concepts lacking pages and missing cross-references. Two files carry navigation: index.md, a categorized catalog updated on every ingest and read first at query time — sufficient to roughly a hundred sources and a few hundred pages without embedding-based retrieval infrastructure — and log.md, an append-only, grep-parseable timeline of ingests, queries and lint passes. The rationale is economic: humans abandon wikis because bookkeeping grows faster than value, and moving the summarizing, filing and consistency work to the model prices maintenance near zero, leaving humans sourcing, directing and questioning. The source is a deliberately abstract primary idea file by a practitioner — a pattern meant to be instantiated with one's own agent, offered without measurements.

## Key Properties

- Strict layer ownership: humans curate immutable raw sources, the model writes every wiki page, a co-evolved schema file governs conventions and workflows
- Ingest integrates a source into existing pages — often 10-15 per source — rather than merely indexing it for later retrieval
- Good query answers are filed back into the wiki as pages, so exploration compounds like ingestion
- Lint periodically hunts contradictions, stale claims, orphan pages and missing cross-references
- index.md (categorized catalog, read first at query time) and log.md (append-only, grep-parseable timeline) suffice to about a hundred sources without embedding-based search

## Relationships

- [[llm-maintained-wiki]] — gives the pattern that concept states its concrete reference shape — the three owned layers, the ingest/query/lint loop and the index/log conventions — drawn from the primary idea file that concept's secondary coverage defers to
- [[retrieval-augmented-generation]] — defined in opposition to it: instead of retrieving raw-document chunks at query time, knowledge is compiled into maintained pages at ingest time, and an index-first read replaces the vector index at moderate scale

## Applications

Bootstrapping a personal research wiki, a book-companion wiki, or a team knowledge base fed by transcripts and project documents; the schema file keeps an agent's maintenance behavior consistent across sessions and transfers to others working similar domains.

## Sources

- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

## See Also

- [[llm-maintained-wiki]]
- [[retrieval-augmented-generation]]
