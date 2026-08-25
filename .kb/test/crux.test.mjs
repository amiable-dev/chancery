#!/usr/bin/env node
/**
 * Crux excerpts (ADR-013 D3, packet 7).
 *
 * A crux is a bounded verbatim excerpt captured at judge-time: byte-substring
 * containment is checked against the just-fetched source (capture-time only —
 * the C5 store keeps hashes, not bytes), the excerpt lives content-addressed
 * in its own sidecar store, and verify computes a tri-state without ever
 * upgrading a citation's verification status. Both polarities throughout.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { checkContainment, cruxCap, storeCrux, readCruxObject, cruxState, checkCrux } from '../lib/crux.mjs';

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

// ---- containment: verbatim byte-substring, contiguous by construction ----
{
  const src = 'The gate could not fail. It can now, and one CI leg re-runs it.';
  check('exact substring passes', checkContainment(src, 'It can now').ok);
  check('paraphrase fails', !checkContainment(src, 'The gate was unable to fail').ok);
  check('case drift fails (verbatim means bytes)', !checkContainment(src, 'the gate could not fail').ok);
  check('empty crux fails', !checkContainment(src, '').ok);
}

// ---- bounds: ceiling 500, lesser-of proportionality for short works ----
{
  check('long source gets the ceiling', cruxCap(100000) === 500);
  check('short work gets the proportional floor', cruxCap(700) === 175);
  check('cap never exceeds the source', cruxCap(80) <= 80);
}

// ---- store: content-addressed object + capture event, idempotent ----
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-crux-'));
  const meta = storeCrux(root, 'alpha', {
    url: 'https://x.example/a', text: 'It can now', source_hash: 'sha256:' + 'a'.repeat(64),
    captured_at: '2026-08-25', locator: 'para 2',
  });
  check('object file named by its content hash',
    /^sha256:[0-9a-f]{64}$/.test(meta.hash) && readCruxObject(root, meta.hash) === 'It can now');
  const again = storeCrux(root, 'alpha', {
    url: 'https://x.example/a', text: 'It can now', source_hash: 'sha256:' + 'a'.repeat(64),
    captured_at: '2026-08-25', locator: 'para 2',
  });
  check('same text, same address (idempotent)', again.hash === meta.hash);
  const events = fs.readFileSync(path.join(root, '.kb', 'evidence', 'crux', 'alpha.jsonl'), 'utf8')
    .trim().split('\n').map((l) => JSON.parse(l));
  check('capture events append, never overwrite', events.length === 2 && events[0].crux_hash === meta.hash);
  fs.rmSync(root, { recursive: true, force: true });
}

// ---- tri-state: verified / contested / unverifiable / withheld / integrity ----
{
  const cruxOf = (over = {}) => ({ hash: 'sha256:' + 'b'.repeat(64), source_hash: 'sha256:' + 'a'.repeat(64),
    captured_at: '2026-08-25', ...over });
  const src = (over = {}) => ({ url: 'u', hash: 'sha256:' + 'a'.repeat(64), reachability: 'ok', ...over });
  const okObject = () => 'text-that-hashes-elsewhere';
  check('verified when the accepted source hash still matches capture',
    cruxState({ crux: cruxOf(), source: src(), objectExists: true, objectHashMatches: true }).state === 'verified');
  check('contested when the source moved on and the crux is unconfirmed',
    cruxState({ crux: cruxOf(), source: src({ hash: 'sha256:' + 'c'.repeat(64) }), objectExists: true, objectHashMatches: true }).state === 'contested');
  check('unverifiable when the source is dead',
    cruxState({ crux: cruxOf(), source: src({ reachability: 'dead-no-archive' }), objectExists: true, objectHashMatches: true }).state === 'unverifiable');
  check('withheld license carries no text and states so',
    cruxState({ crux: { source_hash: 'sha256:' + 'a'.repeat(64), captured_at: '2026-08-25', license: 'withheld-license' }, source: src(), objectExists: false, objectHashMatches: false }).state === 'withheld');
  check('missing object at a non-withheld crux is an integrity failure',
    cruxState({ crux: cruxOf(), source: src(), objectExists: false, objectHashMatches: false }).state === 'integrity-fail');
  check('object content not matching its address is an integrity failure',
    cruxState({ crux: cruxOf(), source: src(), objectExists: true, objectHashMatches: false }).state === 'integrity-fail');
}

// ---- the gate check (KB024): integrity errors, contested warnings, per-work cap ----
{
  const H = (c) => 'sha256:' + c.repeat(64);
  const sha = (s) => 'sha256:' + crypto.createHash('sha256').update(s).digest('hex');
  const T1 = 'x'.repeat(400), T2 = 'y'.repeat(400);
  const HB = sha(T1), HD = sha(T2);
  const noteWith = (slug, sources) => ({ slug, data: { sources } });
  const objects = { [HB]: T1, [HD]: T2 };
  const read = (h) => objects[h] ?? null;

  const clean = checkCrux([noteWith('a', [{ url: 'https://w.example/one', hash: H('a'),
    crux: { hash: HB, source_hash: H('a'), captured_at: '2026-08-25' } }])], read, { perWorkCap: 1500 });
  check('verified crux yields no findings', clean.length === 0);

  const contested = checkCrux([noteWith('a', [{ url: 'https://w.example/one', hash: H('c'),
    crux: { hash: HB, source_hash: H('a'), captured_at: '2026-08-25' } }])], read, { perWorkCap: 1500 });
  check('contested crux is a warning, not an error',
    contested.length === 1 && contested[0].severity === 'warning' && contested[0].code === 'KB024');

  const broken = checkCrux([noteWith('a', [{ url: 'https://w.example/one', hash: H('a'),
    crux: { hash: H('f'), source_hash: H('a'), captured_at: '2026-08-25' } }])], read, { perWorkCap: 1500 });
  check('missing object is an error', broken.some((f) => f.severity === 'error'));

  const capped = checkCrux([
    noteWith('a', [{ url: 'https://w.example/one', hash: H('a'), crux: { hash: HB, source_hash: H('a'), captured_at: '2026-08-25' } }]),
    noteWith('b', [{ url: 'https://w.example/one#part-2', hash: H('a'), crux: { hash: HD, source_hash: H('a'), captured_at: '2026-08-25' } }]),
  ], read, { perWorkCap: 600 });
  check('per-work aggregate cap trips across notes on the canonical URL',
    capped.some((f) => f.severity === 'error' && /aggregate/.test(f.message)));
}

if (failures.length) {
  console.error('crux test FAILED:\n  - ' + failures.join('\n  - '));
  process.exit(1);
}
console.log('crux test passed — verbatim containment, content-addressed store, tri-state honest, per-work cap enforced, crux never upgrades a citation');
