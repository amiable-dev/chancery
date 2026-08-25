#!/usr/bin/env node
/**
 * Query eval set (ADR-013 D2, spec v2 per packet 8).
 *
 * Hygiene gates now; scores are non-gating. Both polarities throughout: every
 * check must catch its bad fixture and pass its good one, or the gate is
 * decoration — the packet-8 mutation-test principle applied to the harness's
 * own validators.
 */
import { validateItems, normalizeQueryText, evalsetHash, runHarness } from '../lib/evalset.mjs';
import { retrieve } from '../lib/query.mjs';

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const note = (slug, title, domain, def) => ({
  slug, title, data: { title, domain, maturity: 'established', tags: ['concept'] },
  body: `## Definition\n${def}\n\n## Sources\n- s\n`,
});
const NOTES = [
  note('proxy-capture', 'Proxy Capture', 'observability', 'Record conversation state at a proxy boundary so recovery survives harness crashes.'),
  note('slo-alerting', 'SLO Alerting', 'observability', 'Alert on error budget burn rate over multiple windows.'),
  note('alias-table', 'Alias Table', 'llm', 'A curated synonym table for retrieval seeding.'),
];
const CONCEPTS = new Set(NOTES.map((n) => n.slug));

const item = (over = {}) => ({
  id: 'q-0001', text: 'how does a session survive a harness crash?',
  provenance: 'log-derived', provenance_ref: 'log/2026-08.md#L10', author: 'chris',
  authoring_direction: 'question-first', class: 'standard',
  labeled_at_corpus: 'sha256:' + 'a'.repeat(64),
  required: ['proxy-capture'], forbidden: [], ...over,
});

// ---- schema + referential integrity (G4) ----
{
  const ok = validateItems([item()], { concepts: CONCEPTS });
  check('valid item passes', ok.length === 0);
  check('missing provenance fails', validateItems([item({ provenance: undefined })], { concepts: CONCEPTS }).length > 0);
  check('unknown class fails', validateItems([item({ class: 'hard' })], { concepts: CONCEPTS }).length > 0);
  check('non-curator without provenance_ref fails',
    validateItems([item({ provenance_ref: undefined })], { concepts: CONCEPTS }).length > 0);
  check('curator without provenance_ref passes',
    validateItems([item({ provenance: 'curator', provenance_ref: undefined })], { concepts: CONCEPTS, curatorCap: 1 }).length === 0);
  check('unresolvable required fails', validateItems([item({ required: ['ghost'] })], { concepts: CONCEPTS }).length > 0);
  check('required∩forbidden fails',
    validateItems([item({ forbidden: ['proxy-capture'] })], { concepts: CONCEPTS }).length > 0);
  check('bad corpus hash fails', validateItems([item({ labeled_at_corpus: 'yesterday' })], { concepts: CONCEPTS }).length > 0);
  check('vocab-mismatch without hypothesis fails',
    validateItems([item({ class: 'vocab-mismatch' })], { concepts: CONCEPTS }).length > 0);
  check('vocab-mismatch with hypothesis passes',
    validateItems([item({ class: 'vocab-mismatch', hypothesis: 'query says crash, concept says capture' })], { concepts: CONCEPTS }).length === 0);
  check('no-answer with required fails',
    validateItems([item({ class: 'no-answer' })], { concepts: CONCEPTS }).length > 0);
}

// ---- unique ids, near-duplicates, supersession, curator cap (G4) ----
{
  check('duplicate id fails', validateItems([item(), item()], { concepts: CONCEPTS }).length > 0);
  check('near-duplicate text fails', validateItems(
    [item(), item({ id: 'q-0002', text: 'How does a session survive a harness CRASH??' })],
    { concepts: CONCEPTS }).length > 0);
  check('distinct texts pass', validateItems(
    [item(), item({ id: 'q-0002', text: 'when should alerts page a human?', required: ['slo-alerting'] })],
    { concepts: CONCEPTS }).length === 0);
  check('normalization strips case and punctuation',
    normalizeQueryText('How does X work?!') === normalizeQueryText('how does x work'));
  check('supersession pointer must resolve', validateItems(
    [item({ superseded_by: 'q-0099' })], { concepts: CONCEPTS }).length > 0);
  check('resolving supersession passes and superseded item is exempt from dupe checks', validateItems(
    [item({ superseded_by: 'q-0002' }), item({ id: 'q-0002' })], { concepts: CONCEPTS }).length === 0);
  const many = [item(), item({ id: 'q-0002', text: 'alerts and paging?', required: ['slo-alerting'], provenance: 'curator', provenance_ref: undefined }),
    item({ id: 'q-0003', text: 'what is an alias table for?', required: ['alias-table'], provenance: 'curator', provenance_ref: undefined })];
  check('curator share over cap fails', validateItems(many, { concepts: CONCEPTS, curatorCap: 0.5 }).length > 0);
  check('curator share under cap passes', validateItems(many, { concepts: CONCEPTS, curatorCap: 0.9 }).length === 0);
}

// ---- eval-set hash: deterministic, sensitive to every surface (B6) ----
{
  const surfaces = { queries: [item()], apriori: [], aliases: { crash: ['failure'] }, config: { k: [3], score_cutoff: 0 } };
  const h1 = evalsetHash(surfaces);
  const h2 = evalsetHash(JSON.parse(JSON.stringify(surfaces)));
  check('hash deterministic across object identity', h1 === h2 && /^sha256:[0-9a-f]{64}$/.test(h1));
  check('hash moves on alias edit', evalsetHash({ ...surfaces, aliases: { crash: ['failure', 'wreck'] } }) !== h1);
  check('hash moves on config edit', evalsetHash({ ...surfaces, config: { k: [3], score_cutoff: 0.1 } }) !== h1);
  check('key order does not move the hash',
    evalsetHash({ config: { score_cutoff: 0, k: [3] }, aliases: { crash: ['failure'] }, apriori: [], queries: [item()] }) === h1);
}

// ---- retrieval scores exposed for the abstention contract ----
{
  const hits = retrieve(NOTES, 'how does state survive a crash?');
  check('hits expose a numeric score', hits.length > 0 && typeof hits[0].score === 'number');
}

// ---- harness: deterministic, honest, curator-excluded (B4, R2, R3) ----
{
  const items = [
    item(),
    item({ id: 'q-0002', text: 'when should alerts page a human?', required: ['slo-alerting'], provenance: 'issue-thread', provenance_ref: 'issues/1' }),
    item({ id: 'q-0003', text: 'what colour is the bikeshed?', class: 'no-answer', required: [], provenance: 'issue-thread', provenance_ref: 'issues/2' }),
    item({ id: 'q-0004', text: 'what is an alias table?', required: ['alias-table'], provenance: 'curator', provenance_ref: undefined }),
    item({ id: 'q-0005', text: 'burn rate paging thresholds?', required: ['slo-alerting'], forbidden: ['alias-table'], provenance: 'log-derived', provenance_ref: 'log/2026-08.md#L20' }),
  ];
  const config = { k: [3], score_cutoff: 0, now: '2026-08-25T00:00:00Z' };
  const r1 = runHarness({ notes: NOTES, items, config });
  const r2 = runHarness({ notes: NOTES, items, config });
  check('harness byte-deterministic', JSON.stringify(r1) === JSON.stringify(r2));
  check('one hash: run strips the clock exactly as check omits it',
    r1.evalset_hash === evalsetHash({ queries: items, apriori: [], aliases: {}, config: { k: [3], score_cutoff: 0 } }));
  check('report carries the eval-set hash', /^sha256:/.test(r1.evalset_hash));
  check('pilot watermark present', r1.watermark === 'pilot / not adjudicable');
  check('clock is the pinned one, not wall time', r1.generated_at === '2026-08-25T00:00:00Z');
  check('headline excludes curator items', r1.headline.n === 4);
  check('counts printed beside rates', typeof r1.headline.recall_at_3?.hits === 'number'
    && typeof r1.headline.recall_at_3?.of === 'number');
  check('per-item results enumerated for dev', Array.isArray(r1.per_item) && r1.per_item.length === 5);
  check('no-answer abstention honoured when nothing retrieved',
    r1.per_item.find((p) => p.id === 'q-0003').pass === (retrieve(NOTES, 'what colour is the bikeshed?').length === 0));
  check('anti-label violations counted', typeof r1.headline.forbidden_violations === 'number');
  const slice = r1.slices.by_class.find((s) => s.class === 'no-answer');
  check('n<10 slice enumerates items instead of rates', Array.isArray(slice.items) && slice.rate === undefined);
}

if (failures.length) {
  console.error('evalset test FAILED:\n  - ' + failures.join('\n  - '));
  process.exit(1);
}
console.log('evalset test passed — hygiene both-polarity, canonical hash, deterministic pinned-clock harness, curator-excluded headlines');
