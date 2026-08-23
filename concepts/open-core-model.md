---
title: "Open Core Model"
date: 2026-05-29
domain: software-distribution
maturity: established
source_type: practitioner
tags: [concept, open-source, business-model, licensing, saas, monetisation, domain/software-distribution, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/
    hash: sha256:db47a3a23c8db34574379ae1c5cfd4ced48717fb33c56242b3fea87efae9620d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/vigolium/vigolium
    hash: sha256:b387e7b00f9203a8583c50ca541e01a95adb04047570713a6348e741874e2e12
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Open Core Model

## Definition
The Open Core Model is a commercial open-source business strategy in which the core product functionality is released under a strong copyleft open-source licence (typically AGPL or GPL), while operational features — hosting, collaboration tooling, scheduling, enterprise integrations — are sold as a commercial product layered on top. The open core is the technical engine; the commercial layer is the operational interface.

## Explanation
Open Core is distinct from "open-washing" (releasing documentation or non-functional components as "open source") and from dual-licensing (same code, two licences). The defining characteristic is a principled functional split: everything that *does the core job* is open, everything that *operates it at scale* is commercial.

Vigolium articulates this split explicitly:
> "The scanner is the open core, operations are commercial. Anything that finds bugs stays in the AGPL repo. The Console is just the ops layer on top: hosting, collaboration, scale, scheduling."

Jessie Ho frames contributor confidence in terms of observable behaviour over time:
> "New detection lands in the open repo first. The day capability starts moving out of core to upsell the Console, that trust is gone."

This is a commitment, not a guarantee — contributor trust in open core projects is earned incrementally and lost suddenly. The licensing choice (AGPL) reinforces the commitment: AGPL's copyleft provisions mean anyone can fork and self-host the core indefinitely, which limits the leverage of capability-shifting.

### Why AGPL?
AGPL extends GPL's copyleft to cover network use: if you run a modified AGPL program as a service, you must release the modified source. This prevents the "SaaS loophole" (using open source as infrastructure without contributing back) and is why database companies (MongoDB, Elasticsearch, Cockroach) gravitate to it before eventually moving to proprietary licences.

For the open core model, AGPL is the strongest available guarantee that the core stays open — a company relicensing from AGPL to proprietary is an unambiguous trust-breaking event.

### The Boundary Principle
The most durable open core products draw the boundary at **capability vs. operations**:
- **Open (capability):** Detection rules, scan logic, analysis algorithms, integrations with data sources
- **Commercial (operations):** Multi-tenant hosting, RBAC, audit logs, SLA support, scheduling, SSO

Boundary violations — moving capability (detection, analysis) into the commercial tier — destroy contributor trust and are hard to reverse.

### Contrast: Open Core vs Adjacent Models

| Model | Core Open? | Revenue Mechanism |
|---|---|---|
| **Open Core** | Yes (AGPL/GPL) | Commercial ops layer |
| **Dual-licence** | Yes (GPL) + commercial | Sell commercial licence to avoid copyleft |
| **Open-washing** | No (marketing only) | Proprietary SaaS |
| **Community Edition** | Crippled version | Upsell to enterprise edition |
| **Freemium SaaS** | No | Paid tier upgrades |

## Key Properties
- **Functional boundary:** Core = capability; commercial = operations. Violations destroy trust
- **AGPL enforcement:** Strong copyleft prevents capability-shifting to a closed fork; the "nuclear option" for open core integrity
- **Trust as capital:** Contributor confidence is the intangible asset; it's built incrementally and destroyed suddenly
- **Self-host guarantee:** Any user can fork + self-host the core indefinitely, which anchors the commercial value in operations (convenience, scale) rather than lock-in
- **Contributor alignment:** If detection lands in open repo first, contributors have reason to believe their work won't be monetised without credit

## Relationships
- Related to [[perpetual-fallback-licensing]]: a related strategy where users retain a licence to an older open version if the vendor changes terms; open core provides a structural (not contractual) version of this guarantee
- Related to [[isv-distribution-platform]]: ISVs distributing open core tools often add proprietary ops layers — the same boundary principle applies
- Related to [[device-bound-licensing]]: different monetisation strategy for the same capability (restricts use rather than adding ops layers)

## Applications
- **Security tooling:** Vigolium (AGPL scanner + Cloud Console), Metasploit (community + Pro), Nuclei (open templates + enterprise)
- **Data infrastructure:** ClickHouse (AGPL core + ClickHouse Cloud), Redis (BSD → SSPL transition broke trust), Elasticsearch (Apache → proprietary transition broke trust)
- **Databases:** MongoDB (AGPL → SSPL), Cockroach (BSL), TimescaleDB (Apache → TSL) — all navigating the open core boundary question
- **Evaluating tools:** When assessing an open source tool, identify which licence it uses, where the functional boundary falls, and whether the commercial tier has ever received capability that started in the open repo

## Study
- Flashcards: [[flashcards/open-core-model|Practice this concept]]

## Sources
- [Vigolium: Open-source vulnerability scanner](https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/) — author's first-person explanation of the open core boundary and trust model
- [Vigolium GitHub](https://github.com/vigolium/vigolium) — AGPL licence confirmation

## See Also
- [[perpetual-fallback-licensing]]
- [[isv-distribution-platform]]
- [[device-bound-licensing]]
