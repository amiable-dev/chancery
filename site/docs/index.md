---
hide:
  - navigation
  - toc
---

<div class="kbl" markdown>

<div class="kbl-hero">
  <img src="img/logo.svg" alt="chancery mark">
  <h1>chancery</h1>
  <p>Turn research into a verified, shared knowledge substrate — read once, judge explicitly, and let humans and agents retrieve from what you've vetted.</p>
  <div class="kbl-cta">
    <a class="md-button md-button--primary" href="getting-started/first-corpus/">Get started →</a>
    <a class="md-button" href="https://github.com/amiable-dev/chancery">★ Star on GitHub</a>
  </div>
  <div class="kbl-badges">
    <img src="https://img.shields.io/github/actions/workflow/status/amiable-dev/chancery/kb-verify.yml?label=kb%20verify&color=33d6c2" alt="kb verify">
    <img src="https://img.shields.io/badge/license-MIT-671bc6" alt="license MIT">
    <img src="https://img.shields.io/badge/status-early%20v0.x-5848c7" alt="status early v0.x">
    <img src="https://img.shields.io/badge/node-%E2%89%A522-4289c3" alt="node >= 22">
    <img src="https://img.shields.io/badge/gate-0%20model%20calls-444d5c" alt="gate: 0 model calls">
  </div>
</div>

<div class="kbl-section">
  <span class="kbl-kicker">quickstart</span>
  <h2>Start in 60 seconds</h2>
  <p class="kbl-lead">Your agent supplies the judgment. The CLI supplies everything that can be deterministic.</p>

=== "Claude Code / MCP"

    ```console
    $ npm install -g @amiable-dev/chancery
    $ claude mcp add kb -- kb-mcp
    # six tools, byte-identical to the CLI: kb_search · kb_read · kb_propose …
    > "Ingest this post to staging and assess it against our rubric."
    # the generated skills already taught your agent the loop
    ```

=== "The CLI loop"

    ```console
    $ kb ingest https://example.com/article
    # → staging/<slug>.md, source hashed
    $ kb assess staging/<slug>.md
    # → judgment task for your agent
    $ kb promote <slug> --draft d.json --apply
    # → concepts/<slug>.md, by construction
    $ kb query "what do we know about X?"
    # grounded — uncited answers rejected
    ```

=== "CI gate"

    ```console
    # .github/workflows/kb-verify.yml — the contract, before every commit
    $ kb verify
    480+ files · schema / links / index / cards · ~1s
    # no API keys in the gate · no network · the exit code is the contract
    ```

</div>

<div class="kbl-section">
  <span class="kbl-kicker">the gate</span>
  <h2>See it gate</h2>
  <p class="kbl-lead">verify doesn't hand you prose to parse. Evidence drift is caught mechanically — which claims, not just which links. <em>The transcript below is real captured output: the gate on this repository, then genuine drift against a source whose content changes every fetch (<a href="https://github.com/amiable-dev/chancery/blob/main/site/capture/capture-terminal.mjs">capture harness</a>).</em></p>
  <div class="kbl-term">
    <div class="kbl-term-bar"><span class="dots"><span></span><span></span><span></span></span>
      captured output — kb verify · kb revalidate
      <button id="kbl-term-replay">replay</button>
    </div>
    <div class="kbl-term-body" id="kbl-term-body"><noscript><div class="ln">$ kb verify → PASS · $ kb revalidate → DRIFT, queued for review. Enable JavaScript for the captured transcript.</div></noscript></div>
  </div>
</div>

<div class="kbl-section" id="kbl-stepper-root">
  <span class="kbl-kicker">the loop</span>
  <h2>Two phases, one gate</h2>
  <p class="kbl-lead">kb never calls a model. Walk the loop — judgment arrives from outside, everything else is a lookup table.</p>
  <div class="kbl-stepper" id="kbl-stepper"><noscript>ingest → assess (phase 1) → your agent answers → apply (phase 2) → verify. Enable JavaScript for the walkthrough.</noscript></div>
  <div class="kbl-stage-card" id="kbl-stage-card">
    <span class="kbl-kicker"></span>
    <h3></h3>
    <p class="desc"></p>
    <pre></pre>
    <div class="kbl-stage-nav">
      <button id="kbl-prev">← Prev</button>
      <button id="kbl-next">Next →</button>
    </div>
  </div>
</div>

<div class="kbl-section">
  <span class="kbl-kicker">capabilities</span>
  <h2>Why chancery</h2>
  <div class="kbl-grid">
    <div class="kbl-card"><span class="tick"></span><h3>Gated promotion</h3><p>Sources land in staging, get judged against a rubric — knockout disqualifiers first — and only then become concepts. Nothing is auto-deleted.</p></div>
    <div class="kbl-card"><span class="tick"></span><h3>Falsifiable citations</h3><p>Every source is content-hashed at ingest. revalidate reports which claims' evidence drifted; support gives claim-by-claim verdicts against the exact snapshot judged.</p></div>
    <div class="kbl-card"><span class="tick"></span><h3>A typed concept graph</h3><p>Explicit relationship clauses ("X supersedes Y because…"), faceted classification, a generated index. The hallucination-free graph auto-extraction can't produce.</p></div>
    <div class="kbl-card"><span class="tick"></span><h3>Grounded query + context</h3><p>query returns ranked concepts with their graph edges — answers citing unretrieved concepts are rejected. context compiles the exact bundle a task needs, byte-stable.</p></div>
    <div class="kbl-card"><span class="tick"></span><h3>A tamper-evident loop</h3><p>Judgments travel in task envelopes — stale, replayed, or out-of-bounds answers are refused. Applies verify themselves and roll back; audit sweeps for rot.</p></div>
    <div class="kbl-card"><span class="tick"></span><h3>Your agent already knows it</h3><p>One procedure source generates skills for Claude Code, Copilot, Windsurf, and Devin — CI-diffed so they can't go stale — plus a local MCP facade.</p></div>
  </div>
</div>

<div class="kbl-section">
  <span class="kbl-kicker">start here</span>
  <h2>Pick your path</h2>
  <div class="kbl-grid">
    <a class="kbl-card" href="getting-started/installation/"><span class="kbl-kicker">coding agent</span><h3>I use Claude Code / Copilot</h3><p>Generated skills teach your agent the loop — no glue code. →</p></a>
    <a class="kbl-card" href="guides/mcp-facade/"><span class="kbl-kicker">research workflow</span><h3>I run deep research</h3><p>kb-mcp: six tools, byte-identical to the CLI, local stdio. →</p></a>
    <a class="kbl-card" href="architecture/overview/"><span class="kbl-kicker">ci gate</span><h3>I want the corpus gated</h3><p>kb verify — hermetic, ~1s, the exit code is the contract. →</p></a>
  </div>
</div>

<div class="kbl-section kbl-stats">
  <div class="kbl-stat"><div class="n">212</div><div class="d">concept notes — generated by the tool itself</div></div>
  <div class="kbl-stat"><div class="n">1,112</div><div class="d">flashcards</div></div>
  <div class="kbl-stat"><div class="n">~1s</div><div class="d">kb verify</div></div>
  <div class="kbl-stat"><div class="n">0</div><div class="d">model calls in the gate</div></div>
</div>

</div>
