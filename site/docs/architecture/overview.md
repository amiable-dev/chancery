# Architecture

The one-paragraph model: **markdown files are the source of truth, but not all files are equal** — every path has a data class, from canonical notes to quarantine to append-only evidence. A deterministic CLI owns every mutation and check; it never invokes a model, holds no model credential, and makes no network call in its verification path. Where judgment is needed, commands run in two phases bound by a task envelope; any supplier answers; the CLI validates and applies by rule, re-verifies what it touched, and rolls back on failure. **`kb verify` in CI is the contract.**

```
 untrusted inflow (quarantine)          judgment supplier
 URLs → staging/  ──assess──► task ───► (agent | council | human)
                                │             │
              ┌───── discard    queue    promote ◄─ envelope-bound answer
              ▼                   │         │
        (recommendation)    (human governs) ▼
                                     concepts/ ──cards──► flashcards/
                                        │
        query · context · sources · support · audit · export · verify ◄── CI
```

## Standing invariants

1. `kb` never calls a model — judgment is supplied through the task contract.
2. `kb verify` never touches the network — network verbs record evidence; verify checks the records.
3. Files are canon; derived layers are rebuildable and never the source of truth.
4. Frontmatter lifecycle only at note granularity.
5. Live notes stay lean — history lives in git.
6. No unverifiable metadata.
7. Internal citations are navigation, never corroboration.
8. **No path around the gate, on any interface.**

## The full record

The complete architecture — data classification, the write state machine, the protocol envelope, ten ADRs, the design specs, and the adversarial council reviews with per-finding dispositions — is versioned in the repository and written to be read:

- [Architecture & write paths](https://github.com/amiable-dev/chancery/tree/main/docs/architecture)
- [ADRs](https://github.com/amiable-dev/chancery/tree/main/docs/adrs)
- [Design specs](https://github.com/amiable-dev/chancery/tree/main/docs/design)
- [Council reviews & dispositions](https://github.com/amiable-dev/chancery/tree/main/docs/reviews/2026-08-22)
- [Why "Chancery"](https://github.com/amiable-dev/chancery/blob/main/docs/why-chancery.md) — the name, mechanism for mechanism
- [The launch writeup](https://github.com/amiable-dev/chancery/blob/main/docs/launch.md)
