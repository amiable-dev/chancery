# Design spec: export integration — mounting into an existing site

**Status:** implemented 2026-08-22 · **ADR:** [008](../adrs/008-interfaces-and-runtime.md) · **Council review:** 2026-08-22 packet 4 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in [`../reviews/2026-08-22/dispositions.md`](../reviews/2026-08-22/dispositions.md)

`kb export` output must mount cleanly into a live site — and must never ship what shouldn't be public.


*Deviations at implementation: superseded notes ship as manifest `redirects` entries (the consuming site wires them), never as stub pages; the mount test validates the transformed tree's properties statically — a full Docusaurus build fixture is deferred to the consuming site's own CI, where it belongs.*

## The publication filter (first, because it gates everything)

Exports ship **C1 notes only, and not all of them**: superseded stubs render as aliases/redirects to their successor, never as pages; `status` filtering via `--include-status` (default: every non-superseded C1 note). **C3–C6 never ship** — staging, queue, evidence, assessments, the log, `maintenance/` reports: these contain unreviewed inflow, contested findings, and supplier records about the owner's own corpus. The filter is **verify-checked** (KB021: export tree containing an excluded path or unfiltered stub fails), and export output is **never canon and never re-ingested** — a site-side edit to the exported tree is a defect, not a fork (SCOPE §4.3).

## Command surface

```
kb export docusaurus --out DIR --base-path /kb --id-prefix kb/ [--merge-tags --host-tags FILE]
kb export mkdocs     --out DIR [--base-path …]
kb export json       --out DIR        # presentation-free: no facet flattening, no H1 handling;
                                      # its own versioned schema with a stability guarantee
```

One transform layer for the *site* renderers (wikilink resolution, facet flattening, H1 handling, manifest); the JSON renderer is a separate contract that preserves source structure. Per-renderer flag applicability is tabulated in the implementation; an inapplicable flag (e.g. `--merge-tags` on mkdocs) is an **error**, not a no-op.

- **Link rewriting, enumerated**: aliases resolved via the index; anchors preserved; relative markdown links resolved; images/assets copied and rewritten; external URLs untouched; output URL-encoded; an unresolved wikilink renders as plain text and lands in the export report as a recorded gap. `--id-prefix` is **required for mounted exports** (default `kb/`), with post-prefix collision detection.
- `--merge-tags` takes an explicit `--host-tags <file>` input and writes the merged result **inside `--out`** — never outside. A conflict exits non-zero with a structured report; since this repo's CI runs export as a build check, a conflict fails that check.
- `--out` safety: refuses paths inside canon directories or `.git`, resolves symlinks before writing, builds to a temp dir and atomically replaces — no partial trees, no route around the write gate.
- `kb-export-manifest.json` hashes **rendered outputs** (not sources — a transform change must dirty the manifest) and embeds transform/renderer/config/schema versions. Determinism pins the environment: LF endings, 0644 modes, C-locale collation, sorted directory walk, no absolute source paths in artifacts.

## Delivery: pull, pinned from day one

The consuming site's CI checks this repo out **at a pinned tag or SHA** and runs the export in its own build — pinning is one line of site config and is what keeps the integration diff reviewable; unpinned `main` was the reviewed defect. The trade is named: a public repo removes the read-credential question and **creates a supply-chain one** — the host's CI executes this repo's exporter, which is precisely why it pins and bumps deliberately. This repo's CI runs the export as a build check only; publishing is the site's job.

## Acceptance

- **Mount test** (fixture host site, pinned npm deps, offline cache): links resolve under `/kb`, no id collisions, tags merged with a reported conflict — plus an mkdocs fixture and a JSON schema-stability test.
- Publication filter: fixture tree with a staged note and a superseded stub ⇒ KB021 both-polarity.
- Manifest: transform-version bump alone ⇒ manifest diff. Determinism: two runs byte-identical.
- Non-goals: hosting; building the site; per-page authoring metadata beyond frontmatter.
