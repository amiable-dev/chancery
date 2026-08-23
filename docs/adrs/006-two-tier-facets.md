---
title: "ADR-006: Two-tier facet classification with a scalar/nested-tag mirror"
status: accepted
date: 2026-08-22
tags: [adr, classification, facets]
links: ["005-proposal-queue.md"]
council_review: "2026-08-22 packet 2 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

The inherited corpus carried 298 unique tags across 243 concepts — a power law whose head genuinely classifies (11 tags carry 43% of applications) and whose 159-tag singleton tail is noise. Two failed extremes frame the decision: keep authoring free-text tags (the tail regrows forever) or derive everything and author nothing (which a council recommended — reasoning correctly from a *wrong statistic* I supplied: "1.3 notes/tag" measured across the wrong denominator; the concepts-only figure is 4.3). A 25-note evenly-spaced hand sample then cut the axis force-fit rate from 24% to 4% and the full 216-note run surfaced two domains the sample structurally could not see — sampling validates only the axes it exercises.

## Decision

1. **Two tiers**: closed axes (`domain`, `maturity`, `source_type`) — one value each, enum-validated, extended only via accepted queue proposals; plus a governed open `topics` list with `min_uses: 3` — uses are counted over *accepted* classifications in notes, acceptance is always a queue decision (never automatic at the third use), and a below-threshold topic lives only in the queue, not in note frontmatter. The two tiers serialise differently by design: closed axes are scalar, `topics` is a list; the mirror rule below covers both from the same `facets.yml` authority.
2. **Every value is emitted twice, from one enum**: as a scalar property (drives Obsidian Bases/Dataview and site filtering) and as a mirrored nested tag `domain/x` (drives the tag pane, graph groups, search) — because in Obsidian, nested tags *are* facets. **The scalar is authoritative; the mirror is derived data living inside C1 files** — a declared, bounded exception to "derived layers live outside canon" (data-classification), accepted because Obsidian cannot read a sidecar. The exception is safe only while conformance is machine-checked: `kb verify` cross-checks the mirror (KB012) and `kb facets --apply` regenerates it idempotently; hand-editing either form is a lint failure. No further derived-in-canon exceptions without an ADR.
3. **Judge `maturity` from the note, not from familiarity** — hand-classifying from field knowledge produced 44% `emerging` against a corpus that is measurably 72%; the note-grounded rule is written into the axis definition.
4. **Bulk classification is sample-first**, with worked-exemplar calibration handed to every parallel classifier, and independent-classifier convergence treated as the strongest available signal for axis changes.

## Consequences

- Classification stays useful in *both* consumers (Obsidian and any exported site) with zero **representational** drift by construction — the scalar and its mirror cannot disagree undetected (KB012). Semantic drift (an axis growing stale against the corpus) is governed separately, through the queue.
- Axis evolution is slow and governed — deliberately.
- The denominator lesson is recorded: statistics fed to advisers must name their population.
