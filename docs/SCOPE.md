# Scope

**Status: ACCEPTED 2026-08-22 — target: Gear 2 (§7)**
**Date:** 2026-08-22 · **Review:** at each trigger in §5, and no later than 2027-02
**This is R0's deliverable, per `history/evidence-2026-08.md`.**

---

## 1. What this is

`kb` is **a governed, git-native knowledge base for AI agents**: the verifiable corpus that our agents and deep-research workflows (including llm-council-driven whitepapers) query first, cite as active links, and feed back into through gated promotion.

It is **serious tooling engineered to product discipline** — CI-enforced schema, tested gates, falsifiable revalidation, versioned migrations — **published as open source, without product claims.** The discipline exists because agents write here unattended, not because a customer does; the publication exists so that external demand can be *measured* rather than assumed (§7).

**The initial output is Gear 2 of the ladder in §7**: engine and exemplar corpus public, a product-and-user README that puts the vision in front (the llm-council route: OSS project → docs site → community), a licence, and a launch writeup — while the *scope claims* stay at "open source project", not "product". First user remains us.

## 2. Who it is for

| Consumer | How |
|---|---|
| Our coding/research agents (Claude Code, Copilot, Windsurf, Devin) | generated skills + the `kb` CLI |
| Our deep-research workflow and Python tooling (llm-council) | local stdio MCP facade (`kb_search` / `kb_read` / `kb_propose`) |
| The humans on this team | Obsidian over the corpus; flashcards as a learning **extension**, outside core |

The first user is us. **Success is measured as research throughput and corpus quality** — time-to-grounded-brief, citation-support rate, corpus freshness — not stars, adoption, or revenue.

## 3. Non-goals (each with the trigger that would reverse it)

| Non-goal | Reversal trigger (from assessment §10) |
|---|---|
| Competing on conversational-memory recall benchmarks (LoCoMo-class; Mem0/Zep/Letta's job) — though their *exhaust* is welcome as untrusted staging inflow | T2: an incumbent ships review-gated promotion → 30-day reassessment |
| Extraction into standalone packages/repos | T1: ≥3 unsolicited external requests by 2027-02 — **now armed**: Gear 2 publishes the surfaces T1 measures |
| SaaS / hosted product; multi-tenant anything | T4: a concrete remote consumer with auth/tenancy needs — and then only scoped properly |
| Product/category marketing ("knowledge infrastructure for AI agents" as a claim; wedge marketing; roadmap promises to outsiders) | T1/T2 evidence → **Gear 3** (§7), never asserted ahead of it |
| Rust rewrite; distribution machinery beyond a Bun-compiled binary experiment | T5: Node-less harness, measured latency, or a real distribution play |
| Full-text/graph-rank retrieval build (ADR-013 D1) | T7: recall on the query eval set regresses against its pinned baseline across a **substantive change** (corpus revision, query cohort, or ranker) — never elapsed time on a fixed fixture, and never a note-count. Adjudicated by the D2 harness under its preregistered rule (packet 8, B8). |
| `kb viz` single-file graph viewer | T8: ≥2 distinct external requests recorded as issues, or selection by the #1 queue-visualisation review (ADR-013 D6 — a countable condition, not "demand"). |

## 4. Standing invariants (violating one is a design regression, not a preference)

1. **`kb` never calls a model.** Judgment arrives through the two-phase task contract; any schema-conforming supplier ({single agent, council, human}) may answer. No `kb council` verb, ever; no supplier-specific artifacts in the corpus.
2. **`kb verify` never touches the network.** Network verbs record evidence; verify checks the records. CI stays hermetic.
3. **Files are canon; derived layers (indexes, projections) are deterministically rebuildable and never the source of truth.**
4. **Frontmatter lifecycle only at note granularity** (versioning = citation = lifecycle). Claim-level semantics, if ever needed, live in the derived layer or as atomic claim notes.
5. **Live notes stay lean** — history lives in git and derived layers; superseded content is pointed to, never embedded (the token tax: the primary consumer is a model reading the file).
6. **No unverifiable metadata** — no world-time validity fields unless the source states them.
7. **Internal citations are navigation, never corroboration** (provenance classes: external-primary / external-secondary / internal-synthesis / model-inference; only external classes count toward tiers).
8. **Writes go through the gate on every interface** — local CLI, MCP `kb_propose`, or the PR contract. Direct canonical writes do not exist.

## 5. The budget that is actually scarce

The binding constraint is **owner attention**, not compute (both adversarial panels, independently). The queue-eats-the-curator tripwire (T6) is therefore a scope rule: if staging + queue adjudication demand exceeds the owner's stated weekly budget, the response is to **simplify the gates**, not to work harder — and R1b (lineage resolver + confidence tiers) does not get built until an adjudication-budget audit says the inflow supports it.

## 6. How this document changes

By explicit revision with a dated entry — the same discipline as the design doc. A trigger firing obliges a review within 30 days; it does not auto-change the scope. The owner decides; this file records.

## 7. The gear ladder — and the product variant, pre-drafted

Three gears. Moving up a gear is a scope revision under §6, taken on the evidence named here — never on momentum.

### Gear 1 — private dogfood *(where this started)*

Engine + corpus in one private repo; success = our research throughput. Complete as of 2026-08.

### Gear 2 — published open source, no product claims *(current target — the initial output)*

What "published" means concretely:

1. **Public repo(s)** with the engine usable by someone who is not us: `kb init`-style onboarding path, our corpora as reference instances, honest pre-release versioning (v0.x).
2. **A product-and-user README** — the vision in front, pitched at mid-to-lead engineers, in the llm-council mould (project → docs site → community), clearly marked early.
3. **Licence** (MIT, matching llm-council) and baseline OSS hygiene: CONTRIBUTING, security policy, CI badges.
4. **One launch writeup**, and presence in the places this audience already is (the LLM-Wiki gist thread is the native distribution channel — WUPHF and Hjarni found their audiences there).
5. **T1 measured for a quarter.** That is the whole point of this gear: converting "unoccupied quadrant" from belief into a measured hypothesis.

What Gear 2 does **not** include: wedge marketing, adoption targets, support commitments beyond good-citizen issue triage, extraction into packages, or any statement that this is a product.

### Gear 3 — full OSS product *(pre-drafted; requires T1 or T2 evidence)*

If the evidence arrives, the scope rewrite is already known:

- **Pick the wedge, not the category.** The two credible candidates: *governed evidence stores for research agents* or *CI-enforced knowledge bases for engineering agents*. One is chosen; the other is cut. "Knowledge infrastructure for AI agents" remains banned as positioning.
- **Success metrics flip** to counted adoption: installs, corpora-not-ours, PRs from strangers. Our KBs demote from the point to the reference instances.
- **The engine extracts** into its own repo and ships empty; distribution (npx + Bun binary + `kb init`) becomes mandatory, not experimental.
- **The schema becomes a public API**: migrations must run on corpora never seen; schemas/rubrics/facets become the documented extension surface; every frontmatter change is a semver event with a compatibility contract.
- **The gate becomes a security boundary**, not just a quality one: strangers proposing notes via the PR contract is prompt-injection surface, and the code-span/provenance rules graduate to threat-model claims with adversarial tests.
- **Governance gets real**: co-maintainers or written support boundaries (engine yes; your content and judgment quality no); a name that can be searched and claimed; a written answer to *what success buys* (reputation, hiring signal, consulting wedge, hosted-later optionality — pick one).
- **Cards are cut from the product** (kept as our private extension): a product carries no idiosyncrasies it cannot defend.
- **Still refused, even then**: SaaS/hosted, recall benchmarks. The §4 invariants are unchanged — they *are* the product.

The residual risk at every gear is the same one both adversarial panels ranked first: the owner's attention. Gear changes add work before they add help; §5's budget rule outranks the ladder.
