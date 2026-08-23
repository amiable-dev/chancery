---
tags: [flashcards, knowledge-management, pkm, llm, wiki, architecture]
sr-due: 2026-07-08
sr-interval: 1
sr-ease: 250
---

# Wiki Navigation Scaffold — Flashcards

#flashcards/knowledge-management

## Definition <!-- kb:card:fd4403 -->
What is the wiki navigation scaffold?
?
A two-file structural convention for agent-maintained wikis: **index.md** (content-oriented catalog of every page with one-line summaries, organised by category) and **log.md** (append-only chronological record of every ingest, query, and lint pass). Together they allow an LLM to navigate a growing wiki without requiring embedding-based vector search infrastructure.

## Two files <!-- kb:card:9ab79f -->
What are the two complementary orientations provided by index.md and log.md?
?
**index.md** = spatial orientation — *what exists* and *where things are*, organised categorically. The LLM reads it at query time to identify the most relevant pages.
**log.md** = temporal orientation — *what happened and when*, in chronological order. The LLM reads recent entries to avoid repeating work and to understand the state of the wiki.

## Log format <!-- kb:card:bbfd16 -->
How should log.md entries be formatted for parseability?
?
Use a consistent prefix per entry, e.g.: `## [2026-07-08] ingest | Source Title`
This makes the log queryable with simple Unix tools:
- `grep "^## \[" log.md | tail -5` → last 5 entries
- `grep "^## \[.*\] query" log.md` → all query entries

## Scale threshold <!-- kb:card:ac41a8 -->
At what scale does the navigation scaffold become insufficient, and what replaces it?
?
Works without external tooling up to ~hundreds of pages / ~100 sources. Above that, full-text hybrid search (e.g., **qmd** — BM25/vector with LLM re-ranking, available as CLI and MCP server) becomes necessary. The index never becomes obsolete even at large scale — it provides categorical overview that keyword search alone can't replicate.

## Application <!-- kb:card:bb19c6 -->
What's missing in our vault that the navigation scaffold would provide?
?
The vault has a `_index.md` with page titles and tags, but no one-line summaries or source metadata. There's no `log.md` to track when each synthesis ran. Adding both would give the pipeline temporal context across sessions and allow the LLM to orient itself without re-scanning the entire concepts directory.
