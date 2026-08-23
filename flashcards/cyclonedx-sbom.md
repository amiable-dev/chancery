---
tags: [flashcards, security, supply-chain, sbom, standards]
sr-due: 2026-06-07
sr-interval: 1
sr-ease: 250
---

# CycloneDX SBOM — Flashcards

#flashcards/security

## Definition <!-- kb:card:be97cf -->
What is CycloneDX, and how does it go beyond a simple SBOM?
?
CycloneDX is an OWASP-maintained open standard for software supply chain transparency. It covers: Software BOM (SBOM), SaaS BOM, Hardware BOM, AI/ML BOM, Operations BOM, Vulnerability Disclosure Reports (VDR), and Vulnerability Exploitability eXchange (VEX). It's not just a component inventory — it's a full-stack supply chain risk communication standard.

## Key Concept <!-- kb:card:075b95 -->
What is a `purl` (Package URL) in CycloneDX, and why is it important?
?
A purl is a standardised URI scheme (`pkg:npm/lodash@4.17.21`, `pkg:pypi/requests@2.31.0`) that uniquely identifies a software package across ecosystems. It enables unambiguous cross-tool comparison: two SBOMs referencing `pkg:npm/lodash@4.17.21` are referring to exactly the same artifact, regardless of which tool generated the SBOM.

## Application <!-- kb:card:58cdfe -->
How does an SBOM accelerate incident response when a critical CVE like Log4Shell drops?
?
Without an SBOM: grep repos, check lockfiles, ask teams — days of manual inventory work. With CycloneDX SBOMs in a tool like Dependency-Track: query `which components include log4j?` across all your products in seconds. The SBOM is a pre-computed inventory that answers "are we affected?" instantly rather than at investigation time.

## VEX <!-- kb:card:0f0b92 -->
What is VEX in CycloneDX, and how does it complement an SBOM?
?
VEX (Vulnerability Exploitability eXchange) is a CycloneDX document type that goes beyond "we include component X" to say "CVE-Y in component X is NOT exploitable in our context because [reason]." An SBOM declares presence; VEX declares risk status. Together they let vendors proactively communicate that a widely-reported vulnerability doesn't affect their product.

## Comparison <!-- kb:card:bfb5bd -->
What distinguishes CycloneDX from SPDX (the other major SBOM standard)?
?
CycloneDX is more security-focused: it has native VEX, VDR, pedigree, and provenance support built into the spec. SPDX is more license-compliance-focused: it has richer license expression syntax but less native security data. Both are accepted by US EO 14028 and EU CRA. Most organisations pick one; CycloneDX is more common in security-first contexts.
