# Gated promotion

The founding rule: **agents are never trusted with bookkeeping.** Judgment arrives from outside; the CLI validates it and applies it by rule — and nothing reaches canon around that gate, on any interface.

## The rubric shape

Assessment is three stages, in order:

1. **Knockout disqualifiers** — `pure-announcement`, `duplicate`, `unfalsifiable`. Any one triggered ends scoring. This is the property weighted scores can't give you: a fatal flaw cannot be averaged away by good prose.
2. **Ordinal dimensions** — `durability`, `actionability`, `atomicity`, each rated `fail` / `weak` / `strong` against **exemplar notes** shipped with the rubric and hash-pinned into every task. When models change, you re-check exemplars, not magic numbers.
3. **A routing table** over the results → `promote` · `split` · `queue` · `discard`. The default is `queue` — anything unclear goes to a human, never to `/dev/null`.

A document carrying several separable, actionable ideas routes to **`split`** and is promoted as multiple concepts, each judged on its own merits.

## The envelope

Every task carries an envelope; every answer must honour it:

| refusal | meaning |
| --- | --- |
| `KB022.1` | no / unknown task id — answers bind to tasks, not to files |
| `KB022.2` | inputs changed since emission — re-emit, never edit-to-match |
| `KB022.3` | a migration changed the schema mid-flight |
| `KB022.4` | this task was already applied — no replays |
| `KB022.5` | the answer implies writes outside the declared set — nothing written |
| `KB022.6` | this task class doesn't accept that supplier class |

Applies then **verify themselves**: written files are re-checked and the whole write rolls back byte-identically on any failure. Partial application does not exist.

## The audit trail

The corpus stays supplier-anonymous, but every judgment is recorded in `.kb/assessments/` — supplier attestation, answer digest, the written set, and a `proposer_overlap` disclosure for when the same agent staged *and* judged the material. Accountability without polluting the notes.

## Non-negotiables

From `.kb/POLICY.md`: never delete a file (a `discard` is a recommendation), never rewrite a wikilink (an unresolved link is a *recorded gap*), never touch content inside code spans. These exist because an automated cleanup pass once destroyed exactly this kind of record — the incident this whole design answers.
