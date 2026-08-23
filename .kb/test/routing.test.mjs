#!/usr/bin/env node
/**
 * Rubric routing table.
 *
 * The point of ordinal ratings plus a lookup table (rather than weighted sums)
 * is that routing is auditable and does not shift when a model's calibration
 * does. That is only true if the table behaves exactly as written — especially
 * the rule that a knockout cannot be outvoted by strong ratings elsewhere.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRubric, route } from '../lib/rubric.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rubric = loadRubric(KB_DIR, 'promotion');

const verdict = (dims, dq = {}) => ({
  rubric: 'promotion@2',
  target: 't',
  disqualifiers: Object.fromEntries(
    rubric.disqualifiers.map((d) => [d.id, { triggered: !!dq[d.id], rationale: 'x' }]),
  ),
  dimensions: Object.fromEntries(Object.entries(dims).map(([k, v]) => [k, { rating: v, rationale: 'x' }])),
});

const ALL_STRONG = { durability: 'strong', actionability: 'strong', atomicity: 'strong' };

const cases = [
  ['all strong -> promote', verdict(ALL_STRONG), 'promote'],
  ['weak actionability still promotes', verdict({ ...ALL_STRONG, actionability: 'weak' }), 'promote'],
  ['weak atomicity -> split', verdict({ ...ALL_STRONG, atomicity: 'weak' }), 'split'],
  ['failed durability -> discard', verdict({ ...ALL_STRONG, durability: 'fail' }), 'discard'],
  ['unmatched combination -> queue, never silent discard',
    verdict({ durability: 'weak', actionability: 'weak', atomicity: 'weak' }), 'queue'],

  // First real-world gap (llm-council routing whitepaper, 2026-08-23): several
  // separable, actionable ideas in a weak-durability container must split, not
  // queue — the parts are judged on their own merits after extraction.
  ['actionable multi-concept document -> split even with weak durability',
    verdict({ durability: 'weak', actionability: 'strong', atomicity: 'fail' }), 'split'],
  ['strong container with several ideas -> split',
    verdict({ durability: 'strong', actionability: 'strong', atomicity: 'fail' }), 'split'],
  ['failed durability still discards despite atomicity fail',
    verdict({ durability: 'fail', actionability: 'strong', atomicity: 'fail' }), 'discard'],

  // The property that weighted sums cannot give you: a knockout is absolute.
  ['knockout beats three strong ratings', verdict(ALL_STRONG, { duplicate: true }), 'discard'],
  ['knockout beats an otherwise-promotable note', verdict(ALL_STRONG, { 'pure-announcement': true }), 'discard'],
];

const failures = [];
for (const [name, v, expected] of cases) {
  const got = route(rubric, v).action;
  if (got !== expected) failures.push(`${name}: expected ${expected}, got ${got}`);
}

if (failures.length) {
  console.error('ROUTING TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log(`routing test passed — ${cases.length} cases, knockouts remain absolute`);
