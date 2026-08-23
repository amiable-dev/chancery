---
title: "LLM Wiki Pattern"
date: 2026-06-18
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm, memory]
tags: [concept, ai-agents, knowledge-management, pkm, architecture, llm, wiki, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm, topic/memory]
status: draft
sources:
  - url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    hash: sha256:38e4f6b3bc571142fda8122633d849887afb108c2ab5b84251a024bab995c2dc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/
    hash: sha256:c09a81d3832eb9bb26c26700421dc83643e23598cee4305debacd7050be9ded6
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# LLM Wiki Pattern

## Definition
A knowledge-management pattern, articulated by Andrej Karpathy in April 2026, in which a shared, cross-linked Markdown library (a "wiki") serves as the persistent context layer for AI agents. Rather than humans maintaining the wiki's internal consistency, LLMs handle the bookkeeping — updating cross-references, creating new pages, and editing multiple files in a single pass — while humans curate the content and manage it like code.

## Explanation
Human wikis fail for a predictable reason: the bookkeeping overhead (updating every cross-reference when one fact changes, keeping related pages in sync, remembering to add new entries) eventually exceeds the value they provide. Humans get bored and the wiki goes stale.

Karpathy's insight is that this is precisely the kind of task LLMs handle well. They do not get bored, do not forget to update a cross-reference, and can touch fifteen files in one pass. The burden that causes humans to abandon wikis is the burden LLMs absorb naturally.

The pattern has three roles:
1. **Agents do the bookkeeping** — updating cross-references, creating concept stubs, keeping the graph consistent, and synthesising new information into existing pages.
2. **Humans curate** — reviewing agent-proposed changes, making high-level editorial decisions, and managing the wiki like a codebase (PRs, reviews, version control).
3. **The wiki provides context** — agents read the wiki before doing work, gaining curated, version-controlled institutional knowledge rather than re-deriving it from raw documents on every call.

### Why It Matters for Agent Context
The dominant alternative — RAG — retrieves chunks from documents at query time and asks the LLM to contextualise them on the fly. This works for one-off questions but is fragile for agents running multi-step tasks: each step may re-discover the same context from scratch, and the assembled answer may be inconsistent across steps.

A living wiki changes the model. Concepts are curated once, cross-linked explicitly, and updated incrementally. An agent reading the wiki gets *curated knowledge* — the distilled result of human editorial decisions and prior agent runs — not raw document chunks.

### Instances of the Pattern
The same underlying idea surfaces under many names:
- `AGENTS.md` / `CLAUDE.md` convention files in coding agent repos
- Obsidian vaults wired to coding agents (like this vault)
- "Metadata as code" repos in data teams (table schemas, metric definitions committed as Markdown)
- OKF bundles (the standardised, interoperable form)
- Any `index.md` + `log.md` repo structure an agent consults before doing real work

Each instance is bespoke. [[open-knowledge-format]] is Google Cloud's attempt to standardise the interoperability layer so that these instances can exchange knowledge without translation.

### The Karpathy Gist
Published April 2026 at https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f. Key quotes:
- *"LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass."*
- The gist describes a minimal `CLAUDE.md`-based wiki structure as a starting point.
- Google Cloud's OKF blog post explicitly cites this gist as the conceptual origin of OKF.

## Key Properties
- **Agent-maintained consistency:** LLMs handle bookkeeping; humans handle curation
- **Living document:** wiki grows more useful over time as agents add and update entries
- **Version-control-native:** changes go through PRs, enabling audit trails
- **No special runtime:** plain Markdown files; no wiki engine or database required
- **Cross-link graph:** Markdown links between files form a navigable knowledge graph
- **Progressive enrichment:** starts minimal (one schema file, one runbook) and grows organically

## Relationships
- Formalised as [[open-knowledge-format]]: OKF is the standardised, interoperable version of this pattern
- Instantiated as [[agent-knowledge-schema]]: the AGENTS.md/CLAUDE.md family is a direct instance of the LLM wiki pattern scoped to coding agents
- Embodies [[metadata-as-code]]: the wiki is treated as a codebase — versioned, reviewed, owned
- Contrasts with [[retrieval-augmented-generation]] (implicit): wiki provides curated, pre-linked concepts; RAG retrieves raw chunks at query time
- Related to [[context-engineering]]: the wiki is a durable context layer; context engineering decides what from it to inject into the active prompt
- Complements [[agent-session-distillation]]: session distillation extracts knowledge from agent runs and could feed back into the wiki

## Applications
- **Coding agents:** `AGENTS.md` in a repo tells agents how the codebase is structured, what conventions to follow, and which patterns to apply. Agents keep it updated.
- **Data teams:** Markdown files for each table, metric, and join path, committed next to the SQL. Agents update them when schemas change.
- **On-call runbooks:** Each incident type has an OKF concept. An on-call agent reads the relevant page and follows the embedded cross-links.
- **This vault:** Our staging/permanent Obsidian structure is an instance of the LLM wiki pattern. The pipeline that synthesises staging notes into concepts is the "agent does the bookkeeping" step.
- **Institutional knowledge preservation:** As a team grows, the wiki captures knowledge that would otherwise live only in senior engineers' heads.

## Study
- Flashcards: [[flashcards/llm-wiki-pattern|Practice this concept]]

## Sources
- [Andrej Karpathy — LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — original articulation of the pattern
- [Google Cloud Blog — How the Open Knowledge Format can improve data sharing](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/) — Google's formalisation and extension of the pattern into OKF

## See Also
- [[open-knowledge-format]]
- [[agent-knowledge-schema]]
- [[metadata-as-code]]
- [[context-engineering]]
- [[agent-session-distillation]]
- [[knowledge-compounding]]
- [[wiki-lint-operation]]
- [[wiki-navigation-scaffold]]
- [[memex]]
