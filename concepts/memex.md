---
title: "Memex"
date: 2026-07-08
domain: knowledge-management
maturity: established
source_type: research
topics: [pkm, memory]
tags: [concept, knowledge-management, pkm, history, vannevar-bush, associative-memory, hypertext, domain/knowledge-management, maturity/established, source-type/research, topic/pkm, topic/memory]
status: draft
sources:
  - url: https://www.theatlantic.com/magazine/archive/1945/07/as-we-may-think/303881/
    hash: sha256:28c572172262c598333158c6daa83099ad11bc508da840e49d1bb4f5a6470e77
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    hash: sha256:38e4f6b3bc571142fda8122633d849887afb108c2ab5b84251a024bab995c2dc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://datasciencedojo.com/blog/llm-wiki-tutorial/
    hash: sha256:15f81041e9b663581be27027adc0b7a7e3c1b82248c37c6346357837512d0801
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Memex

## Definition
The Memex (Memory Extender) is a hypothetical personal knowledge device described by Vannevar Bush in his 1945 essay "As We May Think" — a desk-sized machine that stores an individual's entire collection of books, records, and communications on microfilm and allows navigation through the collection via *associative trails*: user-defined chains of linked documents that mirror the human mind's natural association-based thinking. The Memex is widely recognised as the conceptual ancestor of hypertext, personal computing, and — most directly — the [[llm-wiki-pattern|LLM Wiki pattern]].

## Explanation
Vannevar Bush's central observation in 1945 was that existing indexing systems — alphabetical, numerical — do not match how the human mind works. The mind operates by association: one thought triggers another, and that path can be traversed again. Bush's vision was a machine that would let individuals build and traverse their own associative trails through a personal corpus of knowledge.

### The Core Memex Architecture
- **Personal corpus:** The user stores books, articles, notes, and records — all microfilmed for rapid access
- **Associative trails:** The user can link any two documents with a named trail. Following the trail steps through the chain of associations
- **Trail sharing:** Trails can be extracted and shared with others, allowing communities to collectively build associative knowledge maps
- **Marginalia:** The user can annotate any document; annotations are part of the trail

### What Bush Got Right
The Memex vision anticipated:
- **Personal information management** distinct from library systems
- **Non-linear navigation** through associative links (hypertext, Wikilinks)
- **Knowledge as a network**, not a hierarchy
- **The curation layer:** the Memex is useful because the *human curates the associations*, not just the content

### What Bush Couldn't Solve
Bush assumed the human would build and maintain all the associative trails. In practice, this is the fatal bottleneck — the same maintenance burden that kills human wikis. Building a 1,000-node Memex would require an enormous ongoing time investment to create and maintain trails, update links when documents change, and resolve contradictions.

This is precisely the gap that LLMs fill. Karpathy's observation: *"The part he couldn't solve was who does the maintenance. The LLM handles that."*

### The LLM Completion of the Memex Vision
The [[llm-wiki-pattern]] is, in effect, a practical Memex:
- **Personal corpus** → the `raw/` sources directory (immutable originals)
- **Associative trails** → `Wikilinks` between concept and entity pages, maintained by the LLM
- **Curation layer** → the human curates sources and high-level editorial direction; the LLM does all the cross-referencing
- **Trail sharing** → the wiki is a git repo, shareable and forkable
- **Marginalia** → LLM-added annotations, source citations, and contradiction flags on every page

The critical difference from Bush's vision: the human's role shrinks from "maintaining all the trails" to "curating sources and asking good questions." The maintenance burden — the part that made the Memex impractical — is absorbed by the LLM.

### Historical Influence
The Memex directly influenced:
- **Ted Nelson's Xanadu (1960s):** Hypermedia with bidirectional links and transclusion — a software Memex
- **Douglas Engelbart's NLS/oN-Line System (1960s):** Collaborative hypertext with the mouse, windows, and hyperlinks
- **Tim Berners-Lee's World Wide Web (1989):** Unidirectional hyperlinks at global scale — a public, not personal, Memex
- **Obsidian, Roam, Logseq (2020s):** Personal knowledge tools with wikilink graphs — closer to Bush's vision but still human-maintained

The irony is that the Web — the most successful descendant — went in the opposite direction from the Memex: public, not personal; crawled, not curated; stateless search, not associative trails.

## Key Properties
- **Associative, not hierarchical:** Navigation follows conceptual links, not folder structures or indexes
- **Personal:** The corpus and trails reflect one individual's knowledge, not a public library
- **Persistent:** Trails built today are traversable years later — unlike episodic memory
- **Curated:** Value derives from the *quality of associations*, not just the volume of stored material
- **Maintenance-intensive:** Bush's original vision required enormous human effort for trail-building and upkeep

## Relationships
- Conceptual ancestor of [[llm-wiki-pattern]]: the LLM wiki is a practical implementation of the Memex vision
- Realised by [[knowledge-compounding]]: compounding is what makes the LLM-maintained Memex more valuable than Bush imagined possible
- Precedes modern [[retrieval-augmented-generation]]: RAG represents the "library card catalog" school of information retrieval that Bush was explicitly arguing against
- Anticipates [[wiki-navigation-scaffold]]: index.md and log.md are the engineered equivalents of Bush's catalog system
- Related to [[codebase-knowledge-graphs]]: knowledge graphs encode the associative structure Bush envisioned, though in typed form

## Applications
- **Historical framing:** When pitching an LLM-maintained wiki to stakeholders, the Memex analogy explains why this is the right model: *"This is what Bush imagined in 1945, and LLMs are finally making it practical"*
- **Design principle:** "Would Bush recognise this as a Memex trail?" is a useful heuristic when deciding whether a wikilink connection is genuine or superficial
- **Research into knowledge tools:** Any system that claims to solve personal knowledge management should be evaluated against the Memex's core desiderata: associative, personal, persistent, curated
- **This vault:** The staging → concept pipeline, cross-linking, and graph view in Obsidian are together a Memex implementation; the [[wiki-lint-operation]] is the maintenance layer Bush couldn't provide

## Sources
- [Vannevar Bush — As We May Think (1945)](https://www.theatlantic.com/magazine/archive/1945/07/as-we-may-think/303881/) — The Atlantic, July 1945. Original articulation of the Memex
- [Andrej Karpathy — LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — explicit connection between the LLM wiki pattern and the Memex
- [Data Science Dojo — LLM Wiki Tutorial](https://datasciencedojo.com/blog/llm-wiki-tutorial/) — modern tutorial explaining the Memex lineage

## See Also
- [[llm-wiki-pattern]]
- [[knowledge-compounding]]
- [[wiki-lint-operation]]
- [[wiki-navigation-scaffold]]
- [[retrieval-augmented-generation]]
