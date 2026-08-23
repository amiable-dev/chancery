---
tags: [flashcards, exposure-catalog, security, supply-chain, threat-intelligence]
sr-due: 2026-05-25
sr-interval: 1
sr-ease: 250
---

# Exposure Catalog — Flashcards

#flashcards/security

## Definition <!-- kb:card:3408d0 -->
What is an Exposure Catalog?
?
An operator-supplied structured data file that specifies known-compromised packages, extensions, or configurations — identified by ecosystem, package name, and affected version ranges — used to match against an inventory of installed artefacts to produce actionable findings. Narrower and more operational than a CVE database.

## CVE vs Catalog <!-- kb:card:d652a4 -->
How does an Exposure Catalog differ from a CVE database (e.g., NVD)?
?
CVE databases are broad and general: they cover any vulnerability, often with days–weeks latency. An exposure catalog is operator-curated, covers only active supply-chain campaigns, has lower false positive rates, and can be updated in minutes. It answers "are we affected by *this specific campaign* right now?" not "which of our packages have any known vulnerability?"

## Anatomy <!-- kb:card:010f4d -->
What fields does a typical exposure catalog entry contain?
?
- `id` — unique catalog entry identifier
- `severity` — e.g., critical/high/medium
- `description` — human-readable summary
- `ecosystem` — npm, pypi, go, rubygems, composer, etc.
- `package` — package name
- `affected_versions` — exact versions or version ranges
- `source` — link to the advisory
- `created_at` — timestamp

## Perplexity Workflow <!-- kb:card:656d10 -->
How does Perplexity use an AI agent in its exposure catalog workflow?
?
A threat signal arrives (public disclosure or intel feed) → Perplexity Computer drafts a catalog update PR (translates the advisory into structured format + adds source links) → a human engineer reviews and merges → updated catalog is distributed to fleet → Bumblebee scans run → findings go to security team. Human review gates quality; AI reduces manual authoring effort.

## Community Catalogs <!-- kb:card:6c9beb -->
What does Bumblebee's `threat_intel/` directory provide?
?
Community-maintained exposure catalogs derived from public supply-chain campaign reporting — including the Mini Shai-Hulud campaign series that targeted npm, PyPI, RubyGems, Go modules, and Composer across TanStack, SAP, and Zapier. A starting point operators can use without building catalogs from scratch.

## Finding Traceability <!-- kb:card:8d369f -->
What makes a catalog-generated finding actionable for incident response?
?
Every finding includes the specific catalog entry ID that triggered it, the severity from the catalog, the source advisory link, and the exact source file on the machine that matched. Responders can immediately pivot from a finding to the advisory and then to remediation, with full traceability.
