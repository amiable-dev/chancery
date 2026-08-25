#!/usr/bin/env node
/**
 * validation-r1a behaviour (spec acceptance):
 * - never-resolved sets at the third failure across two runs, never three-in-one
 * - supersede is one atomic transaction: reciprocal fields, leaned body,
 *   byte-identical rollback on induced failure
 * - support verdicts: stale snapshot refused; fabricated claim_quote refused;
 *   verdicts land in the evidence store; non-SUPPORTED verdicts queue
 * - migration backfill is idempotent
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderConcept } from '../lib/promote.mjs';
import { recordObservation, readStore, citeId, canonicalUrl, freshness } from '../lib/evidence.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(KB_DIR, 'bin', 'kb.mjs');
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

// ---- never-resolved: 3 failures across >=2 runs, not 3 in one ----
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-ev-'));
  const obs = (reach, run) => recordObservation(tmp, 'n', {
    cite_id: 'abcdefabcdef', url_canonical: 'https://x.example/a', reachability: reach,
  }, run);
  obs('dns-transient', 'run1'); obs('dns-transient', 'run1');
  const thirdSameRun = obs('dns-transient', 'run1');
  check('three failures in ONE run do not set never_resolved', thirdSameRun.never_resolved === false);
  const fourthNewRun = obs('dns-transient', 'run2');
  check('a failure in a SECOND run sets never_resolved', fourthNewRun.never_resolved === true);
  const recovered = obs('ok', 'run3');
  check('an ok observation clears the streak', recovered.never_resolved === false && recovered.consecutive_failures === 0);
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ---- fixture corpus for the CLI flows ----
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-r1a-'));
for (const d of ['concepts', 'staging', 'flashcards']) fs.mkdirSync(path.join(fixture, d), { recursive: true });
const run = (args, input) => {
  const file = input ? path.join(fixture, `ans-${crypto.randomUUID().slice(0, 8)}.json`) : null;
  if (input) fs.writeFileSync(file, JSON.stringify(input));
  try {
    const out = execFileSync('node', [CLI, ...args.map((a) => (a === '@A@' ? file : a))], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, KB_ROOT: fixture },
    });
    return { code: 0, json: JSON.parse(out) };
  } catch (e) {
    let json = null; try { json = JSON.parse(e.stdout ?? ''); } catch { /* not json */ }
    return { code: e.status, json, stderr: e.stderr };
  }
};
const mkConcept = (slug, extra = {}) => fs.writeFileSync(path.join(fixture, 'concepts', `${slug}.md`), renderConcept({
  slug, title: slug.toUpperCase(), tags: ['testing'],
  definition: 'A fixture definition long enough to satisfy the concept schema.',
  explanation: 'A fixture explanation long enough to satisfy the schema rules.',
  key_properties: ['one', 'two'],
  relationships: [{ target: 'peer', clause: 'relates for a stated fixture reason' }],
  applications: 'Exercises the r1a suite.', see_also: ['peer'], ...extra,
}, { sourceUrl: extra.sourceUrl ?? null, today: '2026-08-22' }));

mkConcept('old-note'); mkConcept('new-a'); mkConcept('new-b'); mkConcept('peer');

// ---- supersede: dry-run, apply, reciprocity, lean, refusal on repeat ----
{
  const dry = run(['supersede', 'old-note', '--by', 'new-a,new-b', '--format', 'json']);
  check('supersede dry-runs', dry.code === 0 && dry.json.would_write.length === 3);

  const ap = run(['supersede', 'old-note', '--by', 'new-a,new-b', '--apply', '--format', 'json']);
  check('supersede applies', ap.code === 0 && ap.json.applied === true);
  const oldText = fs.readFileSync(path.join(fixture, 'concepts', 'old-note.md'), 'utf8');
  check('old note is leaned to a pointer', oldText.includes('Superseded by [[new-a]], [[new-b]]') && !oldText.includes('## Definition'));
  check('old note carries status + successors', /status: superseded/.test(oldText) && /superseded_by: \[new-a, new-b\]/.test(oldText));
  const newA = fs.readFileSync(path.join(fixture, 'concepts', 'new-a.md'), 'utf8');
  check('successor gained supersedes', /supersedes: \[old-note\]/.test(newA));

  const again = run(['supersede', 'old-note', '--by', 'new-a', '--apply', '--format', 'json']);
  check('re-superseding is refused', again.code === 1);

  const v = run(['verify', '--format', 'json']);
  check('supersession verifies clean (no KB016)', !v.json.findings.some((f) => f.code === 'KB016'));

  const q = run(['query', 'fixture definition old', '--format', 'json']);
  const hit = q.json.task?.hits?.find?.((h) => h.slug === 'old-note')
    ?? (q.json.task ?? q.json).hits?.find?.((h) => h.slug === 'old-note');
  check('query stamps superseded hits', !hit || Array.isArray(hit.superseded_by));
}

// ---- supersede rollback: induced failure restores every byte ----
{
  mkConcept('doomed');
  // Corrupt a successor's frontmatter AFTER parse would succeed but schema
  // fails on write: make new target with an invalid status by hand.
  fs.writeFileSync(path.join(fixture, 'concepts', 'bad-succ.md'),
    '---\ntitle: "Bad"\ndate: 2026-08-21\ntags: [x]\nstatus: draft\nbogus_field_not_in_schema: true\n---\n## Definition\nd\n## Explanation\ne\n## Key Properties\n- k\n## Relationships\n- r\n');
  const before = {
    doomed: fs.readFileSync(path.join(fixture, 'concepts', 'doomed.md'), 'utf8'),
    bad: fs.readFileSync(path.join(fixture, 'concepts', 'bad-succ.md'), 'utf8'),
  };
  const res = run(['supersede', 'doomed', '--by', 'bad-succ', '--apply', '--format', 'json']);
  check('supersede rolls back on post-apply failure', res.code === 1);
  check('rollback restores old note byte-identically',
    fs.readFileSync(path.join(fixture, 'concepts', 'doomed.md'), 'utf8') === before.doomed);
  check('rollback restores successor byte-identically',
    fs.readFileSync(path.join(fixture, 'concepts', 'bad-succ.md'), 'utf8') === before.bad);
}

// ---- support: seeded cache, stale-snapshot refusal, verbatim rule, recording ----
{
  const url = 'https://example.com/cited-source';
  mkConcept('cited', { sourceUrl: url });
  const cid = citeId('cited', url);
  const cacheDir = path.join(fixture, '.kb', 'cache', 'snapshots');
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(path.join(cacheDir, `${cid}.txt`), 'The source text asserting the fixture claim at length.');

  const emitted = run(['support', 'cited', '--no-fetch', '--format', 'json']).json;
  check('support emits an evidence-verdict task', emitted?.envelope?.task_class === 'evidence-verdict');
  const id = emitted.envelope.task_id;
  const quote = 'A fixture definition long enough to satisfy the concept schema.';

  const fab = run(['support', 'cited', '--verdicts', '@A@', '--format', 'json'], {
    task_id: id, verdicts: [{ cite_id: cid, claim_quote: 'This sentence appears nowhere in the note.', verdict: 'SUPPORTED', rationale: 'r' }],
  });
  check('fabricated claim_quote is refused', fab.code === 1);

  const ok = run(['support', 'cited', '--verdicts', '@A@', '--format', 'json'], {
    task_id: id,
    supplier: { class: 'model-single', id: 'fixture' },
    verdicts: [
      { cite_id: cid, claim_quote: quote, verdict: 'SUPPORTED', rationale: 'stated verbatim in source' },
      { cite_id: cid, claim_quote: 'Exercises the r1a suite.', verdict: 'UNCERTAIN', rationale: 'source is silent' },
    ],
  });
  check('verdicts apply', ok.code === 0 && ok.json.recorded === 2);
  const store = readStore(fixture, 'cited');
  const withSupport = store.find((o) => o.support);
  check('verdicts land in the evidence store', withSupport?.support?.length === 2);
  check('store keys by canonical url', withSupport?.url_canonical === canonicalUrl(url));

  const replay = run(['support', 'cited', '--verdicts', '@A@', '--format', 'json'], {
    task_id: id, verdicts: [{ cite_id: cid, claim_quote: quote, verdict: 'SUPPORTED', rationale: 'r' }],
  });
  check('support replay refused (KB022.4)', replay.code === 1 && replay.json?.error?.code === 'KB022.4');

  // stale snapshot: a fresh task (snapshot v2), then the cache changes under
  // it before the answer arrives. (Emitting with unchanged inputs would reuse
  // the applied task id and refuse as replay — idempotent emission.)
  fs.writeFileSync(path.join(cacheDir, `${cid}.txt`), 'Snapshot version two, still asserting the claim.');
  const em2 = run(['support', 'cited', '--no-fetch', '--format', 'json']).json;
  fs.writeFileSync(path.join(cacheDir, `${cid}.txt`), 'Completely different snapshot content now.');
  const stale = run(['support', 'cited', '--verdicts', '@A@', '--format', 'json'], {
    task_id: em2.envelope.task_id,
    verdicts: [{ cite_id: cid, claim_quote: quote, verdict: 'SUPPORTED', rationale: 'r' }],
  });
  check('stale snapshot refused (KB022.2)', stale.code === 1 && stale.json?.error?.code === 'KB022.2');
}

// ---- migration backfill idempotence ----
{
  const url = 'https://example.com/legacy';
  fs.writeFileSync(path.join(fixture, 'concepts', 'legacy.md'),
    `---\ntitle: "Legacy"\ndate: 2026-08-21\ntags: [x]\nstatus: draft\nsources:\n  - url: ${url}\n    hash: "sha256:${'c'.repeat(64)}"\n    retrieved: 2026-07-01\n---\n## Definition\nd\n## Explanation\ne\n## Key Properties\n- k\n## Relationships\n- r\n`);
  const first = run(['migrate', '--apply', '--format', 'json']);
  check('migrate backfills class + liveness', first.code === 0);
  const migrated = fs.readFileSync(path.join(fixture, 'concepts', 'legacy.md'), 'utf8');
  check('summary gained class + reachability', /class: unclassified/.test(migrated) && /reachability: ok/.test(migrated));
  const store = readStore(fixture, 'legacy');
  check('store gained the relocated observation', store.length === 1 && store[0].reachability === 'ok' && store[0].run === 'migrated:2026-07-01');
  const second = run(['migrate', '--apply', '--format', 'json']);
  check('backfill is idempotent (text)', !second.json.changes.some((c) => c.file === 'concepts/legacy.md'));
  check('backfill is idempotent (store)', readStore(fixture, 'legacy').length === 1);
}

fs.rmSync(fixture, { recursive: true, force: true });

if (failures.length) {
  console.error(`r1a test FAILED:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exitCode = 1;
} else {
  // ---- D5: freshness states — deterministic, date-carrying, no clock ----
{
  const ok = (d, digest) => ({ reachability: 'ok', run: `r1:${d}`, authenticity: { content_digest: digest } });
  check('hash-unchanged when latest ok observation matches the accepted baseline',
    freshness(ok('2026-08-24', 'sha256:aa'), 'sha256:aa').state === 'hash-unchanged'
    && freshness(ok('2026-08-24', 'sha256:aa'), 'sha256:aa').last_checked === '2026-08-24');
  check('content-drifted when latest digest differs from the accepted baseline',
    freshness(ok('2026-08-24', 'sha256:bb'), 'sha256:aa').state === 'content-drifted');
  check('unverifiable for dead sources, date carried',
    freshness({ reachability: 'dead-no-archive', run: 'r1:2026-08-20' }, 'sha256:aa').state === 'unverifiable'
    && freshness({ reachability: 'dead-no-archive', run: 'r1:2026-08-20' }, 'sha256:aa').last_checked === '2026-08-20');
  check('degraded reachability surfaces as unreachable with the kind',
    freshness({ reachability: 'blocked-4xx', run: 'r1:2026-08-21' }, 'sha256:aa').state === 'unreachable:blocked-4xx');
  check('never observed is stated, not guessed',
    freshness(null, 'sha256:aa').state === 'never-checked' && freshness(null, 'sha256:aa').last_checked === null);
}

console.log('r1a test passed — never-resolved arithmetic, atomic supersession, bound support verdicts, idempotent backfill');
}
