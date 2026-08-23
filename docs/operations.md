# Operations — the layer below the architecture

**Status:** accepted 2026-08-22 · **ADR:** [011](adrs/011-toolchain-and-productionisation.md) · **Council review:** 2026-08-22 packet 5 (REJECT) — rewritten; dispositions in [reviews/2026-08-22/dispositions.md](reviews/2026-08-22/dispositions.md)

What keeps the repository itself trustworthy: dependencies, CI, settings, releases. The architecture docs govern what the system *is*; this page governs the machinery it runs on. **This table is generated from the workflows' actual triggers — when they change, this page changes in the same PR.**

## CI layers (matches the shipped workflows)

| job | events | what | secrets |
|---|---|---|---|
| `verify` (matrix 22/24; macOS on main only) | every push, every PR | tests → adapter freshness → `kb verify` (exit code unswallowed; report asserted by `report-summary.mjs`) | none |
| `verify-offline` | every push, every PR | `kb verify` inside an empty network namespace — invariant 2 as runtime fact | none |
| `pr-contract` | every PR | write-paths §1: canonical diffs need apply-records; gate-code+fixtures together is flagged | none |
| **`gate`** | every push, every PR | **the single required status check** — aggregates the above | none |
| `zizmor` | push/PR/weekly | workflow-security lint that works while private (the build-phase detector) | none |
| `gitleaks` | push/PR (range) + weekly (full history) | secret scanning — license-free (verified: `amiable-dev` is a User account) | `GITHUB_TOKEN` only |
| `npm-audit` | weekly + dispatch | `--package-lock-only` (installs nothing), fails on high | none |
| `node-eol` | weekly | fails when the CI matrix carries a dead Node line ([check-node-eol.mjs](../.kb/bin/check-node-eol.mjs)) | none |
| `codeql` / `dependency-review` / `scorecard` | push+weekly / PR / weekly | **armed at the public flip** via a fail-closed `precheck` visibility guard that is *never deleted* — it simply starts passing; `workflow_dispatch` dry-runs them (no publish) before flip day | `GITHUB_TOKEN` only |

**Enabled today on the private repo** (not deferred): dependabot version updates + cooldown, dependabot vulnerability alerts + dependency graph. **Accepted interim risk, dated 2026-08-22:** no deep JS SAST until CodeQL arms at the flip — interim coverage is zizmor (workflows), the conformance purity test (gate imports), and npm audit + dependabot (dependencies).

## Dependency posture

Six runtime dependencies, two tiers — the tier is load-bearing:

| tier | packages | policy |
|---|---|---|
| **gate path** | `yaml`, `ajv`, `ajv-formats` + Node builtins | minimal and boring; **individual dependabot PRs, never batched**; parses untrusted staged files |
| **network verbs only** | `jsdom`, `@mozilla/readability`, `turndown` | parses hostile web content; dynamically imported so the CI verify process never loads it (conformance-tested); grouped minor/patch updates |

Install-time policy (ADR-011 §3): CI always `npm ci --ignore-scripts`; audit runs `--package-lock-only`; dependabot has a 7-day cooldown; majors arrive individually; **grouped updates are never auto-merged**, and an action-pin bump is reviewed by reading the upstream diff, not the SHA. Behavioural hardening of the network verbs (scheme allowlist, private/metadata-address denial, 5MB response cap, jsdom with scripts and resource-loading off) lives in [net-guard.mjs](../.kb/lib/net-guard.mjs) and ADR-011 §2.

## The flip (private → public) — a rehearsable gate, then one irreversible step

Making the repo public exposes **all history, forever**. Everything below happens *before* the visibility change, in order; each step has a verification.

1. **Rehearse the armed workflows**: `gh workflow run scorecard.yml` and `gh workflow run security.yml` (dispatch paths run without publishing). Verify: both complete green on the private repo.
2. **Full-history secret sweep**: the weekly gitleaks job already scans full history; run it on demand (`gh workflow run security.yml`) and verify a clean pass *dated within a week of the flip*.
3. **History content review** (human, not tooling): scan `git log --stat` for anything that must not be public — private URLs, PII, draft research content. The corpus was built for publication, but the check is cheap and the mistake is permanent. *Executed 2026-08-23: the review found the pre-scrub provenance (internal service URLs, the exclusion manifest naming personal-domain files, removed staging/labs bodies) recoverable from history — resolved by cutting a fresh public root; the full pre-release history is preserved in a private archive repo and a local bundle (ADR-003 history-preservation preference honoured via the archive).*
4. **Fork-safety settings** (only dangerous once forks exist):
   ```bash
   gh api -X PUT "repos/$R/actions/permissions/workflow" -f default_workflow_permissions=read -F can_approve_pull_request_reviews=false
   ```
   and in Settings → Actions: *Require approval for all outside collaborators*. Verify: read the settings back.
5. **Branch protection** from the committed, reviewable body:
   ```bash
   gh api -X PUT "repos/$R/branches/main/protection" --input .github/branch-protection.json
   gh api "repos/$R/branches/main/protection" | jq .required_status_checks
   ```
   The required context is **`gate`** — the aggregate job, never matrix-leg names (legs rename when the matrix changes; the aggregate doesn't). **Stated plainly:** `enforce_admins: false` means the sole admin can push past the required check. That is a *named, accepted exception* to invariant 8 at single-maintainer scale (ADR-011 §5) — the gate binds every non-admin path, and Scorecard will score Branch-Protection accordingly (see step 8). Rollback: `gh api -X DELETE .../protection`.
6. *(Ordering corrected at first execution: these features are public-only and 422 on a private repo — they move to immediately AFTER step 7.)* **Enable the public-only channels**: private vulnerability reporting (`gh api -X PUT "repos/$R/private-vulnerability-reporting"`), secret scanning + push protection (`gh repo edit --enable-secret-scanning --enable-secret-scanning-push-protection`). SECURITY.md already describes email as the interim channel and flips its "preferred" once this lands.
7. **The flip itself**: `gh repo edit "$R" --visibility public --accept-visibility-change-consequences`. Immediately after: confirm `precheck` now reports public (run any workflow), CodeQL completes on both languages, Scorecard publishes.
8. **Publish the known-red statement** (in the launch notes): on day one, Scorecard's Branch-Protection (admin bypass), Signed-Releases (no releases yet), Fuzzing, and CII-Best-Practices checks are *knowingly* red/low — recorded positions with triggers, not defects. Then add badges (scorecard, CodeQL) after first green runs.
9. CITATION.cff and SUPPORT.md land with the flip PR; LICENSE attribution is confirmed by the owner before step 7 (owner: @amiable-dev — this is the one unowned-until-now TODO, now owned).

`R=amiable-dev/chancery` throughout — set once in the shell; a rename means this page changes.

## Release policy

**Governance note, 2026-08-23:** ADR-011 §7 gated npm publication on an external consumer; the owner exercised the trigger early — name security (npm: `@amiable-dev/chancery` — the unscoped name is blocked by npm's similarity rule against `chance`, discovered at first publish) under the product direction, with chancery.dev registered. Provenance-mandatory holds; nothing else about the gear changes.

The artifact is the npm tarball: **engine + default ontology only** (never the reference corpus, never operational state — enforced by the package test suite). `bin` installs `kb` and `kb-mcp`; the installed CLI governs the repo it runs *in* via root discovery (nearest ancestor with `.kb/kb.config.yaml`).

**Cutting a release** (after the one-time setup below):

```bash
npm version patch        # or minor — bumps package.json, commits, tags vX.Y.Z
git push --follow-tags   # the tag triggers .github/workflows/release.yml
```

The workflow re-runs the full gate, refuses a tag/version mismatch, packs, generates a CycloneDX SBOM, attests SLSA provenance for the tarball (GitHub-native, Sigstore), creates the GitHub release with tarball + SBOM attached, and publishes to npm with `--provenance`. Consumers verify with `gh attestation verify amiable-dev-chancery-X.Y.Z.tgz --repo amiable-dev/chancery` or `npm audit signatures`.

**One-time setup (owner):** create an npm **automation** token (npmjs.com → Access Tokens → Generate → Automation) and store it as the repo secret — run `gh secret set NPM_TOKEN` yourself and paste the token; it must never pass through an agent. After the first publish exists, optionally switch the package to npm **trusted publishing** (GitHub Actions OIDC; package settings on npmjs.com) and delete the token.

Semver, 0.x; **1.0 criterion**: the envelope schema and the `kb query` phase-1 JSON stable across two consecutive minor releases. Commit convention: Conventional Commits (dependabot configured to comply).

## Incident response

**Owner: @amiable-dev. Acknowledge within 7 days (SECURITY.md); contain before analyse.**

- *Compromised dependency or action* (the CVE-2026-33634 class): (1) pin past or remove the affected version in a direct commit; (2) compute the exposure window — first CI run with the bad revision (Actions run history; note default log retention is 90 days, so **export run logs for anything suspicious immediately**) to the pinning commit; (3) rotate every secret the runner could see in that window — for this repo that is `GITHUB_TOKEN` (auto-rotates) and any keys the *user's other workflows* share via the runner (none today; keep it that way); (4) diff released/committed artifacts against known-good.
- *Vulnerability report received*: email `security@amiable.dev` (monitored; verify this stays true) or, post-flip, private vulnerability reporting. Triage against SECURITY.md's scope notes; fixes ship as patch releases on latest 0.x.
- *Gate integrity doubt* (a green run that shouldn't have been): re-run `gate` on the suspect SHA; diff `.kb/lib` + `.kb/test` against the last trusted commit — the fixtures-and-checks-together shape is the first thing to look for.

## Recurring

- **Weekly (automated)**: dependabot PRs (cooled down 7 days), npm audit, gitleaks full-history sweep, zizmor, node-eol check.
- **When node-eol fails**: one PR bumps the matrix, `engines`, `.nvmrc`, and the runtime floor in `kb.mjs` together.
- **Dated review triggers**: zizmor pin (1.6.0, set 2026-08-22 — bump quarterly); actionlint adoption (deferred 2026-08-22: no npm/PyPI-native distribution; revisit when a pinned, checksummed install is one line); vendor facts in `install-knowledge.mjs` (their own dated triggers).
