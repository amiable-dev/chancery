---
title: "Data Governance"
date: 2026-04-15
domain: governance
maturity: established
source_type: practitioner
topics: [enterprise]
tags: [concept, data-governance, infrastructure, compliance, data-quality, security, domain/governance, maturity/established, source-type/practitioner, topic/enterprise]
status: draft
sources:
  - url: https://www.dama.org/cpages/body-of-knowledge
    hash: sha256:b367b6a851307c80082ab9666b3b895328bf7604320016c6281f5fe58857f657
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.nist.gov/privacy-framework
    hash: sha256:53682fc9ec26fd36bcb3e82db65a8c3b48ec65fa5174245c90cfc29ed314600d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://arxiv.org/abs/1803.09010
    hash: sha256:9ff6df06168cdfe7df1effb4e4aefc9f36a6aff4decd24ff3dd678f6bdc4ab70
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Data Governance

## Definition
A framework of policies, processes, roles, and standards that manages the availability, usability, integrity, security, and compliance of data within an organisation. Data governance defines *who* can access *what* data, *how* it is classified and protected, *where* it flows, and *how long* it is retained — ensuring data is trustworthy, auditable, and used appropriately across its lifecycle.

## Explanation
Data governance answers: "Can we trust this data? Can we use it? Are we allowed to?" It spans technical controls, organisational policy, and compliance requirements.

**Core governance dimensions:**

**1. Data Classification**
Categorising data by sensitivity: public, internal, confidential, restricted (PII/PHI/PCI). Classification drives access controls, encryption requirements, and retention rules. All downstream governance depends on knowing what a dataset contains.

**2. Data Quality**
Ensuring data is accurate, complete, consistent, and timely. Data quality rules are enforced at ingestion (schema validation, type checks, null constraints) and monitored continuously (profiling, anomaly detection on distributions). Low-quality data in AI systems directly causes low-quality outputs.

**3. Data Lineage**
Tracking the origin and transformations of data: where it came from, what pipeline touched it, what it was used to produce. Lineage enables impact analysis ("what would break if this source changed?") and compliance audits ("where did this customer's data go?").

**4. Access Control**
Role-based or attribute-based access controls determining who can read, write, or delete data. In governed environments: column-level masking for PII, row-level security for multi-tenant data, just-in-time access requests for sensitive datasets.

**5. Retention and Lifecycle**
Policies governing how long data is kept and how it is destroyed. Driven by regulation (GDPR right to erasure, HIPAA retention minimums), business need, and cost. Lifecycle automation prevents silent accumulation of stale sensitive data.

**6. Data Contracts**
Explicit, versioned agreements between data producers and consumers defining schema, SLAs for freshness and quality, and deprecation notice periods. Contracts prevent silent breaking changes in data pipelines.

**7. Federated Data Catalog**
A searchable inventory of datasets with metadata: owner, classification, lineage, access process, and quality scores. Discoverability without a catalog leads to shadow data (undiscovered sensitive datasets, duplicate sources).

**Governance in AI contexts:**
AI systems introduce governance challenges absent in traditional data platforms:
- **Training data provenance** — what data was used to train or fine-tune a model? Affects copyright and bias liability.
- **[[retrieval-augmented-generation|RAG]] corpus governance** — what enters the retrieval corpus? Outdated or incorrect documents contaminate agent responses.
- **Output data classification** — LLM outputs may reconstruct PII from training data even if inputs were clean.
- **Model cards and datasheets** — structured documentation of model training data, intended use, and known limitations as a governance artefact.

## Key Properties
- **Governance is preventive and detective** — policy at ingestion (preventive) + monitoring (detective); both are required
- **Data contracts reduce coupling** — explicit schemas with versioning prevent cascade failures when producers change
- **Classification drives everything** — access controls, encryption, retention, and sharing rules all depend on knowing data sensitivity
- **Lineage enables trust** — untraceable data is ungovernable data; lineage is the audit backbone
- **Governance without tooling doesn't scale** — policy embedded in automation (pipeline checks, catalog indexing, masking at query time) is more reliable than manual enforcement
- **GDPR/CCPA/HIPAA are governance requirements** — regulation doesn't create governance; it establishes the floor

## Relationships
- Embedded in [[agentic-ai-platform-architecture]] Layer 3 (Data & Knowledge): data governance is the backbone of the data foundation layer
- Related to [[zero-trust-architecture]]: Zero Trust's data pillar and data governance share classification, access control, and lineage concerns
- Related to [[observability]]: data pipeline observability (freshness, quality metrics, lineage events) is a governance signal source
- Related to [[retrieval-augmented-generation|RAG]]: RAG corpus quality and classification directly affect what agents can access and how trustworthy their outputs are
- Related to [[typed-knowledge-graph]]: schema governance for knowledge graphs is a specialised form of data governance
- Related to [[knowledge-confidence-scoring]]: confidence scoring is a data quality mechanism applied to knowledge assets

## Applications
- **Regulated industries:** Healthcare (HIPAA) or financial services (SOX) require auditable lineage and access logs for all sensitive data — governance framework makes this tractable
- **GDPR compliance:** Right to erasure requires knowing exactly where a user's data lives across all systems — lineage makes this executable
- **AI training data:** Documenting training datasets with datasheets, tracking licenses, and flagging bias risks before model deployment
- **RAG corpus management:** Classification rules determine which documents enter the retrieval corpus; quality checks prevent stale or inaccurate content from contaminating agent responses
- **Homelab data hygiene:** Even at small scale, classifying what data lives where (secrets vs logs vs vault vs backups) and having retention rules prevents sensitive data accumulation

## Study

> [!tip] Flashcards
> [[flashcards/data-governance|Review flashcards for this concept]]

## Sources
- [DAMA DMBOK (Data Management Body of Knowledge)](https://www.dama.org/cpages/body-of-knowledge) — comprehensive data management framework
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework) — risk-based privacy and data governance
- [Google's Datasheet for Datasets](https://arxiv.org/abs/1803.09010) — structured documentation template for training datasets

## See Also
- [[zero-trust-architecture]]
- [[agentic-ai-platform-architecture]]
- [[retrieval-augmented-generation]]
- [[typed-knowledge-graph]]
- [[knowledge-confidence-scoring]]
- [[observability]]
