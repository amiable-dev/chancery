## What

<!-- One paragraph. Link the ADR or spec if this implements one. -->

## Write-paths contract (delete rows that don't apply)

- [ ] **Staged sources / queue proposals / task-answer artifacts only** — no canonical edits
- [ ] **Canonical (`concepts/`, `flashcards/`, `.kb` config) diffs**: matching apply-records are included and reference this base commit
- [ ] **Engine change**: both-polarity fixtures added in this PR for every new/changed check
- [ ] `npm test` and `kb verify` green locally

<!-- Hand-authored canonical markdown without apply-records is declined by policy —
     see CONTRIBUTING.md and docs/architecture/write-paths.md -->
