# Your first corpus in twenty minutes


Bring 3–5 sources from something you're actually researching — links you'd otherwise leave dying in browser tabs. By the end you'll have a small verified corpus: concept notes with hashed evidence, a judgment on file for every admission, and `kb query` answering questions from it with citations you can check.

You'll need Node 22 or 24, and the AI agent you already use (Claude Code, Cursor — anything that can read a file and run a command). **`kb` itself never calls a model**; your agent supplies the judgment.

## 1. Install and initialise

```bash
npm install -g @amiable-dev/chancery
mkdir my-kb && cd my-kb
kb init
kb verify
```

`kb init` scaffolds the corpus: `staging/` (sources in quarantine), `concepts/` (judged notes), `flashcards/`, and `.kb/` (the rubric, the evidence store, the queue — the paperwork). `kb verify` should already pass: the gate works from minute one, on an empty corpus.

## 2. Ingest your sources

```bash
kb ingest https://arxiv.org/abs/2005.11401 https://example.com/that-article-you-liked
```

Each URL is fetched, its readable text extracted, and a staging note written to `staging/`. Open one — it's just the source, captured and dated. Nothing has been judged yet; staging is quarantine, not the corpus.

If a fetch is refused (paywall, bot-wall, JS-only page), that's a **recorded outcome, not an error** — the refusal reason is the tool being honest about what it could not capture. Find a better URL for the same work (an arXiv `/abs/` page beats a PDF; an original beats coverage).

## 3. Hand your agent the judging

Paste this into your agent, in the `my-kb` directory:

```text
You are the judgment supplier for a Chancery knowledge base in this directory.
For each file in staging/, run the two-phase loop:

1. `kb assess staging/<file> --format json` prints a judgment form: the note,
   a rubric with knockout disqualifiers, and rating scales with exemplars.
   READ THE STAGED NOTE IN FULL first. Then write your verdict JSON (the form
   tells you the shape; include supplier: {"class":"model-single","id":"<your model>"})
   and submit it with `kb assess staging/<file> --verdict <file>.json`.
   Judge honestly: a true disqualifier is stated as true; queue and discard
   are good outcomes; do not grade to admit.

2. For each note routed promote or split: `kb promote <slug> --format json`
   prints a drafting form. Write concept note(s) per its schema — definition
   is one paragraph with no lists; `applications` is a single string;
   relationships only to slugs the form offers, each with a clause saying HOW
   they relate. Apply with `kb promote <slug> --draft <file> --apply`.

Then run `kb verify` and report: what was admitted, queued, or discarded, and why.
Never use --force. Never edit files in concepts/ directly.
```

Now watch. Your agent reads each source, fills in the judgment form, and the CLI routes it: **promote** (clears the bar), **split** (several ideas — several notes), **queue** (borderline — parked for *you*, with reasons), or **discard** (recommendation only; nothing is ever deleted). Expect real rejections — on our own corpus the gate admitted roughly half of what we'd been keeping by hand. The rejections come with their reasoning attached; disagree with one, and `kb promote <slug> --force` is your recorded override.

## 4. Look at what you got

Open the folder in Obsidian (or read the markdown raw). Each admitted concept carries:

- a definition and explanation that stand without the source,
- the source with a **content hash** — what the evidence said the day it was judged,
- the assessment that admitted it — ratings, rationales, and which model judged,
- typed links to related concepts, with a clause saying *how* they relate.

```bash
kb verify
```

The gate now checks all of it: dead evidence, broken structure, missing provenance, index drift. Put this in CI and the corpus stays honest without you watching.

## 5. The payoff

```bash
kb query "what does my corpus say about <your topic>?"
```

Retrieval over what you've vetted: the answer cites concepts, the concepts cite hashed evidence, and an answer citing something that wasn't retrieved is rejected outright. This — not the pipeline — is the product: research your project can *load*, whether the reader is you, a teammate, or the agent doing tomorrow's work.

## Where next

- **Keep it verified:** `kb revalidate` re-fetches your evidence and reports which *claims* drifted, not just which links died.
- **Check the load-bearing claims:** `kb support <slug>` runs claim-by-claim verdicts against the exact snapshots judged.
- **Study it:** `kb cards <slug>` drafts a spaced-repetition deck per concept.
- **Feed an agent:** `kb context --for <task>` compiles deterministic, budgeted context bundles; the MCP server (`kb-mcp`) exposes the corpus to any MCP client.
- **Understand the design:** [how Chancery thinks](../architecture/overview.md) — the five-minute mental model.
