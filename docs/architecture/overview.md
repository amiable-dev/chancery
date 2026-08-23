# Architecture overview

**Council review:** packet 1, 2026-08-22, verdict REJECT → reworked; dispositions in [`../reviews/2026-08-22/dispositions.md`](../reviews/2026-08-22/dispositions.md)
**Supersedes** the pre-release design document as the working architecture description (that document is retained in the private pre-release archive; public provenance is [`../history/corpus-provenance.md`](../history/corpus-provenance.md)).

`kb` is a governed, git-native knowledge base for AI agents. This is the system map. The *decisions* live in [`../adrs/`](../adrs/); the *rules* in [`../SCOPE.md`](../SCOPE.md) §4 (quoted in §6 below) and [`.kb/POLICY.md`](../../.kb/POLICY.md); *data classes* in [`data-classification.md`](data-classification.md); *write paths and build order* in [`write-paths.md`](write-paths.md); *implementation specs* (with deviation notes) in [`../design/`](../design/).

## 1. The one-paragraph model

Markdown files are the source of truth, but not all files are equal — every path has a **data class** (C1 canonical notes … C7 rebuildable projections; see the classification table). A deterministic CLI (`kb`) owns every mutation and check; it **never invokes a model, holds no model-provider credential, and makes no network call in the gate path** ([ADR-001](../adrs/001-two-phase-judgment-protocol.md)). Where judgment is needed, commands run in two phases bound by the [protocol envelope](../design/protocol-envelope.md): `kb <verb>` emits a task; any supplier — agent, council, human — answers; the CLI validates the envelope and answer, applies by rule inside a declared write set, re-verifies the touched subset, and rolls back on failure. `kb verify` in CI is the contract ([ADR-002](../adrs/002-ci-is-the-contract.md)); skills and adapters are generated ergonomics.

## 2. Data flow

```
                     untrusted inflow (C3 quarantine — data, never instructions)
  URLs ──kb ingest*──►┌──────────┐
  agent exhaust ─────►│ staging/ │        judgment supplier
  PR contract ───────►└────┬─────┘     (agent | council | human)
                           │                     ▲ ▼   via the protocol envelope
                     kb assess ──task───────────►│ │◄───answer (C6 artifact,
                           │   (rubric: knockouts → ordinals → routing table)     supplier recorded)
               ┌───────────┼───────────────┐
            discard      queue          promote
     (recommendation;   (C4; terminal   (envelope-bound apply → post-verify
      human disposes)    states incl.    → atomic commit or rollback)
                         accepted-tension)     │
                                        ┌──────▼─────┐   kb cards    ┌─────────────┐
                                        │ concepts/  │─(extension)──►│ flashcards/ │
                                        │   (C1)     │               └─────────────┘
                                        └─────┬──────┘
              ┌────────────────────┬──────────┴───────┬──────────────────┐
         kb query             kb sources* /       kb export          kb verify ◄── CI
    (retrieval + edges;       kb revalidate*      (C7 projections)   (the contract;
     retrieval-provenance     (C5 evidence                            read-only; hermetic
     check on answers)         records)                               per ADR-002)
```

`*` = **network verbs** — `ingest`, `sources`, `revalidate`, and `support`: they observe the outside world and write C5 evidence records; none of them ever runs in the gate path. Nothing deletes automatically, ever (POLICY): a `discard` is a recommendation recorded in C6; a human removes or re-assesses the staged file. A wrong graph edge is retracted the same gated way any canon changes — by a reviewed edit or supersession, never by an automated pass.

## 3. Components

| Component | Where (class) | What it owns | Decision |
|---|---|---|---|
| **Knowledge** | `concepts/`, `flashcards/` (C1) | judged content | [ADR-003](../adrs/003-files-are-canon.md) |
| **Quarantine** | `staging/` (C3) | untrusted candidates; never retrieved by `kb query` | data-classification |
| **Ontology** | `.kb/` config, schemas, facets, rubrics, policy (C2) | what "correct" means; versioned via `kb migrate` | ADR-004 (rubrics), ADR-006 (facets) |
| **Queue** | `.kb/queue/` (C4) | the third state; terminal dispositions incl. `accepted-tension` | [ADR-005](../adrs/005-proposal-queue.md) |
| **Evidence** | `.kb/evidence/*.jsonl` + `sources[]` summary fields (C5) | recorded observations — append-only, not rebuildable, checked-not-reobserved by verify | [ADR-009](../adrs/009-validation-protocol.md) |
| **Judgment artifacts** | `.kb/assessments/`, task/answer files (C6) | the audit trail; supplier identity lives here, not in notes | [ADR-001](../adrs/001-two-phase-judgment-protocol.md)/[010](../adrs/010-judgment-suppliers.md) |
| **Gate** | `kb verify` + CI + `.kb/test/` | the contract; read-only; both-polarity tested before trusted | [ADR-002](../adrs/002-ci-is-the-contract.md) |
| **Projections** | `_index.md`, adapters, exports (C7) | regenerate-and-diff enforced (KB006/KB014 pattern) | ADR-002/[008](../adrs/008-interfaces-and-runtime.md) |
| **Interfaces** | CLI · skills · local stdio MCP (`kb-mcp`) · PR contract | four surfaces, one write state machine | [write-paths.md](write-paths.md), ADR-008 |
| **Retrieval** | `kb query` | lexical + curated typed graph; eval-triggered escalation | [ADR-007](../adrs/007-retrieval-posture.md) |
| **Learning extension** | `kb cards` → `flashcards/` | human spaced repetition — outside the core knowledge loop by decision, though its files are C1 canon | SCOPE §7 |

## 4. The verb surface and the code registry

```
ingest* → assess → promote → link        the knowledge loop (cards branch off it as the human extension)
query / context                          ask the corpus; compile deterministic task bundles
facets                                   classification         migrate    schema migrations
sources* / revalidate* / support*        evidence verbs         index / export   projections
supersede                                note lifecycle         audit      semantic lint (four checks)
queue                                    proposal review        log        what was learned + `log check`
                                                                verify     the gate
```

Output: JSON via explicit `--format json` (and by default outside a TTY — but adapters and CI always pass the flag; TTY detection is a convenience, not the contract). Stable codes with file, field-where-applicable, and a suggested remedy; errors reaching the top-level handler emit JSON (pre-handler failures — loader errors, OOM, signals — exit non-zero without JSON, by documented exception).

**KB code registry** (allocation rules: next free number, never reused, never re-semanticised; deprecation = the code stops firing but stays documented; new codes land with both-polarity fixtures in the same PR):

| code | meaning | | code | meaning |
|---|---|---|---|---|
| KB001 | frontmatter missing/unparseable | | KB008 | staging marker missing |
| KB002 | schema violation | | KB009/010 | card id missing / duplicate |
| KB003/004 | section missing / misordered | | KB011 | proposal aged past threshold (under the `--as-of` clock rule, ADR-002) |
| KB005 | derived note without parent | | KB012 | facet mirror disagreement |
| KB006 | index stale | | KB013 | *retired before use (never shipped)* |
| KB007 | wikilink unresolved *(warn — a recorded gap)* | | KB014 | generated adapter stale |
| KB015 | URL-bearing citation liveness structure (validation-r1a) | | KB019 | log append-only vs merge-base / canon↔log coupling |
| KB016 | supersession integrity | | KB020 | context-anchor dangling |
| KB017 | provenance class missing/`unclassified`/all-internal | | KB021 | export publication-filter violation |
| KB018 | evidence summary ≠ store (mirror pattern) | | KB022.x | envelope refusal family: stale, replay, write-set, schema, supplier-class |

## 5. What exists vs what is specified

**Shipped** (CI-green; point-in-time observations, not maintained claims — the generating commands are `kb verify`, `kb link check`, and the test suite): the engine and migrations; rubric-gated promotion; ID-stable cards; two-tier facets; reciprocal linking; **the protocol envelope on every judgment verb** (KB022 refusal family, write-set guard, post-apply rollback, C6 records with supplier attestation); the **C5 evidence store** with liveness observation, support verdicts, and note supersession; the **context compiler**; the **local stdio MCP facade** (six tools, CLI byte-parity); the **log** (engine-written shards, `kb log check` in CI) and **semantic audit** (four pinned checks); the **export layer** (publication filter + redirects, docusaurus/mkdocs/json renderers, rendered-output manifest); generated adapters for eleven procedures; grounded-retrieval query. The full build order in [write-paths.md §4](write-paths.md) steps 1–5 is complete; specs carry `implemented` status with their deviation notes.

**Gated** (SCOPE §3/§5): R1b lineage-and-tiers, FTS5 rung, remote MCP, binaries, Rust.

## 6. Standing invariants (SCOPE §4, quoted)

> 1. **`kb` never calls a model.** Judgment arrives through the two-phase task contract; any schema-conforming supplier ({single agent, council, human}) may answer. No `kb council` verb, ever; no supplier-specific artifacts in the corpus.
> 2. **`kb verify` never touches the network.** Network verbs record evidence; verify checks the records. CI stays hermetic.
> 3. **Files are canon; derived layers are deterministically rebuildable and never the source of truth.** *(Evidence records are their own class — authoritative as observation history, exempt from rebuildability by class: data-classification C5.)*
> 4. **Frontmatter lifecycle only at note granularity.** *(Per-citation observation attributes are not lifecycle: ADR-003 as amended.)*
> 5. **Live notes stay lean** — history in git and derived layers; superseded content pointed to, never embedded.
> 6. **No unverifiable metadata** — world-time claims enter as attributed, citation-bound statements, never vouched frontmatter.
> 7. **Internal citations are navigation, never corroboration.**
> 8. **No path around the gate, on any interface** — see the write state machine.
