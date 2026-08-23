# CLI reference

Every command emits JSON with `--format json` (and by default outside a TTY). Errors carry a stable code, the location, and a suggested remedy — output an agent can act on without inventing fixes.

## The knowledge loop

| command | does |
| --- | --- |
| `kb init` | initialise a governed repository here (green gate immediately) |
| `kb ingest <url…>` | fetch into `staging/` as reviewable source notes |
| `kb assess <file> [--verdict v.json]` | two-phase rubric judgment → `promote` / `split` / `queue` / `discard` |
| `kb promote <slug> [--draft d.json] [--apply]` | staged note → concept note(s), rendered by construction |
| `kb cards <slug> [--draft c.json] [--apply]` | create/refresh the concept's flashcard deck |
| `kb facets [--sample N] [--draft f.json] [--apply]` | classify against the closed axes |
| `kb link check \| suggest [--draft l.json] [--apply]` | connectivity report → reciprocal cross-links |
| `kb supersede <old> --by <new[,new]> [--apply]` | atomic note supersession |

## Evidence (network verbs — never in the gate)

| command | does |
| --- | --- |
| `kb sources [--apply]` | content-hash every citation; record observations |
| `kb revalidate [--slug S] [--accept S]` | re-fetch and report evidence drift |
| `kb support <slug> [--verdicts v.json]` | claim-level support verdicts against pinned snapshots |

## Asking

| command | does |
| --- | --- |
| `kb query "<q>" [--domain D] [--answer a.json]` | grounded retrieval with graph edges |
| `kb context --for <task> <args> [--budget N]` | one deterministic task bundle |

## Maintenance & governance

| command | does |
| --- | --- |
| `kb verify` | **the contract** — hermetic validation, stable KB codes |
| `kb index` | regenerate generated indexes |
| `kb audit [--only <check>] [--findings f.json]` | semantic lint: contradictions, stale claims, gaps, graph rot |
| `kb queue [accept\|reject\|accept-tension <id>]` | the third state between pass and block |
| `kb log gap\|miss\|note "<text>"` · `kb log check` | the learning log + its append-only enforcement |
| `kb migrate [--apply]` | surgical structural migrations |
| `kb export docusaurus\|mkdocs\|json [--out D]` | mount-ready projections behind the publication filter |

Conventions: **dry-run by default** — writing verbs preview until `--apply`; bulk writers also require a clean git tree. `discard` never deletes. Verify exit code 0 with warnings = healthy with recorded gaps.
