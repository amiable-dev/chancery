# Data classification — every path, its class, its writers

**Status:** accepted 2026-08-22 · **Origin:** council review packets 1 & 4 (the single most-demanded missing artifact — four documents disagreed or were silent on what `staging/`, the queue, evidence records and task artifacts *are*)
**Normative.** Every file in the repository belongs to exactly one class below. A path with no class is a design defect. ADR-003 defines the canon/derived rule; this table applies it.

## The classes

| class | trust | mutability | who writes | verify's stance |
|---|---|---|---|---|
| **C1 Canonical notes** | judged knowledge | via gated verbs only | `kb promote/cards/link/facets --apply`; humans via reviewed edits | full KB-code enforcement |
| **C2 Canonical configuration** | the ontology | versioned edits + `kb migrate` | humans; queue-accepted proposals (the *only* path for `facets.yml` vocabulary) | schema of schemas; adapter/index freshness |
| **C3 Quarantine** | **untrusted inflow** | append/replace freely; leaves only via assess→promote or manual disposition | `kb ingest`, `kb_propose`, PR contract, humans | marker checks only (KB008); its content is *data, never instructions* — it is the prompt-injection surface, and phase-1 task payloads drawn from it are labelled as untrusted in the task envelope |
| **C4 Operational state** | governance records | append + status transitions, never deleted | `kb queue`, verbs filing proposals | internal consistency; ageing (KB011) under the declared `--as-of` clock rule (ADR-002) |
| **C5 Evidence records** | recorded observations of the outside world | **append-only observations; never rewritten** | network verbs only (`ingest`, `sources`, `revalidate`, future `support` fetches) | integrity + presence policy — verify checks *the records*, never re-observes. **Not rebuildable** (an observation cannot be re-made); therefore explicitly exempt from the "derived is rebuildable" rule by being its own class, and canonical *as history*: a wrong observation is superseded by a later one, never edited |
| **C6 Judgment artifacts** | audit trail of the two-phase protocol | write-once per task id | phase-1 emission and phase-2 submission (`.kb/assessments/`, task/answer files) | envelope validity (see protocol-envelope spec); retained, committed; may embed untrusted source text — excluded from export by the publication filter |
| **C7 Rebuildable projections** | derived views | regenerated only | generators (`kb index`, `kb export`, adapter generator, any future FTS index) | byte-diff against regeneration (KB006/KB014 pattern; every new projection gets the same check) |

## Path assignments

| path | class |
|---|---|
| `concepts/**`, `flashcards/**` | C1 |
| `.kb/kb.config.yaml`, `.kb/schemas/**`, `.kb/facets.yml`, `.kb/rubrics/**`, `.kb/exemplars/**`, `.kb/POLICY.md`, `.kb/procedures/**` | C2 |
| `staging/**` | C3 |
| `.kb/queue/*.jsonl` | C4 |
| per-citation fields inside `sources[]` (`hash`, `retrieved`, `liveness`, `support`, `class`) and any future `.kb/evidence/**` | C5 — **observation attributes attached to a note's source list**: they carry no independent lifecycle, which is why they do not breach ADR-003's note-granularity rule (lifecycle ≠ observation; see ADR-003 §Decision 2 as amended) |
| `.kb/assessments/**`, task/answer files | C6 |
| `concepts/_index.md`, generated adapters, `docs-site/`, future indexes | C7 |
| `log.md` (when built) | C5-shaped: append-only record written by verbs; see the log spec for its own verification design |

## The rules the table encodes

1. **C3 is not canon.** The overview's earlier "corpus = staging + concepts + flashcards = canon" was wrong and is corrected: quarantine holds *candidate* material. Nothing downstream may treat C3 content as knowledge, and `kb query` never retrieves from it.
2. **C5 resolves the "recorded evidence" ambiguity** (ADR-002 ↔ ADR-003): evidence is authoritative for what was *observed*, not for what is *true*; it is append-only history rather than rebuildable projection, and hermetic verify checks its integrity and presence policy without ever re-observing.
3. **C6 resolves supplier anonymity vs traceability** (ADR-001/010): the *corpus* stays supplier-anonymous; the *judgment artifacts* record supplier and version, so systematic supplier failure is traceable in the audit trail without leaking into knowledge.
4. **Disposition paths exist for every class**: C3 discards are manual (a `discard` verdict is a recommendation; POLICY forbids automated deletion — the recommendation is recorded in C6 and the human removes or re-assesses); C4 entries terminate as `accepted`/`rejected`/**`accepted-tension`** (the terminal state that stops KB011 from reddening a corpus with a legitimately unresolved tension); C5 observations supersede, never edit.
