---
title: "Open Knowledge Format (OKF)"
aliases: ["Open Knowledge Format (OKF)"]
date: 2026-06-18
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [pkm]
tags: [concept, ai-agents, knowledge-management, pkm, standards, google, interoperability, architecture, domain/standards, maturity/emerging, source-type/vendor-doc, topic/pkm]
status: draft
sources:
  - url: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/
    hash: sha256:c09a81d3832eb9bb26c26700421dc83643e23598cee4305debacd7050be9ded6
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
    hash: sha256:b87f2d7b1524b0ab81d0ad27f756210e51d42613fcf2dde17b4842b06be11824
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/
    hash: sha256:bb69ecd217c66510fc9ecc2959e62e6dc26a075c6503ae720596c46580691534
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Open Knowledge Format (OKF)

## Definition
A vendor-neutral, open specification (v0.1, published June 2026 by Google Cloud) that formalises the [[llm-wiki-pattern]] into a portable, interoperable standard. An OKF **bundle** is a directory of Markdown files with YAML frontmatter, where each file represents one concept (table, metric, runbook, API) and Markdown cross-links between files form a knowledge graph. The only required YAML field per concept is `type`; everything else is optional.

## Explanation
Before OKF, every team building AI agents solved the same problem from scratch: how do you give an agent the internal organisational knowledge it needs — table schemas, metric definitions, join paths, runbooks — without locking it to a proprietary catalog API or SDK? The result was dozens of bespoke variants: Obsidian vaults wired to coding agents, `AGENTS.md` / `CLAUDE.md` convention files, "metadata as code" repos. Each was compelling but none interoperated.

OKF standardises the minimal interoperability layer across all of these. A bundle written by one team can be read by a different agent without translation, because the format is just files, just Markdown, and just YAML frontmatter.

### Structure

```
sales/
├── index.md              # progressive disclosure entry point
├── datasets/
│   └── orders_db.md      # one concept per file
├── tables/
│   ├── orders.md         # YAML frontmatter + markdown body
│   └── customers.md
└── metrics/
    └── weekly_active_users.md
```

Each file uses a small, fixed set of YAML reserved fields:

| Field | Required | Purpose |
|-------|----------|---------|
| `type` | ✅ **Yes** | What kind of thing this is (e.g. `BigQuery Table`, `Metric`, `Runbook`) |
| `title` | No | Human-readable name |
| `description` | No | One-line summary |
| `resource` | No | URL to the backing resource |
| `tags` | No | Array of string labels |
| `timestamp` | No | ISO 8601 last-updated timestamp |

Concepts link to each other using standard Markdown links (`[text](/path/to/concept.md)`). Those links turn the directory into a graph richer than a filesystem hierarchy. Bundles can also include optional `index.md` files for progressive disclosure and `log.md` files for change history.

### Three Design Principles

1. **Minimally opinionated** — exactly one required field (`type`); the spec defines the interoperability surface, not the full content model. Teams extend freely within that surface.

2. **Producer/consumer independence** — a human-written bundle can be read by an agent; a pipeline-generated bundle can be browsed by a human in a static HTML visualiser. The format is the contract; tooling at each end is swappable.

3. **Format, not platform** — no cloud account, runtime, SDK, or registry required to read or write OKF. Bundles render on GitHub, ship as tarballs, and mount on any filesystem.

### OKF vs RAG

| | OKF | RAG |
|--|-----|-----|
| Storage | Markdown files + YAML | Vector store (embeddings) |
| Unit | Curated, cross-linked concept | Raw chunk |
| Agent access | Reads/updates files directly | Query → retrieve → contextualise |
| Portability | Yes — plain files | No — embedding model + vector DB |
| Human-readable | Yes | No |

The key distinction: RAG *re-derives* knowledge at query time from raw chunks. OKF stores *curated* knowledge that agents read and update directly. The two are **complementary**, not competing — OKF bundles can feed RAG pipelines or be used standalone.

### Reference Tooling (shipped with v0.1)
- **BigQuery enrichment agent** — auto-generates OKF concepts from BigQuery table schemas
- **Static HTML visualiser** — renders any OKF bundle as a navigable knowledge graph
- **Three sample bundles** — data team, runbooks, and API reference examples

### Minimal Consumer (12-line Python)
A bundle is parseable with Python stdlib — no install required:

```python
import pathlib, re, yaml

def load_bundle(root):
    concepts, links = {}, []
    for path in pathlib.Path(root).rglob("*.md"):
        text = path.read_text()
        meta = {}
        if text.startswith("---"):
            _, fm, body = text.split("---", 2)
            meta = yaml.safe_load(fm) or {}
        else:
            body = text
        concepts[str(path)] = meta
        for target in set(re.findall(r"\]\((/[^)]+\.md)\)", body)):
            links.append((str(path), target))
    return concepts, links
```

## Key Properties
- **One required field:** `type` — the spec surface is intentionally tiny
- **File path = identity:** concept identity is the file path, not a database key
- **Markdown cross-links = graph edges:** no separate graph database needed
- **Version-control-native:** bundles commit alongside code and go through PRs
- **Agent read/write:** agents can update OKF bundles directly, not just query them
- **Portability without translation:** any OKF bundle can be consumed by any OKF-aware agent

## Relationships
- Formalises [[llm-wiki-pattern]]: OKF is the standardised interchange format for what Karpathy's LLM wiki described informally
- Embodies [[metadata-as-code]]: OKF bundles are the canonical form of org knowledge stored as version-controlled files
- Contrasts with [[compilation-stage-knowledge-layer]]: the compilation-stage layer pre-processes knowledge at build time; OKF is the storage and exchange format that such layers produce and consume
- Complements [[context-engineering]]: OKF bundles are a primary source of the curated context that context engineering injects into agent prompts
- Related to [[agent-knowledge-schema]]: AGENTS.md/CLAUDE.md convention files are informal OKF-like bundles; OKF provides the interoperability standard they lack
- Extends [[typed-knowledge-graph]]: OKF bundles are lightweight typed knowledge graphs (type field + link graph) without a graph database dependency
- Addresses [[agent-memory-lock-in]]: vendor-neutral format avoids knowledge being trapped behind proprietary catalog APIs

## Applications
- **Data team metadata-as-code:** Export BigQuery table and metric definitions as an OKF bundle committed next to the SQL it describes. Schema changes go through PRs.
- **Incident runbooks for agents:** Store each runbook as an OKF concept. An on-call agent reads `index.md`, follows cross-links, and resolves the context it needs without catalog API calls.
- **Cross-org knowledge exchange:** A vendor ships a catalog export as OKF; your agent consumes it directly with zero integration work.
- **Agent context bootstrap:** Replace or augment `AGENTS.md` / `CLAUDE.md` convention files with a full OKF bundle that an agent keeps current over time.
- **Our Obsidian vault:** The staging/permanent pattern we already use is a bespoke OKF-like structure. Adopting OKF frontmatter conventions (`type`, `timestamp`, etc.) would make our vault interoperable with future agent tooling.

## Study
- Flashcards: [[flashcards/open-knowledge-format|Practice this concept]]

## Sources
- [Google Cloud Blog — How the Open Knowledge Format can improve data sharing](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/) — primary Google announcement post
- [OKF Spec (GitHub)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) — formal specification v0.1
- [MarkTechPost — Google Cloud Introduces OKF](https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/) — accessible technical summary

## See Also
- [[llm-wiki-pattern]]
- [[metadata-as-code]]
- [[agent-knowledge-schema]]
- [[context-engineering]]
- [[compilation-stage-knowledge-layer]]
- [[typed-knowledge-graph]]
