#!/usr/bin/env node
/**
 * Proposal queue — the third state between "pass" and "block".
 *
 * Blocking an unrecognised value makes an agent pick a wrong-but-permitted one
 * to get past the gate; auto-fixing destroys the judgment that produced it. The
 * queue only works if a proposal genuinely does not block, and genuinely does
 * not vanish.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as queue from '../lib/queue.mjs';

const KB = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-queue-'));
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const a = queue.propose(KB, 'facet', { subject: 'note-a', value: 'topic:x', rationale: 'r', today: '2026-08-01' });
check('proposal is created with an id', !!a?.id);
check('proposal starts open', a.status === 'open');

// Idempotent on (kind, subject, value) — an agent re-running must not pile up
// duplicates of the same suggestion.
check('identical open proposal is not duplicated',
  queue.propose(KB, 'facet', { subject: 'note-a', value: 'topic:x', today: '2026-08-02' }) === null);
check('a different value IS a new proposal',
  !!queue.propose(KB, 'facet', { subject: 'note-a', value: 'topic:y', today: '2026-08-02' }));

// Kinds are separate files but one listing.
queue.propose(KB, 'link', { subject: 'note-b', value: 'note-c', today: '2026-08-02' });
check('list spans kinds', queue.list(KB, { status: 'open' }).length === 3);
check('list filters by kind', queue.list(KB, { kind: 'link' }).length === 1);

// Resolution is recorded, not deleted — the decision is the audit trail.
const resolved = queue.resolve(KB, a.id, 'accepted', '2026-08-10');
check('resolve returns the entry', resolved?.id === a.id);
check('resolved entry leaves the open list', !queue.list(KB, { status: 'open' }).some((e) => e.id === a.id));
check('resolved entry is retained, not removed', queue.list(KB).some((e) => e.id === a.id && e.status === 'accepted'));
check('resolution date is recorded', queue.list(KB).find((e) => e.id === a.id).resolved === '2026-08-10');
check('unknown id resolves to null', queue.resolve(KB, 'nope', 'accepted', '2026-08-10') === null);

// Ageing is what gives the queue teeth: drift surfaces as a backlog signal
// rather than as a wall agents learn to route around.
check('nothing is stale before the threshold', queue.stale(KB, 14, '2026-08-05').length === 0);
const aged = queue.stale(KB, 14, '2026-09-01');
check('open proposals go stale after the threshold', aged.length === 2);
check('accepted proposals never go stale', !aged.some((e) => e.id === a.id));

fs.rmSync(KB, { recursive: true, force: true });

if (failures.length) {
  console.error('QUEUE TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('queue test passed — proposals dedupe, survive resolution, and age into a signal');
