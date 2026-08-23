# Schemas

Every structured artifact validates against a JSON Schema in `.kb/schemas/` — notes at rest, and **every two-phase answer** before it can touch anything.

| schema | validates |
| --- | --- |
| `concept.schema.json` | concept frontmatter: title, date, tags, status (`draft`/`living`/`stable`/`superseded`), facets, supersession fields, and `sources[]` with hash / liveness / provenance class |
| `flashcard.schema.json` | deck frontmatter |
| `rubric-verdict.schema.json` | assess answers: every disqualifier addressed with a rationale, every dimension rated on the ordinal scale |
| `concept-draft.schema.json` | promote answers: the fields concepts are *rendered from* — sections can't be missing or misordered because prose never carries the structure |
| `card-draft.schema.json` | card create/refresh answers |
| `facet-draft.schema.json` | classification answers (novel values become queue proposals, never writes) |
| `link-draft.schema.json` | cross-link proposals — every link needs a clause saying *how* the two relate |
| `query-answer.schema.json` | grounded answers: citations checked against the retrieved set |
| `support-verdict.schema.json` | claim-level evidence verdicts, quote-verbatim enforced |
| `audit-finding.schema.json` | semantic-lint findings, discriminated per check |

All answer schemas require the envelope's `task_id` and accept a supplier attestation (`supplier`, `proposer_overlap`) — recorded in the audit trail, never in notes.
