#!/usr/bin/env node
/**
 * Context compiler acceptance (design/context-compiler.md): determinism,
 * stale-index refusal, budget floor + priority trims reported in the tail,
 * one fixture per task mode, KB020 anchor resolution.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderConcept } from '../lib/promote.mjs';
import { resolveAnchor } from '../lib/context.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(KB_DIR, 'bin', 'kb.mjs');
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-ctx-'));
for (const d of ['concepts', 'staging', 'flashcards']) fs.mkdirSync(path.join(fixture, d), { recursive: true });
const run = (args) => {
  try {
    const out = execFileSync('node', [CLI, ...args], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, KB_ROOT: fixture },
    });
    return { code: 0, json: JSON.parse(out) };
  } catch (e) {
    let json = null; try { json = JSON.parse(e.stdout ?? ''); } catch { /* not json */ }
    return { code: e.status, json };
  }
};

const mk = (slug, rel) => fs.writeFileSync(path.join(fixture, 'concepts', `${slug}.md`), renderConcept({
  slug, title: slug.toUpperCase(), tags: ['testing'],
  definition: `A definition for ${slug} long enough to satisfy the schema comfortably.`,
  explanation: 'An explanation long enough to satisfy the concept schema rules.',
  key_properties: ['one', 'two'],
  relationships: [{ target: rel, clause: 'relates for a stated fixture reason' }],
  applications: 'Exercises the context suite.', see_also: [rel],
}, { sourceUrl: null, today: '2026-08-22' }));
mk('alpha', 'beta'); mk('beta', 'alpha'); mk('gamma', 'alpha');
fs.writeFileSync(path.join(fixture, 'flashcards', 'alpha.md'),
  '---\ntitle: "ALPHA"\ntags: [flashcards, testing]\ndate: 2026-08-22\ndeck: testing\n---\n\nQ: What is alpha? <!-- kb:card:aaaaaa -->\nA: A fixture.\n');

// stale index refuses BEFORE the index exists
{
  const r = run(['context', '--for', 'cards-refresh', 'alpha', '--format', 'json']);
  check('missing index refuses with CONTEXT_STALE_INDEX', r.code === 1 && r.json?.error?.code === 'CONTEXT_STALE_INDEX');
}
run(['index']);

// one bundle per task mode
{
  const cards = run(['context', '--for', 'cards-refresh', 'alpha', '--format', 'json']);
  check('cards-refresh compiles', cards.code === 0 && cards.json.bundle.response_schema.name === 'card-draft.schema.json');
  check('cards-refresh carries the deck artifact', cards.json.bundle.artifacts.some((a) => a.name === 'deck:alpha'));
  check('edges are ranked and resolve', cards.json.bundle.edges.some((e) => e.slug === 'beta'));
  check('policy excerpts embedded', cards.json.bundle.policy.length >= 1 && cards.json.bundle.policy.every((p) => p.text.length > 0));

  const promote = run(['context', '--for', 'promote-review', 'alpha', '--format', 'json']);
  check('promote-review compiles', promote.code === 0 && promote.json.bundle.response_schema.name === 'concept-draft.schema.json');

  const pair = run(['context', '--for', 'audit-pair', 'alpha', 'beta', '--format', 'json']);
  check('audit-pair compiles with two targets', pair.code === 0 && pair.json.bundle.targets.length === 2
    && pair.json.bundle.response_schema.name === 'audit-finding.schema.json');

  const brief = run(['context', '--for', 'research-brief', '--query', 'definition alpha fixture', '--format', 'json']);
  check('research-brief retrieves targets', brief.code === 0 && brief.json.bundle.targets.length > 0);

  const qa = run(['context', '--for', 'query-answer', '--query', 'definition alpha fixture', '--format', 'json']);
  check('query-answer compiles', qa.code === 0 && qa.json.bundle.response_schema.name === 'query-answer.schema.json');
}

// determinism: byte-identical across runs
{
  const sha = () => crypto.createHash('sha256')
    .update(JSON.stringify(run(['context', '--for', 'cards-refresh', 'alpha', '--format', 'json']).json)).digest('hex');
  check('two runs are byte-identical', sha() === sha());
}

// budget: floor failure with the minimum stated; trims follow priority and land in the tail
{
  const floor = run(['context', '--for', 'cards-refresh', 'alpha', '--budget', '50', '--format', 'json']);
  check('impossible budget fails with the floor code', floor.code === 1 && floor.json.error.code === 'CONTEXT_BUDGET_FLOOR');
  check('floor failure names the minimum', /at least \d+/.test(floor.json.error.remedy));

  const full = run(['context', '--for', 'cards-refresh', 'alpha', '--format', 'json']).json.bundle;
  const fullSize = JSON.stringify(full.targets).length + JSON.stringify(full.response_schema).length
    + JSON.stringify(full.policy).length + JSON.stringify(full.edges).length + JSON.stringify(full.artifacts).length;
  const squeezed = run(['context', '--for', 'cards-refresh', 'alpha', '--budget', String(fullSize - 10), '--format', 'json']);
  check('tight budget trims instead of failing', squeezed.code === 0);
  check('trims are reported in the tail', squeezed.json.bundle.tail.trims.length >= 1);
  check('lowest class trims first', squeezed.json.bundle.tail.trims[0].class === 'artifacts');
  check('prefix stays stable under trimming: policy intact before artifacts go',
    squeezed.json.bundle.policy.length === full.policy.length || squeezed.json.bundle.artifacts.length === 0);
}

// KB020: a dangling anchor resolves to null (the CLI refusal path shares this)
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-anchor-'));
  fs.writeFileSync(path.join(tmp, 'doc.md'), '# T\n\n## Real Heading\ncontent\n');
  check('resolving a real heading works', resolveAnchor(tmp, tmp, { file: 'doc.md', heading: 'Real Heading' }) !== null);
  check('a renamed heading dangles (KB020)', resolveAnchor(tmp, tmp, { file: 'doc.md', heading: 'Old Heading' }) === null);
  check('a missing file dangles (KB020)', resolveAnchor(tmp, tmp, { file: 'gone.md', heading: null }) === null);
  fs.rmSync(tmp, { recursive: true, force: true });
}

fs.rmSync(fixture, { recursive: true, force: true });

if (failures.length) {
  console.error(`context test FAILED:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('context test passed — five modes, determinism, budget floor + priority trims, anchor resolution');
}
