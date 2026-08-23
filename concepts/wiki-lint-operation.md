---
title: "Wiki Lint Operation"
date: 2026-07-08
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm, provenance, workflow]
tags: [concept, knowledge-management, pkm, llm, wiki, linting, maintenance, health-check, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm, topic/provenance, topic/workflow]
status: draft
sources:
  - url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    hash: sha256:38e4f6b3bc571142fda8122633d849887afb108c2ab5b84251a024bab995c2dc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://levelup.gitconnected.com/beyond-rag-how-andrej-karpathys-llm-wiki-pattern-builds-knowledge-that-actually-compounds-31a08528665e
    hash: sha256:d4b23f01e62bb5cb822a6330b1ee2c62649027945aedbe0ee1cb05fc52175f64
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Wiki Lint Operation

## Definition
The wiki lint operation is a periodic LLM-driven health-check of an agent-maintained knowledge base that scans for structural and semantic defects: orphan pages, broken cross-references, contradictions between pages, stale claims superseded by newer sources, concept mentions lacking their own page, and missing source provenance. It is one of the three core operations in the [[llm-wiki-pattern|LLM Wiki pattern]] (alongside Ingest and Query), and its purpose is to maintain the structural integrity that makes [[knowledge-compounding]] possible.

## Explanation
As a wiki grows — through ingest and query operations — defects accumulate silently:

- A concept mentioned on 10 pages may never have gotten its own page
- Two sources ingested months apart may contain contradictory claims that were never reconciled
- A page written early may reference an entity that was later renamed or merged
- A summary may have been accurate when written but is now stale after three newer sources revised the picture
- A page may have no inbound links, making it invisible to the LLM during normal navigation

In a human-maintained wiki, these defects compound until someone decides to do a "wiki gardening" pass — which rarely happens. In an LLM-maintained wiki, the lint operation can run periodically and systematically, because the LLM can cross-reference the entire wiki structure in one pass.

### What Lint Checks
Karpathy identifies six canonical lint checks:

| Check | What it finds |
|-------|--------------|
| **Contradictions** | Two or more pages making mutually exclusive claims about the same fact |
| **Stale claims** | Assertions that newer sources have superseded but the relevant page hasn't been updated |
| **Orphan pages** | Pages with no inbound links — invisible during normal LLM navigation |
| **Concept gaps** | Concepts frequently mentioned but lacking their own dedicated page |
| **Missing cross-references** | A and B are related but don't link to each other |
| **Missing source provenance** | Pages that make claims without citing a source |

Extended implementations add:
- **Broken links:** Wikilinks pointing to slugs that don't exist as files
- **Schema violations:** Pages missing required frontmatter fields
- **Stale embeddings:** Pages not yet indexed in the vector search layer (if used)

### Lint as Synthesis, Not Just Cleanup
Lint is not purely mechanical. When the LLM identifies a contradiction, it must reason about which claim is more likely to be correct, flag both sources, and suggest how the page should be updated. When it identifies a concept gap, it can draft a stub page for human review. When it discovers an orphan page, it can suggest which pages should link to it.

This means lint runs produce actionable outputs — not just defect lists but proposed edits, new stubs, and suggested investigations. The LLM can also surface *new questions to explore* and *new sources to seek*, turning maintenance into a form of guided research.

### Relation to Code Linting
The name is deliberate: just as a code linter enforces structural and style rules on source code, a wiki linter enforces structural and consistency rules on the wiki corpus. The analogy holds at the automation level too — both are best run periodically in the background rather than only on-demand. See [[intent-gap-linting]] for the code-linting parallel.

## Key Properties
- **Periodic, not continuous:** Run on a schedule (e.g. after every N ingests, or weekly)
- **Structurally comprehensive:** Checks the entire wiki graph, not just recently modified pages
- **Semantically aware:** Contradiction and staleness detection requires LLM reasoning, not just regex
- **Outputs actionable edits:** Lint produces proposed fixes, stubs, and research directions — not just defect IDs
- **Maintenance enabler:** Without lint, compounding quality degrades over time as orphans, contradictions, and gaps accumulate
- **Discovery mechanism:** Lint often surfaces forgotten pages and unexpected connections

## Relationships
- Part of [[llm-wiki-pattern]]: the third operation (after Ingest and Query) in the canonical pattern
- Maintains [[knowledge-compounding]]: without lint, the structural integrity that enables compounding erodes
- Uses [[wiki-navigation-scaffold]]: lint reads the index to find all pages and the log to see what's been recently touched
- Analogous to [[intent-gap-linting]] in code: both enforce structural integrity on a corpus maintained by LLMs
- Complements [[agent-knowledge-schema]]: the schema file defines what "correct" structure looks like; lint enforces it
- Surfaces gaps for [[knowledge-compounding]]: concept gaps found during lint become candidates for new source investigation

## Applications
- **This vault:** Our pipeline currently lacks a lint operation. Adding one would find: concept stubs without source citations, broken `Wikilinks`, concepts mentioned in notes but lacking their own concept page, and contradictions between staging notes that cover the same topic from different angles
- **Research wikis:** After 6 months of ingesting papers, a lint run surfaces all the contradictions in the literature you've been silently accumulating
- **Team knowledge bases:** Orphan pages represent forgotten work; the lint operation surfaces them for re-integration or archival
- **Automated wiki health scoring:** Lint output can be quantified (orphan count, contradiction count, gap count) to produce a "wiki health score" that trends over time

## Sources
- [Andrej Karpathy — LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — defines the three operations and lint specifically
- [Beyond RAG: Karpathy's LLM Wiki Pattern](https://levelup.gitconnected.com/beyond-rag-how-andrej-karpathys-llm-wiki-pattern-builds-knowledge-that-actually-compounds-31a08528665e) — extended description of lint checks including stale embeddings and broken cross-references

## See Also
- [[llm-wiki-pattern]]
- [[knowledge-compounding]]
- [[wiki-navigation-scaffold]]
- [[intent-gap-linting]]
- [[agent-knowledge-schema]]
- [[curated-over-mined-precedence]]: reframes broken-link stripping from a veto (delete outright) to an influence-weighted pending assertion, which may resolve once the target note lands
