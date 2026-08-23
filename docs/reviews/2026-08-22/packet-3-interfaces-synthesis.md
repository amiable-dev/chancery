# Chairman's Synthesis — Adversarial Review, Packet 3 (ADR-008 / 009 / 010)

**Convention used below.** `[BLOCKER]` = must change before code is written, because it is wrong, self-contradictory, or will produce bad data/an unenforced invariant. A verdict of APPROVE-WITH-CHANGES with blockers means the document's *core decisions survive* the required edits; REJECT means the document cannot be built from as written.

**Two corrections to claims raised in council deliberation, so they are not repeated downstream:** (a) ADR-009 does *not* require `verify` to fetch pages — it correctly assigns fetching to "network verbs" and gives verify structural checks only; the real defects are storage, binding, and freshness, not a hermeticity violation. (b) ADR-008 does not claim to ship a Node runtime in a binary; `bun build --compile` embeds Bun/JavaScriptCore, which makes the binary a **second runtime**, and the defect is the missing parity contract, not an impossibility.

---

## ADR-008 — Interfaces and runtime

**Verdict: APPROVE-WITH-CHANGES** (Decisions 1, 3, 4 stand; Decision 2's final sentence and Decision 5's trigger language must be resolved or struck before build)

1. **[BLOCKER] Decision 2, "Both phases of any judgment verb may also be exposed as tools."** "May" is not a decision, and phase 2 *applies an answer* — a write. As written, an implementer can ship a canonical write path through MCP without violating a single sentence in this ADR, while Decision 4 says "Direct canonical writes do not exist on any interface." Replace with an explicit tool list and a declared write target per tool (queue/staging only, or gated-apply with the identical preconditions, authorization, task binding, and clean-worktree checks the CLI enforces).

2. **[BLOCKER] Decision 2 has no proposer ≠ supplier rule.** Combined with ADR-010's "any schema-conforming answerer" and ADR-009's recording of verdicts as evidence, the same agent that filed a proposal can supply the phase-2 judgment for it and have the CLI record it as evidence. Either bar the proposer from supplying its own judgment, or require the record to disclose that it did.

3. **[BLOCKER] Decisions 2–3 leave the queue→PR seam undefined.** "The PR contract is the universal remote write path… agent proposes via PR, CI runs the gate, a human promotes" never says what a PR may *contain*. A PR carrying hand-authored canonical markdown can pass structural verification while bypassing the two-phase apply rule entirely — that is invariant 8 defeated by the path this ADR calls universal. Define permitted PR contents, the deterministic apply step, what "promotes" means mechanically, and how a locally queued `kb_propose` item becomes such a PR.

4. **[BLOCKER] No threat model for the component about to be built.** "local trust boundary only, no auth of its own" is asserted, not analysed. Missing at minimum: repo-root confinement and symlink/path-traversal handling for `kb_search`/`kb_read`; response size caps; queue-flood limits; behaviour on a dirty or concurrently mutated worktree; and the confused-deputy loop where `kb_read` returns attacker-authored markdown instructing the agent to call `kb_propose`. Propose-only bounds blast radius; it does not bound poisoned proposals a tired human promotes.

5. **[BLOCKER] Context names two consumers the Decision does not serve.** "the deep-research workflow and the Python ecosystem are real non-shell consumers **we already have**" is the load-bearing justification, yet Decision 2 ships *local stdio only* (hosted deferred to T4) and Python gets neither a library nor a documented subprocess/JSON-RPC contract. Motivation and decision do not intersect. Name the actual first consumer, or add the Python surface.

6. **[SHOULD-FIX] Decision 5 rests on an EOL floor and an untested second runtime.** "Node ≥20 now" in a document dated `2026-08-22` floors on a line whose LTS window closed in April 2026 — state a supported-LTS policy instead. And `bun build --compile` ships a different engine: for a tool whose product *is* determinism, a compiled binary needs a parity contract (identical `kb verify` results), a supported-platform matrix, and reproducibility requirements, or Node SEA should be used instead. "~1% of the cost" is asserted with no derivation.

7. **[SHOULD-FIX] Decision 5's triggers are exactly the exemption ADR-009 condemns.** "when distribution matters (T5)", "measured per-invocation latency at volume", "a real distribution play" have no thresholds and no measurement method — while ADR-009's Context indicts "the one component exempted from the project's own trigger discipline." T4 and T5 are also invoked but neither defined nor linked. Give numbers, an owner, and a location.

8. **[SHOULD-FIX] Zero citations in the paragraph doing all the deciding.** "Aug-2026 verified landscape", "4–32× token cost vs CLI", "~46 clients", "MCP Resources unused by any major client", "~1% of the cost". The sibling ADR mandates URL-liveness taxonomies and per-citation support verdicts; this ADR should dogfood R1a on itself.

9. **[SHOULD-FIX] Vendor constants embedded as permanent architecture, with no rot owner.** "six-spec-field SKILL.md", "Windsurf budgeted to 6k chars", "`CLAUDE.md` imports `AGENTS.md` because Claude Code does not read it." A hermetic verify (invariant 2) *cannot* detect that Windsurf raised its budget or that Claude Code started reading `AGENTS.md`. Move these to a versioned adapter data file with a review trigger, and state explicitly that KB014 checks regenerate-and-diff of local artifacts, not upstream conformance.

10. **[SHOULD-FIX] The procedure source — the foundation of the "primary interface" — is never specified.** "One procedure source compiles to every harness" gives no format, location, or generation command, and "every harness" is unbounded while only four conventions are named. Also undeclared: the canon status of the generated adapters, which must be committed to be read yet are regenerable (invariant 3) — see cross-doc C4.

11. **[SHOULD-FIX] Two overclaims in Consequences.** "Reach without a second enforcement surface" is false by Decision 2: the facade is a second code path that must itself enforce propose-only semantics; say instead that it delegates to the same gate core, and require a test proving it. And "behavioural parity is the gate's job" is more than the gate can deliver — the gate sees writes; nothing here constrains `kb_search`/`kb_read` to CLI semantics (ranking, redaction, draft/queue visibility), so the facade can expose material the CLI hides. Say *outcome* parity for writes and specify read-side parity separately.

12. **[NIT]** `links` omits the `mcp-facade` design spec and ADR-005 (queue), on which Decision 2 depends. "because Claude Code does not read it" is pronoun-ambiguous. Decision 5 (runtime) is unrelated to interface topology and belongs in its own ADR with its own trigger.

**Most important thing MISSING:** a normative end-to-end write state machine — permitted artifacts and gate checks for CLI, skills, MCP, and PR — plus a single conformance suite run against all four surfaces that asserts no path reaches canon without the gate. That suite *is* invariant 8; without it the invariant is a sentence.

---

## ADR-009 — Validation protocol

**Verdict: REJECT.** R1a is the next build phase, and its two central artifacts — the evidence store and the taxonomy — are underspecified in ways that will produce wrong data on first contact with a real bibliography.

1. **[BLOCKER] Per-citation evidence has no declared storage class, and every implied location breaks an invariant.** R1a records "URL-liveness taxonomy per citation… recorded as evidence" and "per-citation **support verdicts**". Frontmatter violates invariant 4 (note granularity) and invariant 5 (lean notes). A derived layer violates invariant 3, because network observations and supplier verdicts are *not* hermetically rebuildable from files. This is canon-that-isn't-frontmatter: a third storage class the project has never named. Specify class, path, schema, git tracking, and — critically — **citation identity/keying** (raw URL? canonicalized URL? URL + note + offset? content hash?) before any code exists.

2. **[BLOCKER] The liveness taxonomy conflates two orthogonal axes and is non-exhaustive.** "`live` / `dead-with-archive` / `likely-fabricated`" mixes reachability with authenticity: a fabricated citation can resolve (hallucinated title on a live domain), and a genuine one can 404. There is no bucket for dead-without-archive, 403/paywall, robots/WAF-blocked, JS-required, rate-limited, redirected, malformed, or transient DNS failure — all of which will be coerced into an accusation of fabrication and poison the corpus. Split into `reachability` × `authenticity-signal`, enumerate every network outcome, and note that fabrication is a *judgment*, never a deterministic network result.

3. **[BLOCKER] Support verdicts are at the wrong granularity and are bound to nothing immutable.** "per-citation **support verdicts**… against full-page content" cannot represent a source that supports one claim in a note, contradicts another, and is irrelevant to a third. And nothing requires a content digest, canonicalized URL, retrieval record, selected passage, task digest, or answer digest — so the page can change between emission, judgment, application, and audit, and the verdict is irreproducible. Bind verdict → (claim or quoted proposition) × (source snapshot + passage) × (task, answer).

4. **[BLOCKER] No verify enforcement mapping and no freshness semantics.** "checked structurally by verify" confirms a record *exists*, not that it is current or that the state is acceptable. The ADR never states what `kb verify` does with `likely-fabricated`, with dead-no-archive, or with a citation that never saw a network verb (the entire pre-R1a corpus). Required: pass/fail/warn per state; expiry expressed without trusting a clock (invariant 6) — commit/object binding is the obvious candidate; and a migration plan for existing notes.

5. **[BLOCKER] All of R1a silently assumes URL-bearing citations.** A research programme cites books, DOIs, datasets, preprint versions, standards, PDFs, and personal communications. None of these has a liveness verdict or a "full-page content" fetch path, and no provenance rule covers them. Either scope R1a explicitly to web citations or specify the non-URL branch — for the stated first user, this is likely the majority of the bibliography.

6. **[SHOULD-FIX] Title and Consequences overstate determinism.** "deterministic evidence now" and "Everything checkable-by-rule ships immediately; everything needing judgment infrastructure waits" are contradicted by R1a itself: `SUPPORTED`/`UNCERTAIN`/`CONTRADICTED` are supplied judgments, and judge-task emission *is* judgment infrastructure shipping now. Distinguish deterministic capture and structural validation from nondeterministic semantic decisions.

7. **[SHOULD-FIX] "cuts fabricated citations 6–79×" is a category error as used.** A liveness check *detects* unreachable URLs; it cannot reduce fabrication unless it sits in a generate-check-regenerate loop this ADR never describes. As stated it will be read as an efficacy claim for R1a. Restate as a detection rate, or describe the loop.

8. **[SHOULD-FIX] The "constitutional collision" argument proves too much.** "live-web lineage resolution cannot coexist with a hermetic gate in the same command" — R1a already solved that shape: network verbs record, verify checks structurally. The same split generalises to lineage resolution, so hermeticity is *not* a reason to gate R1b. Adjudication cost is. Keep the real reason; drop the argument that undermines your own architecture.

9. **[SHOULD-FIX] The R1b trigger is not executable.** "an adjudication-budget audit (projected items/week × minutes/item vs the owner's stated budget)" — the budget is neither stated nor linked. "90 days of R1a evidence" has no minimum-N; for a single-user inflow that may be n≈12 and decides nothing. Add the budget figure, a start event, minimum item count, a decision owner, a pass/fail formula, a recorded trigger artifact, and the outcome that **cancels** R1b rather than re-queuing it forever.

10. **[SHOULD-FIX] Consequences pre-decides what the Decision defers.** "The 'verified' tier, when it arrives, means k≥2 independent lineages or one authoritative primary" fixes R1b's semantics before the evidence meant to shape them; "authoritative" is undefined and judgment-dependent, and one primary source establishes what it *said*, not that the claim is true. Mark as a non-binding sketch or delete.

11. **[SHOULD-FIX] Provenance classes mix axes, overlap, and have no assignment mechanism.** `external-primary` / `external-secondary` / `internal-synthesis` / `model-inference` conflate source origin/type with derivation: a secondary source cites a primary; an internal synthesis may be model-authored. Separate the axes, state a precedence rule, and specify *who assigns* the class (proposer self-report? judge task? audit?) — R1b's "authoritative primary" makes this load-bearing.

12. **[SHOULD-FIX] Invariant 7 gets restated but never enforced.** "internal citations are navigation, never corroboration" needs a named verify rule that refuses internal citations as corroboration input; otherwise it is a slogan in a document whose entire job is mechanising rules.

13. **[SHOULD-FIX] "note-level supersession on the existing schema, with integrity checks" names no checks.** Cycles, dangling `supersedes` targets, fan-in (two notes superseding one), supersession across renames, whether superseded notes remain addressable — all need rules and rule IDs before build.

14. **[SHOULD-FIX] Fetched page content is unaddressed as data.** Support verdicts "against full-page content" imply fetching, caching, and transmitting third-party pages to an external supplier. Nothing states snapshot location, size caps, retention, or that a public open-source corpus is not accumulating a copyright liability.

15. **[NIT]** `links` omits ADR-010 despite "bounded by ADR-010". Consequences attributes "per-citation evidence records" to "ADR-003's machinery", but this ADR introduces them — misattribution or an undocumented prior definition.

**Most important thing MISSING:** the enumerated verify rule set for R1a — rule IDs, evidence file location and schema, citation identity, pass/fail/warn per state, and the migration path for pre-R1a notes. Without it, "R1a — build now" is a direction, not a spec.

---

## ADR-010 — Judgment suppliers

**Verdict: APPROVE-WITH-CHANGES** (the anti-coupling thesis is sound; three clauses currently contradict it)

1. **[BLOCKER] Decision 1 records false provenance.** "Any schema-conforming answerer — single agent, council, **human** — is a valid supplier" followed by "decisions **supplier-anonymous**, provenance-marked `model-inference`" means human judgment is stamped as model inference. It also overloads ADR-009's *source* provenance vocabulary for a *decision* provenance concept the two ADRs never distinguish (cross-doc C3). Introduce distinct decision-provenance values: human, model, mechanical.

2. **[BLOCKER] Decision 2(b) dissolves Decision 2's refused role.** "*panel judge* for ordinal rubric dimensions" — ADR-009's `SUPPORTED`/`UNCERTAIN`/`CONTRADICTED` verdicts *are* an ordinal rubric feeding evidential tiers. So a panel may rule on whether a source supports a contested claim: adjudicating contested truth under another name, and precisely the "path by which panel consensus upgrades a claim's evidential tier" the same clause refuses. Fix with an allowlist of permitted dimensions (style, completeness, scope-fit…) and explicit exclusion of support verdicts, source reliability, lineage independence, and tier assignment.

3. **[BLOCKER] Supplier anonymity makes the refusal unenforceable and bad judgments un-invalidable.** If nothing durably records supplier class, model/version, and task-schema version, then (a) no gate can enforce "no panel on contested truth", and (b) when a supplier is later found defective — bad version, prompt bug, compromised endpoint — you cannot enumerate and re-run its decisions. That is irreversible information loss in a project whose thesis is auditability. The defensible rule is anonymity *in note frontmatter* (invariants 4/5), full identity in the governed evidence record.

4. **[BLOCKER] Decision 3 contradicts Decision 1's supplier-neutrality.** "no supplier-specific artifacts" versus "council task instructions carry the effective-votes framing": the model-free CLI emitting council-aware instruction text is supplier coupling inside the one component that must stay neutral (invariant 1). Note that "no `kb council` verb, ever" is cosmetic by comparison — the coupling surface is the task schema, not the verb table. Move the framing into a council-side adapter.

5. **[BLOCKER] Nobody owns task transport.** llm-council is "library + MCP + HTTP", but this ADR never says who moves a task from CLI to supplier and back. Absent an explicit "the harness or the human transports; the CLI never dials out," the obvious implementation is a `kb` supplier adapter calling council over HTTP — a model call inside a model-free CLI (invariants 1 and 2). Put the prohibition in the Decision, not the preamble.

6. **[SHOULD-FIX] "Any schema-conforming answerer" treats schema validity as trust.** A replayed, stale, task-swapped, truncated, or adversarial answer can be perfectly schema-conforming. Required: task-digest binding, schema versioning, answer identity, replay/idempotency rules, application preconditions, and failure semantics for malformed / partial / timeout / refusal / answer-to-stale-task.

7. **[SHOULD-FIX] The router role smuggles consensus back in, inverted.** "member dissent is a go-gather-more-evidence signal" makes panel *agreement* an implicit stop signal — agreement subtracting required evidence work is the refused path in mirror image. State the asymmetry explicitly: dissent may add work; agreement may never reduce it or upgrade a tier. Also give a threshold and an output schema.

8. **[SHOULD-FIX] The disagreement structurer has no safe output contract.** "positions, evidence, cruxes" without required faithful quotation, source linkage, separation of supplied evidence from model conjecture, and preservation of minority positions means generated synthesis can manufacture or erase disagreement — inside the role you sanctioned precisely because panels must not adjudicate.

9. **[SHOULD-FIX] Self-contamination is unaddressed.** Decision 4 lets llm-council consume the KB via the facade while also judging over it — a panel ingesting its own prior `model-inference` records as evidence. An ADR built on correlated-consensus contamination must say how `model-inference` records are excluded from, or flagged in, council-visible evidence.

10. **[SHOULD-FIX] "~2 votes regardless of panel size" is uncited and load-bearing.** It is the sole quantitative basis for the effective-votes framing shipped verbatim in task instructions. Downgrade to a stated conservative policy assumption with a review trigger, or cite it.

11. **[SHOULD-FIX] The graceful-degradation claim has no default and no decider.** "contested items wait for a human **or** take a single-model structuring pass" — which, chosen by whom, and what does verify do with the resulting record?

12. **[NIT]** `links` omits ADR-008 though Decision 4 depends on the facade defined there. "no `kb council` verb, **ever**" is unearned — ADRs are superseded, not eternal; the real constraint is "no supplier-specific core semantics." "a single-model structuring pass with **less** family diversity" — a single model has none.

**Most important thing MISSING:** the versioned two-phase task/answer schema, a supplier conformance suite, and a decision-record audit schema (supplier class, version, task class, digests). The interface this ADR declares to be the entire abstraction is the one artifact it never defines.

---

## Cross-document findings

**C1. [BLOCKER] ADR-008 × ADR-009 × ADR-010 — the three ADRs jointly build a self-judging evidence pipeline.** ADR-008 Decision 2 exposes "Both phases of any judgment verb" as MCP tools; ADR-010 Decision 1 admits "any schema-conforming answerer" with no proposer≠supplier rule; ADR-009 R1a records the resulting verdicts as evidence, supplier-anonymous. Composed, a local agent proposes, judges its own proposal, and launders the result into the corpus as an untraceable record — and no single document contains a sentence prohibiting it. Name and prohibit the composition explicitly in all three.

**C2. [BLOCKER] ADR-009 × ADR-010 — the judge-task loophole.** ADR-009 R1a obtains support verdicts "via emitted judge tasks"; ADR-010 Decision 1 lists "council" as a valid supplier and Decision 2(b) permits panel judging of ordinal rubrics. Therefore a panel can supply the verdicts that feed evidential tiers — the exact path ADR-010 Decision 2 refuses. One must change: either verdict tasks are marked supplier-restricted and the task schema carries enforceable task classes plus supplier attestation, or ADR-010 drops the refusal as unenforceable.

**C3. [BLOCKER] ADR-009 × ADR-010 — `model-inference` means two different things on the same day.** In ADR-009 it is one of four *source* provenance classes; in ADR-010 it is the stamp on every recorded *decision*, including human ones. Two same-dated accepted ADRs, one token, two ontologies, plus a factual falsehood. Split the vocabularies.

**C4. [BLOCKER] ADR-008 × ADR-009 — two artifacts fall outside invariant 3's canon/derived binary, and neither document notices.** ADR-008's generated adapters are committed but regenerable (`committed-derived`, safe for verify to rewrite); ADR-009's liveness and support evidence is committed and **not** rebuildable (`canon-sidecar`, verify must never regenerate it). These are *different* cases needing *different* rules, but the missing taxonomy is the same missing taxonomy. Resolve centrally, once, before either build begins.

**C5. [SHOULD-FIX] ADR-010 × ADR-009 — ADR-010 is written against a state that is gated.** ADR-010 sanctions the structurer for "contested/UNCERTAIN items" and its Consequences invoke `contested` keeping both positions; ADR-009 places the tier machinery and `contested` in **R1b — gated behind 90 days**. R1a ships only `SUPPORTED`/`UNCERTAIN`/`CONTRADICTED`. Rewrite ADR-010's roles against R1a states and mark the `contested` clauses R1b-gated.

**C6. [SHOULD-FIX] ADR-008 × ADR-010 — the topology permits a hosted write surface by composition.** ADR-008 authorizes only a "Local stdio MCP facade" with hosted deferred to T4; ADR-010 Decision 4 blesses llm-council (which is "library + MCP + **HTTP**") consuming the KB "via the MCP facade." State explicitly that only a colocated process may use the facade and that no HTTP-to-stdio bridge may be built, or T4 is satisfied silently by an integration ADR.

**C7. [SHOULD-FIX] All three documents — `status: accepted` with `council_review: pending (packet 3)`.** Three ADRs dated `2026-08-22`, all accepted, all awaiting the review now happening — and ADR-009 binds normatively to an unreviewed ADR-010 ("bounded by ADR-010"), on the very question of the council's own powers. Either "accepted" does not mean reviewed (then define that in the ADR template) or these should read `proposed`. A governance project cannot ship this ambiguity in its own governance records.

**C8. [SHOULD-FIX] All three documents — the evidence standard is not applied to the documents that set it.** ADR-009 mandates URL-liveness taxonomies, per-citation support verdicts, and provenance classes, while all three ADRs make uncited, load-bearing quantitative claims ("4–32× token cost", "~46 clients", "~1% of the cost", "39–77%", "6–79×", "~2 votes regardless of panel size"). Two of these are then *shipped into generated artifacts* (adapter constants, council task instructions). Dogfood R1a on the ADR corpus, or the corpus's first user reads a governance system that exempts itself.

---

## Council's single highest-priority instruction before build

Before any of R1a or the MCP facade is written, land one small document that answers three questions the packet leaves open and that every blocker above traces back to: **(1) what storage classes exist beyond canon-frontmatter and rebuildable-derived, and what verify may rewrite in each; (2) the versioned task/answer schema with task classes, supplier-class attestation, and digest binding; (3) the end-to-end write state machine plus one conformance suite proving invariant 8 across CLI, skills, MCP, and PR.** Everything else in this review is downstream of those three.