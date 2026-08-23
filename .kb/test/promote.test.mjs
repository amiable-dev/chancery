#!/usr/bin/env node
/**
 * Concept rendering.
 *
 * The structural claim of P3 is that a promoted concept *cannot* have a missing
 * or misordered section, because the CLI renders sections from schema-validated
 * fields rather than accepting prose. That claim is only worth making if it is
 * checked, so this asserts it directly against the section list in kb.config.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { renderConcept, unresolvedTargets, stagingSourceUrl } from '../lib/promote.mjs';
import { headings, splitFrontmatter } from '../lib/md.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED = parseYaml(fs.readFileSync(path.join(KB_DIR, 'kb.config.yaml'), 'utf8'))
  .collections.concepts.sections;

const draft = (over = {}) => ({
  slug: 'x', title: 'X', tags: ['ai-agents'],
  definition: 'A single paragraph definition long enough to satisfy the schema minimum length.',
  explanation: 'An explanation long enough to satisfy the schema minimum length requirement.',
  key_properties: ['one', 'two'],
  relationships: [{ target: 'known-slug', clause: 'relates because of a stated reason' }],
  applications: 'Applied in some concrete way.',
  see_also: ['known-slug'],
  ...over,
});

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

// 1. every required section, in the required order
const text = renderConcept(draft(), { sourceUrl: 'https://example.com/a', today: '2026-08-21' });
const present = headings(splitFrontmatter(text).body, 2);
check('all required sections present', REQUIRED.every((s) => present.includes(s)));
check('sections in required order',
  JSON.stringify(present.filter((h) => REQUIRED.includes(h))) === JSON.stringify(REQUIRED));

// 2. a definition is one paragraph — list markers are rejected, not silently kept
let threw = false;
try { renderConcept(draft({ definition: 'Intro:\n- a bullet that makes this not a paragraph at all' }), { sourceUrl: null, today: '2026-08-21' }); }
catch { threw = true; }
check('list markers in definition are rejected', threw);

// 3. the staging source repeated in extra_sources must not become two citations
const dup = renderConcept(draft({ extra_sources: ['https://example.com/a'] }), { sourceUrl: 'https://example.com/a', today: '2026-08-21' });
check('duplicate source urls are deduped', (splitFrontmatter(dup).data.sources ?? []).length === 1);

// 4. `concept` is always the first tag, whether or not the draft supplied it
check('concept tag is prepended', splitFrontmatter(text).data.tags[0] === 'concept');
const kept = renderConcept(draft({ tags: ['concept', 'ai-agents'] }), { sourceUrl: null, today: '2026-08-21' });
check('concept tag is not duplicated',
  splitFrontmatter(kept).data.tags.filter((t) => t === 'concept').length === 1);

// 5. gaps are reported, not silently dropped — a link to a not-yet-written page
//    is a finding, and one to a sibling in the same batch is not.
const gaps = unresolvedTargets(
  [draft({ slug: 'a', relationships: [{ target: 'b', clause: 'points at its sibling in this batch' }], see_also: ['nope'] }),
   draft({ slug: 'b' })],
  new Set(['known-slug']),
);
check('sibling in same batch resolves', !gaps.some((g) => g.target === 'b'));
check('genuinely unknown target is reported', gaps.some((g) => g.target === 'nope'));

// 6. provenance comes from the staging marker
check('source url read from staging marker',
  stagingSourceUrl('# T\n\n**Source:** https://example.com/x\n**Added:** 2026-08-21\n') === 'https://example.com/x');

if (failures.length) {
  console.error('PROMOTE TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('promote test passed — rendered sections are complete and ordered by construction');
