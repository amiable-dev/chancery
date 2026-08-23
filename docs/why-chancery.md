# Why "Chancery"

**Status:** accepted 2026-08-23 · this page is the canonical naming explanation; the README carries the short form, and chancery.dev carries this one.

A medieval **chancery** was the office that turned writing into *record*. Petitions and drafts arrived from anywhere; the chancery examined them, authenticated the genuine ones under seal, enrolled them, and kept the rolls. A document was not authoritative because someone important wrote it — it was authoritative because it had **passed through the office**, and the office's marks proved it.

That is this system, mechanism for mechanism:

| the chancery | this project |
|---|---|
| petitions arriving from anywhere | untrusted inflow into `staging/` — quarantine, never canon |
| examination by the office | rubric assessment, schema validation, the verify gate |
| the **seal** that binds a document to its issuing act | the **task envelope** — every judgment bound to its task, its inputs, its declared write set; stale or replayed answers refused |
| enrolment onto the rolls | the gated apply: post-verified, atomic, rolled back on failure |
| the rolls themselves — append-only, kept for audit | git history, the evidence store, the judgment artifacts, the log |
| letters that never passed the office carry no authority | **no path around the gate, on any interface** (invariant 8) |

The name also says what the project is *not*. A chancery doesn't write the petitions and doesn't decide the kingdom's policy — judgment comes from elsewhere (in our case: your agent, a model panel, or you). The office's job is narrower and harder to do honestly: make sure nothing becomes part of the record without passing examination, and make sure the record can prove it. **Bookkeeping is deterministic; judgment is supplied.**

## The name vs the command

**Chancery** is the project. **`kb`** is its CLI — short for what it operates on, kept short because you type it constantly. The split is deliberate and old: ripgrep installs `rg`; Kubernetes ships `kubectl`. Docs and generated skills refer to the command as `kb` throughout; when you see either name, it's one system.

*(Before 2026-08-23 the repository was named `swe-ai-ml-kb`, after its reference corpus; GitHub redirects the old URL.)*
