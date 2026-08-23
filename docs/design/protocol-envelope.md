# Design spec: the protocol envelope — task↔answer binding and the trust boundary

**Status:** implemented 2026-08-22 · **ADR:** [001](../adrs/001-two-phase-judgment-protocol.md) · **Origin:** council packets 1 & 4, which independently named this the single missing mechanism ("everything else is a thin wrapper; this is the only genuinely new mechanism and it is absent")
**Ownership:** this document owns the task/answer envelope for **every** judgment-consuming surface — `assess`, `promote`, `cards`, `facets`, `link`, `query --answer`, future `support`, `audit`, and the MCP `kb_task`/`kb_submit` tools. No other spec may define envelope fields.


*Deviations at implementation: none; the drafting task class and the stateless read-only variant are specified above.*

## 1. Why

Today an answer file binds to nothing: `kb assess x --verdict v.json` will apply a verdict computed against content that has since changed, replay an old answer, or accept a well-formed answer to the wrong task. And schema conformance is syntactic — the founding incident was an automated pass damaging notes, and the supplier channel reproduces exactly that class unless the *apply* step is structurally bounded.

## 2. The envelope

Phase 1 emits, and phase 2 requires back, an envelope wrapping every task:

```jsonc
{
  "envelope": {
    "task_id": "sha256(verb, target, corpus_commit, inputs)[:16]",
    "verb": "assess",
    "schema_version": "…",            // of the answer schema AND the ontology (kb.config version)
    "corpus_commit": "git HEAD at emission",
    "input_hashes": { "staging/x.md": "sha256:…", "rubric": "sha256:…", "exemplars": { … } },
    "allowed_writes": ["concepts/x.md", ".kb/queue/promotion-*.jsonl"],   // declared write set
    "untrusted_payload": true,          // C3-sourced content is data, never instructions
    "emitted_at_commit_only": true      // no wall-clock in the envelope (hermetic replay)
  },
  "task": { …existing task body… }
}
```

**Read-only verbs use a stateless envelope**: `kb query` derives its `task_id` from the question + retrieved content instead of persisting a C6 record (nothing accumulates per query; there is no write to audit). The answer echoes the id; a changed corpus or question re-derives differently and refuses as stale. Mutating verbs always persist.

Phase 2 (`--verdict/--draft/--answer`) **refuses** when: `task_id` absent or unknown; `corpus_commit` ≠ current HEAD for any file in `input_hashes` whose hash changed (stale-task rejection — unchanged files may drift HEAD harmlessly); `schema_version` mismatch after a migration; or the answer's implied writes exceed `allowed_writes`. Each refusal has its own KB code and remedy ("re-emit the task").

## 3. The trust boundary — what a schema-valid malicious answer cannot do

1. **Write outside `allowed_writes`** — the apply step path-checks every write against the declared set (no path joins from answer content; slugs resolve through the index only).
2. **Mutate C2 configuration** — vocabulary changes only via queue acceptance; no answer writes config.
3. **Carry instructions in content** — C3-sourced payload is marked untrusted; renderers treat every answer field as data (list items escaped where markdown-significant; no field is ever executed or interpreted as a command).
4. **Skip re-verification** — every `--apply` is followed by an in-process `verify` over the touched files (fast subset), and a failing post-apply verify **rolls the operation back**: multi-file writes stage to a temp set and atomically move only after the subset passes. Partial application does not exist.
5. **Replay** — a `task_id` already applied is refused (`.kb/assessments/` records applied ids); identical re-application of an additive merge is idempotent where the operation is naturally so, refused otherwise.

## 3b. Task classes and supplier restrictions

Every task carries a `task_class`, and each class declares which supplier classes may answer it. Supplier class arrives as **attestation** in the answer (`supplier: {class, id, version}` — self-reported, not cryptographically proven; the C6 record is what makes a false attestation auditable after the fact, and refusing unattested answers is what makes the restriction *enforceable at all*, which anonymity-everywhere would not be).

| task_class | examples | allowed supplier classes |
|---|---|---|
| `drafting` | concept/card drafting, link suggestions, query answers | `human`, `model-single`, `model-panel` |
| `rubric-ordinal` | assess dimensions, card-quality review | `human`, `model-single`, `model-panel` |
| `classification` | facet assignment, provenance-class spot-checks | `human`, `model-single`, `model-panel` |
| `evidence-verdict` | support verdicts, source reliability, lineage independence, tier assignment | `human`, `model-single` — **`model-panel` excluded** (ADR-010: panel consensus must not feed evidential state) |
| `structuring` | disagreement structuring, audit-finding write-ups | `human`, `model-single`, `model-panel` — output contract per ADR-010 §3a (faithful quotation, source linkage, conjecture separated, minorities preserved) |

An answer whose attested supplier class is not allowed for the task's class is **refused** (registry code), identically on CLI and MCP.

## 4. Supplier record, decision provenance, and separation of duties

The **corpus** stays supplier-anonymous (ADR-010); the **judgment artifact** (C6) records `supplier` (class, id, version), `task_class`, task and answer digests, and the answering context — full identity in the governed record is what lets a later-discovered-defective supplier's decisions be enumerated and re-run.

**Decision provenance** — vocabulary owned here, disjoint from ADR-009's *source* provenance classes: every applied judgment records `decision_provenance: human | model | mechanical` (`mechanical` = rule-applied with no judgment, e.g. a migration). A human answer is never stamped as model inference.

**Proposer≠supplier disclosure** — required field on every C6 record: `proposer_overlap: true | false | unknown`, true when the answering supplier also produced or staged the material under judgment. Not machine-prevented at this gear; machine-*visible* always, and the conformance suite (write-paths §3) asserts the field's presence.

## 5. Failure semantics

| situation | behaviour |
|---|---|
| no supplier answers | task stays open in C6; nothing blocks; listed by `kb queue` |
| answer fails schema/envelope | refused with code; task remains open; N repeated failures noted in the artifact |
| suppliers disagree (multi-answer verbs) | routed to the queue as a contested item; ADR-010's roles apply |
| supplier class not allowed for task class | refused with code; recorded in C6 |
| migration lands mid-task | stale-task rejection on submit; re-emit |

## 6. Acceptance

- Round-trip: emit → mutate input → submit ⇒ stale rejection with the right code.
- Replay: apply once, resubmit ⇒ refused.
- Write-set: an answer implying a write outside `allowed_writes` ⇒ refused, nothing written.
- Rollback: induced post-apply verify failure ⇒ tree byte-identical to pre-apply.
- Task-class restriction: an `evidence-verdict` answer attesting `model-panel` ⇒ refused, identically via CLI and MCP.
- Disclosure: a C6 record missing `proposer_overlap` ⇒ conformance-suite failure.
- Envelope schema versioned; both-polarity fixtures for every refusal code (the KB022 family in the overview registry).

## Non-goals

Cryptographic supplier authentication; distributed task queues; concurrent multi-writer arbitration beyond git (ADR-003's stated scope).
