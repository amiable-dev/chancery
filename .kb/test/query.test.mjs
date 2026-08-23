#!/usr/bin/env node
/**
 * Corpus query.
 *
 * The operation the pattern this descends from has and this did not. What makes
 * it more than grep is returning the corpus's own cross-references alongside
 * each hit, and refusing an answer that cites something it was never shown.
 */
import { retrieve, relationships, applyFilters, checkCitations, buildQueryTask } from '../lib/query.mjs';

const note = (slug, title, domain, def, rels = '') => ({
  slug, title, data: { title, domain, maturity: 'established', tags: ['concept'] },
  body: `## Definition\n${def}\n\n## Relationships\n${rels}\n\n## Sources\n- s\n`,
});

const NOTES = [
  note('agent-state', 'Agent State', 'ai-agents', 'What an agent holds in context during a run.',
       '- [[external-state]] — is the durable counterpart when the window is gone\n- [[agent-harness]] — owns the state, not the session'),
  note('external-state', 'External State', 'ai-agents', 'A record outside the model that survives between runs.'),
  note('slo-alerting', 'SLO Alerting', 'observability', 'Alert on error budget burn rather than CPU thresholds.'),
];

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

// Relationship clauses are the edges — the whole reason this beats grep.
{
  const r = relationships(NOTES[0].body);
  check('both relationships parsed', r.length === 2);
  check('target extracted', r[0].target === 'external-state');
  check('clause extracted without the link or dash',
    r[0].clause === 'is the durable counterpart when the window is gone');
}

// Retrieval ranks, and carries the edges with each hit.
{
  const hits = retrieve(NOTES, 'how does state survive between runs?');
  check('something is retrieved', hits.length > 0);
  check('relevant concept ranks in', hits.some((h) => h.slug === 'external-state' || h.slug === 'agent-state'));
  check('unrelated concept does not dominate', hits[0].slug !== 'slo-alerting');
  const withRels = hits.find((h) => h.slug === 'agent-state');
  if (withRels) check('hits carry their relationship edges', withRels.relationships.length === 2);
  check('hits carry the definition', hits.every((h) => typeof h.definition === 'string'));
}

// Facet filters narrow BEFORE ranking — this is what P5's classification bought.
{
  check('filter restricts the pool',
    applyFilters(NOTES, { domain: 'observability' }).length === 1);
  check('an empty filter is a no-op', applyFilters(NOTES, { domain: null }).length === 3);
  const hits = retrieve(NOTES, 'state between runs', { filters: { domain: 'observability' } });
  check('filtered retrieval cannot return another domain',
    hits.every((h) => h.domain === 'observability'));
}

// Citation grounding: cheap, deterministic, and the difference between a
// grounded answer and a merely plausible one.
{
  const hits = retrieve(NOTES, 'state between runs');
  check('a citation to a retrieved concept passes',
    checkCitations({ citations: [{ slug: hits[0].slug, supports: 'x' }] }, hits).length === 0);
  check('a citation to something never retrieved is caught',
    checkCitations({ citations: [{ slug: 'never-shown', supports: 'x' }] }, hits).includes('never-shown'));
  check('no citations is not an error here (schema enforces presence)',
    checkCitations({}, hits).length === 0);
}

// The task must tell the model to use only what it was given.
{
  const task = buildQueryTask('q', retrieve(NOTES, 'state'), {});
  check('task carries the response schema', task.response_schema === 'query-answer.schema.json');
  check('task instructs grounding', /ONLY the concepts below/.test(task.instructions));
  check('task instructs recording gaps rather than filling them', /gaps/.test(task.instructions));
}

if (failures.length) {
  console.error('QUERY TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('query test passed — edges travel with hits, filters narrow, ungrounded citations rejected');
