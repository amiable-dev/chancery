---
tags: [flashcards, knowledge-management, ai-agents, memory, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# LLM wiki architecture — Flashcards

#flashcards/knowledge-management

## Three owned layers <!-- kb:card:9f22eb -->
What three layers make up the LLM wiki architecture?
?
Immutable raw sources the model reads but never edits; a wiki of model-generated interlinked markdown pages the model owns entirely; and a schema document (CLAUDE.md/AGENTS.md-style) encoding structure, conventions and workflows.

## Lint operation <!-- kb:card:4becf9 -->
What does the periodic "lint" operation check for in the LLM wiki architecture?
?
Contradictions, superseded claims, orphan pages, concepts lacking pages, and missing cross-references.

## Ingest integrates, not indexes <!-- kb:card:c4ef91 -->
What does "ingest" do beyond simply indexing a new source for later retrieval?
?
It integrates the source into the wiki: writing a summary page, updating the index, and revising the entity and concept pages the source touches — often 10-15 pages per source.

## Query and filing back <!-- kb:card:29ea61 -->
How does the query operation work, and what happens to a good answer afterward?
?
It reads the index first, drills into relevant pages, and synthesizes a cited answer; answers worth keeping are filed back into the wiki as pages, so exploration compounds like ingestion does.

## Navigation: index.md vs log.md <!-- kb:card:915344 -->
What are index.md and log.md for in the LLM wiki architecture?
?
index.md is a categorized catalog updated on every ingest and read first at query time — enough for roughly a hundred sources without embedding-based retrieval. log.md is an append-only, grep-parseable timeline of ingests, queries and lint passes.

## Economic rationale <!-- kb:card:edd7e5 -->
Why does this architecture claim to avoid the usual reason human-maintained wikis get abandoned?
?
Humans abandon wikis because bookkeeping grows faster than value; moving the summarizing, filing and consistency work to the model prices maintenance near zero, leaving humans to source, direct and question.
