# Packet 7 — council review of ADR-013 (Graft-informed adoptions)

*2026-08-24 · reasoning tier · consolidated synthesis, verbatim. Dispositions in [dispositions.md](dispositions.md).*

# COUNCIL PACKET 7 — Consolidated Review of ADR-013

**Chairman's summary of council position.** The ADR's spine is right: adopt mechanisms, not ontology; instrument before building; keep the gate's properties intact. The council is unanimous on one substantive finding — **D1 fixes an algorithm in the same document that builds the instrument meant to choose it, and the algorithm it fixes is the one least suited to the graph we actually have.** Beyond that, the review found two defects the ADR does not know it has: a metric-validity error in D2 (required-concept labels cannot compute precision), and a clock-nondeterminism bug in D5 that will break CI on day one in a project whose motto is "CI is the contract." D3 needs a verification rule to make "verbatim" mean anything. D4/D5 are directionally right but need presentation discipline; a minority would reject them.

---

## 0. Structural objections (before the decisions)

**Bundling.** ADR-013 declares itself "the decision of record for all six" items of different kinds: D1 designates a destination, D6 arms a tripwire, D3 carries a schema migration, D2/D4/D5 are builds. D1 is the most likely to be superseded — by the ADR's own execution order it is built *last*, after the instrument that should inform it. Amending it later will require disentangling it from a migration that has already shipped. **Recommendation: per-decision `status:` fields, or split D1 and D3 into their own ADRs.**

**Self-sealing rationale.** The Consequences section claims "a future 'why not embeddings' debate has its answer on file." An ADR should record an argument *and its rebuttals*, not pre-write the verdict of a debate it also declares closed. All three of D1's embedding claims are contestable (§5).

**Over-claim.** "The tripwire finally has an instrument" is too strong. D2's queries and labels are written by the same person who built the corpus, so the eval is *structurally blind* to retrieval misses of concepts the curator never connected — precisely the failure class D1's rejected alternative addresses. State that limitation in the ADR.

---

## 1. D1 — Personalized PageRank over a curated graph

**The pattern transfers; the algorithm does not.** Lexical seed → graph expansion is the correct fix for vocabulary mismatch (a concept whose text doesn't match the query but sits one hand-judged link away). PPR itself is imported from graph conditions that are the inverse of ours. Graft uses PPR as a *statistical smoother* over dense, noisy, machine-derived call graphs. Chancery's graph is sparse, small, and intentional, and its edges carry meaning that PPR discards.

Mechanical failure modes, in rough order of severity:

**(a) Out-degree normalization inverts the curatorial signal.** PPR divides a node's mass among its out-edges. In a call graph, out-degree is a property of the code. In a hand-judged corpus, out-degree is a property of *curatorial attention*: a well-elaborated concept with 20 typed links passes 1/20 to each neighbour; a stub with one link passes everything. You have built a ranker that penalizes the concepts you worked hardest on as sources.

**(b) Edge-type blindness at exactly the wrong stage.** A single transition matrix flattens `refutes`, `depends-on`, `specializes`, `contrasts-with` into adjacency. A query about X returns its refuters ranked identically to its supports. For a governance KB that is worse than lexical-only, because it is confidently wrong. Typed, clause-carrying links are the corpus's whole differentiator, and vanilla PPR ignores them.

**(c) Small-graph mixing.** At n≈212 (even n≈2,000), d=0.85 implies expected walk length ~6.7 hops — at or beyond the graph's diameter. The walk mixes before the personalization vector can assert itself and scores collapse toward smoothed degree: every query returns the same governance/evidence/CI hubs. The fix is aggressive restart (d≈0.5, ~2 hops) — at which point **PPR and bounded spreading activation are the same machine with different bookkeeping**, which dissolves the ADR's own framing of PPR as a distinct destination.

**(d) Undirected degeneration.** If backlinks are materialized or reciprocal links are a curation convention, the effective graph is undirected, and PPR becomes degree-weighted proximity to the seeds — weighted BFS with extra steps, worse explainability, and a convergence tolerance to argue about. The spec must state that traversal uses stored link direction only.

**(e) Hub domination and reciprocal-link inflation** follow from (c) and (d). Ontology hubs (`judgment`, `evidence`, `gate`) are linked from nearly everywhere; answers regress to the corpus's table of contents. In a sparse graph a 2-cycle or small clique traps mass between seed and partner.

**(f) Facet blindness.** Multi-facet hubs leak mass symmetrically across all facets. Mitigations (type-gated traversal, post-walk lexical re-rank) are unspecified.

**(g) Recency de-ranking — the bias nobody named.** The least-linked concepts are the newest judgments. A graph-rank stage structurally buries the most recent entries in a live governance record.

**(h) "Deterministic" is asserted, not specified — and the ADR is internally inconsistent.** Power iteration's output depends on iteration count, epsilon convergence, floating-point summation order, and tie-breaking. **D1 rejects embeddings for nondeterminism across versions while adopting an iterative numerical method whose determinism it never pins.** At this scale a *finite, truncated k-step* walk (k≈3) is exact, cheap, and equals spreading activation — the determinism problem disappears. If PPR survives at all, it needs fixed iteration count (not epsilon), canonical summation order, score rounding, and tie-break by concept ID, or `kb verify` flips near-ties on a different runner.

**(i) Explainability.** D4 exists because "recording without rendering leaves the legibility argument half-made." A PPR float cannot be explained to a reader. Bounded typed traversal with retained paths yields "ranked 3rd: two hops from seed A via `depends-on` → `refines`." For this project, path-explainable ranking is not a nicety; it is the thesis.

**Required change.** Reword D1 to designate the *architecture* (lexical seed + deterministic typed graph expansion, no network, no model in read path) and **strike the commitment to personalized PageRank**. Make the rank function a pre-registered bake-off adjudicated by D2: (1) lexical-only + aliases as the null hypothesis the graph stage must beat; (2) BM25 + bounded k-hop typed decay; (3) BM25 + typed spreading activation; (4) typed/directed PPR. Prefer the simplest method within a declared tolerance of the best. Additionally require: per-type weights as **declared, versioned, diffable data** (not engine constants); reciprocal-rank fusion with a lexical-only channel so the graph can never fully swamp a correct-but-orphaned answer; a "no free hubs" rule (promotion requires a lexical match or a clause match on the traversed edge); refutation-awareness as an explicit output requirement.

Finally: **seed quality dominates at this scale.** Field-weighted BM25 over titles/definitions/tags plus a curated alias table will move recall more than walker choice.

---

## 2. D2 — Gaming, metrics, and gating posture

**The measurement defect first.** D2 specifies queries "labeled with required concepts" and then claims "deterministic precision/recall." A required-concept list supports coverage and recall; **it cannot support precision** unless every returned non-required concept has also been judged irrelevant — otherwise relevant-but-not-required results count as false positives. Fix: exhaustive or graded qrels over a *pooled* candidate set, where the pool is the union of outputs from lexical-only, BFS/spreading, PPR, and any challenger, so the labels do not privilege the incumbent ranker.

**Three live gaming vectors when one person curates, queries, labels, and tunes:**

1. **In-distribution vocabulary.** Author-written queries use corpus terms of art, so lexical-only posts near-perfect recall and the eval set *certifies that the graph stage is unnecessary*. That is a tautology, not a measurement. Require an explicit **vocabulary-mismatch subset** — queries whose required concepts share little or no lexical overlap with the query. That subset is the entire justification for D1's graph stage.
2. **Label circularity.** Labels assigned by someone who knows the link topology encode the graph, so graph-rank looks good by construction. Document a label protocol: label from the question, before consulting current topology.
3. **Tuning overfit.** ~50–100 queries against a handful of parameters is enough to Goodhart. Keep a sealed holdout never used for tuning.

**Controls, using machinery Chancery already has:**

- **Query provenance as a required field** (council packet, issue thread, external reader, MCP transcript), with metrics reported *split by provenance class* and synthesized-from-corpus items discounted. Harvest questions; don't invent them. The append-only log is the natural out-of-distribution source and goes unmentioned.
- **Eval labels routed through ADR-010's two-phase machinery** with a supplier class. This buys the anti-gaming property for free: the log proves the label predates the ranker commit, and a label edited after a failing run becomes a visible, rationale-bearing amendment. Track **`label-edits-after-failure` as a first-class metric** — it is the gaming detector.
- **Anti-labels** ("must NOT return") — these instrument D1's hub-domination failure directly — and **no-answer queries** where the correct behaviour is silence. Without them the eval rewards recall-maximizing dumps.
- **Label staleness policy:** store corpus-version-at-labeling; new concepts silently invalidate old recall labels.
- **Statistical honesty:** at n≈20–50, scalar deltas are noise. Declare a minimum item count and a noise band, and review the per-item pass/fail diff between runs, not the aggregate.
- **Slice reporting** by concept popularity, graph component, query type, and facet dependence, so aggregate gains cannot conceal hub bias.

**Posture.** Non-gating is right now, for three reasons the ADR doesn't state: the metric is unstable at small *n*; the system it measures (D1) doesn't exist; and **early gating makes adding a hard query a CI-breaking content PR**, so contributors rationally stop adding hard queries and the set atrophies into permanent greenness. But "tracked for regression" with no obligation to look is decoration. **Gate the hygiene immediately** — schema-valid items, unique IDs, labels present, harness executes deterministically across platforms, results committed as a tracked artifact. That is a real CI contract today and costs nothing.

**Promotion trigger to score-gating,** pre-declared now: (i) ≥50 items with ≥50% externally-provenanced across ≥2 authors; (ii) pooled/exhaustive labels adequate for the metric being gated; (iii) an established noise band from repeat runs; (iv) at least one demonstrated true-positive red (proof the set can fail); (v) baseline stability across *substantive corpus revisions*. Then gate as a **ratchet on the sealed subset** — no regression below (baseline − noise band) — arriving *with* D1's build, never before, with a logged waiver path.

**One more defect:** the SCOPE tripwire's "measured recall degradation, two consecutive months" is meaningless as written. Re-running a deterministic engine on a fixed fixture for two months produces no new evidence. The tripwire must key to *what changed* — corpus revision, query cohort, or ranker — against a pinned baseline, and the ADR must say where eval results are recorded, or the longitudinal signal is unenforceable.

---

## 3. D3 — Crux excerpts

**Copyright: defensible in practice, but not for the reason the ADR implies.** There is no quantitative safe harbor, and one council member's confident "highly defensible under fair use / transformative by nature" is doctrinally wrong. Worse, **D3's selection criterion is the *load-bearing* passage — which is by construction the "heart of the work,"** the factor that decided *Harper & Row* against a ~300-word taking from a 200,000-word manuscript. Epistemically the right rule; legally the worst one. Attributed quotation-scale extraction for critical/scholarly purpose with no substitution effect still makes this workable, but the bound must be qualified:

- **License enum per source,** with class-dependent rules: public-domain/CC may relax the bound; all-rights-reserved holds it; **paywalled or contractually-licensed material (standards bodies, subscription databases) is the real hazard** because terms of use bind beyond copyright. Add a `crux: withheld-license` state storing locator + hash but no text.
- **Proportionality floor:** 500 chars of a 700-char abstract, an aphorism, or a poem is most of the work. Lesser-of rule; flag short works for manual judgment.
- **Per-*work* aggregate cap enforced by `kb verify`.** Twelve concepts each quoting 500 chars of one book is 6,000 assembled characters. The per-item bound cannot see this; a mechanical check can. This is exactly the class of check the project exists to run.
- **Contiguous spans only** (no stitched fragments — misquotation is a worse trust failure than over-quotation), plus a locator and mandatory attribution wherever the excerpt renders.

**Staleness: yes, a real gap the evidence hashes do not cover — and the ADR's own architecture already contains the fix.** The C5 hash pins the source *blob*; a crux string floating in mutable frontmatter has no integrity relation to it. The dangerous case is not a dead link but a *healthy-looking* one: source revised, hash differs, and the stored quote — possibly corrected, retracted, or never present — renders as a live attributed quotation.

Required changes:

1. **Store the crux as a content-addressed object** in the evidence store; frontmatter holds pointer + hash. Hand-edited drift then becomes detectable by `kb verify`.
2. **Deterministic substring-containment validation at apply time:** the proposed crux must be a byte-substring of the pinned source blob. This is a pure rule, fits the two-phase supplier model exactly, and closes the worst hole in D3 as written — **a model supplier paraphrasing or hallucinating a "verbatim" passage, which nothing currently catches.** Without it, "verbatim" is an unverified claim in a system built on rule-verified claims. *Caveat:* this presumes the C5 store retains bytes, not only hashes. If it retains only hashes, say so plainly — then containment can only be checked at fetch time by an out-of-gate `kb refresh`, and D3's survivability claim ships with no offline mechanical re-check ever.
3. **Fields:** `crux_hash`, `crux_source_hash` (evidence hash of the version it came from), `crux_captured_at`, `crux_locator`. `kb verify` computes a tri-state: **verified** (current artifact hash == `crux_source_hash`), **unverifiable** (dead / `dead-no-archive`), **contested** (artifact present, hash differs, crux not re-confirmed). Re-fetch creates a new verification event; it must never silently overwrite the historical crux.
4. **A crux must never upgrade a citation's verification status.** `kb support`'s quote-binding must distinguish "bound to stored excerpt, as of D" from "bound to live source," or D3 launders unverifiable claims into verified-looking ones — raising apparent trust faster than actual trust.

---

## 4. D4/D5 — Where rendering can weaken the trust story

The ADR's premise — "recording without rendering leaves the legibility argument half-made" — is correct and worth defending. **Council note on dissent:** one member voted REJECT on both D4 and D5 (badge fatigue; "epistemological validity is not chronological"). The majority holds that the reasoning offered supports presentation discipline rather than deletion, and that collapsing to a binary verified/unverified badge (that member's D4 remedy) *destroys* exactly the distinctions the record already holds while asserting a trust hierarchy the records don't license. The dissent is recorded; the fixes below are presentation-layer.

**D4 — three ways it backfires:**

- **Badge fatigue is the default, not a risk.** Graft's solid/dashed carries *one binary*, rarely shown. D4 imports the idiom for a 4-valued supplier class × provenance class × override boolean. Line style cannot carry that; you get dash-plus-dot-plus-colour and a legend nobody reads (and both dash patterns and colour fail accessibility). **Render exceptions, not states:** declare a house norm ("human-judged, current, no override") and mark only departures. One idiom per axis; full detail on drill-down; a machine-readable data attribute and accessible text label, not colour alone.
- **The naming asserts what the records don't license.** Supplier class is a *provenance* axis, not a trust axis — a careless human judgment is not better than a well-supported model-panel one, and a panel may contain correlated suppliers. **Rename to provenance-graded rendering.** Attach any *quality* claim to review status (owner-reviewed / council-reviewed / test-covered).
- **Laundering incentive.** As written, D4 rewards overriding model output into apparent human provenance. State that supplier class is immutable once logged and that overrides *layer* rather than rewrite. Overrides must carry dates — an "owner override" badge otherwise reads as current endorsement when it may be years old. And grades must be computed at export-build time from records, never hand-authored in templates.

**D5 — false precision, plus a day-one CI bug:**

- **"Last verified N days ago" conflates check-recency with validity, and is volatility-blind.** A 400-day-old archive.org citation may be less drifted than a 30-day-old marketing page. Rename to **"last checked."**
- **Enumerate the states** — hash-unchanged-since-D, human-re-read-at-D, crux-captured-at-D, unverifiable-since-D — because three or four semantics are collapsing into one integer. `dead-no-archive` needs "unverifiable since D," not a large number.
- **Per-source volatility / `recheck_after`,** rendered as fresh / due / overdue with the exact date on demand; coarse buckets in answers. Never threshold or colour raw age.
- **Pin the clock.** Age is computed against `now`, so `kb query` output is not reproducible day to day, and the D2 harness will flap. Inject `KB_NOW` (or derive from commit date) and **exclude age from the eval diff.** In a "CI is the contract" project this bites immediately, and the ADR does not see it.
- **Badge budget:** one provenance mark plus one freshness state per citation, both drill-down-able.

**D6** is correctly sized as a tripwire, but "external-adopter demand" is a mood, not a tripwire — in an ADR that elsewhere demands "measured recall degradation, two consecutive months." Make it countable (≥2 distinct external requests recorded as issues). Also resolve the **D3×D6 interaction**: a single-file HTML export bundling every crux is a *distributed compilation of third-party quotations* — a different copyright posture from a repo. Default excerpts out, or behind an explicit flag. And define the drift predicate before the staleness counter can mean anything.

---

## 5. What the comparison missed

**(a) The transferable half of regenerate-don't-govern — filed as "category mismatch" too fast.** The *corpus* is not regenerable; its *derivations* are: adjacency, backlink index, BM25 tables, activation results, doc-site, eval outputs. Adopt the discipline: derived artifacts are a git-ignored cache keyed by corpus content-hash + schema version + tool version + ranking-policy hash, never authoritative, never hand-edited, refusing to serve on hash mismatch. This yields a free determinism test — **`rebuild == cached` in `kb verify`** — which is precisely the check D1's floating-point and ordering hazards need. Strongest missed adoption in the packet.

**(b) Clauses are indexable text.** Chancery's edges carry clauses; Graft's are structurally mute. Indexing clause prose gives *edge-level* relevance — hence typed, explainable traversal weights and the criterion for the "no free hubs" rule — and it is the one thing Graft's design structurally cannot do. This should be the core of D1, not PPR.

**(c) A curated alias/abbreviation table.** IDF over 212 documents is near noise and title/definition fields are very short. A hand-curated synonym table is deterministic, diffable, reviewable, exactly Chancery's genre, and probably the highest-leverage retrieval investment at this scale. It is also the null-hypothesis baseline D1's graph stage must beat.

**(d) "Why this result" as a tested contract.** Ship seeds matched, path taken, edge types traversed, corpus and ranking-policy hashes, as part of the answer; make D2 items assert the *validity* of the path (not necessarily its identity, which would overfit to one implementation). For a governed KB this matters more than which graph algorithm wins.

**(e) Score fusion is unmentioned.** A strict seed→rank pipeline makes graph rank hostage to seed recall. RRF is deterministic and belongs in the bake-off.

**(f) Fail-closed behaviour** on a stale or missing index is undefined.

**Embeddings: rejected for the right reason, stated wrongly, and over-scoped.**

- *"Nondeterministic across model versions"* conflates **versioned** with **nondeterministic**. A pinned model, tokenizer, and dtype is a content-addressable artifact — the thing this project governs well. A model bump becomes a versioned migration with a diffed recall report: the same discipline D3 accepts for a schema change. And the residual float variance is the variance D1's power iteration inherits unexamined.
- *"Model artifact in the read path"* is the honest objection — but state it as a **value**, not a fact. Note also the asymmetry: ADR-010 admits model suppliers to write *content* into the record while D1 bars them from *ranking* it. That may be the right line; it needs an argument.
- *"Duplicates what the link graph already encodes"* is backwards. The link graph encodes what the curator **noticed**. The failure mode of hand curation is unknown-unknowns — pairs that should be linked and aren't. That is where dense retrieval earns its keep, and it isn't retrieval at all.
- **Scope error:** the objections reach *third-party neural* embeddings. **Corpus-derived latent factors — LSA/SVD or random projection over the term-document matrix — are deterministic, model-free, network-free, and computed from the record itself.** The ADR rejects a category when its arguments only reach a subset. Name the subset.
- **Council caution on one proposed remedy.** A member recommended running a local ONNX model (e.g. MiniLM) inside `kb`. Taken literally that **violates the stated contract that the CLI never calls a model**, offline or not, and "mathematically deterministic" overstates cross-runtime float and tokenizer behaviour. The admissible form is: vectors generated *offline* through ADR-010's supplier protocol, committed as content-hashed data, read by pure numeric code. Keep it out of the production read path unless the governing contract changes — but permit it as an **offline benchmark challenger.** If a pinned embedding baseline materially beats lexical+graph on the vocabulary-mismatch subset, that is evidence of a corpus blind spot even if embeddings stay inadmissible in `kb query`.

**Recommended new decision — D7: `kb suggest-links`.** Offline, non-gating, out-of-read-path model-assisted proposal of candidate typed links for human judgment through ADR-010's two-phase machinery. Read-path determinism is preserved, the model acts as a proposer under governance, and it attacks the corpus's real weakness (link recall) rather than its non-problem (ranking thirty candidates).

---

## 6. Verdicts

| ID | Verdict | Rationale |
|---|---|---|
| **D1** | **ACCEPT-WITH-CHANGES** *(minority: REJECT and resubmit)* | Keep lexical-seed + deterministic typed graph-rank as the destination; **strike the PPR commitment** — out-degree normalization inverts curatorial signal, it is edge-type-blind against a typed corpus, it degenerates to weighted BFS if backlinks are materialized, it mixes past the graph's diameter at standard damping, its determinism is unspecified while it rejects embeddings for nondeterminism, and its scores are unexplainable in a project whose thesis is legibility. Specify a finite k-hop typed decay with retained paths, declared versioned per-type weights, hub penalty, RRF against a lexical-only channel — and let D2 adjudicate the rank function it was built to test. |
| **D2** | **ACCEPT-WITH-CHANGES** | Build now, but as written the metric is invalid (required-concept labels cannot compute precision — use pooled/exhaustive qrels) and the design is gameable: add required query provenance with metrics split by class, a vocabulary-mismatch subset, labels as logged ADR-010 judgments with `label-edits-after-failure` tracked, a sealed holdout, anti-labels and no-answer items, a relabel policy, a stated noise band, and a recording surface for the two-month trend. Non-gating is correct — but **gate the hygiene now**, and pre-declare the promotion triggers; the tripwire must key to substantive change, not elapsed time on a fixed fixture. |
| **D3** | **ACCEPT-WITH-CHANGES** | Workable but under-specified where it will hurt: 500 chars is a ceiling, not a safe harbor, and "the load-bearing passage" *is* the heart of the work — add a license enum with `withheld-license`, a proportionality floor for short works, a **per-work aggregate cap enforced by `kb verify`**, contiguous-span-only, and mandatory attribution. Make the crux a content-addressed store object with `crux_hash`/`crux_source_hash`/`crux_captured_at`/`crux_locator`, a **deterministic substring-containment check at apply time** (or "verbatim" is an unverified claim in a rule-verified system), a verified/unverifiable/**contested** tri-state, and an explicit rule that **a crux never upgrades a citation's verification status.** |
| **D4** | **ACCEPT-WITH-CHANGES** *(minority: REJECT — badge fatigue)* | Rename to **provenance**-graded: supplier class is provenance, not quality, and grading it as trust asserts what the records don't license. Render exceptions against a declared house norm rather than badging every state; one ordinal idiom per axis plus accessible text and a machine-readable attribute; grades computed at build time from records; supplier class immutable so overrides layer rather than launder; overrides dated. |
| **D5** | **ACCEPT-WITH-CHANGES** *(minority: REJECT — false precision)* | Raw day counts are volatility-blind false precision: rename to "last checked," enumerate the distinct states (hash-unchanged / re-read / crux-captured / unverifiable-since), add per-source `recheck_after` rendered fresh/due/overdue with exact dates on demand, no colour or thresholds on age — and **pin the clock (`KB_NOW`) while excluding age from the D2 eval diff**, or CI flaps on day one. |
| **D6** | **ACCEPT-WITH-CHANGES** | Tripwire posture and candidate-not-decided status are correctly sized restraint, but "external-adopter demand" is unmeasurable in an ADR that elsewhere demands measured conditions — make it countable (≥2 recorded external requests); define the drift predicate before the staleness counter can mean anything; and exclude crux excerpts from the single-file export by default (D3×D6). |
| **New — D7** | **RECOMMEND ADOPT** | `kb suggest-links`: offline, non-gating, out-of-read-path model-assisted link proposal via ADR-010 — attacks link recall, the actual weakness of hand curation, without putting a model in the read path. |
| **New — D8** | **RECOMMEND ADOPT** | Record/derivation separation: a hash-keyed, git-ignored, never-authoritative cache for all derived artifacts with `rebuild == cached` as a `kb verify` determinism test. This is the transferable half of Graft's regenerate-don't-govern model, filed as category mismatch too quickly — and it is the check D1's numerical hazards require. |
| **New — D9** | **RECOMMEND ADOPT** | A curated alias/abbreviation table as versioned corpus data — highest-leverage retrieval work at 212–2,000 notes, and the null-hypothesis baseline D1's graph stage must beat. |

**Process note.** The execution order (instrument first) is right, and packet 7 preceding any build is honoured. But D2's changes are load-bearing for D1's adjudication: the eval-set spec must return through council review once the vocabulary-mismatch subset, pooling protocol, and label protocol exist, **before the D1 tripwire can ever fire honestly.** Also amend the Consequences section: "why not embeddings" is not answered on file until the rationale is narrowed to third-party neural embeddings in the read path and stated as a governing value rather than three contestable technical facts.
