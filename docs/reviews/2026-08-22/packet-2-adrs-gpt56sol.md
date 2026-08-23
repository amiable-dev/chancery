## `adrs/004-rubric-shape.md`

**Verdict: REJECT**

1. **[BLOCKER] Section “Decision,” item 1 makes every knockout an unconditional discard:** “**any YES discards**.” This prevents a knockout from routing to `split`, `queue`, or another safe disposition. It also conflicts with the stated default that uncertain cases are queued. The rubric schema must distinguish fatal discard conditions from conditions requiring review or restructuring.

2. **[BLOCKER] Cross-document contradiction — ADR-004 vs ADR-005:** ADR-004 says future audit verdicts use knockouts where “any YES discards,” while ADR-005 says “contested finding[s]” and every future judgment-bearing feature route through the proposal queue. A contested knockout therefore has two specified outcomes: discard and queue. Precedence and uncertainty handling are undefined.

3. **[SHOULD-FIX] Section “Decision,” item 3 does not define a total, machine-validatable routing table.** “A deterministic routing table over the ordinal tuple” omits required behavior for missing dimensions, unknown enum values, duplicate rules, overlapping rules, schema-version mismatches, and incomplete tuples. “Default route is `queue`” can conceal malformed rubric or supplier output unless schema errors are distinguished from legitimate queue outcomes.

4. **[SHOULD-FIX] Section “Decision,” item 2 overstates repeatability:** “judgment is calibrated against fixed reference points.” Repo notes are not fixed unless tasks identify exemplar content by commit or content hash. Later edits can silently change the rubric’s effective meaning while retaining the same rubric identifier.

5. **[SHOULD-FIX] Section “Decision” does not specify the judgment task/answer boundary.** It must state that the CLI only serializes the rubric and exemplars, validates supplier-returned knockout/ordinal values, and applies the route. Otherwise “Promotion … need[s] a model’s judgment” leaves open an implementation in which the CLI invokes a model, violating the standing invariant.

6. **[SHOULD-FIX] “Every judgment carries a one-sentence rationale” is insufficient for auditability.** A rationale needs criterion-local evidence or source anchors; one unconstrained sentence cannot show why each knockout and ordinal was selected. It also needs length, format, and validation rules if it is part of the protocol.

7. **[SHOULD-FIX] Section “Consequences” claims “Auditable and model-portable by construction.”** Neither property follows from ordinal labels alone. Supplier identity/version, task schema version, rubric version, exemplar hashes, source hash, and validated answer must be retained to support either claim.

8. **[SHOULD-FIX] Section “Consequences” contains an unsupported empirical claim:** “**Proven on real content the first day**.” No fixture, task record, commit, or reproducible test is identified. `routing.test.mjs` can prove routing mechanics, not that the duplicate judgment was correct.

9. **[NIT] Frontmatter `council_review: pending (packet 2)` is an unstructured compound value.** If governance state is machine-consumed, status and packet identifier need separate schema-controlled fields.

**Most important thing MISSING:** A versioned rubric/task/answer schema defining completeness, uncertainty, evidence, provenance, and deterministic error-versus-route behavior.

---

## `adrs/005-proposal-queue.md`

**Verdict: REJECT**

1. **[BLOCKER] Section “Decision,” first bullet permits invalid canonical notes:** “A novel value … never fails the write … and the write proceeds provisionally.” For closed facets or nonexistent link targets, this either places schema-invalid/broken data in live notes or silently substitutes some other value. The document defines neither the provisional representation nor what `kb verify` considers valid.

2. **[BLOCKER] Cross-document contradiction — ADR-005 vs ADR-006:** ADR-005 says a novel facet value “never fails the write,” while ADR-006 says closed-axis values are “enum-validated” and hand-editing either representation is a lint failure. An unrecognized value cannot simultaneously pass the write and satisfy closed-enum verification. The documents need one explicit provisional-state encoding and verification rule.

3. **[BLOCKER] Section “Decision,” third bullet depends on unverifiable wall time:** “`kb verify` fails on proposals left unreviewed past the threshold.” No deterministic, verifiable age source is defined. Reading the current clock against a mutable `created_at` field violates the no-unverifiable-world-time invariant and makes identical commits verify differently. If age derives from git history, behavior for shallow clones, rebases, squashes, and missing history must be specified.

4. **[BLOCKER] Section “Consequences” says proposals “survive resolution as an audit trail,” but `.kb/queue/*.jsonl` has no canonicality or mutation model.** It is unclear whether JSONL is canonical governance state, an append-only event log, or a derived view. An append-only log requires event schemas and deterministic reduction; mutable records undermine the claimed audit trail.

5. **[SHOULD-FIX] “Accepting a proposal is the only path by which vocabulary (`facets.yml`) changes” lacks enforcement scope.** The ADR must say how direct edits, merges, imports, migrations, and manual git changes are detected by the write gate and by `kb verify`. CLI-only policy is insufficient because the invariant covers every interface.

6. **[SHOULD-FIX] Dedupe behavior is asserted but not defined:** “Proposals are dedupe-keyed.” No normalization, key fields, scope, collision handling, or reopen behavior is specified. Link-target proposals, facet values, and contested findings cannot safely share one undocumented keying rule.

7. **[SHOULD-FIX] The state machine is absent.** At minimum, the document needs allowed states and transitions for proposed, accepted, rejected, superseded, withdrawn, and reopened records, plus deterministic handling of repeated writes against resolved proposals.

8. **[SHOULD-FIX] “The CLI records, a human governs” conflicts with the broader supplier-neutral two-phase design unless authority is made explicit.** The document does not say whether a supplier may recommend a resolution, whether only humans may apply one, or how the CLI authenticates/records the governing decision without making identity claims it cannot verify.

9. **[SHOULD-FIX] The first bullet groups materially different cases without separate safety rules.** A novel topic, nonexistent link target, and contested audit finding have different effects on note validity and consumers. One “write proceeds provisionally” rule is too broad and can publish broken navigation.

10. **[SHOULD-FIX] T6 and R1b are referenced but not operationally connected:** “tracked as trigger T6” and “precondition audit … (R1b).” There is no location, measurable budget formula, responsible command, or blocking condition. These references cannot be implemented from this ADR.

11. **[SHOULD-FIX] The incident and panel claims in “Context” are unauditable.** “The 2026-07-26 incident class” and “both adversarial panels” need repository-local records or stable external references; otherwise they are unverifiable world-time assertions presented as decision evidence.

12. **[NIT] Queue-path partitioning is unspecified.** `.kb/queue/*.jsonl` needs deterministic file naming and ordering rules to avoid platform-dependent output and unnecessary merge conflicts.

**Most important thing MISSING:** A canonical proposal state machine, including provisional note representation, deterministic ageing, event schema, resolution authority, and verification rules.

---

## `adrs/006-two-tier-facets.md`

**Verdict: REJECT**

1. **[BLOCKER] Section “Decision,” item 2 stores a derived mirror in canonical note files:** “Every value is emitted twice, from one enum.” If the scalar is authoritative, the nested tag is rebuildable derived data and must not become a second canonical representation. Requiring both inside live notes conflicts with “derived layers rebuildable never canon” and adds duplicated frontmatter to model-consumed notes.

2. **[BLOCKER] Cross-document contradiction — ADR-006 vs ADR-005:** ADR-006 requires closed axes to be “one value each, enum-validated,” while ADR-005 permits novel facet values to pass provisionally. No valid serialized form is specified for a proposal that is not yet in the enum.

3. **[BLOCKER] Item 1’s `topics` rule is not executable:** “`min_uses: 3`, so a tag used once is a proposal, not a classification.” It does not define how second and third uses are recorded if the topic cannot yet classify notes, whether proposed uses appear in live files, or whether acceptance happens automatically at three uses. Counting mutable proposal records rather than accepted note classifications also creates circular semantics.

4. **[SHOULD-FIX] Item 2 contradicts item 1’s data model:** “Every value is emitted twice, from one enum,” but `topics` is described as governed open vocabulary, not a closed enum, and is plural rather than scalar. The mapping must separately define closed-axis values and topic values.

5. **[SHOULD-FIX] “Hand-editing either form is a lint failure” is not technically distinguishable from generator output in git-native markdown.** Verification can detect mismatch or unauthorized values, but not whether a matching pair was hand-authored. State the enforceable condition rather than the authoring history.

6. **[SHOULD-FIX] The authoritative representation is never named.** “From one enum” could mean the scalar, nested tag, or `facets.yml` is authoritative. Deterministic repair and conflict behavior require a single source of truth.

7. **[SHOULD-FIX] Item 3 relies on undefined measurement:** “a corpus that is measurably 72%.” No gold labels, measurement procedure, population, or uncertainty are named. If maturity is itself a judgment, the claim risks treating classifier output as ground truth.

8. **[SHOULD-FIX] Item 4 uses “parallel classifier” without preserving the model-free boundary.** It must require CLI-emitted tasks and supplier-returned answers, and define whether convergence is merely reported or can alter an axis. The CLI must not run classifiers itself.

9. **[SHOULD-FIX] “Independent-classifier convergence” is not a reliable axis-change criterion without independence and disagreement rules.** Two suppliers may share training data, prompts, or systematic bias. No minimum supplier count, agreement statistic, sample size, or escalation route is specified.

10. **[SHOULD-FIX] Section “Consequences” overclaims “zero drift by construction.”** Mirrored values can remain internally consistent while becoming semantically stale, and synchronized duplication does not prevent taxonomy drift.

11. **[SHOULD-FIX] The statistics in “Context” use multiple unexplained populations:** 243 concepts, a 25-note sample, and a 216-note full run. The excluded 27 concepts and the distinction between “notes” and “concepts” must be accounted for, especially because denominator errors are cited as decision-critical.

12. **[NIT] The tag serialization is underspecified.** Obsidian accepts multiple tag representations; exact frontmatter key, slash escaping, normalization, case rules, Unicode handling, and ordering must be fixed for deterministic verification.

**Most important thing MISSING:** A single authoritative facet representation and deterministic serialization/proposal lifecycle that avoids storing derived mirrors as canonical note content.

---

## `adrs/007-retrieval-posture.md`

**Verdict: REJECT**

1. **[BLOCKER] Section “Decision,” item 3 violates the model-free CLI invariant:** “rung 3 = local embeddings.” An embedding model is still a model; “local,” “serverless,” and “no secret” do not make a CLI model call permissible. Embedding generation must be an external supplier phase, with the CLI limited to validating and consuming rebuildable artifacts, or the rung must be removed.

2. **[BLOCKER] Item 4 misstates internal retrieval citations as grounding:** “Grounding is checked deterministically: a query answer citing a concept that was not retrieved is rejected.” Retrieval membership proves only that the cited note was returned, not that the answer is corroborated or entailed. This conflicts with the invariant that internal citations are navigation, never corroboration. Rename the check to retrieval provenance and avoid claiming grounding.

3. **[BLOCKER] Item 2 introduces time-dependent CI state without a deterministic basis:** “run monthly in CI” and “two consecutive months.” The same repository commit can produce a different escalation state based on calendar time. The document must separate scheduled execution from `kb verify` and define canonical, reviewable evaluation runs without unverifiable timestamps.

4. **[SHOULD-FIX] Item 2 does not define recall@10.** The eval set needs relevance judgments, query scope, treatment of multiple relevant notes, macro versus micro averaging, ties, exclusions, and versioning. Without these, the threshold is not reproducible.

5. **[SHOULD-FIX] “Triggers the next rung” gives a metric architectural authority without a governance step.** A threshold breach should create a proposal or decision packet, not automatically change retrieval implementation. Cost, latency, portability, and failure analysis may argue against escalation despite low recall.

6. **[SHOULD-FIX] The evaluation design is vulnerable to test-set overfitting.** A maintained set of only “~30” known queries can be optimized directly by adding labels, aliases, or links. No holdout queries, rotation policy, provenance, or change-review rule is defined.

7. **[SHOULD-FIX] Item 1 does not specify the lexical algorithm sufficiently for deterministic implementation.** “Lexical IDF ranking” omits tokenization, stemming, stop words, field weighting, IDF corpus, tie-breaking, Unicode normalization, and versioning.

8. **[SHOULD-FIX] “Edges travel with every hit” is undefined and may cause uncontrolled context expansion.** Edge direction, depth, type filtering, deduplication, ordering, and context budget must be fixed. Otherwise retrieval output is neither deterministic in shape nor predictably lean.

9. **[SHOULD-FIX] Item 3 does not address FTS5 portability.** SQLite build options, tokenizer/version differences, ranking expression, index schema, and deterministic rebuild checks must be pinned before FTS5 can be treated as a reproducible derived layer.

10. **[SHOULD-FIX] Item 3’s local-embedding rung lacks artifact governance.** Model identity and digest, tokenizer, chunking, vector dimensions, numerical format, platform variance, corpus hash, and rebuild procedure are all absent. Without them, the derived index cannot be validated or reproduced.

11. **[SHOULD-FIX] Item 3 overclaims that curated links are “the hallucination-free graph.”** Human-curated links may be mistaken, obsolete, or semantically overstated. Curation avoids one extraction failure mode; it does not establish truth.

12. **[SHOULD-FIX] The empirical claims in “Context” are not traceable.** “Claude Code’s grep-first result,” “LlamaIndex’s own concession,” “Sourcegraph’s … guidance,” and “Cursor, Nov 2025” lack citations or repository-local evidence. They cannot support an “evidence-based position” as written.

13. **[SHOULD-FIX] Cross-document contradiction — ADR-007 vs ADR-004:** ADR-007 assigns graph omission to a future “audit spec,” while ADR-004 says future audit verdicts use knockout/ordinal routing. Neither document defines how omission findings become supplier tasks, evidence-bearing answers, or queue records; ADR-004’s unconditional knockout discard is especially unsuitable for uncertain missing-link findings.

14. **[NIT] “No embeddings at ~250 notes” uses corpus size rhetorically after rejecting size-triggered escalation.** If current non-escalation is based on measured recall, cite that result; otherwise this remains a size heuristic.

**Most important thing MISSING:** A hermetic, versioned retrieval-evaluation protocol that cleanly separates `kb verify`, scheduled evaluation, supplier-generated model artifacts, and governance-approved escalation.