#!/usr/bin/env node
/**
 * Log (design/log.md): grammar, applies write lines, merge-base append-only
 * polarity (mutate/delete fail, merge-interleave passes), canon<->log
 * coupling, degraded mode without a base, the 200-char cap.
 * Audit (design/audit.md): pinned deterministic candidates, seeded
 * contradiction surfaced, alias protection, verbatim-quote refusal, queue
 * dedupe on rerun, accepted-tension exits the ageing clock.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderConcept } from '../lib/promote.mjs';
import { appendLog, formatLine, checkLog } from '../lib/log.mjs';
import { gapCandidates } from '../lib/audit.mjs';
import * as queue from '../lib/queue.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(KB_DIR, 'bin', 'kb.mjs');
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

// ---------------- log: grammar + append ----------------
{
  check('grammar renders', formatLine({ verb: 'assess', target: 'x', disposition: 'discard', rationale: 'duplicate' })
    === '- assess x → discard; duplicate');
  check('grammar strips newlines', !formatLine({ verb: 'note', disposition: 'recorded', rationale: 'a\nb' }).includes('\n'));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-log-'));
  appendLog(tmp, '2026-08-22', ['- a x → done']);
  appendLog(tmp, '2026-08-22', ['- b y → done']);
  appendLog(tmp, '2026-09-01', ['- c z → done']);
  const aug = fs.readFileSync(path.join(tmp, 'log', '2026-08.md'), 'utf8');
  check('one day header for two same-day appends', (aug.match(/## 2026-08-22/g) ?? []).length === 1);
  check('months shard', fs.existsSync(path.join(tmp, 'log', '2026-09.md')));
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ---------------- log: merge-base polarity in a real git repo ----------------
{
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-git-'));
  const g = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  g('init', '-q', '-b', 'main');
  g('config', 'user.email', 't@t'); g('config', 'user.name', 't');
  fs.mkdirSync(path.join(repo, 'log'));
  fs.mkdirSync(path.join(repo, 'concepts'));
  fs.writeFileSync(path.join(repo, 'log', '2026-08.md'), '## 2026-08-20\n- promote a → applied\n- cards a → created\n');
  fs.writeFileSync(path.join(repo, 'concepts', 'a.md'), 'body\n');
  g('add', '-A'); g('commit', '-qm', 'base');
  const base = g('rev-parse', 'HEAD').trim();

  // append passes
  fs.appendFileSync(path.join(repo, 'log', '2026-08.md'), '- link a → applied\n');
  g('add', '-A'); g('commit', '-qm', 'append');
  check('pure append passes', checkLog(repo, base).findings.length === 0);

  // interleave (a merge shape): base lines survive in order, new line between
  const good = '## 2026-08-20\n- promote a → applied\n- merged-in x → applied\n- cards a → created\n- link a → applied\n';
  fs.writeFileSync(path.join(repo, 'log', '2026-08.md'), good);
  g('add', '-A'); g('commit', '-qm', 'interleave');
  check('merge interleave with intact base lines passes', checkLog(repo, base).findings.length === 0);

  // mutation and deletion fail — checkLog reads the worktree, no commit needed
  fs.writeFileSync(path.join(repo, 'log', '2026-08.md'),
    '## 2026-08-20\n- promote a → applied; REWRITTEN\n- cards a → created\n');
  check('mutated base line fails (KB019)', checkLog(repo, base).findings.some((f) => f.code === 'KB019'));
  fs.writeFileSync(path.join(repo, 'log', '2026-08.md'), '## 2026-08-20\n- promote a → applied\n');
  check('suffix truncation fails (KB019)', checkLog(repo, base).findings.some((f) => f.code === 'KB019'));
  fs.writeFileSync(path.join(repo, 'log', '2026-08.md'), good);

  // coupling: canon touched, no log line — measured from ITS OWN base, since
  // earlier commits in the wider range already added log lines
  const base2 = g('rev-parse', 'HEAD').trim();
  fs.writeFileSync(path.join(repo, 'concepts', 'a.md'), 'edited body\n');
  g('add', '-A'); g('commit', '-qm', 'canon edit, no log');
  const coupled = checkLog(repo, base2);
  check('canon diff without a log line fails coupling', coupled.findings.some((f) => /no log line/.test(f.message)));
  fs.appendFileSync(path.join(repo, 'log', '2026-08.md'), '- note → recorded; hand edit explained\n');
  g('add', '-A'); g('commit', '-qm', 'log line added');
  check('adding the line satisfies coupling', checkLog(repo, base2).findings.length === 0);

  // degraded without any base
  const bare = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-nogit-'));
  check('no repo degrades to a warning, not a lie', checkLog(bare, null).degraded === true);
  fs.rmSync(bare, { recursive: true, force: true });
  fs.rmSync(repo, { recursive: true, force: true });
}

// ---------------- fixture corpus for CLI-level log + audit ----------------
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-audit-'));
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
    return { code: e.status, json };
  }
};
const mk = (slug, definition, extra = {}) => fs.writeFileSync(path.join(fixture, 'concepts', `${slug}.md`),
  renderConcept({
    slug, title: extra.title ?? slug.toUpperCase(), tags: ['testing'],
    definition,
    explanation: extra.explanation ?? 'An explanation long enough to satisfy the schema requirements.',
    key_properties: ['one', 'two'],
    relationships: [{ target: extra.rel ?? 'peer', clause: 'relates for a stated fixture reason' }],
    applications: 'Exercises the audit suite.', see_also: [extra.rel ?? 'peer'],
  }, { sourceUrl: null, today: '2026-08-22' })
    // splice a domain into the frontmatter: the first '\n---\n' is the closing delimiter
    .replace('\n---\n', `\n${extra.fm ?? 'domain: testing'}\n---\n`));

// a seeded contradiction pair in one domain
mk('hot-take', 'Retrieval augmentation is always required for grounded agent answers in production systems.');
mk('cold-take', 'Retrieval augmentation is never required for grounded agent answers in production systems.');
mk('peer', 'A neutral fixture note that pads the corpus for ranking purposes here.');

// log verb: cap + line lands
{
  const gap = run(['log', 'gap', 'the corpus lacks a note on X', '--format', 'json']);
  check('kb log gap writes a line', gap.code === 0 && fs.existsSync(path.join(fixture, gap.json.file)));
  const long = run(['log', 'note', 'x'.repeat(201), '--format', 'json']);
  check('201 chars refused', long.code !== 0);
}

// audit: determinism + seeded pair surfaced
{
  const a = run(['audit', '--only', 'contradictions', '--limit', '5', '--format', 'json']);
  const b = run(['audit', '--only', 'contradictions', '--limit', '5', '--format', 'json']);
  check('candidate generation is deterministic', JSON.stringify(a.json.task) === JSON.stringify(b.json.task));
  const items = a.json.task.candidates.contradictions.items;
  check('params hash rides in the task', /^sha256:[0-9a-f]{16}$/.test(a.json.task.candidates.contradictions.params_hash));
  const pair = items.find((i) => [i.a, i.b].sort().join() === 'cold-take,hot-take');
  check('seeded contradiction pair surfaces', !!pair);

  // findings: fabricated quote refused; genuine quotes queue; rerun dedupes
  const id = a.json.envelope.task_id;
  const finding = (qa, qb) => ({
    task_id: id, supplier: { class: 'model-single', id: 'fixture' },
    findings: [{ check: 'contradictions', candidate_id: pair.candidate_id, a: 'cold-take', b: 'hot-take',
      quote_a: qa, quote_b: qb, verdict: 'contradiction', more_likely_correct: 'unknown', rationale: 'direct negation' }],
  });
  const fab = run(['audit', '--findings', '@A@', '--format', 'json'],
    finding('Retrieval augmentation is never required for grounded agent answers in production systems.',
            'This sentence was never written in either note at all.'));
  check('fabricated quote refused', fab.code === 1 && /verbatim/.test(fab.json.error.message));

  const ok = run(['audit', '--findings', '@A@', '--format', 'json'],
    finding('Retrieval augmentation is never required for grounded agent answers in production systems.',
            'Retrieval augmentation is always required for grounded agent answers in production systems.'));
  check('genuine findings apply and queue', ok.code === 0 && ok.json.queued === 1);
  check('a derived report lands', fs.existsSync(path.join(fixture, ok.json.report)));

  // rerun the same finding under a fresh task: queue dedupes on stable identity
  fs.appendFileSync(path.join(fixture, 'concepts', 'peer.md'), '\nPadding edit to refresh the task inputs.\n');
  const a2 = run(['audit', '--only', 'contradictions', '--limit', '5', '--format', 'json']);
  const pair2 = a2.json.task.candidates.contradictions.items.find((i) => [i.a, i.b].sort().join() === 'cold-take,hot-take');
  check('candidate identity is content-derived (stable across runs)', pair2.candidate_id === pair.candidate_id);
  const rerun = run(['audit', '--findings', '@A@', '--format', 'json'], {
    ...finding('Retrieval augmentation is never required for grounded agent answers in production systems.',
               'Retrieval augmentation is always required for grounded agent answers in production systems.'),
    task_id: a2.json.envelope.task_id,
  });
  check('re-submitted finding does not double-queue', rerun.code === 0 && rerun.json.queued === 0);
}

// alias protection: a link written as a title-form alias is NOT a gap
{
  const notes = [
    { slug: 'real-note', title: 'The Real Note', data: { aliases: ['Alias Form'] }, body: 'x' },
    { slug: 'n1', title: 'N1', data: {}, body: 'see [[Alias Form]] and [[truly-missing]]' },
    { slug: 'n2', title: 'N2', data: {}, body: 'see [[Alias Form]] and [[truly-missing]]' },
    { slug: 'n3', title: 'N3', data: {}, body: 'see [[Alias Form]] and [[truly-missing]]' },
  ];
  const gaps = gapCandidates(notes, 10);
  check('alias-form links are protected', !gaps.some((g) => g.term.toLowerCase().includes('alias')));
  check('a genuinely missing term referenced by 3 notes is a gap', gaps.some((g) => g.term === 'truly-missing'));
}

// accepted-tension exits the ageing clock
{
  const kbq = path.join(fixture, '.kb');
  const entry = queue.propose(kbq, 'audit', { subject: 'contradictions:aged', value: 'contradiction', rationale: 'r', source: 'audit', today: '2026-01-01' });
  check('aged proposal is stale before disposition', queue.stale(kbq, 14, '2026-08-22').some((e) => e.id === entry.id));
  queue.resolve(kbq, entry.id, 'accepted-tension', '2026-08-22', 'legitimately unresolved');
  check('accepted-tension exits the ageing clock', !queue.stale(kbq, 14, '2026-08-22').some((e) => e.id === entry.id));
}

fs.rmSync(fixture, { recursive: true, force: true });

if (failures.length) {
  console.error(`log-audit test FAILED:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('log-audit test passed — append-only vs merge-base, coupling, pinned candidates, verbatim rule, dedupe, tension terminal');
}
