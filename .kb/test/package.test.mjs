#!/usr/bin/env node
/**
 * npm-packaging acceptance: the tarball is the ENGINE + default ontology —
 * never the reference corpus, never operational state, never tests — and the
 * packaged CLI governs an EXTERNAL repo via root discovery (nearest ancestor
 * carrying .kb/kb.config.yaml), not the package it runs from. Offline: the
 * extracted package borrows this repo's node_modules by symlink.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderConcept } from '../lib/promote.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(KB_DIR, '..');
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-pack-'));

// ---- pack, and audit the tarball's contents ----
const packOut = execFileSync('npm', ['pack', '--pack-destination', work, '--json'], {
  cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
});
const tarball = path.join(work, JSON.parse(packOut)[0].filename);
const listing = execFileSync('tar', ['tzf', tarball], { encoding: 'utf8' }).split('\n').filter(Boolean);

const has = (p) => listing.some((l) => l === `package/${p}` || l.startsWith(`package/${p}`));
check('engine ships', has('.kb/bin/kb.mjs') && has('.kb/bin/kb-mcp.mjs') && has('.kb/lib/'));
check('default ontology ships', has('.kb/kb.config.yaml') && has('.kb/schemas/') && has('.kb/facets.yml') && has('.kb/POLICY.md'));
check('procedures ship (adapters regenerate from them)', has('.kb/procedures/'));
check('the reference corpus does NOT ship', !has('concepts/') && !has('flashcards/') && !has('staging/'));
check('operational state does NOT ship (C4-C6)', !has('.kb/queue/') && !has('.kb/assessments/') && !has('.kb/evidence/'));
check('tests and log do NOT ship', !has('.kb/test/') && !has('log/'));
check('the doc site does NOT ship (ADR-012 §4)', !has('site/') && !has('design_handoff_chancery_brand/'));
check('governance docs beyond the name page do NOT ship', !has('docs/adrs/') && !has('docs/reviews/'));

// ---- extract; borrow node_modules; drive an EXTERNAL self-governed repo ----
execFileSync('tar', ['xzf', tarball, '-C', work]);
const pkg = path.join(work, 'package');
fs.symlinkSync(path.join(REPO, 'node_modules'), path.join(pkg, 'node_modules'));
const packedCli = path.join(pkg, '.kb', 'bin', 'kb.mjs');

const target = path.join(work, 'their-kb');
for (const d of ['concepts', 'staging', 'flashcards']) fs.mkdirSync(path.join(target, d), { recursive: true });
// the target repo carries ITS OWN .kb, seeded from the package's default ontology
fs.cpSync(path.join(pkg, '.kb', 'schemas'), path.join(target, '.kb', 'schemas'), { recursive: true });
fs.cpSync(path.join(pkg, '.kb', 'rubrics'), path.join(target, '.kb', 'rubrics'), { recursive: true });
for (const f of ['kb.config.yaml', 'facets.yml', 'POLICY.md']) {
  fs.copyFileSync(path.join(pkg, '.kb', f), path.join(target, '.kb', f));
}
fs.writeFileSync(path.join(target, 'concepts', 'their-note.md'), renderConcept({
  slug: 'their-note', title: 'Their Note', tags: ['testing'],
  definition: 'A note in somebody else’s repository, long enough for the schema.',
  explanation: 'An explanation long enough to satisfy the schema requirements.',
  key_properties: ['one', 'two'],
  relationships: [{ target: 'their-note', clause: 'self-reference for the fixture' }],
  applications: 'Proves the packaged CLI governs external repos.', see_also: [],
}, { sourceUrl: null, today: '2026-08-23' }));

// NO KB_ROOT: discovery must find the target repo from cwd — including a subdir
const run = (args, cwd) => {
  const env = { ...process.env }; delete env.KB_ROOT;
  try {
    return { code: 0, out: execFileSync('node', [packedCli, ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env }) };
  } catch (e) { return { code: e.status, out: e.stdout ?? '' }; }
};
const idx = run(['index', '--format', 'json'], target);
check('packaged CLI regenerates the external index', idx.code === 0 && fs.existsSync(path.join(target, 'concepts', '_index.md')));
const v = run(['verify', '--format', 'json'], target);
const report = JSON.parse(v.out || '{}');
check('packaged CLI verifies the external repo clean', v.code === 0 && report.ok === true);
const deep = run(['verify', '--format', 'json'], path.join(target, 'concepts'));
check('discovery walks up from a subdirectory', deep.code === 0 && JSON.parse(deep.out).ok === true);
check('nothing leaked into the package dir', !fs.existsSync(path.join(pkg, 'concepts', '_index.md')) && !fs.existsSync(path.join(pkg, '.kb', 'queue')));

// ---- kb init from the packed tarball: a green gate in an empty directory ----
{
  const fresh = path.join(work, 'green-field');
  fs.mkdirSync(fresh, { recursive: true });
  const initRun = run(['init', '--format', 'json'], fresh);
  check('packed kb init succeeds', initRun.code === 0 && JSON.parse(initRun.out).ok === true);
  const v2 = JSON.parse(run(['verify', '--format', 'json'], fresh).out);
  check('freshly initialised repo verifies clean', v2.ok === true && v2.summary.warnings === 0);
  const rubric = fs.readFileSync(path.join(fresh, '.kb', 'rubrics', 'promotion.rubric.yaml'), 'utf8');
  check('fresh rubric anchors to shipped exemplars', /\.kb\/exemplars\//.test(rubric) && !/: concepts\//.test(rubric));
  check('exemplar notes shipped and copied', fs.existsSync(path.join(fresh, '.kb', 'exemplars', 'context-engineering.md')));
  check('adapters generated for the fresh repo', fs.existsSync(path.join(fresh, '.claude', 'skills', 'kb-verify', 'SKILL.md')));
  const again = run(['init', '--format', 'json'], fresh);
  check('re-init inside a root is refused', again.code === 1 && JSON.parse(again.out).ok === false);
  const nested = path.join(fresh, 'eval-root');
  fs.mkdirSync(nested, { recursive: true });
  const refused = run(['init', '--format', 'json'], nested);
  check('nested init refuses without --force', refused.code === 1);
  const forced = run(['init', '--force', '--format', 'json'], nested);
  check('nested init proceeds with --force', forced.code === 0 && JSON.parse(forced.out).ok === true);
  const nv = JSON.parse(run(['verify', '--format', 'json'], nested).out);
  check('nested root self-governs cleanly', nv.ok === true && nv.summary.warnings === 0);
}

fs.rmSync(work, { recursive: true, force: true });

if (failures.length) {
  console.error(`package test FAILED:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('package test passed — tarball is engine+ontology only; packaged CLI self-governs external repos via root discovery');
}
