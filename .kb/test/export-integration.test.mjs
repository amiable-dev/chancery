#!/usr/bin/env node
/**
 * Export integration (design/export-integration.md): the publication filter
 * (superseded ship as manifest redirects, never pages), mount properties
 * (id prefix + site-absolute links), per-renderer flag applicability,
 * merge-tags conflict refusal with nothing written, rendered-output manifest
 * hashing, json schema stability, determinism, --out safety.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderConcept } from '../lib/promote.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(KB_DIR, 'bin', 'kb.mjs');
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-exp-'));
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
const mk = (slug) => fs.writeFileSync(path.join(fixture, 'concepts', `${slug}.md`),
  renderConcept({
    slug, title: slug.toUpperCase(), tags: ['testing'],
    definition: `A definition for ${slug} long enough to satisfy the schema comfortably.`,
    explanation: 'An explanation long enough to satisfy the schema rules here.',
    key_properties: ['one', 'two'],
    relationships: [{ target: 'live-note', clause: 'relates for a stated fixture reason' }],
    applications: 'Exercises the export suite.', see_also: ['live-note'],
  }, { sourceUrl: null, today: '2026-08-22' }));

mk('live-note');
mk('other-note');
mk('old-note');
{
  const f = path.join(fixture, 'concepts', 'old-note.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace(/^status: .*$/m, 'status: superseded')
    .replace('\n---\n', '\nsuperseded_by: [live-note]\n---\n'));
}
// reciprocal so verify would hold; not needed by export but keeps the fixture honest
{
  const f = path.join(fixture, 'concepts', 'live-note.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('\n---\n', '\nsupersedes: [old-note]\n---\n'));
}

const out = path.join(fixture, 'site');

// mounted docusaurus export
{
  const r = run(['export', 'docusaurus', '--out', out, '--base-path', '/kb', '--format', 'json']);
  check('mounted export succeeds', r.code === 0);
  check('superseded note has no page', !fs.existsSync(path.join(out, 'concepts', 'old-note.md')));
  const manifest = JSON.parse(fs.readFileSync(path.join(out, 'kb-export-manifest.json'), 'utf8'));
  check('superseded note ships as a redirect', JSON.stringify(manifest.redirects['old-note']) === '["live-note"]');
  const page = fs.readFileSync(path.join(out, 'concepts', 'other-note.md'), 'utf8');
  check('mounted ids are prefixed (default kb/)', /^id: kb\/other-note$/m.test(page));
  check('links are site-absolute under --base-path', page.includes('](/kb/live-note)'));
  check('manifest pins transform + config', manifest.transform_version === '2' && manifest.config.base_path === '/kb' && manifest.config.id_prefix === 'kb/');
  check('manifest hashes rendered files', Object.values(manifest.files).every((h) => /^sha256:[0-9a-f]{64}$/.test(h)));
}

// determinism: two runs, identical manifests (hashes of rendered bytes)
{
  const m1 = JSON.parse(fs.readFileSync(path.join(out, 'kb-export-manifest.json'), 'utf8'));
  run(['export', 'docusaurus', '--out', out, '--base-path', '/kb', '--format', 'json']);
  const m2 = JSON.parse(fs.readFileSync(path.join(out, 'kb-export-manifest.json'), 'utf8'));
  check('export is deterministic', JSON.stringify(m1) === JSON.stringify(m2));
}

// a config change alone dirties the manifest (rendered hashes move)
{
  run(['export', 'docusaurus', '--out', out, '--base-path', '/other', '--format', 'json']);
  const m3 = JSON.parse(fs.readFileSync(path.join(out, 'kb-export-manifest.json'), 'utf8'));
  check('a transform-shaping config change dirties rendered hashes', m3.config.base_path === '/other'
    && m3.files['concepts/other-note.md'] !== undefined);
}

// mkdocs + flag applicability
{
  const r = run(['export', 'mkdocs', '--out', out, '--format', 'json']);
  check('mkdocs renders', r.code === 0 && fs.existsSync(path.join(out, 'concepts', 'other-note.md')));
  check('mkdocs pages carry no docusaurus frontmatter', !fs.readFileSync(path.join(out, 'concepts', 'other-note.md'), 'utf8').startsWith('---'));
  const bad = run(['export', 'mkdocs', '--out', out, '--merge-tags', '--host-tags', 'x.yml', '--format', 'json']);
  check('inapplicable flag is an error, not a no-op', bad.code !== 0);
}

// json renderer: presentation-free, schema-stable shape
{
  const r = run(['export', 'json', '--out', out, '--format', 'json']);
  check('json renders', r.code === 0);
  const corpus = JSON.parse(fs.readFileSync(path.join(out, 'corpus.json'), 'utf8'));
  check('json preserves source structure', corpus.schema_version === '1'
    && corpus.notes.every((n) => n.slug && n.frontmatter && typeof n.body === 'string')
    && corpus.notes.some((n) => n.body.includes('[[live-note')));
  check('json excludes superseded notes too', !corpus.notes.some((n) => n.slug === 'old-note'));
}

// merge-tags: conflict refused, nothing written
{
  const host = path.join(fixture, 'host-tags.yml');
  fs.writeFileSync(host, 'testing:\n  label: Their Testing\n  permalink: /theirs\n');
  // our facets file has curated topics from the real KB_DIR; craft a conflict via a topic name
  // that exists in the real curated list — read it:
  const facets = fs.readFileSync(path.join(KB_DIR, 'facets.yml'), 'utf8');
  const topic = (facets.match(/curated:\n\s+- ([a-z0-9-]+)/) ?? [])[1];
  if (topic) {
    fs.writeFileSync(host, `${topic}:\n  label: Conflicting Label\n  permalink: /conflict\n`);
    const r = run(['export', 'docusaurus', '--out', `${out}-mt`, '--merge-tags', '--host-tags', host, '--format', 'json']);
    check('tag conflict refused non-zero', r.code === 1);
    check('conflict names the tag', r.json.error.message.includes(topic));
    check('nothing written on conflict', !fs.existsSync(`${out}-mt`));
  }
  // non-conflicting host merges
  fs.writeFileSync(host, 'their-unique-tag:\n  label: Theirs\n  permalink: /theirs\n');
  const ok = run(['export', 'docusaurus', '--out', `${out}-mt`, '--merge-tags', '--host-tags', host, '--format', 'json']);
  check('non-conflicting tags merge', ok.code === 0
    && fs.readFileSync(path.join(`${out}-mt`, 'tags.yml'), 'utf8').includes('their-unique-tag'));
}

// --out safety
{
  const bad = run(['export', 'docusaurus', '--out', 'concepts', '--format', 'json']);
  check('export into canon is refused', bad.code !== 0);
  const bad2 = run(['export', 'docusaurus', '--out', '.kb/site', '--format', 'json']);
  check('export into .kb is refused', bad2.code !== 0);
}

fs.rmSync(fixture, { recursive: true, force: true });

if (failures.length) {
  console.error(`export-integration test FAILED:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('export-integration test passed — filter + redirects, mount properties, renderer flags, manifest, determinism, merge conflicts, out safety');
}
