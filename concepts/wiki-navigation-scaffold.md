---
title: "Wiki Navigation Scaffold (index.md + log.md)"
aliases: ["Wiki Navigation Scaffold (index.md + log.md)"]
date: 2026-07-08
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm]
tags: [concept, knowledge-management, pkm, llm, wiki, architecture, navigation, index, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm]
status: draft
sources:
  - url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    hash: sha256:38e4f6b3bc571142fda8122633d849887afb108c2ab5b84251a024bab995c2dc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.aibuilderclub.com/blog/karpathy-llm-wiki
    hash: sha256:4018178174683320ffd5f3942cf55802c9872e851c2a539deb5c7971ae817668
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://datasciencedojo.com/blog/llm-wiki-tutorial/
    hash: sha256:15f81041e9b663581be27027adc0b7a7e3c1b82248c37c6346357837512d0801
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Wiki Navigation Scaffold (index.md + log.md)

## Definition
The wiki navigation scaffold is a two-file structural convention for agent-maintained knowledge bases consisting of: (1) `index.md` — a content-oriented catalog of every page with one-line summaries, organised by category; and (2) `log.md` — an append-only chronological record of every ingest, query, and lint pass. Together, these files allow an LLM agent to orient itself and navigate a growing wiki without requiring embedding-based vector search infrastructure.

## Explanation
As a wiki grows past a handful of pages, the LLM faces a navigation problem: it can't read every page on every query. It needs a way to identify which pages are relevant without loading them all. Two complementary strategies solve this:

### index.md — The Content Map
`index.md` is the wiki's table of contents, maintained by the LLM. Each entry contains:
- A wikilink to the page
- A one-line summary of what the page covers
- Optional metadata (date added, source count, category tags)

Organised by category (entities, concepts, sources, comparisons, syntheses), it gives the LLM a rapid survey of the entire wiki. When answering a query, the agent reads the index first to identify the 3-5 most relevant pages, then drills into those. Karpathy notes this scales surprisingly well to *hundreds of pages and ~100 sources* without requiring any external tooling.

The LLM updates `index.md` on every ingest operation, keeping it current automatically.

### log.md — The Timeline
`log.md` is an append-only chronicle. Each entry records what happened and when: a source ingested, a question answered, a lint pass completed. A consistent entry prefix (e.g., `## [2026-07-08] ingest | "Paper Title"`) makes it parseable with simple Unix tools:

```bash
# Last 5 entries
grep "^## \[" log.md | tail -5

# All queries
grep "^## \[.*\] query" log.md
```

The log gives the LLM temporal orientation — what has been ingested recently, when the last lint ran, what questions have already been answered. It prevents the LLM from re-deriving work that already exists in the wiki.

### Why Two Files?
The two files serve orthogonal purposes and should be kept separate:

| | index.md | log.md |
|---|----------|--------|
| **Orientation** | What exists (content map) | What happened (timeline) |
| **Access pattern** | Read at query time | Append at operation time |
| **Organisation** | Categorical | Chronological |
| **Size management** | Updated in place | Append-only (grows indefinitely) |
| **LLM read frequency** | Every query session | Recent entries only |

### Scale and the Transition to Search
At small scale (< 50 pages), the index alone is sufficient. At moderate scale (100–500 pages), the index remains the primary navigation tool but benefits from the LLM's ability to skim it rapidly. At larger scale, full-text search becomes necessary.

Karpathy recommends **qmd** for this transition: a local search engine for Markdown files using hybrid BM25/vector search and LLM re-ranking, available as both a CLI tool (for the LLM to shell out to) and an MCP server (for native tool use). The index never becomes obsolete even at large scale — it provides a fast categorical overview that search alone can't replicate.

## Key Properties
- **Zero external dependencies:** Two plain Markdown files; no database, no vector store, no infrastructure
- **LLM-maintained:** The index and log are updated by the LLM as part of ingest/query/lint operations — humans don't maintain them
- **Parseable:** Consistent prefix conventions make both files queryable with grep, awk, or any text tool
- **Complementary:** Index = spatial (where things are); Log = temporal (when things happened)
- **Scalable threshold:** Works without additional tooling up to ~hundreds of pages; qmd or similar plugs in above that
- **Progressive:** Start with just index.md; add log.md when temporal orientation becomes valuable

## Relationships
- Part of [[llm-wiki-pattern]]: Karpathy specifies these as the two special files in the pattern
- Enables [[knowledge-compounding]]: the LLM needs fast orientation to integrate each new source against the full wiki context
- Required by [[wiki-lint-operation]]: lint reads the index to discover all pages and the log to identify recently touched areas
- Complemented by [[agent-knowledge-schema]]: the schema file (AGENTS.md / CLAUDE.md) defines *how* to maintain the index and log; the scaffold defines *what* they contain
- Analogous to [[codebase-knowledge-graphs]] but lighter-weight: knowledge graphs encode typed semantic relationships; the navigation scaffold is a flat, human-readable approximation that suffices at moderate scale

## Applications
- **This vault:** Our vault has neither an `index.md` nor a `log.md` in the canonical sense. The `_index.md` file serves a partial role but doesn't include one-line summaries or timestamps. Adding a `log.md` to track synthesis pipeline runs would give temporal orientation across sessions
- **New wiki bootstrapping:** Start any new LLM-maintained wiki with these two files; the agent will populate them as work proceeds
- **Multi-agent wikis:** When multiple agents contribute to the same wiki, the log becomes the coordination mechanism — each agent appends its work, preventing duplication
- **Audit trail:** The log provides a durable record of what the LLM changed and when, satisfying basic auditability requirements without additional tooling

## Sources
- [Andrej Karpathy — LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — defines the index.md and log.md pattern with practical advice on prefix conventions
- [AI Builder Club — Karpathy's LLM Wiki](https://www.aibuilderclub.com/blog/karpathy-llm-wiki) — practical walkthrough including the grep-parseable log format
- [Data Science Dojo — LLM Wiki Tutorial](https://datasciencedojo.com/blog/llm-wiki-tutorial/) — tutorial implementation of the two-file scaffold

## See Also
- [[llm-wiki-pattern]]
- [[knowledge-compounding]]
- [[wiki-lint-operation]]
- [[agent-knowledge-schema]]
- [[codebase-knowledge-graphs]]
