---
title: "ADR-012: The doc site — MkDocs Material behind the publication gate"
status: accepted
date: 2026-08-23
tags: [adr, docs, site, packaging]
links: ["002-ci-is-the-contract.md", "011-toolchain-and-productionisation.md", "../design/export-integration.md"]
council_review: "2026-08-23 packet 6 (REJECT) — rewritten; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

chancery.dev serves a one-page placeholder; the project needs a documentation site that enables users, in the mould of llm-council.dev. The tooling decision sits at the intersection of four facts:

1. **The design handoff prices one option far below the others.** `design_handoff_chancery_brand/` ships production MkDocs Material artifacts — `extra.css` written against Material's scheme tokens (the one genuinely non-portable asset), logo/favicon SVGs (portable), an `mkdocs.yml` snippet, and hi-fi prototypes framed as "recreate in MkDocs Material". The prototypes are recreated within the target's layout *whichever* generator is chosen; what Material uniquely inherits is the finished token layer. A design artifact does not bind an engineering decision — it changes the price of one.
2. **Family consistency**: llm-council's site is MkDocs; the brand explicitly continues that family's language.
3. **The exporter should eat here**: the mkdocs renderer is the least-exercised of the three; mounting the corpus through it makes this repo the renderer's first standing consumer.
4. **The toolchain rule**: ADR-011 §1 made the toolchain Node-only. Python already runs in one governed workflow (zizmor via pinned uv, ADR-011 §4) — but as a read-only scanner. A site build is a *pipeline that ships a public artifact*, which is a genuinely wider carve-out and is recorded as an **amendment to ADR-011 §1** (its text now carries the clause): *non-Node toolchains are permitted in individual workflows when pinned by a committed, hash-checked resolution and kept out of the gate path; the gate itself remains Node-only.*

## Options considered

Docusaurus (Node-native, our richest renderer; loses on the token layer and family consistency, and adds the largest dependency tree of the candidates — an observation as of 2026-08, not a permanent claim) · Astro Starlight (same recreation cost, no family precedent) · extending the hand-rolled placeholder (cannot carry structured docs, search, and a mounted corpus without becoming a bespoke generator). **MkDocs Material accepted**, under the constraints below.

## Decision

1. **MkDocs Material, resolved and frozen.** `site/requirements.txt` states the direct pin (`mkdocs-material==9.7.7` at adoption); the committed, hash-checked **`site/requirements.lock`** (uv-compiled, every transitive pinned, interpreter pinned by `site/.python-version`) is what installs — `uv pip install --require-hashes`. A transitive bump can only arrive as a diff. Dependabot's `pip` ecosystem watches `site/` (stanza added with this ADR); a bump PR regenerates the lock in the same change.
2. **Repo structure and classes, stated precisely**: `site/docs/**` is authored site source — versioned canonical *site* content, outside `kb verify`'s collections but inside its own check (the strict PR-time build, below). The subtree `site/docs/kb/**` is **C7 derived output**, gitignored, wholly owned by the exporter, deletable at will; no authored file may live under it. Root `docs/` (ADRs, specs, reviews) is **not duplicated into the site** — the site's architecture section links to the repository, which remains the single home of governance documents.
3. **The corpus mounts through our own exporter** — exact commands, not gestures:
   ```
   npm ci --ignore-scripts
   node .kb/bin/kb.mjs export mkdocs --out site/docs/kb --format json
   ```
   Navigation needs no plugin and no generated YAML: the nav carries **one static entry — the exporter's generated concepts index page** — and the tree is navigated through it. The exporter builds to a temp directory and atomically replaces the output (export-integration), so stale pages from withdrawn notes cannot survive a rebuild. **Withheld targets cannot dangle by construction**: the renderer's link rewriter only links slugs present in the shipped set; anything filtered or unresolved renders as plain text — a recorded gap, not a 404 — and `mkdocs build --strict` enforces the rest.
4. **The publication gate — the finding this rewrite exists for.** The pages workflow is a publishing interface for corpus content; invariant 8 applies to it like any other. The deploy therefore runs, on the exact deployed SHA, in order: **`kb verify`** (which includes KB021 over the mounted tree — the checker scans `site/docs/kb` as well as `docs-site`) → the locked export → **`mkdocs build --strict`**. Any failure stops the deploy; the previous site stays up. A **PR-time twin job** (no `pages: write`, fork-safe) runs the same three steps on every PR touching `site/**`, `concepts/**`, or `.kb/**`, so a bad config, a broken exporter change, or a dependency bump is caught before `main`. What ships is the C1 non-superseded tier — the widest distribution channel this project has consumes the same filter as every consumer, and now *proves* it in-run rather than assuming it.
5. **Brand implementation**: `extra.css`, `logo-mark.svg`, `favicon.svg` copy verbatim; from the handoff's `mkdocs.yml` snippet the theme block (name, logo, favicon, fonts, palette schemes) is adopted verbatim and nav/repo/extensions are adapted — the snippet is a theme spec, not a site inventory. Fonts load by two deliberate mechanisms, one per family: Material's font config (IBM Plex) and the CSS import (Space Grotesk) — both from Google Fonts, a declared third-party runtime dependency of the public page. Landing interactions (`landing.js`) are progressive enhancement with `<noscript>` fallbacks — and the "gate terminal" is **labelled an illustrative transcript** in the UI: a site whose premise is deterministic honesty does not present simulated output as capture. (Generating it from a real captured failure is the recorded upgrade path.)
6. **Security posture of mounted content, stated**: no HTML sanitiser runs. The trust boundary is the gate itself — corpus content is reviewed, canon-only material that entered through envelope-bound applies; raw HTML inside it would be a reviewed artifact. If inflow trust ever widens (external PR-contributed notes), sanitisation becomes a precondition of the mount, not an option.
7. **Packaging**: the npm tarball is closed over the `files` allowlist — the package suite asserts **closure** (every shipped path must fall under an allowlisted prefix), so `site/` and any future directory are excluded without anyone remembering to test for them. The negative assertions for `site/` and the design pack exist as belt-and-braces; the closure test is the guarantee. (Tests live in `.kb/test/package.test.mjs`, shipped with this ADR.)
8. **Local preview is supported and synchronized**: `uv pip install --require-hashes -r site/requirements.lock && mkdocs serve -f site/mkdocs.yml` after an export — the same frozen environment CI builds with. "Confined to workflows" describes the *gate's* exposure, not a prohibition on contributors.

## Consequences

- The one interface that writes corpus content to the public internet now runs the contract before every publish — at PR time and deploy time — closing the gap the review named as the packet's most important miss.
- Python's footprint is exactly enumerable: `site/requirements.{txt,lock}`, `site/.python-version`, two workflow steps, one dependabot stanza — and none of it reachable from the gate.
- Revisit triggers: adopting any nav/site plugin beyond Material, or any Material-Insiders-only feature, reopens the tooling half of this ADR; docs versioning (`mike`) is evaluated when the CLI reaches 1.0.
- ADR frontmatter dates are documentary (ADRs live outside the corpus and its invariant-6 rule) — stated here once so the exception is deliberate.
