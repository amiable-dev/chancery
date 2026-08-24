# Google Cloud Introduces Open Knowledge Format (OKF): A Vendor-Neutral Markdown Spec for Giving AI Agents Curated Context

**Source:** https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Open Knowledge Format (OKF), a vendor-neutral markdown spec giving AI agents portable, cross-linked, version-controlled context

---

Foundation models keep getting stronger, yet they still stall on the same thing: context. A model can write code or analyze a dataset, but only with the right internal knowledge. That knowledge includes table schemas, metric definitions, runbooks, join paths and it lives scattered across catalogs, wikis, and a few senior engineers’ heads.

Google Cloud introduced the **Open Knowledge Format (OKF)**, an open specification that formalizes the LLM-wiki pattern into a portable, interoperable format. It is a vendor-neutral, agent- and human-friendly standard for the context modern AI systems need.

OKF is a format, not a service or a platform. **OKF v0.1** represents knowledge as a directory of markdown files with YAML frontmatter. A small set of agreed-upon conventions lets wikis written by one producer be consumed by a different agent without translation.

That is the whole idea. There is no compression scheme, no new runtime, and no required SDK. A bundle of OKF documents is just markdown, just files, and just YAML frontmatter. It renders on GitHub, ships as a tarball, and mounts on any filesystem.

If you have used Obsidian, Notion, or Hugo, the shape will feel familiar. OKF only formalizes the conventions needed to make those patterns interoperable.

## **The Fragmented Context Problem**

In most organizations, model context is overwhelmingly internal knowledge. Today it sits in incompatible silos: metadata catalogs with their own APIs, wikis, shared drives, code comments, and docstrings.

Ask an agent ‘How do I compute weekly active users from our event stream?’ It must assemble that answer from scattered, mutually incompatible surfaces. Every vendor offers its own catalog, SDK, and knowledge-graph schema. None of the knowledge is portable across products or organizations.

The result is duplicated effort. Every agent builder solves the same context-assembly problem from scratch. Every catalog vendor reinvents the same data models.

[Andrej Karpathy articulated the underlying idea in his April 2026 LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). His point: LLMs do not get bored, do not forget to update cross-references, and can edit many files in one pass. The bookkeeping that makes humans abandon personal wikis is exactly what LLMs handle well.

The same pattern keeps reappearing under different names. Examples include Obsidian vaults wired to coding agents, the AGENTS.md and CLAUDE.md convention files, and ‘metadata as code’ repos. Each instance is bespoke, so none of them interoperate. OKF standardizes that interoperability layer so agents can do the heavy lifting.

## **How OKF Works: The Design in One Screen**

An OKF **bundle** is a directory of markdown files representing **concepts** — tables, datasets, metrics, playbooks, runbooks, or APIs. Each concept is one file, and the file path is its identity.

```
sales/
├── index.md
├── datasets/
│   ├── index.md
│   └── orders_db.md
├── tables/
│   ├── index.md
│   ├── orders.md
│   └── customers.md
└── metrics/
    ├── index.md
    └── weekly_active_users.md
```

Each concept carries a small YAML front-matter block, then a markdown body for everything else.

```
---
type: BigQuery Table
title: Orders
description: One row per completed customer order.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, revenue]
timestamp: 2026-05-28T14:30:00Z
---

# Schema

| Column        | Type   | Description                              |
|---------------|--------|------------------------------------------|
| `order_id`    | STRING | Globally unique order identifier.        |
| `customer_id` | STRING | FK to [customers](/tables/customers.md). |
```

The reserved structured fields are `type`, `title`, `description`, `resource`, `tags`, and `timestamp`. Concepts link to each other with normal markdown links. Those links turn the directory into a graph that is richer than file-system parent/child relationships. Bundles can optionally include `index.md` files for progressive disclosure and `log.md` files for change history.

## **Three Principles Behind the Design**

-   **Minimally opinionated**: OKF requires exactly one field on every concept: `type`. Everything else is left to the producer. The spec defines the interoperability surface, not the content model.
-   **Producer/consumer independence**: A human-written bundle can be read by an agent. A pipeline-generated bundle can be browsed in a visualizer. The format is the contract; tooling at each end is swappable.
-   **Format, not platform**: OKF is tied to no cloud, database, model provider, or agent framework. It will never require a proprietary account to read, write, or serve.

## **Use Cases, With Examples**

-   **Data team metadata-as-code**: Export BigQuery table and metric definitions as a bundle. Commit it next to the SQL it describes, and review changes through pull requests.
-   **Incident runbooks for agents**: Store each runbook as a concept. An on-call agent reads `index.md`, follows cross-links, and resolves the join path it needs.
-   **Cross-org knowledge exchange**: A vendor ships a catalog export as OKF. Your agent consumes it directly, with no integration work.
-   **Developer-team wiki**: Replace a stale Notion or Obsidian space with versioned markdown that an agent keeps current.

## **How OKF Compares**

Approach

Storage

Schema required

Portable

SDK/registry

Agent-readable

OKF v0.1

Markdown + YAML files

Only `type`

Yes

No

Yes, no translation

Notion

Proprietary DB

Per-workspace

Export-only

API needed

Via API

Obsidian vault

Markdown files

None enforced

Yes

No

Bespoke conventions

Metadata catalog

Vendor store

Vendor schema

Export-only

Vendor SDK

Vendor-specific

RAG index

Vector store

Embedding model

No

Yes

Chunks, not concepts

The distinction from RAG is useful for developers. RAG re-derives knowledge at query time from raw chunks. An OKF bundle stores curated, cross-linked concepts that an agent reads and updates directly.

## **A Minimal OKF Consumer**

OKF is parseable with standard tools. This reads a bundle and builds its link graph.

```
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
        concepts[str(path)] = meta            # type, title, tags, etc.
        for target in set(re.findall(r"\]\((/[^)]+\.md)\)", body)):
            links.append((str(path), target))  # markdown cross-links
    return concepts, links

concepts, graph = load_bundle("sales/")
```

No backend or install is needed to read or serve a bundle. The same files live in version control beside the code they describe.

## **Key Takeaways**

-   Google’s Open Knowledge Format (OKF) v0.1 formalizes the LLM-wiki pattern into a portable, vendor-neutral spec.
-   A bundle is just a directory of markdown files with YAML frontmatter—no SDK, runtime, or registry.
-   Every concept requires only one field, `type`; cross-links between files form the knowledge graph.
-   Google shipped reference tools: a BigQuery enrichment agent, a static HTML visualizer, and three sample bundles.
-   Unlike RAG, OKF stores curated, version-controlled concepts that agents read and update directly.

* * *

Check out the **[Technical details here](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing).** Also, feel free to follow us on **[Twitter](https://x.com/intent/follow?screen_name=marktechpost)** and don’t forget to join our **[150k+ML SubReddit](https://www.reddit.com/r/machinelearningnews/)** and Subscribe to **[our Newsletter](https://www.aidevsignals.com/)**. Wait! are you on telegram? **[now you can join us on telegram as well.](https://t.me/machinelearningresearchnews)**

Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? **[Connect with us](https://forms.gle/wbash1wF6efRj8G58)**

[![](https://www.marktechpost.com/wp-content/uploads/2019/06/Screen-Shot-2021-09-14-at-9.02.24-AM-150x150.png)](https://www.marktechpost.com/author/6flvq/)

##### [Asif Razzaq](https://www.marktechpost.com/author/6flvq/)

Asif Razzaq is the CEO of Marktechpost Media Inc.. As a visionary entrepreneur and engineer, Asif is committed to harnessing the potential of Artificial Intelligence for social good. His most recent endeavor is the launch of an Artificial Intelligence Media Platform, Marktechpost, which stands out for its in-depth coverage of machine learning and deep learning news that is both technically sound and easily understandable by a wide audience. The platform boasts of over 2 million monthly views, illustrating its popularity among audiences.
