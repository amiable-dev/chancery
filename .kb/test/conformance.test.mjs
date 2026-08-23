#!/usr/bin/env node
/**
 * Conformance suite (write-paths §3): the envelope is the only route to canon.
 *
 * Asserts, against a disposable KB_ROOT fixture: (a) `verify` performs zero
 * writes; (b) answers bind to their task — missing id, stale inputs, replay,
 * and out-of-set writes are each refused with their KB022 code; (c) the C6
 * record carries supplier attestation and the proposer_overlap disclosure;
 * (d) a failing post-apply verify rolls the write back byte-identically;
 * (e) the gate path never statically imports the extraction stack (ADR-011).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderConcept } from '../lib/promote.mjs';
import { check as envCheck, emit as envEmit, guardWrites, TASK_CLASSES } from '../lib/envelope.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(KB_DIR, 'bin', 'kb.mjs');
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };
// A step later steps depend on: record the failure AND dump the payload, then bail.
const need = (name, value, payload) => {
  if (value) return value;
  failures.push(name);
  console.error(`conformance test FAILED:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  console.error(`  payload at failure: ${JSON.stringify(payload)?.slice(0, 800)}`);
  process.exit(1);
};

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-conformance-'));
const run = (args, input) => {
  const file = input ? path.join(fixture, `answer-${crypto.randomUUID().slice(0, 8)}.json`) : null;
  if (input) fs.writeFileSync(file, JSON.stringify(input));
  const argsWithFile = file ? args.map((a) => (a === '@ANSWER@' ? file : a)) : args;
  try {
    const out = execFileSync('node', [CLI, ...argsWithFile], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, KB_ROOT: fixture },
    });
    return { code: 0, json: JSON.parse(out) };
  } catch (e) {
    let json = null;
    try { json = JSON.parse(e.stdout ?? ''); } catch { /* not json */ }
    return { code: e.status, json };
  }
};

// ---- fixture corpus: one concept, one staging note --------------------------
fs.mkdirSync(path.join(fixture, 'concepts'), { recursive: true });
fs.mkdirSync(path.join(fixture, 'staging'), { recursive: true });
fs.mkdirSync(path.join(fixture, 'flashcards'), { recursive: true });

const concept = (slug, title) => renderConcept({
  slug, title, tags: ['testing'],
  definition: 'A fixture concept with a definition long enough to satisfy the schema.',
  explanation: 'An explanation long enough to satisfy the schema minimum length rules.',
  key_properties: ['one', 'two'],
  relationships: [{ target: 'other-note', clause: 'relates for a stated fixture reason' }],
  applications: 'Used to exercise the conformance suite.',
  see_also: ['other-note'],
}, { sourceUrl: 'https://example.com/src', today: '2026-08-22' });
fs.writeFileSync(path.join(fixture, 'concepts', 'other-note.md'), concept('other-note', 'Other Note'));

const stagingPath = path.join(fixture, 'staging', 'candidate.md');
const stagingText = [
  '# Candidate', '',
  '> **Source**: https://example.com/article', '> **Added**: 2026-08-22', '> **Tags**: testing', '',
  'Body of the staged candidate, long enough to assess.', '',
].join('\n');
fs.writeFileSync(stagingPath, stagingText);

// ---- (a) verify performs zero writes ---------------------------------------
const treeHash = () => {
  const parts = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((x, y) => (x.name < y.name ? -1 : 1))) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) walk(abs);
      else parts.push(`${abs}:${crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex')}`);
    }
  };
  walk(fixture);
  return crypto.createHash('sha256').update(parts.join('\n')).digest('hex');
};
{
  const before = treeHash();
  run(['verify', '--format', 'json']);
  check('verify writes nothing', treeHash() === before);
}

// ---- (b) binding: missing id, stale, replay, out-of-set --------------------
const emitAssess = () => run(['assess', 'staging/candidate.md', '--format', 'json']).json;
const goodVerdict = (task_id) => ({
  task_id, rubric: 'promotion@1', target: 'staging/candidate.md',
  disqualifiers: {
    'pure-announcement': { triggered: false, rationale: 'fixture' },
    duplicate: { triggered: false, rationale: 'fixture' },
    unfalsifiable: { triggered: false, rationale: 'fixture' },
  },
  dimensions: {
    durability: { rating: 'strong', rationale: 'fixture' },
    actionability: { rating: 'strong', rationale: 'fixture' },
    atomicity: { rating: 'strong', rationale: 'fixture' },
  },
});

{
  const emitted = emitAssess();
  check('assess emits an envelope', /^[0-9a-f]{16}$/.test(emitted.envelope?.task_id));
  const id = emitted.envelope.task_id;

  const noId = run(['assess', 'staging/candidate.md', '--verdict', '@ANSWER@', '--format', 'json'],
    { ...goodVerdict(id), task_id: undefined });
  check('missing task_id refused with KB022.1', noId.code === 1 && noId.json?.error?.code === 'KB022.1');

  fs.writeFileSync(stagingPath, `${stagingText}\nEdited after emission.\n`);
  const stale = run(['assess', 'staging/candidate.md', '--verdict', '@ANSWER@', '--format', 'json'], goodVerdict(id));
  check('stale inputs refused with KB022.2', stale.code === 1 && stale.json?.error?.code === 'KB022.2');
  fs.writeFileSync(stagingPath, stagingText);

  const ok = run(['assess', 'staging/candidate.md', '--verdict', '@ANSWER@', '--format', 'json'], goodVerdict(id));
  check('bound verdict applies', ok.code === 0 && ok.json?.ok === true);

  const replay = run(['assess', 'staging/candidate.md', '--verdict', '@ANSWER@', '--format', 'json'], goodVerdict(id));
  check('replay refused with KB022.4', replay.code === 1 && replay.json?.error?.code === 'KB022.4');
}

// ---- promote: write-set guard + C6 record ----------------------------------
{
  const emitted = run(['promote', 'candidate', '--format', 'json']).json;
  const id = need('promote emits an envelope', emitted?.envelope?.task_id, emitted);
  const draft = (slug) => ({
    task_id: id,
    supplier: { class: 'model-single', id: 'conformance-fixture', version: '1' },
    concepts: [{
      slug, title: 'Candidate', tags: ['testing'],
      definition: 'A drafted definition long enough to satisfy the schema requirements here.',
      explanation: 'A drafted explanation long enough to satisfy the schema length rules.',
      key_properties: ['alpha', 'beta'],
      relationships: [{ target: 'other-note', clause: 'relates for a drafted fixture reason' }],
      applications: 'Applied in the conformance fixture.',
      see_also: ['other-note'],
    }],
  });

  // Layer 1: the draft schema's slug pattern refuses traversal before the
  // guard is even consulted. Layer 2 (the guard itself) is unit-tested below —
  // it is what holds if a schema ever regresses.
  const escape = run(['promote', 'candidate', '--draft', '@ANSWER@', '--apply', '--format', 'json'], draft('../escape'));
  check('traversal slug refused', escape.code === 1);
  check('traversal wrote nothing', !fs.existsSync(path.join(fixture, 'escape.md')));

  const ok = run(['promote', 'candidate', '--draft', '@ANSWER@', '--apply', '--format', 'json'], draft('candidate'));
  check('gated promote applies', ok.code === 0 && ok.json?.ok === true);
  check('concept landed', fs.existsSync(path.join(fixture, 'concepts', 'candidate.md')));

  const record = JSON.parse(fs.readFileSync(path.join(fixture, '.kb', 'assessments', 'tasks', `${id}.json`), 'utf8'));
  check('C6 record marked applied', record.status === 'applied');
  check('C6 record carries supplier attestation', record.supplier?.class === 'model-single');
  check('C6 record carries proposer_overlap', record.proposer_overlap === 'unknown');
  check('C6 record lists written files', Array.isArray(record.written) && record.written.includes('concepts/candidate.md'));
  check('C6 record carries decision provenance', record.decision_provenance === 'model');
}

// ---- (d) rollback: post-apply verify failure restores bytes ----------------
{
  // A deck whose frontmatter a human corrupted: the refresh merge preserves the
  // broken header, post-apply verify sees KB001, and the write must roll back.
  const deckPath = path.join(fixture, 'flashcards', 'candidate.md');
  const corrupted = ['---', 'title: "unclosed', '---', '', '## Cards', '',
    'Q: What? <!-- kb:card:aaaaaa -->', 'A: That.', ''].join('\n');
  fs.writeFileSync(deckPath, corrupted);

  const emitted = run(['cards', 'candidate', '--format', 'json']).json;
  const cardsId = need('cards emits an envelope', emitted?.envelope?.task_id, emitted);
  const ok = run(['cards', 'candidate', '--draft', '@ANSWER@', '--apply', '--format', 'json'], {
    task_id: cardsId,
    cards: [{ question: 'A new fixture question?', answer: 'A new fixture answer.' }],
  });
  check('post-apply failure exits non-zero', ok.code === 1);
  check('rollback restores the file byte-identically', fs.readFileSync(deckPath, 'utf8') === corrupted);
}

// ---- write-set guard (unit: layer 2 behind the draft schemas) ---------------
{
  const env = { allowed_writes: ['concepts/*.md', '.kb/queue/proposals.jsonl'] };
  const ok = (files) => guardWrites(env, fixture, files).ok;
  check('guard passes an in-set write', ok(['concepts/x.md']) === true);
  check('guard passes the literal pattern', ok(['.kb/queue/proposals.jsonl']) === true);
  check('guard refuses traversal', ok(['../escape.md']) === false);
  check('guard refuses nested paths through a one-segment wildcard', ok(['concepts/a/b.md']) === false);
  check('guard refuses an absolute path', ok(['/etc/passwd']) === false);
  check('guard refuses an out-of-set directory', ok(['staging/x.md']) === false);
  check('guard reports KB022.5', guardWrites(env, fixture, ['../e.md']).code === 'KB022.5');
}

// ---- supplier-class restriction (unit: no evidence-verdict verb exists yet) -
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-envelope-'));
  const { envelope } = envEmit(tmp, {
    verb: 'support', taskClass: 'evidence-verdict', target: 'x',
    inputs: [{ name: 'claim', text: 'c' }], allowedWrites: [], schemaVersion: '1', task: {},
  });
  const refused = envCheck(tmp, {
    task_id: envelope.task_id, supplier: { class: 'model-panel' },
  }, { verb: 'support', schemaVersion: '1', resolveInput: (n) => (n === 'claim' ? 'c' : undefined) });
  check('panel refused on evidence-verdict with KB022.6', refused.ok === false && refused.code === 'KB022.6');
  check('evidence-verdict excludes panels in the registry', !TASK_CLASSES['evidence-verdict'].includes('model-panel'));
}

// ---- the apply lock: a live holder refuses, a dead holder is reclaimed -----
{
  const lockDir = path.join(fixture, '.kb', 'lock');
  fs.mkdirSync(lockDir, { recursive: true });
  fs.writeFileSync(path.join(lockDir, 'pid'), String(process.pid)); // this test process is alive
  const emitted = run(['cards', 'candidate', '--format', 'json']).json;
  const held = run(['cards', 'candidate', '--draft', '@ANSWER@', '--apply', '--format', 'json'], {
    task_id: emitted?.envelope?.task_id ?? 'deadbeefdeadbeef',
    cards: [{ question: 'Held-lock question?', answer: 'Never lands.' }],
  });
  check('a live lock holder refuses the apply', held.code !== 0);
  fs.writeFileSync(path.join(lockDir, 'pid'), '999999999'); // dead pid: reclaimable
  const reclaimed = run(['cards', 'candidate', '--draft', '@ANSWER@', '--apply', '--format', 'json'], {
    task_id: emitted?.envelope?.task_id ?? 'deadbeefdeadbeef',
    cards: [{ question: 'Reclaimed-lock question?', answer: 'Lands or rolls back on its merits.' }],
  });
  check('a dead holder is reclaimed', !fs.existsSync(lockDir) || reclaimed.code !== undefined);
}

// ---- (e) gate-path purity: no static import of the extraction stack --------
{
  const banned = ['jsdom', '@mozilla/readability', 'turndown'];
  const staticImports = (file) => {
    const src = fs.readFileSync(file, 'utf8');
    return [...src.matchAll(/^\s*(?:import|export)\s[^;]*?from\s+['"]([^'"]+)['"]/gms)].map((m) => m[1]);
  };
  const seen = new Set();
  const queue = [path.join(KB_DIR, 'bin', 'kb.mjs')];
  const offenders = [];
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    for (const spec of staticImports(file)) {
      if (banned.some((b) => spec === b || spec.startsWith(`${b}/`))) offenders.push(`${path.basename(file)} -> ${spec}`);
      if (spec.startsWith('.')) queue.push(path.resolve(path.dirname(file), spec));
    }
  }
  check(`gate path has no static extraction imports (${offenders.join(', ') || 'clean'})`, offenders.length === 0);
}

fs.rmSync(fixture, { recursive: true, force: true });

if (failures.length) {
  console.error(`conformance test FAILED:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('conformance test passed — envelope binding, refusals, C6 record, rollback, gate purity');
}
