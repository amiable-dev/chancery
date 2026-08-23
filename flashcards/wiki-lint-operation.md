---
tags: [flashcards, knowledge-management, pkm, llm, wiki, linting]
sr-due: 2026-07-08
sr-interval: 1
sr-ease: 250
---

# Wiki Lint Operation — Flashcards

#flashcards/knowledge-management

## Definition <!-- kb:card:b2b260 -->
What is the wiki lint operation?
?
A periodic LLM-driven health-check of an agent-maintained knowledge base that scans for: orphan pages, broken cross-references, contradictions between pages, stale claims superseded by newer sources, concepts mentioned but lacking their own page, and missing source provenance. One of the three core operations in the LLM Wiki pattern (alongside Ingest and Query).

## Six checks <!-- kb:card:2a622b -->
What are the six canonical wiki lint checks?
?
1. **Contradictions** — two pages making mutually exclusive claims
2. **Stale claims** — assertions superseded by newer sources
3. **Orphan pages** — pages with no inbound links
4. **Concept gaps** — concepts frequently mentioned but lacking their own page
5. **Missing cross-references** — related pages that don't link to each other
6. **Missing source provenance** — claims without citations

## Lint vs code lint <!-- kb:card:9ced5c -->
How does wiki linting relate to code linting?
?
Both enforce structural integrity on a corpus maintained over time. Code linting checks syntax, style, and type correctness. Wiki linting checks page structure, link integrity, and semantic consistency (contradictions, staleness). The analogy holds at the automation level: both are best run periodically in the background. See also: intent-gap linting.

## Output type <!-- kb:card:4cba0b -->
What does a lint operation produce as output?
?
Not just a defect list — actionable outputs: proposed edits to reconcile contradictions, stub pages for concept gaps, suggested inbound links for orphan pages, and new research questions or source suggestions. Lint is a form of guided discovery, not just cleanup.

## Why lint matters for compounding <!-- kb:card:b15258 -->
How does the lint operation support knowledge compounding?
?
Knowledge compounding relies on structural integrity — pages must be findable, cross-references must be accurate, and contradictions must be resolved. Without lint, orphans accumulate (pages the LLM can't find), contradictions silently erode trust, and concept gaps create holes in synthesis. Lint is the maintenance operation that keeps compounding quality high.
