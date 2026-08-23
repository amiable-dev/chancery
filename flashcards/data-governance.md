---
tags: [flashcards, data-governance, infrastructure, compliance]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Data Governance — Flashcards

#flashcards/infrastructure

## Definition <!-- kb:card:58c187 -->
What is data governance?
?
A framework of policies, processes, roles, and standards managing the availability, usability, integrity, security, and compliance of data. It defines who can access what data, how it is classified and protected, where it flows, and how long it is retained — ensuring data is trustworthy, auditable, and used appropriately.

## Core Dimensions <!-- kb:card:2427c1 -->
What are the seven core data governance dimensions?
?
1. **Classification** — categorise by sensitivity (public/internal/confidential/restricted)
2. **Data quality** — accuracy, completeness, consistency, timeliness
3. **Lineage** — track origin, transformations, and downstream usage
4. **Access control** — RBAC/ABAC, column masking, row-level security, JIT access
5. **Retention and lifecycle** — how long data is kept; how it is destroyed
6. **Data contracts** — versioned producer/consumer agreements on schema and SLAs
7. **Federated data catalog** — searchable inventory with metadata and discoverability

## Application <!-- kb:card:46cd51 -->
How does data governance apply to RAG systems?
?
The RAG corpus requires governance: classification rules determine which documents can enter (sensitive data shouldn't be indexed uncontrolled); quality checks prevent stale/inaccurate content; lineage tracks which source documents produced which agent responses; retention policies ensure outdated content is removed rather than contaminating future retrievals.

## Relationship <!-- kb:card:69a5da -->
How do data governance and Zero Trust overlap?
?
Both address data classification and access control. Zero Trust's **data pillar** implements governance controls at the technical enforcement layer (attribute-based access, encryption, flow monitoring). Data governance provides the policy framework; Zero Trust provides the enforcement mechanism.

## Failure Mode <!-- kb:card:42378f -->
What happens when data governance is absent in AI systems?
?
- Training data provenance is unknown → copyright and bias liability exposure
- RAG corpus contains stale/inaccurate/sensitive documents → contaminated agent responses
- No lineage → can't answer GDPR right-to-erasure requests (where does this user's data live?)
- Shadow data accumulates → ungovernable sensitive datasets discovered only during breaches
