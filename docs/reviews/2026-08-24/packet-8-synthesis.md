# Packet 8 — council review of the query eval-set spec (ADR-013 D2)

*2026-08-24 · reasoning tier · consolidated synthesis, verbatim. Dispositions below in [dispositions.md](dispositions.md) (packet-8 section).*

# COUNCIL PACKET 8 — REVIEW
## Query eval-set spec (ADR-013 D2 implementation design)

**Verdict: ACCEPT-WITH-CHANGES.** Blocking items B1–B8 must land before any D1 bake-off is *adjudicated*; items G1–G4 must land before any score gates anything. The architecture survives review: two-phase attested labels, mandatory provenance, anti-labels, per-item diffs over scalar deltas, honest-before-large. The defects cluster in three places — **one false claim of independence**, **one metric that is vacuous under the spec's own determinism guarantee**, and **an anti-gaming posture aimed at the wrong adversary**. All are cheap to fix on paper and expensive to fix after the bake-off has been run.

The council was unanimous on the verdict and near-unanimous on the substantive findings. Where reviewers diverged, I adjudicate below.

---

## 1. Do the qrels license precision@k? Minimal second-judge protocol

**Conditionally yes — as *pooled* precision, a benchmark-local quantity — but the spec's stated justification is wrong and must be struck.**

The load-bearing sentence is false by construction:

> *"the log proves every label predates the ranker commit it later judges"*

This holds for `required`/`forbidden`, which are authored from query text alone. It **cannot** hold for pooled qrels: the pool *is* the union of challenger top-k outputs, so every pooled label is necessarily posterior to the rankers that produced it. The ADR-010 log proves *when* a label was appended; it does not prove the judge was blind or disinterested. Provenance-of-time is not provenance-of-independence, and the spec conflates them. (One reviewer read this claim as the strongest thing in the spec; the majority correctly read it as a defect. It is a defect.)

The defensible sequence, which must be written into the spec:

1. freeze candidate ranker commits + configs;
2. generate the pool, strip attribution, shuffle under a recorded seed;
3. judge;
4. freeze a qrels version;
5. score the already-frozen outputs against it.

Three further openings, all fixable:

- **Pool composition is a function of challenger membership.** Register a fifth ranker later and its novel-but-relevant retrievals arrive unjudged — the classic TREC pool-bias failure, landing precisely on whatever D1 recommends. Require re-pooling as a declared event (new challenger, alias-table change, corpus revision), each pooled concept citing the run that produced it, and **no hand-additions ever**.
- **Coverage must be published, not assumed.** Report `unjudged@k`. Precision is `n/a` for any ranker whose reported top-k is not fully judged; where coverage is partial but reportable, emit an interval (unjudged-as-irrelevant → unjudged-as-relevant) rather than a point estimate. Pool depth ≥ largest reported k. Record a pool manifest (contributing commits, configs, depth, corpus hash, judging batch).
- **`marginal` is undefined.** This is where a solo judge has maximal discretion. Declare the primary treatment (recommend strict: marginal ≠ relevant) and **always co-report the lenient variant**. A comparison that does not survive both is reported as not robust.

**The overlooked fact that changes the frame: the corpus is 212 concepts.** Pooling exists because TREC corpora have millions of documents. At n=212 exhaustive judgment is *affordable*, and pooling's cost justification largely evaporates. Exploit this:

- exhaustively judge a stratified audit slice (~8–10 queries, ~2,000 judgments) to *measure* pool miss rate rather than caveat it;
- exhaustively judge holdout queries at seal (§5);
- note that **`no-answer` items are universal negatives**. "No relevant concept exists" over 212 concepts cannot be established by pooling — if every ranker is bad, the pool is empty. It requires an attested scan of all 212 concepts (titles *and* definitions), logged as its own two-phase task. Today it is a bare authorial assertion.

**Minimal second-judge protocol (single-maintainer compatible):**

1. **Blind, seeded, source-anonymous presentation.** No ranker identity, no rank, no score, no `required` membership, no prior labels; shuffle order; record the seed with the attestation. Near-zero cost, highest value in the packet.
2. **A versioned relevance rubric** with worked examples for relevant/marginal/irrelevant. Rubric revisions invalidate agreement statistics and force re-sampling.
3. **Test–retest self-agreement.** Re-present a random 20% of judgments blind after a cooldown (≥30 days or ≥200 intervening judgments). Publish 3-class agreement and binary relevant/not agreement. **No comparison may be reported as decisive on a margin narrower than the measured agreement band.**
4. **Independent second supplier over a stratified sample** — at minimum 25% of queries or 10 queries, whichever is larger, and including *every* `no-answer` item, every curator item that appears in any reported slice, and ≥25% of vocab-mismatch items. A model session is an acceptable second supplier: the no-model constraint binds the *harness*, not the supplier. Commit the task prompt and model version. Second-supplier labels do **not** enter qrels; the agreement statistic and the flagged disagreements do, and disagreements are adjudicated as their own logged two-phase task.
5. **Report disagreement *direction*.** Disagreement that systematically favors the incumbent is itself a gaming signal.
6. The query author must not be the sole relevance judge for that query.
7. An agreement floor feeds the promotion triggers (§6).

With blinding + measured agreement + published coverage, precision@k is licensed as a bounded, reliability-capped, benchmark-local quantity. Name it **pooled precision@k** in every report. Without them it is a curator's opinion with a timestamp.

---

## 2. The vocab-mismatch check

**Unsound as a class *definition* and a CI gate; sound as a screen.** Four failure modes, all identified independently by multiple reviewers:

- **Wrong surface.** Overlap is computed against `title + definition`; retrieval operates over the indexed surface — body text, headings, and `aliases.yaml`. Zero title overlap is worthless if "crash" appears four times in the body.
- **Tokenizer-dependent fake mismatch.** Unstemmed, "recover"/"recovery" and "capture"/"captured" score as zero overlap; you accumulate morphologically trivial items classed as hard.
- **Goodhart by construction.** The seed plan says the mismatch items are "authored against the mechanical overlap check." A pass/fail threshold on a curator-authored field selects for contrived phrasing, and the class then certifies a *lexical* property while the claim it supports is *behavioral*.
- **The fixture is the tuning knob.** `aliases.yaml` is shared with `kb query`; any alias edit silently reclassifies your hardest items.

**Required reoperationalization — two tiers:**

- **Tier 1, mechanical screen (necessary, not sufficient, diagnostic only):** pinned stemmer, English stoplist **plus a corpus-frequency stoplist** (top-N tokens across the 212 concepts — otherwise "agent", "session", "concept" defeat honest items), computed against the *indexed* surface. State the rule as zero (or declared ≤1) shared content tokens. Stemmer version, stoplists, and threshold go inside the D8 policy hash so they cannot drift silently.
- **Tier 2, behavioral confirmation (definitional):** an item is `lexical_hard` at (corpus hash, alias snapshot) **iff the frozen lexical-only+aliases challenger fails to return at least one `required` concept in top-K**, evidenced by a referenced run. Make this a *computed* field, recomputed every run, never authored. The author supplies a `hypothesis` field and a naturalness attestation.

Critically: **do not** require graph-challenger *success* in the definition — that would make "the graph stage wins the vocab-mismatch slice" tautological.

Three additions:

- **`alias_repairable: true|false`** — computed: does adding one alias fix it? If yes, the item is evidence for **D9**, not for an expensive traversal stage. Without this field a set of alias-repairable items will be used to buy a graph stage.
- **Class-drift reporting.** As aliases grow and items graduate out of `lexical_hard`, the graph stage's justification shrinks to what it actually is. Report drift every run.
- **Provenance floor.** Curator-authored mismatch items are smoke material and are labeled `synthetic-vocab-mismatch`; the headline mismatch slice requires non-curator provenance (≥ half, and ≥10 items, before the slice is quotable anywhere).

The hygiene gate on "the overlap check passes" is **removed** and replaced by gates on provenance, `provenance_ref`, and naturalness attestation presence.

---

## 3. Is ~40 items enough? Minimum honest configuration

**Enough to start reporting. Not enough for anything the spec's slice tables imply. And the stated composition is wrong.**

First the arithmetic error: the seed is described as 25% curator-authored. It isn't. 10 curator-standard + 6 curator-authored vocab-mismatch (+ probably 4 curator no-answer) = **16–20 of 40, i.e. 40–50%**. The genuinely non-curator headline set is **20 items** (10 log-derived + 10 packet/issue). Restate this honestly or re-source the mismatch and no-answer items from log/issue phrasings.

Second, the statistics. At n=40 with success ≈ 0.6, SE ≈ 0.077 — a 95% interval of roughly ±15 points. Scalar comparison at that width is theatre, which the spec already concedes by making per-item pass/fail the unit of comparison. Good. Then **state the paired threshold explicitly**: exact McNemar on discordant pairs. At 10 discordant pairs, 9–1 gives p ≈ 0.02; **8–2 gives p ≈ 0.11 and is not significant** — so the honest preregistered bar is *the exact test*, not a lopsidedness ratio heuristic (one reviewer proposed "≥10 discordant, ≥80/20", which admits the 8–2 case its own arithmetic rejects; do not adopt that form). Six vocab-mismatch and four no-answer items support **no rate whatsoever** — one flip is 17% and 25%.

Third, the dominant risk at n=40 is **not power, it is multiplicity**: ~5 metrics × 2 values of k × 4 slice families ≈ 40 comparisons. Something will look decisive. The binding requirement for D1 is therefore not more items but a **preregistered decision rule**, committed before the bake-off runs: one primary endpoint, its slice, its k, its exact test, and the written disposition for "inconclusive."

**Minimum honest configuration to start reporting (pilot tier), all of which the seed can meet:**

- reports watermarked `pilot / not adjudicable`;
- raw numerators and denominators printed beside every rate;
- curator items **excluded** from headline metrics, not "discounted" (an unjustifiable weighting is worse than an exclusion rule); curator share capped in hygiene;
- ≥20 non-curator headline items; ≥2 distinct non-curator provenances at ≥8 items each;
- any class/slice with n<10 reported as an **enumerated item list with pass/fail**, never as a percentage;
- uncertainty from item resampling (§6), self-agreement measured before any precision number publishes;
- `no-answer` items exhaustively attested; `vocab-mismatch` items behaviorally confirmed;
- the in-degree-quartile slice ships with the *first* report, not later — it is the instrument against hub-flattery of graph rankers.

**Promotion-quality tier (before D1 is adjudicated or scores gate):** ≥100 usable queries, ≥50 non-curator, ≥20 provenance-backed `lexical_hard`, ≥15 independently confirmed `no-answer`, and every slice used in a promotion argument at ≥20 items. Grow `log-derived` preferentially — the log is append-only, free, and the designated OOD source; 10 is an arbitrary cap.

---

## 4. Is `label-edits-after-failure` sufficient?

**No. Under an append-only log, edits are the *loud* move; additions are the natural one — and the metric watches only the loud move.** Worse, it watches only *one label surface*: `required` and `forbidden` live in the **query item**, and recall@k and success@k score against them. Nothing in the spec watches query-item mutation at all.

The unmonitored surface, consolidated from all four reviews:

1. **Label additions** — a new `required` concept, or a new pooled `relevant`, that the favored ranker happens to return; a new `irrelevant` for what a competitor uniquely retrieves.
2. **Demotions** — relevant → marginal to erase a favored ranker's miss; quiet `forbidden` removal.
3. **Query churn** — adding easy items, retiring hard ones as "badly formed."
4. **Class laundering** — reclassifying a failing `standard` item to `vocab-mismatch` (reported separately) or `curator` (discounted). Both routes exit the headline.
5. **Opportunistic staling.** "A substantive corpus revision marks dependent labels `stale`," and stale items *drop from headline metrics*. "Substantive" is judge-declared. This is a documented one-word escape hatch from any failing item.
6. **Corpus edits to `required` targets** — editing the concept until lexical finds it. Often right for the KB, and it silently destroys the item's discriminating value and evaporates the mismatch slice.
7. **Config/pool tuning after the fact** — k, thresholds, pool depth, challenger registration, `aliases.yaml`.
8. **Relabeling by superseding append**, which is not an "edit" as the metric defines it.

**Fix structurally, not detectionally** — detection-by-metric invites whack-a-mole. Four mechanisms, in priority order:

- **As-of (time-truncated) views.** Every comparison is computed over qrels *and query items* truncated to the appropriate frozen version — for a fresh bake-off, the qrels version frozen at step 4 of §1's sequence; for subsequent comparisons, the earlier of the two runs' eval-set versions. Post-hoc labels cannot retroactively touch a comparison being read. Dual-report where views differ; a verdict that flips is "not robust." (Note: the naive form "truncate to before min(commit A, commit B)" is wrong for a first bake-off — it would exclude the very pool judgments generated to score A and B. Anchor on the frozen qrels *version*, not on ranker commit timestamps.)
- **Item immutability.** `text`, `required`, `forbidden`, `class` are immutable post-acceptance; corrections supersede via a new `id` with a pointer; comparisons score only ids live in both versions.
- **One eval-set hash and a delta ledger.** A single canonical hash covers queries, required/forbidden, qrels (including supersessions), aliases, classes, provenance, stale status, pool manifests, and metric/policy config. Every run records it. The ledger emits, per delta: *did it follow a failing run on the affected item?* and *does it move a metric in the favored direction?* The conjunction rolls up to one published scalar — **post-hoc-favorable-delta count** — with a required written rationale per instance. Published results are never silently rescored under a new version; both versions are shown.
- **A freeze window.** During D1 adjudication the eval set is pinned to a declared SHA: no additions, no relabels, no alias edits, no corpus edits to `required` targets. Any change either restarts the bake-off or is excluded from it. Cheap, unambiguous, and it removes the whole attack class at the one moment stakes are real.

Also: report the **a-priori-labeled subset** separately. Those are the only labels that carry the predates-the-ranker property the spec currently claims for all of them.

---

## 5. Holdout sealing in a public repo

**It does not break the ratchet, but the spec claims a property it cannot have, and one consequence is unresolvable as written.**

Be precise about the threat model. Against *tooling leakage* and *unintentional overfit*: achievable. Against *deliberate consultation by the person holding commit rights on a public repo*: not achievable by any mechanism, ever. Say so in the spec — a control whose stated reach exceeds its actual reach corrodes the credibility of the controls that work.

**The council's sharpest finding here: public readability is not the primary leak. Feedback granularity is.** A ratchet inherently leaks one scalar per attempt; that is its price. What breaks it is *item-level* feedback — and the spec guarantees item-level feedback twice: `results/` is a tracked per-run artifact, and the declared comparison mode is "the per-item pass/fail diff." Applied to the holdout, CI will print exactly the diagnosis a tuner iterates against. The leak is in the spec's own handwriting, and it would exist even if the queries were secret.

Required, all plain-files-in-git compatible:

- **Aggregate-only holdout output, enforced mechanically.** No per-item holdout text or outcomes in logs or artifacts; holdout result files carry verdict-vs-ratchet-line only; a CI lint fails if per-item fields appear. Explicitly carve the holdout out of per-item diff mode.
- **Prove non-dependence by deletion.** A CI job runs the full dev/tuning suite with `holdout/` *absent*; it must pass identically. This is a real mechanical seal against tooling leakage — strictly stronger than a path-based lint on which files a PR may touch.
- **Defer sealing to a size floor.** The spec never states holdout size; sealing a handful of items protects nothing. Everything stays visible until ≥15 non-curator items accrue, then seal.
- **Commitment + rotation instead of hide-forever.** At seal, publish a manifest of salted per-item hashes plus count and class mix; judge holdout qrels **exhaustively** (affordable at n=212) so no later addition is possible and as-of truncation is a no-op. Rotate on a declared epoch: reveal plaintext, verify against the manifest, burn the items into the public set, draw a fresh holdout from accrued external items. A revealed-and-burned item is still a valid public item, so this degrades gracefully. Holdout items must be non-`curator` provenance only.
- **An access ledger with a declared budget.** Treat the holdout as consumable: ≤1 evaluation per calendar month, ≤N per epoch, and **"holdout evaluations to date" printed on every report.** Overfitting requires repeated looks; a public look-count makes exposure quantifiable, which is the best available substitute for secrecy.
- **Encrypt at rest** (`holdout/queries.jsonl.age` + plaintext SHA in the manifest) so stray tooling reads fail loudly. If you want more than maintainer discipline, escrow the key with a council reviewer and decrypt only at adjudication events. Encrypted blobs are still plain files in git.
- **Pin the baseline at seal** (labels-as-of-seal, corpus hash, band); re-baseline only through a logged re-seal; score the intersection of live non-stale items in both runs, with the count reported. Waivers are logged, expire, carry a linked follow-up, and are counted in the promotion record.
- If none of the above is adopted, **rename the artifact**: a "preregistered protected test set," not a sealed holdout.

**Where the council split:** one reviewer would move the ratchet off the holdout entirely (gate on the public set, defended by the delta ledger and freeze windows, with the holdout as a low-frequency manual audit), on the correct observation that a set CI can read is a set the maintainer can read. I do not adopt that here — it is a change to D2's promotion path, not an implementation detail. Keep the holdout as the ratchet target under the aggregate-only + commitment + access-ledger regime. **If, after implementation, you conclude the holdout cannot be both CI-gating and meaningfully sealed, that is a D2 amendment and returns to council with the D1 packet.**

---

## 6. CI posture

The three-tier shape — hygiene gates now, scores non-gating, promotion by trigger — is right. Changes:

**The noise band is vacuous as specified — this is the packet's most concrete defect and was flagged by every reviewer.** "Established from ≥5 repeat runs" contradicts the determinism guarantee two paragraphs above it: pinned `KB_NOW`, no network, hash-keyed results. Five repeat runs of a deterministic harness yield bitwise-identical output and a zero-width band, which makes "baseline − noise band" gate on any perturbation at all. As written the band is either zero (wrong) or fabricated (worse). Replace with three *distinct* quantities, never conflated:

1. **Determinism** — repeat runs and cross-platform runs, as a hygiene *test*, not a statistic.
2. **Uncertainty** — bootstrap resampling over the query set (≥1000 resamples) for interval width, plus label-unreliability from §1's audit, plus tie-break-seed perturbation spread for stability. Descriptive; printed with counts.
3. **Policy tolerance** — the regression allowance in the ratchet. Name it that. It is a governance choice, not a measurement.

**Add to hygiene gating:**

- **Artifact freshness** (the mechanical teeth under "obligation to look"): a PR touching retrieval code, aliases, or the corpus must include a results artifact keyed to the new policy hash, or CI fails. You are not gating on scores; you are gating that the scores exist and correspond to the merged code.
- **Artifact reproduction**: the committed artifact must match a clean rerun byte-for-byte — not merely that *some* artifact exists.
- **Policy-hash completeness**: vocab config, stemmer version, stoplists, alias-table snapshot, pool depth k, metric config, marginal treatment. Anything that changes numbers without changing the corpus.
- **Referential integrity**: `required`/`forbidden` resolve to real concepts; `required ∩ forbidden = ∅`; `labeled_at_corpus` resolves to a real corpus hash.
- **Near-duplicate query detection** on normalized text, across dev *and* holdout (accidental easy-item inflation; holdout/dev overlap).
- **Append-only/supersession validation** for qrels and query items; stale labels provably excluded from headline denominators.
- **Pool-coverage rule**: precision is comparable only at comparable judged coverage of top-k; below threshold, `n/a` — the spec's own "never approximated" principle, extended.
- **Curator share ≤ declared cap**; delta ledger generated and committed; holdout-absent suite passes; holdout per-item leakage lint passes.

**Replace the checklist line with an artifact.** "A required checklist line" is a human typing that they looked. Make the bot post the machine-generated per-item diff (dev set only) and require a **named disposition per regressed item** — accept / investigate / waive-with-expiry. That is ADR-010's attestation pattern applied reflexively, and it is the difference between an obligation and a decoration.

**Add two preconditions to the five promotion triggers, and one before scores gate anything:**

- (a) measured judge agreement above a declared floor, **and** bootstrap interval width narrower than the intended ratchet step — otherwise you are gating on sampling noise;
- (b) **mutation test passes**: deliberately degrade a ranker (drop the top result; shuffle top-3; strip aliases) and confirm the eval flags it at the declared threshold. *If a mutant ranker passes your eval, your eval is decoration.* Cheapest validity check available; it belongs in the promotion preconditions.
- (c) promotion is an **event, not a threshold crossing**: when the five triggers fire, promotion happens via ADR with evidence attached (agreement figures, coverage, mutation-test result), reviewed through council. Re-establish intervals after any corpus revision staling more than a declared fraction of labels. Give `results/` a pruning policy (latest per policy hash + all promotion-relevant runs) before it becomes sediment.

---

## Additional findings not in the asks

- **`no-answer` has no abstention contract.** Four items expect "silence," but none of the four challengers is specified as *able* to abstain. If none can, all four fail identically and the class measures nothing. Define the mechanism (empty top-k? score below a declared cutoff?) or defer the class.
- **`forbidden` anti-labels need provenance.** Hand-picked anti-labels are themselves a gaming vector (pick what the disfavored ranker returns). Derive hub anti-labels by rule — top-decile in-degree concepts absent from the pooled-relevant set — *and* require judge confirmation before scoring, since high degree plus pool absence does not establish irrelevance.
- **Authoring direction is a missing field.** Items written *from* a concept ("what query would find this?") share its vocabulary and are systematically easier; items written *from* a question do not. Add `authoring_direction: question-first | answer-first` and report separately. Answer-first items inflate the lexical baseline and will quietly bias D1 toward the incumbent.
- **`aliases.yaml` is both fixture and tuning knob.** Pin an alias snapshot hash per run, include alias edits in the delta ledger, freeze during bake-offs.

---

## Enumerated changes

**Blocking before D1 adjudication:**

- **B1** — Strike the claim that the log proves all labels predate the rankers they judge. Write the freeze→pool→judge→freeze-qrels→score sequence. Split the label store into *a priori* (query-only, attestable) and *pooled* (posterior; records producing runs and commits) and report the a-priori subset separately.
- **B2** — Blind, seeded, source-anonymous labeling (no system, rank, score, or `required` membership; shuffled; seed logged). Versioned relevance rubric. 20% test–retest self-agreement published. Independent second-supplier sample (≥25% of queries or ≥10, including all `no-answer`, all reported curator items, ≥25% of mismatch items), labels excluded from qrels, disagreements and their *direction* published and adjudicated as logged tasks. No comparison reported as decisive on a margin narrower than measured agreement.
- **B3** — Declared `marginal` mapping (strict primary) with lenient co-reporting; robustness flag when they disagree.
- **B4** — Replace the repeat-run noise band with three separated quantities: determinism test, bootstrap-over-items uncertainty + label-reliability, and named policy tolerance.
- **B5** — Pool discipline: depth ≥ max k; re-pooling only on declared events; no hand-additions; pool manifest; publish `unjudged@k`; precision `n/a` or interval when coverage is incomplete.
- **B6** — As-of (frozen-version) views over qrels *and* query items for every comparison; dual-view robustness reporting. Query-item immutability with supersede-by-new-id. One eval-set hash. Delta ledger with published post-hoc-favorable-delta count and per-instance written rationale. Close the `stale` and class-reassignment escape hatches (both are deltas requiring rationale). **Freeze window during adjudication.**
- **B7** — Holdout: aggregate-only outputs enforced by lint; explicit carve-out from per-item diff mode; holdout-absent CI job; sealing deferred to ≥15 non-curator items; commitment manifest with salted hashes; exhaustive qrels at seal; declared rotation epoch with reveal-and-burn; access ledger with published look-count; non-curator provenance only; state plainly that sealing defends against tooling leakage and unintentional overfit, not against the maintainer.
- **B8** — Preregistered D1 decision rule: one primary endpoint, its slice and k, exact McNemar on discordant pairs (note 8–2 of 10 is *not* significant; do not use an 80/20 heuristic), multiplicity handling, and the written disposition for "inconclusive." Committed before the bake-off runs.

**Blocking before scores gate anything:**

- **G1** — Mutation test: injected regressions detected at the declared threshold.
- **G2** — Bot-generated per-item regression diff with named dispositions (accept / investigate / waive-with-expiry), replacing the checklist line.
- **G3** — Promotion preconditions added to the five triggers: agreement floor met; interval width < ratchet step; mutation test passing; promotion executed as a logged ADR reviewed by council; waivers expire with linked follow-ups.
- **G4** — Hygiene additions: artifact freshness, artifact reproduction, policy-hash completeness, referential integrity, near-duplicate detection across dev and holdout, append-only/supersession validation, stale exclusion, pool-coverage `n/a` rule, curator-share cap, delta-ledger presence, holdout leakage lint.

**Required with the build:**

- **R1** — Two-tier vocab-mismatch: mechanical screen (pinned stemmer, English + corpus-frequency stoplists, computed against the *indexed* surface, inside the policy hash) as diagnostic only; `lexical_hard` computed from frozen lexical+aliases baseline failure as definitional; do not require graph success. Authored field becomes `hypothesis` + naturalness attestation. Add `alias_repairable`. Report class drift. Drop the hygiene gate; gate provenance instead. `synthetic-vocab-mismatch` for curator items; non-curator floor before the slice is quotable.
- **R2** — Exclude `curator` from headlines rather than discounting; cap curator share; **correct the seed arithmetic** (16–20/40 curator-authored, ~20 non-curator headline items) or re-source the mismatch and no-answer items.
- **R3** — Slices with n<10 reported as enumerated item lists, never rates; counts printed beside every rate; `pilot / not adjudicable` watermark until promotion-quality thresholds are met (≥100 usable, ≥50 non-curator, ≥20 `lexical_hard`, ≥15 `no-answer`, ≥20 per promoted slice).
- **R4** — Exhaustive audit slice (8–10 queries) to measure pool miss rate; exhaustive attested scan for every `no-answer` item.
- **R5** — Define the `no-answer` abstention contract or defer the class.
- **R6** — Rule-derived hub anti-labels with judge confirmation.
- **R7** — Add `authoring_direction`; report answer-first separately.
- **R8** — Pin alias snapshot per run; alias edits in the delta ledger; frozen during bake-offs.
- **R9** — Grow `log-derived` preferentially; drop the arbitrary cap of 10.
- **R10** — `results/` pruning policy; baseline-recompute and waiver-accounting rules.

---

## Process note

Changes are adopted inline; **no further packet is required for this spec.** Build, TDD, and bring the first run's report — including self-agreement, `unjudged@k`, the mutation-test result, and the delta ledger — to packet 9 alongside D1. D1 adjudication proceeds when the tripwire fires against a build containing B1–B8 and under the preregistered decision rule.

Two items return to council rather than being assumed: (i) if implementation shows the holdout cannot be simultaneously CI-gating and meaningfully sealed, the proposal to move the ratchet to the public set is a **D2 amendment**, not an implementation detail; (ii) any contested change from this list.

The three I will not trade: **B4** (a zero-width or fabricated noise band makes every downstream number unauditable in principle), **B6** (unguarded comparison views make the gaming detector decorative), and **B7** (item-level holdout feedback defeats the ratchet regardless of who can read the file).

The spec is closer to honest than most eval sets that gate real decisions. The remaining gap is that three of its four anti-gaming controls currently defend against an adversary who is not the one you have.
