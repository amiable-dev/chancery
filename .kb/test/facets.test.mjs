#!/usr/bin/env node
/**
 * Facet conformance and the scalar/nested-tag mirror.
 *
 * The mirror is the load-bearing claim of §7: the same facet value appears as a
 * scalar property (for Bases, Dataview, Docusaurus) and as a nested tag (for the
 * tag pane, graph and search). Two representations of one fact is only safe if
 * they cannot disagree — so disagreement has to be detectable, and generation
 * has to produce agreement by construction.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { loadFacets, conformance, expectedTags, applyFacets } from '../lib/facets.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const spec = loadFacets(KB_DIR);

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const classified = {
  domain: 'security', maturity: 'emerging', source_type: 'vendor-doc', topics: ['supply-chain'],
  tags: ['concept', 'ai-agents', 'domain/security', 'maturity/emerging', 'source-type/vendor-doc', 'topic/supply-chain'],
};

// 1. A fully classified, mirrored note is clean.
check('classified + mirrored note passes', conformance(spec, classified).length === 0);

// 2. An unclassified note is backlog, not breakage — P5 is incremental.
check('unclassified note produces no findings',
  conformance(spec, { tags: ['concept', 'ai-agents'] }).length === 0);

// 3. Disagreement in either direction is caught.
check('missing mirror tag is caught',
  conformance(spec, { ...classified, tags: classified.tags.filter((t) => t !== 'domain/security') })
    .some((p) => p.kind === 'missing-mirror'));
check('orphan mirror tag is caught',
  conformance(spec, { ...classified, tags: [...classified.tags, 'domain/observability'] })
    .some((p) => p.kind === 'orphan-mirror'));

// 4. Closed axes are closed; uncurated topics are flagged.
check('value outside a closed axis is caught',
  conformance(spec, { ...classified, domain: 'not-an-axis-value' }).some((p) => p.kind === 'unknown-value'));
check('uncurated topic is caught',
  conformance(spec, { ...classified, topics: ['invented-topic'], tags: [...classified.tags, 'topic/invented-topic'] })
    .some((p) => p.kind === 'uncurated-topic'));

// 5. Generation produces agreement by construction, and does not disturb
//    pre-existing non-facet tags.
{
  const raw = 'title: "T"\ndate: 2026-08-21\ntags: [concept, ai-agents, mcp]\nstatus: draft';
  const data = { title: 'T', tags: ['concept', 'ai-agents', 'mcp'], status: 'draft' };
  const assignment = { domain: 'security', maturity: 'established', source_type: 'research', topics: ['mcp'] };
  const next = parseYaml(applyFacets(spec, raw, data, assignment));

  check('generated output is self-consistent', conformance(spec, next).length === 0);
  check('original tags survive', ['concept', 'ai-agents', 'mcp'].every((t) => next.tags.includes(t)));
  check('every expected mirror tag is emitted',
    expectedTags(spec, next).every((t) => next.tags.includes(t)));
  check('scalars are written', next.domain === 'security' && next.maturity === 'established');
  check('unrelated frontmatter is untouched', next.title === 'T' && next.status === 'draft');
}

if (failures.length) {
  console.error('FACETS TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('facets test passed — scalars and nested tags agree by construction, disagreement is detectable');
