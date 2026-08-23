---
tags: [flashcards, open-knowledge-format, ai-agents, knowledge-management, standards]
sr-due: 2026-06-18
sr-interval: 1
sr-ease: 250
---

# Open Knowledge Format (OKF) — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:d02fa3 -->
What is the Open Knowledge Format (OKF)?
?
A vendor-neutral open specification (Google Cloud, v0.1, June 2026) that formalises the LLM-wiki pattern into a portable, interoperable format. A bundle is a directory of Markdown files with YAML frontmatter — no SDK, runtime, or registry required.

## Required Field <!-- kb:card:e2a923 -->
What is the only required field in an OKF concept file?
?
`type` — what kind of thing the concept represents (e.g. `BigQuery Table`, `Metric`, `Runbook`). All other fields (title, description, resource, tags, timestamp) are optional.

## Structure <!-- kb:card:2ba3e9 -->
How does an OKF bundle form a knowledge graph?
?
Each concept is one Markdown file; the file path is its identity. Standard Markdown cross-links between files serve as graph edges — no separate graph database needed. The result is a graph richer than filesystem hierarchy.

## vs RAG <!-- kb:card:cdb959 -->
How does OKF differ from a RAG pipeline?
?
RAG re-derives knowledge at query time by retrieving raw chunks and asking the LLM to contextualise them. OKF stores curated, version-controlled concepts that agents read and update directly. They are complementary: OKF bundles can feed RAG pipelines or be used standalone.

## Design Principles <!-- kb:card:771b4b -->
What are the three design principles behind OKF?
?
1. **Minimally opinionated** — only `type` is required; spec defines interoperability surface, not content model
2. **Producer/consumer independence** — format is the contract; tooling at each end is swappable
3. **Format, not platform** — no cloud, vendor, SDK, or account required to read or write OKF

## Application <!-- kb:card:309f55 -->
A data team wants agents to query their table schemas without authenticating to a catalog API. How does OKF help?
?
They export their BigQuery table definitions as an OKF bundle (Markdown files with `type: BigQuery Table` frontmatter), commit it to version control alongside their SQL, and agents read the files directly — no catalog API, no vendor SDK, no credential management needed.
