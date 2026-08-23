# Council Review — Packet 5 (productionisation baseline)

**Headline:** the gate workflow, which the whole packet calls "the contract," cannot fail. Everything else is secondary to that.

Verdicts: ADR-011 **REJECT** · operations.md **REJECT** · kb-verify.yml **REJECT** · security.yml **REJECT** · scorecard.yml **REJECT** · dependabot.yml **APPROVE-WITH-CHANGES**

---

## FILE 3 — `.github/workflows/kb-verify.yml`

**Verdict: REJECT**

1. **[BLOCKER] The contract step's exit code is `tee`'s, not `kb verify`'s.**
   `run: node .kb/bin/kb.mjs verify --format json | tee kb-report.json`
   GitHub's implicit shell for a `run:` step on Linux/macOS is `bash -e {0}` — `pipefail` is **only** added when you write `shell: bash` explicitly. So a non-zero `kb verify` exits 0 and the job is green. Same defect on the pattern's siblings if it spreads. Fix twice over: add `shell: bash` to that step (or `set -o pipefail`), **and** assert `r.ok === true` in the reporting step so the report and the exit status must agree. Until this lands, packet 5's premise ("Parity lives here") is false and every green run on main since this workflow shipped is unproven.

2. **[BLOCKER] There is no stable, aggregate status check to require.**
   Four matrix legs, no `needs:`-fan-in job. Branch protection is therefore forced to enumerate mutable leg names (see operations.md finding 2). Add one `gate` job (`needs: [verify]`, fails if any leg failed or was skipped) and make **that** the sole required context.

3. **[BLOCKER] Standing invariant 2 ("verify never touches the network") has no executable evidence anywhere in the repo, and this job is the only place it could exist.**
   Nothing here proves the gate is offline. Add a leg that runs `verify` with egress blocked (container `--network none`, or a `--experimental-permission`/proxy-denied sandbox) after `npm ci` has completed, and/or a conformance test that fails on any `fetch`/`http`/`net`/`dns` reference in the gate import closure. Today, a regression that adds a network call to the gate path ships green.

4. **[SHOULD-FIX] `npm ci` executes dependency lifecycle scripts from an attacker-controlled lockfile on fork PRs.** Use `npm ci --ignore-scripts` in the gate and document any dependency that genuinely needs scripts. (See ADR finding 5 — this is the packet's largest unaddressed threat class.)

5. **[SHOULD-FIX] The inline `node -e` summariser is the least-governed code in the repo.** Untested, unlinted, unformatted, unversioned; throws on malformed/partial JSON (killing the `if: always()` step and hiding the real failure); interpolates `f.code`/`f.file`/`f.message` into a Markdown table and a `<details>` block with **no escaping** — one `|` or newline in a finding message corrupts the summary, and raw HTML in a message renders. Move it to a committed script covered by `npm test`, escape delimiters, and run it once in the aggregate job instead of four times across the matrix.

6. **[SHOULD-FIX] Nothing verifies that the SHA pins match their version comments.** `actions/setup-node@8207627… # v7.0.0`, `upload-artifact@b7c566a… # v6`, `codeql-action@db488dd… # v4` are unverifiable by a reviewer, and a mis-pin (or a pin to an attacker's commit with a truthful-looking comment) reads as correct. Add a `pinact`/`ratchet`-style check to CI. This is the control that makes SHA-pinning auditable rather than decorative.

7. **[SHOULD-FIX] No `timeout-minutes`, no `concurrency: cancel-in-progress`.** In-repo branch pushes plus their PR run the 4-leg matrix twice, two legs on macOS at the private-repo 10× minute multiplier, and a hung job burns the 6-hour default. For a document whose thesis is right-sizing, this is unbudgeted.

8. **[NIT]** `id: verify` is never referenced. `upload-artifact` has no `if-no-files-found:` — set it deliberately (`error`, if the report is contract output).

9. **[NIT]** `install-knowledge.mjs --check` has no documented failure semantics: what makes an adapter stale and what the contributor runs to fix it.

**Most important thing MISSING:** an aggregate `gate` job that is the single required check and asserts `report.ok` — nothing here converts "CI is the contract" into one non-bypassable signal.

---

## FILE 5 — `.github/workflows/scorecard.yml`

**Verdict: REJECT**

1. **[BLOCKER] The job-level `permissions:` block deletes `contents: read`.** Job-level permissions **replace** the workflow-level `read-all`; every unlisted scope becomes `none`. `actions/checkout` cannot run, and Scorecard's Branch-Protection / workflow checks also want `actions: read`. Add both to the job block. (The OpenSSF starter workflow lists `contents: read`, `actions: read`, `security-events: write`, `id-token: write` for exactly this reason.)

2. **[BLOCKER] `permissions: read-all` at the top level contradicts ADR-011 §3** ("top-level `permissions: contents: read` with per-job elevation only"). Either narrow the file or record the exception with its reason in the ADR. An unrecorded exception to a rule stated as universal is how the rule dies.

3. **[BLOCKER] The visibility guard is fragile in the fail-open direction.** `if: ${{ github.event.repository.private == false }}` relies on `github.event.repository` being present; where it is not (notably minimal `schedule` payloads), GitHub expression coercion makes `null == false` evaluate **true**, so the gated job runs — against a private repo, where `publish_results: true` cannot succeed. Result: a permanently red Saturday cron nobody is watching. Use a fail-closed form (`github.event.repository.visibility == 'public'`) or, better, a `precheck` job that resolves visibility via `gh api` and exposes an output the gated jobs consume.

4. **[SHOULD-FIX] Flip day is the first time this workflow will ever have executed.** Because the guard is (intended to be) false throughout the build phase, CodeQL and Scorecard have no dry run. Add a `workflow_dispatch` path that runs the analysis without `publish_results` so the machinery is exercised before the irreversible day.

5. **[SHOULD-FIX] Artifact/SARIF upload steps have no `if: always()` or existence guard**, so a partial result is lost precisely when it would be diagnostic. No `timeout-minutes`, no `concurrency`.

6. **[NIT]** Artifact name `SARIF file` contains a space; `retention-days: 5` is unexplained. `push: branches: [main]` publishing on every main push is in the upstream template, so it is defensible — but noisy at this repo's commit rate; schedule + dispatch is enough.

**Most important thing MISSING:** a written statement of which Scorecard checks are *knowingly* red on flip day (Branch-Protection under admin bypass, Signed-Releases, Fuzzing, CII-Best-Practices) so the first published score is read as a recorded position rather than a defect list.

---

## FILE 4 — `.github/workflows/security.yml`

**Verdict: REJECT**

1. **[BLOCKER] `npm-audit` has no event guard.** ADR-011 §4 and operations.md both specify a **weekly** audit; this job runs on every push to main, every PR, the cron and dispatch. A newly disclosed high-severity transitive advisory with no available fix turns main and every open PR red with no remediation path. Gate to `schedule` + `workflow_dispatch`, or make it advisory (file/update an issue) rather than failing.

2. **[BLOCKER] Same fail-open visibility guard as `scorecard.yml`** (see that file, finding 3). The header comment — "Jobs marked 'public gate' no-op while the repo is private" — is therefore not reliably true, and CodeQL without GHAS on a private repo fails rather than no-ops. Also note the distinction the comment blurs: these jobs are **skipped**, not successful-no-op, and skipped contexts behave differently under required-checks than passing ones. Never add them to required checks before they are actually green once.

3. **[SHOULD-FIX] The `gitleaks` job likely needs a secret, contradicting the file's own "no job here needs a secret beyond GITHUB_TOKEN".** `gitleaks/gitleaks-action` has required `GITLEAKS_LICENSE` for **organization-owned** repositories; `amiable-dev/…` looks organizational. Verify for v3; if licensed, either move it post-merge with a secret (breaking §3's fork-safe layering claim for this job) or invoke the `gitleaks` CLI binary directly, which has no such requirement. This must be settled before the ADR lists gitleaks as "adopt now (works on the private repo)".

4. **[SHOULD-FIX] `fetch-depth: 0` does not make gitleaks scan history.** On `push`/`pull_request` the action scans the event's commit range by default. The pre-flip requirement is a **full-history** sweep (operations.md finding 3); add a separate history-sweep job with explicit full-log invocation, and stop implying the current job covers it.

5. **[SHOULD-FIX] A PR can edit the scanner's own config in the same PR.** `.gitleaks.toml` (or equivalent) is taken from the checked-out head. Pin scanner policy from the base branch, or require CODEOWNERS review on scanner config — which currently enforces nothing (see ADR finding 9).

6. **[SHOULD-FIX] Nothing in this repo lints these workflow files.** CodeQL `actions` is gated to the flip and Semgrep was rejected, so the entire defect class demonstrated by findings 1–5 has **no detector during the build phase**. `actionlint` + `zizmor` run offline, free, on a private repo, in seconds. Add them to the gate now.

7. **[SHOULD-FIX] `npm ci` before `npm audit`** executes install scripts merely to ask the registry a question. Use `npm audit --package-lock-only` (or `--ignore-scripts`).

8. **[SHOULD-FIX] The "fork-safe" claim for `codeql` is asserted, not tested.** Fork-PR token behaviour and `security-events: write` need a real fork-PR run before the header comment can stand; per-PR CodeQL is largely redundant at this size — `push` + `schedule` is defensible and simpler.

9. **[NIT]** No `timeout-minutes`, no `concurrency` (post-flip, two languages × push + PR for the same SHA). `queries: security-extended` should be a checked-in `config-file` so the query set is auditable in-repo, and confirm the `actions` language accepts that suite. `dependency-review-action` sets only `fail-on-severity` — the **licence** half of dependency review is exactly what a Gear 2 open-source flip needs; add `allow-licenses`/`deny-licenses`.

**Most important thing MISSING:** a job that runs *while the repo is private* and validates these workflows (actionlint/zizmor) — this file's own defect class is the only one with no detector.

---

## FILE 6 — `.github/dependabot.yml`

**Verdict: APPROVE-WITH-CHANGES**

1. **[BLOCKER] No `cooldown` / minimum release age.** ADR-011's entire threat framing is compromised releases (the `tj-actions` class, the 2025–26 npm wave). This config opens PRs the moment a version ships **and** batches minors/patches for bulk review — the shortest available path from a hijacked release to a merged lockfile. Set a cooldown (e.g. 7 days for npm minor/patch) or record explicitly why immediacy beats latency here.

2. **[SHOULD-FIX] The `github-actions` entry has no `groups` and no `open-pull-requests-limit`, contradicting ADR-011 §4's "npm + github-actions ecosystems, weekly, grouped".** With ~7 pinned actions this is a weekly drip of single-SHA-bump PRs, which trains the maintainer to merge opaque SHA changes unread — the exact failure mode SHA-pinning exists to prevent. Group them, and state in CONTRIBUTING that a pin bump requires reading the upstream diff. (Note: `open-pull-requests-limit` is per-update-entry, so there is no cross-ecosystem "starvation" — but the noise problem is real.)

3. **[SHOULD-FIX] The npm group ignores the boundary the ADR calls load-bearing.** `minor-and-patch` has no `patterns`/`applies-to`, so `yaml`/`ajv`/`ajv-formats` (gate path) arrive in the same batch as `jsdom`/`turndown`. Mirror the two tiers: gate-path bumps reviewed individually, never inside a batch. Also state the policy for majors (currently ungrouped by default and unmentioned).

4. **[SHOULD-FIX] This file cannot implement ADR-011 §1's "dependabot-prompted PR" for the Node floor.** No `updates` entry can; no such ecosystem exists. Fix the ADR or add the real trigger elsewhere (see cross-doc X1).

5. **[NIT]** No `labels`, no `commit-message` prefix (relevant to §7's "flagged in commit messages"), no `versioning-strategy`. `directory: "/"` covers `.github/workflows`; add `.github/actions` if composite actions ever land.

**Most important thing MISSING:** a cooldown/minimum-release-age setting plus an explicit "grouped updates are never auto-merged" statement — the only two knobs here that address the threat the ADR names.

---

## DOCUMENT 2 — `docs/operations.md`

**Verdict: REJECT**

1. **[BLOCKER] The flip-day checklist omits the flip, and omits every irreversible-exposure precondition.** There is no `gh repo edit --visibility public` step, and nothing before it: no **full-history** secret sweep (as distinct from the push-range sweep the workflow actually does), no history review for research-corpus content, PII, private URLs or draft notes, and none of the Actions settings that only become dangerous once forks exist — require approval for all outside-collaborator workflow runs, default `GITHUB_TOKEN` permissions read-only, restrict allowed actions. Making a private repo public exposes all history irreversibly; this section treats it as a settings tidy-up.

2. **[BLOCKER] Required checks are pinned to mutable matrix-leg names, and the list is incomplete.**
   `verify (ubuntu-latest, 22)` and `verify (ubuntu-latest, 24)` — macOS is absent, so a PR merges with both macOS legs red and the OS matrix is decorative. Worse: when ADR-011 §1's floor moves and 22 leaves the matrix, that context never reports and main becomes permanently unmergeable; rename the job and enforcement silently vanishes instead. Require one aggregate `gate` context (see kb-verify finding 2), not leg names.

3. **[BLOCKER] The branch-protection command is presented as paste-verbatim and has evidently never been executed.** `PUT /branches/{branch}/protection` requires a complete body with nested objects and explicit nulls; the `-f "required_status_checks[checks][][context]=…"` bracket-array spelling is at best unverified and will not obviously produce `checks: [{context: …}]`. Use `--input protection.json` with a committed, reviewable JSON body. Also: `PUT` **overwrites** — there is no read-back or diff, and no rollback line if the flip goes wrong.

4. **[BLOCKER] "required checks without required reviews keeps the single-maintainer direct-push-with-green-CI mode workable" is not how protection works.** Required status checks **do** block direct pushes to a protected branch; the mode survives only because `enforce_admins=false` and the sole pusher is an admin who bypasses it. Say that plainly, because the consequence is material: the one interface in daily use is the one that bypasses the server-side gate (standing invariant 8), and Scorecard will score Branch-Protection accordingly on day one.

5. **[BLOCKER] The "CI layers" table misdescribes the shipped workflows and therefore cannot be used as the record.** `npm audit` is listed **Scheduled/weekly** but runs on every push and PR; gitleaks is listed PR + scheduled but also runs on push; CodeQL is listed "every PR" but also runs on push and weekly; Scorecard is listed weekly but also runs on every push to main. Also **"secrets: none" is wrong** for the gitleaks row (`secrets.GITHUB_TOKEN`, and possibly `GITLEAKS_LICENSE`) — use the workflow header's own wording, "no secrets beyond `GITHUB_TOKEN`". Fix the workflows or fix the table; today neither is trustworthy.

6. **[SHOULD-FIX] "The guards are one `if:` line each, removed on flip day" is the wrong control shape.** The guard is fail-open (see security.yml finding 2), is never true while private, and removing it on flip day discards the only documentation of the prerequisite. A guard that *passes* once the repo is public is strictly better than a guard that is deleted.

7. **[SHOULD-FIX] Dependabot alerts and the dependency graph are deferred to flip day though both are available on private repos today.** That leaves a weekly `npm audit` as the sole vulnerability signal for the whole build phase, and the page never states that as accepted risk. Separate *unavailable* (public/GHAS-only) from *available but deliberately deferred*.

8. **[SHOULD-FIX] "Incident response" is a heading, not a procedure.** No owner, no time bound, no definition of "affected run", no credential inventory or rotation step, no advisory path while private reporting is off, and no log-retention assumption — GitHub's default Actions log retention is finite, so "checked against `git log`" is only half the evidence. Also, "the SHA pins are what make that window computable at all" overstates: pins identify the revision; the window also needs run history, timestamps and upstream compromise intelligence.

9. **[SHOULD-FIX] The release policy has no artifact.** "attaches an SBOM and GitHub-native SLSA provenance attestation" — of *what*? There is no build output, no package, no defined tarball; no `attestations: write` permission noted, no SBOM generator named, no consumer-side verification instruction (`gh attestation verify`), and "then 1.0 pins them" gives no criterion for "stabilise".

10. **[SHOULD-FIX] "Recurring: When an LTS line dies … matrix + engines bump PR" names a manual calendar task that ADR-011 §1 attributes to Dependabot.** One of the two is wrong (both, in fact — see X1).

11. **[NIT]** `amiable-dev/swe-ai-ml-kb` hardcoded four times (a rename breaks the checklist silently); "confirm LICENSE attribution (owner action, already flagged)" and "badges … after first green runs" are unowned TODOs inside an ordered checklist; the page is `Status: proposed` while ADR-011 is `accepted` and treats its checklist as decided policy.

**Most important thing MISSING:** a fail-closed, rehearsable pre-flip gate — full-history secret/content audit, fork-PR Actions settings, a dry run of the gated workflows, and read-back verification of every setting — executed *before* the irreversible visibility change.

---

## DOCUMENT 1 — `docs/adrs/011-toolchain-and-productionisation.md`

**Verdict: REJECT**

1. **[BLOCKER] §1 `engines.node >= 22` does not encode the stated policy and has no enforcement point on the actual invocation path.** `>= 22` admits 23 and 25 (non-LTS/current) and every future major including EOL ones. Worse: `engines` is a **warning** at `npm install` time, and the CLI's primary invocation is `node .kb/bin/kb.mjs` inside a harness whose Node version the maintainer does not control — the entire reason the adapter layer exists. An agent on harness-supplied Node 20 gets undefined behaviour, not a refusal. Needed: `22.x || 24.x` (or an explicit supported-major union), `engine-strict=true` in `.npmrc`, `.nvmrc`, **and** a runtime version assertion in the CLI entrypoint that fails with a clear message.

2. **[BLOCKER] §1's stated mechanism does not exist.** "The floor moves when an LTS line dies, by dependabot-prompted PR, not by ADR amendment." Dependabot has no ecosystem that watches the Node release calendar, `engines.node`, or a CI matrix. Nothing will prompt this PR. Replace with a real mechanism: a scheduled job carrying the EOL dates as data that fails when the matrix contains a dead line — or admit it is a named manual calendar item and own it.

3. **[BLOCKER] §4's Semgrep rejection is justified by a control that is itself deferred.** "CodeQL covers the JS surface at this codebase size" — but CodeQL sits in the *"activates at the public flip"* bucket, as does CodeQL `actions`. For the entire build phase this packet governs, the repo has **zero** static analysis of JS and **zero** analysis of the workflow files whose defects fill this review. The reject-with-reason discipline is hiding a live gap. Minimum fix: adopt `actionlint` + `zizmor` now (offline, private-repo-compatible, free) and either accept Semgrep for the interim or record "no SAST until flip" as an explicit dated accepted risk.

4. **[BLOCKER] No install-time supply-chain policy anywhere in the ADR.** §3 hardens what runs *as* CI (SHA pins, permissions, `persist-credentials: false`) but says nothing about what executes *during* `npm ci`: no `--ignore-scripts`, no Dependabot cooldown/minimum release age, no lockfile-only policy, no `npm audit signatures`/provenance check on incoming packages. The attack class the Context itself cites is "compromised release, postinstall executes in CI". Today, six dependencies and their transitive trees run arbitrary install scripts in the gate job, on fork PRs.

5. **[BLOCKER] §2 overstates what the static architecture test can prove.** "The extraction stack … is reachable **only from network verbs**" — an import-graph test establishes that *`verify`'s* transitive closure excludes those packages. It does not establish reachability constraints in general (dynamic `import()`, `createRequire`, subprocess), and because writes go through the gate on every interface (invariant 8), `kb ingest` necessarily runs gate code **in the same process** that just fed hostile HTML to `jsdom`. The defensible claim is "the CI verify process imports a minimal dependency set." If process-level isolation is wanted, require the extraction step to run in a subprocess/worker whose output re-enters as untrusted data — and say so. Also specify the test's entry points, traversal, and dynamic-import policy.

6. **[SHOULD-FIX] §2's dev-dependency exemption contradicts §3's posture.** "New runtime dependencies require an ADR-noted reason; dev-dependency additions do not." Dev dependencies execute under `npm ci` in CI with the same blast radius as runtime ones. A lighter review rule is defensible; a blanket exemption is not — at minimum apply the rule to anything that executes in a workflow.

7. **[SHOULD-FIX] §6's SECURITY.md advertises a channel §5 deliberately disables.** §6 ships "private vulnerability reporting preferred" now; §5 defers enabling private vulnerability reporting to flip day. The file will point reporters at a button that does not exist. Also thin: no response-time commitment, no advisory path, and `security@amiable.dev` unverified as a monitored address.

8. **[SHOULD-FIX] §6's CODEOWNERS is inert under the governance chosen in §5.** With required reviews deferred and a single maintainer who cannot review their own PR, CODEOWNERS enforces nothing — and the stated purpose ("the ADR-002 finding that fixtures-and-checks-together is the attack") is not something ownership metadata addresses. If that finding matters, the control is a **CI check that fires when `.kb/test/` fixtures and `.kb/lib/` change in the same commit**. Otherwise label CODEOWNERS documentary.

9. **[SHOULD-FIX] §4's Trivy rejection reason is factually wrong.** "container/filesystem scanning with nothing to scan pre-binary" — `trivy fs` / `trivy repo` scan lockfiles, secrets and IaC/config; there is plenty to scan. The defensible reason is duplication with `npm audit` + Dependabot. Wrong reasons rot worse than no reasons, and this ADR's value is precisely its reasons.

10. **[SHOULD-FIX] §5 conflates unavailable with deferred.** Dependabot alerts and the dependency graph work on private repos and do not require branch protection or a PR flow. Split the list: what is blocked by visibility/GHAS vs what is available today and deliberately not enabled, with the risk stated.

11. **[SHOULD-FIX] Frontmatter says `status: accepted` while `council_review: pending (packet 5)`, and the companion page is "proposed".** An ADR cannot be accepted pending the review that is reviewing it. Related: is `docs/adrs/*.md` inside the corpus `kb verify` checks? If yes, `council_review:` must be in the schema and `date: 2026-08-22` needs reconciling with invariant 6 (no unverifiable world-time metadata). If no, say so — the frontmatter is then decorative.

12. **[SHOULD-FIX] The ADR mandates dated rot triggers for others' constants but carries none for its own.** operations.md establishes "dated review triggers beside each constant"; ADR-011's perishable claims — LTS dates, action major versions, "the v6 roadmap is explicitly additive", "CodeQL now analyses Actions workflows as a language" — get none. Evidence quality is also uneven: a single upstream PR link supports a roadmap claim, a vendor blog is cited as "2026 guidance", and **"the attack class that hit `tj-actions` and `trivy-action` in 2025–26"** needs a citation for the `trivy-action` half (the well-documented incidents in that class are `tj-actions/changed-files` and `reviewdog`). Cite it or drop it — an unsupported incident claim in the justification for the whole hardening posture is the easiest thing for a hostile reader to pull on.

13. **[SHOULD-FIX] The promised security review of the six dependencies reviewed only their *position*, not their *behaviour*.** Nothing anywhere states: URL/redirect allowlist, localhost/link-local/metadata-endpoint denial (SSRF), response size and time caps, `jsdom` constructed with `runScripts` off and external resource loading disabled. If that lives in ADR-008, link the section; otherwise this is the security review the Context says was missing, and it is still missing.

14. **[SHOULD-FIX] No CI cost or runtime budget in a document whose thesis is right-sizing.** 2 OS × 2 Node on every push *and* PR, macOS at the private-repo 10× multiplier, no `concurrency`, no timeouts. Decide: macOS on main/schedule only, ubuntu on PRs.

15. **[NIT]** §7 "breaking changes allowed, flagged in commit messages" names no convention, and Dependabot's messages will not follow it — pick Conventional Commits or drop the claim. No LICENSE/SPDX policy, though operations.md carries "confirm LICENSE attribution" as an unowned TODO.

**Most important thing MISSING:** an install-time supply-chain policy (`--ignore-scripts`, Dependabot cooldown, lockfile-only, provenance/signature verification) — the ADR pins what runs *as* CI but never governs what executes *during* `npm ci`, which is the threat class it opens by citing.

---

## Cross-document contradictions

**X1. ADR-011 §1 vs operations.md "Recurring" vs `.github/dependabot.yml`.** ADR: the Node floor moves "by dependabot-prompted PR, not by ADR amendment." operations.md: "**When an LTS line dies** (Node release calendar): matrix + engines bump PR" — a manual calendar trigger. dependabot.yml contains nothing that could do either. Three artifacts, three mutually exclusive stories, and the only mechanism that exists is the one the ADR explicitly rules out.

**X2. ADR-011 §4 and operations.md "CI layers" vs `security.yml` / `scorecard.yml`.** ADR and table both specify a **weekly** `npm audit`; the job has no event guard and runs on every push and PR. Same mismatch for gitleaks (also on push), CodeQL (also push + weekly) and Scorecard (also every push to main). The documentation and the normative config disagree about what CI *is*.

**X3. ADR-011 §3 vs `scorecard.yml`.** "top-level `permissions: contents: read` with per-job elevation only" vs `permissions: read-all` at the top of scorecard.yml. An unrecorded exception to a rule stated as universal.

**X4. ADR-011 §4 ("npm + github-actions ecosystems, weekly, grouped") vs `dependabot.yml`.** Only npm is grouped.

**X5. ADR-011 §5/§6 vs operations.md "Incident response".** Private vulnerability reporting is deliberately not enabled until the flip, yet SECURITY.md ships now calling it "preferred" and operations.md points at it as the live channel. For the whole build phase there is no working intake.

**X6. ADR-011 §4 (reject pre-commit hooks: "parity lives at the gate, not at N developer machines") vs ADR-011 Consequences ("the fix is the developer's `nvm install 24`") and §6/operations.md "verify-before-push".** The same document rejects developer-machine controls on principle and then relies on three of them. Either the gate enforces the Node floor (Doc 1 finding 1) or the principle is negotiable — say which.

**X7. ADR-011 §5 / operations.md branch-protection note vs standing invariant 8 ("writes go through the gate on every interface").** The chosen configuration (`enforce_admins=false`, no required reviews, direct push by the sole admin) means the only interface in daily use is the one that can bypass the gate. Neither document names the exception; both imply the opposite. This is the packet's most consequential undeclared invariant violation.

**X8. operations.md "CI layers" ("Gate | every push + PR") vs `kb-verify.yml`** (`push: branches: [main]` only — feature-branch pushes are ungated until a PR exists).

**X9. ADR-011 §2 ("Enforced by a static architecture test in the conformance suite (write-paths §3), not by convention") vs the workflows.** The ADR asserts the purity rule is enforced in the present tense; `kb-verify.yml` runs only `npm test` and no reviewer can tell whether that test exists. State it as a deliverable of this packet with an acceptance criterion, or cite the test by name.

---

## Council note on what to verify before acting

Two findings above are certain and should be treated as pre-build stop-work: the **missing `pipefail`** (documented GitHub behaviour: implicit shell is `bash -e {0}`; `shell: bash` adds `-eo pipefail`) and **job-level `permissions` replacing rather than merging** with the workflow-level block. Three findings are conditional and need one command each to settle: whether `amiable-dev` is an organization (gitleaks licensing), whether `gh api`'s bracket syntax produces the required `checks` array (run it against a throwaway repo), and whether `github.event.repository` is populated for your `schedule` payloads (echo `toJSON(github.event)` once). Do not paste the flip-day block until all three are answered.