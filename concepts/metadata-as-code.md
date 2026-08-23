---
title: "Metadata-as-Code"
date: 2026-06-18
domain: knowledge-management
maturity: established
source_type: practitioner
topics: [devops, enterprise, workflow]
tags: [concept, data-engineering, knowledge-management, architecture, devops, version-control, ai-agents, domain/knowledge-management, maturity/established, source-type/practitioner, topic/devops, topic/enterprise, topic/workflow]
status: draft
sources:
  - url: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/
    hash: sha256:c09a81d3832eb9bb26c26700421dc83643e23598cee4305debacd7050be9ded6
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/
    hash: sha256:bb69ecd217c66510fc9ecc2959e62e6dc26a075c6503ae720596c46580691534
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Metadata-as-Code

## Definition
A practice in which organisational metadata — table schemas, metric definitions, runbook procedures, API descriptions, join paths, and similar institutional knowledge — is stored as version-controlled plain-text files (typically Markdown or YAML) committed alongside the systems they describe, and managed through the same code review and deployment workflows as source code.

## Explanation
In most organisations, the metadata that agents and engineers need lives in fragmented, incompatible systems: proprietary data catalogs with their own APIs, Notion or Confluence wikis, shared drives, code comments, and the heads of senior engineers. When an AI agent needs to answer "How do I compute weekly active users from our event stream?" it must assemble the answer from these scattered, mutually incompatible surfaces.

Metadata-as-code addresses this by making the metadata itself a first-class artifact in version control. Instead of being a separate "catalog" product, the schema for `orders_db` is a file — `datasets/orders_db.md` — that lives in the same repo as the SQL that queries it and changes through the same PR process.

### Why Version Control?
- **Auditability:** who changed this schema description, and when?
- **Review:** schema changes trigger the same PR workflow as code changes — a metric definition change gets reviewed by the same people who review the metric computation
- **Portability:** Markdown files are renderable anywhere — GitHub, local editors, agent prompts — without a catalog API
- **Agent-friendliness:** agents can read files directly without authenticating to a catalog service

### The Data-Engineering Use Case
The canonical example is a data team that exports BigQuery (or Snowflake, Redshift) table definitions as Markdown files with a `type: BigQuery Table` frontmatter, commits them to a `metadata/` directory next to the dbt models they describe, and uses a CI check to keep them in sync. The result is a catalog that:
- Needs no vendor contract to read
- Goes through PR review
- Can be ingested by an agent without an API key

This is one of the primary use cases [[open-knowledge-format]] was designed to support.

### Relationship to Infrastructure-as-Code
Metadata-as-code extends the "X-as-code" philosophy from infrastructure to knowledge:
- **Infrastructure-as-code:** Terraform, Pulumi — infrastructure state declared as version-controlled files
- **Configuration-as-code:** Helm charts, Kubernetes manifests — configuration declared as files
- **Metadata-as-code:** table schemas, metric definitions, runbooks — institutional knowledge declared as files

The same benefits apply in each case: version control, review workflow, portability, and the ability to diff changes over time.

## Key Properties
- **Plain-text:** Markdown or YAML, renderable without tooling
- **Committed to version control:** lives in git alongside the code it describes
- **PR-reviewed:** schema and metadata changes go through the same review process as code
- **Agent-portable:** any agent can read the files without an API key or SDK
- **Producer/consumer independent:** a human writes it, an agent reads it (or vice versa)
- **Incrementally maintainable:** starts with one file, grows as coverage expands

## Relationships
- Instantiated by [[open-knowledge-format]]: OKF is the standardised format specification for metadata-as-code bundles, enabling interoperability across teams and tools
- Enables [[llm-wiki-pattern]]: the LLM wiki is metadata-as-code applied to the full breadth of institutional knowledge (not just data schemas)
- Related to [[context-compilation-pattern]]: context compilation artifacts (`intent.md`, `boundaries.md`, `threat-model.md`) are metadata-as-code for architectural governance
- Related to [[context-engineering]]: metadata-as-code provides a stable, versioned source of the curated context that context engineering selects for injection
- Contrasts with [[agent-memory-lock-in]]: proprietary catalog APIs are the opposite of metadata-as-code; lock-in is avoided by keeping knowledge in portable files

## Applications
- **Data team onboarding:** New engineers (or agents) read the metadata directory to understand the data estate — no catalog tool access required.
- **Schema change review:** A PR that alters `orders.md` is reviewed by data owners the same way a PR altering `schema.sql` is reviewed by engineers.
- **Agent context without API calls:** An agent reading a BigQuery metadata bundle reads files from disk or git, not a catalog API. Zero dependency on catalog availability.
- **Cross-org knowledge sharing:** A vendor or partner ships an OKF bundle as a tarball. Your agent consumes it directly, no integration contract needed.
- **Our vault:** Every concept note in this vault is an instance of metadata-as-code — the metadata for an idea, version-controlled in a Markdown file. This is the pattern the vault operationalises.

## Study
- Flashcards: [[flashcards/metadata-as-code|Practice this concept]]

## Sources
- [Google Cloud Blog — How the Open Knowledge Format can improve data sharing](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/) — OKF announcement, which frames metadata-as-code as a primary use case
- [MarkTechPost — Google Cloud Introduces OKF](https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/) — accessible summary of the pattern and its motivations

## See Also
- [[open-knowledge-format]]
- [[llm-wiki-pattern]]
- [[context-compilation-pattern]]
- [[context-engineering]]
- [[agent-memory-lock-in]]
