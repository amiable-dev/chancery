# Chairman's Consolidated Review — PACKET 6

## docs/adrs/012-doc-site-tooling.md

**Verdict: REJECT**

The tooling *choice* (MkDocs Material) survives review on the family-consistency and dogfooding arguments alone. The *document* does not: it asserts at least three things that are false against the repo as it exists, marks itself `accepted` before its own review closes, and leaves the mechanism of its single novel claim — the mounted corpus — unspecified in the one place it must be exact. Re-issue as `proposed` with the blockers closed.

---

### Findings

**1. [BLOCKER] Frontmatter is self-contradictory: `status: accepted` with `council_review: pending (packet 6)`.**
This document *is* packet 6. An ADR cannot be `accepted` while the review that accepts it is pending. Either the status field is meaningless across the whole ADR set, or this is `proposed` until the packet closes. Fix the field, not the review.

**2. [BLOCKER] "The second runtime is confined to one workflow and one pinned package — visible in exactly two files (`site/requirements.txt`, `pages.yml`)" is factually wrong.**
Python/`uv` is already in this repo: the security workflow runs zizmor via SHA-pinned `setup-uv`. So this is the *second* Python surface, not the first, and it lives in at least three files (plus `dependabot.yml` and `.gitignore` per findings 9 and 3). This matters beyond pedantry twice over: (a) the ADR's entire cost framing ("a second runtime must not leak into the gate") is built on a boundary it mis-measures; (b) it forgoes the stronger *true* argument — ADR-011 already tolerates per-workflow Python, and zizmor is the named precedent that §1 gestures at ("the same shape ADR-011 §4 uses for public-gated scanners") without naming. State the precedent; correct the file count.

**3. [BLOCKER] "MkDocs Material, pinned exactly" / "one pinned package" does not follow from `mkdocs-material==9.7.7` in a bare `requirements.txt`.**
`mkdocs`, `markdown`, `jinja2`, `pymdown-extensions`, `pygments`, `babel` and the Python interpreter itself all float. A transitive major bump reddens the deploy with no repo change — and the deploy is currently the *only* place the site is ever built (finding 5). Commit a `uv.lock` or hash-checked compiled requirements, install with a frozen mode (`uv sync --frozen` / `--require-hashes`), pin the interpreter, or delete the words "exactly" and "one pinned package."
*(Note for the record: the council rejects the stronger claim advanced by one reviewer that `9.7.7` is an invented version — that is unknowable from the packet. What is required is that the pin be recorded as resolved, with the resolution artifact committed.)*

**4. [BLOCKER] §6's deploy pipeline is ungated — `kb verify` appears nowhere.**
The step list is "checkout → Node for the exporter → uv for MkDocs → build → deploy." The ADR is meticulous that Python must never touch the gate and careless that the gate never reaches the deploy. §3 makes `pages.yml` a *publishing interface for corpus content*; SCOPE §4 invariant 8 ("writes go through the gate on every interface") and the standing contract ("`kb verify` in CI is the contract") both bite here. Worse: the publication filter is **verify-checked** (KB021), so this workflow exports while trusting filter state that verify never confirmed *in that run or on that commit*. Require `kb verify` on the exact deployed SHA before export, or make `kb export` refuse on a corpus that fails verification, and say which. A Pages workflow that can fire independently of CI can publish while verification is red.

**5. [BLOCKER] The corpus mount has no navigation mechanism.**
§3: `kb export mkdocs --out site/docs/kb` output is gitignored and "the nav exposes it as the Knowledge Base section." MkDocs `nav:` is static YAML; a regenerated, gitignored tree of unknown filenames cannot be hand-enumerated there, and hand-maintained entries will dangle as notes are added and withdrawn. The available fixes each cost something the ADR has not paid: exporter emits a nav fragment / `.pages` files, build-time nav generation, or a plugin (`awesome-pages`, `literate-nav`) — which breaks "one pinned package" (finding 3). Name the mechanism. As written the deploy either omits the corpus from nav or fails.

**6. [BLOCKER] KB021 × invariant 7 = dangling published links, unaddressed.**
Invariant 7 makes internal citations *navigation*, so published notes will routinely link to notes the publication filter withholds. §3 says the filter "governs what ships exactly as it does for any consumer" and stops there. Nothing states whether the mkdocs renderer rewrites, stubs, or drops filtered targets. Under `mkdocs build --strict` (which a docs site should use) these fail the build; without `--strict` they ship as 404s on chancery.dev. This is precisely the class of defect the "the exporter should eat here" argument was written to surface, and the ADR skips it.

**7. [SHOULD-FIX] No PR-time site build; deploy-only validation.**
Nothing builds the site before `main`. A bad `mkdocs.yml`, a broken exporter change, a dangling citation, or a Dependabot bump is discovered in production. Add a required build-only job (no `pages: write`; fork-PR safe) running the locked export plus `mkdocs build --strict` — strict because MkDocs exits 0 on warnings such as dead links and orphaned nav entries, exactly the failure mode a dynamically mounted corpus invites. Also unstated: workflow `permissions`, `concurrency`, and whether exporter failure fails the deploy or silently ships the previous site.

**8. [SHOULD-FIX] Export output has no cleanup or failure semantics.**
"Export output is gitignored and rebuilt every deploy" does not guarantee *replacement*. Specify a clean/atomic output directory and fail-closed export, plus an assertion that no stale files survive — otherwise a note withdrawn from the publication tier can remain live on the public site.

**9. [SHOULD-FIX] The Dependabot claim asserts configuration that does not exist.**
"so dependabot's `pip` ecosystem bumps it like every other pin" — there are no other pip-ecosystem pins (zizmor's lives inside a workflow, which the pip ecosystem does not manage). This is the repo's first `requirements.txt` and requires a new `dependabot.yml` stanza (`package-ecosystem: pip`, `directory: /site`); if you adopt a lock per finding 3, support differs again. Make the config change part of the decision or drop the sentence.

**10. [SHOULD-FIX] The exporter step is not executable as specified.**
§3 gives a command; §6 gives only "Node for the exporter." Missing: `npm ci`, any build step, the supported-LTS Node version inherited from ADR-011, and invocation of the *repository-local* binary (`kb` is not on `$PATH` on a fresh runner) with no `npx` network fetch. Write the exact command path.

**11. [SHOULD-FIX] "only inside the pages workflow" forbids local preview, which §5 requires.**
Recreating three hi-fi prototypes inside Material's layout and verifying scheme-aware token overrides is impossible without `mkdocs serve`. Contributors editing `site/docs/*.md` need Python, uv, Material, and a built exporter locally. The containment claim is true of CI only. Say whether local preview is supported (and how it stays in sync with the pinned environment) or explicitly unsupported.

**12. [SHOULD-FIX] "canon-adjacent documentation" is not an actionable category, and `site/` becomes an ungoverned third class.**
Invariant 3's ontology is canon or derived-rebuildable. §2 invents a third state — versioned, not corpus, outside `kb verify` — and §3 then nests derived output *inside* it. State the rule precisely: `site/docs/**` is canonical site source **except** the derived subtree `site/docs/kb/**`, with ownership and deletion rules for each. Relatedly, nothing says whether root `docs/` (ADRs, design docs) is duplicated, exported, symlinked, or absent from the site — the exact drift that kills doc sites.

**13. [SHOULD-FIX] The publication tier and its negative assertion are unnamed.**
"governs what ships exactly as it does for any consumer" — the public web is not "any consumer"; it is the widest distribution channel this project has. Name the tier the mount consumes and add an assertion on the *built* artifact that no non-public note content appears under `site/`. Right now the mount's honesty rests on a reference.

**14. [SHOULD-FIX] Mounted markdown plus same-origin JS is an unaddressed active-content boundary.**
§3 renders corpus markdown into a site that §5 also loads custom JavaScript into. Python-Markdown/MkDocs can pass raw HTML through; KB021 is described as a *publication* filter, not a sanitiser. State the threat model — even if the conclusion is "all corpus content is reviewed repo content, no sanitisation required" — and if raw HTML is permitted, say what is stripped (`<script>`, event attributes, `javascript:`/`data:` URLs, iframes).

**15. [SHOULD-FIX] Packaging assurance is stated in the present tense and tested in the weak form.**
"Packaging exclusion, stated and tested… The package suite asserts both exclusions." Two negative assertions only catch the two directories you thought of. An allowlist is properly tested by snapshotting the *entire* tarball file list as an equality assertion, so any future directory is caught. Name the test file, and mark clearly whether it exists today or this ADR mandates it.

**16. [SHOULD-FIX] "The design handoff is the binding input" is overreach.**
A design artifact cannot bind an engineering runtime decision; at most it *prices* one option. As written, the choice is declared foreclosed before the options section runs, which makes the options section theatre. The honest framing is: the handoff makes Material materially cheaper.

**17. [SHOULD-FIX] The differential cost against Docusaurus is overstated by the ADR's own §5.**
Context §1 says other generators mean "reimplementing a finished, high-fidelity design," but §5 concedes the prototypes "are references recreated within Material's layout" — that recreation happens either way. The genuinely non-portable asset is `extra.css` (Material scheme tokens); the SVGs are portable. Restate it; family consistency and the mkdocs-renderer dogfooding argument carry the decision without the inflation. Likewise "its dependency tree is the heaviest of the three" is an unmeasured mutable claim — cite a snapshot or drop it.

**18. [SHOULD-FIX] Custom-domain and placeholder migration are asserted, not specified.**
§6 says "same custom-domain settings" while replacing the placeholder's artifact layout with MkDocs `site/` output. State where the domain binding lives (repo Pages setting vs a `CNAME` authored into `site/docs/`) and what happens to the existing placeholder page and its URL. If the binding is file-based and the file is not carried over, the first deploy drops chancery.dev.

**19. [SHOULD-FIX] The handoff's `mkdocs.yml` snippet disappears between Context and Decision.**
Context §1 lists it among the production artifacts; §5's verbatim-copy list is only `extra.css`, `logo-mark.svg`, `favicon.svg`. State which parts of the snippet are copied verbatim (theme, palette, fonts, extensions) and which are adapted (nav, `repo_url`, plugins) — otherwise "binding input" is half-honoured.

**20. [SHOULD-FIX] Gear 2 scope friction in §5's landing page, and the "gate terminal" specifically.**
SCOPE says no product claims, first user is the owner's research programme; §5 ships "quickstart tabs, gate terminal, two-phase stepper." A quickstart is documentation; a hand-authored terminal *simulating* CLI output on a site whose entire premise is deterministic honesty is fabricated evidence — and unnecessary, because a deterministic CLI's transcripts are capturable and refreshable in CI. Either generate the terminal content from real captured output, or cut it.

**21. [NIT] Undefined internal references.** "C7 discipline" (§3) is a bare unlinked ID — unnavigable now, and worse once mounted publicly; if it means invariant 3, cite SCOPE §4. `links:` includes `008-interfaces-and-runtime.md`, which the body never uses, while the body cites ADR-011 §1 and §4 undifferentiated.

**22. [NIT] Landing-page JS has no degradation contract.** No keyboard/focus/ARIA, reduced-motion, or no-JS behaviour for tabs and stepper. Material degrades gracefully; `landing.js` should be stated as progressive enhancement.

**23. [NIT] Font loading is specified twice.** "Material's font config + the CSS's Space Grotesk import" are two mechanisms; pick one, and decide explicitly between self-hosting and a third-party font host (the latter is an undeclared runtime dependency on a public page).

**24. [NIT] The gitignored `site/docs/kb` silently swallows any authored file saved into it.** Add a negation pattern or use a distinct mount root.

**25. [NIT] No revisit trigger, exit path, or versioning position.** Nothing says under what condition Material is abandoned (e.g. the handoff turns out to require Insiders-only features, or nav forces a third plugin), and nothing states whether docs versioning (`mike`) is needed as the CLI versions ship.

**26. [NIT] `date: 2026-08-23` needs a stated convention.** Invariant 6 forbids unverifiable world-time metadata in the corpus; ADRs are outside the corpus, so this is almost certainly fine — but say so once, so the exception is deliberate rather than incidental. *(The council notes the minority reading that treats this as an invariant-6 violation is a stretch.)*

---

### Cross-document contradictions

**27. [BLOCKER] ADR-012 §1 vs ADR-011 §1 (Node-only toolchain, supported-LTS enforcement).**
ADR-012 introduces a Python runtime into a governed workflow and a `requirements.txt` into the repo, and justifies it by *analogy* — "the same shape ADR-011 §4 uses for public-gated scanners." But that carve-out (as invoked) covers a read-only scanner; this extends it to a pipeline that *builds and ships the public artifact*. "The boundary is per-workflow" is a new rule, not a restatement of the old one. Record ADR-012 as amending/refining ADR-011 §1 with the exact clause text, or ADR-011 now reads as false. Separately, §6's "Node for the exporter" step does not visibly inherit ADR-011's supported-LTS enforcement.

**28. [BLOCKER] ADR-012 §3 vs export-integration / KB021.**
"the publication filter (KB021) governs what ships exactly as it does for any consumer" asserts an equivalence between a public-web consumer and every other consumer without citing KB021's actual tier semantics — and, per finding 6, without addressing what the filter does to the internal citations invariant 7 guarantees. The referenced design doc is being made to carry corroboration it may not contain; under invariant 7 that reference is navigation, not proof.

**29. [SHOULD-FIX] ADR-012 §2 vs SCOPE §4 invariant 3.**
Authored site pages are placed outside `kb verify`'s collections while derived export output sits beneath the same tree — a category invariant 3 does not name (see finding 12). Either bring authored site pages under some check (a strict build with link checking is the minimum) or state explicitly that they are outside the gate and argue why that is safe for a public surface.

---

**Most important thing MISSING:** an executable, commit-pinned publication gate — `kb verify` on the deployed SHA, then a locked clean export, then `mkdocs build --strict` proving zero dangling citations after the KB021 filter, with the nav-generation mechanism named — run at PR time as well as deploy time; as written, the one interface that writes knowledge-base content to the public internet is the only interface this ADR leaves ungated.