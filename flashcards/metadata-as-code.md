---
tags: [flashcards, metadata-as-code, data-engineering, knowledge-management, devops]
sr-due: 2026-06-18
sr-interval: 1
sr-ease: 250
---

# Metadata-as-Code — Flashcards

#flashcards/data-engineering

## Definition <!-- kb:card:4c4beb -->
What is metadata-as-code?
?
The practice of storing organisational metadata — table schemas, metric definitions, runbooks, API descriptions — as version-controlled plain-text files (Markdown or YAML) committed alongside the systems they describe, and managed through code review and deployment workflows just like source code.

## Why Version Control? <!-- kb:card:c8104e -->
What are the main benefits of version-controlling metadata?
?
1. **Auditability** — who changed this description, and when?
2. **Review** — metadata changes go through PRs, reviewed by the people who own the system
3. **Portability** — plain Markdown files readable anywhere without a catalog API
4. **Agent-friendliness** — agents read files directly without authenticating to a catalog service

## X-as-Code Analogy <!-- kb:card:922b0d -->
How does metadata-as-code extend the "infrastructure-as-code" philosophy?
?
It applies the same principle — declare state as version-controlled files — to a new domain: institutional knowledge. IaC: infrastructure as Terraform files. Config-as-code: Kubernetes manifests. Metadata-as-code: table schemas, runbooks, metrics as Markdown files. Same benefits: version control, diffs, review, portability.

## vs Proprietary Catalog <!-- kb:card:cc8c78 -->
What problem does metadata-as-code solve compared to a proprietary data catalog?
?
Proprietary catalogs create vendor lock-in: their APIs, SDKs, and account requirements prevent knowledge from being consumed by different agents or shared with other teams. Metadata-as-code keeps knowledge in portable files — readable by any agent, on any platform, with no vendor dependency. OKF standardises this for interoperability.

## Application <!-- kb:card:c53cfc -->
A data team wants agents to stay current on table schema changes. How does metadata-as-code enable this?
?
Schema definitions live as Markdown files in version control. A CI check keeps them in sync with the actual database. When a schema changes, a PR updates the Markdown file — reviewed by the same team. Agents read the file directly, always getting the current curated description. No catalog API, no drift between docs and reality.
