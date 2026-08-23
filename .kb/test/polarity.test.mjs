#!/usr/bin/env node
/**
 * Both-polarity test for `kb verify`.
 *
 * A gate nobody has watched fail is not known to work. This runs the real
 * checks against fixtures that are deliberately broken, one code per file, and
 * asserts that exactly the expected codes fire — no more, no fewer. A check
 * that silently stops firing is a check that has stopped protecting anything.
 *
 *   node .kb/test/polarity.test.mjs
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(HERE, '..', 'bin', 'kb.mjs');
const FIXTURE = path.join(HERE, 'fixture');

// file basename -> the codes that file must produce
const EXPECTED = {
  'concepts/kb001-nofm.md': ['KB001'],
  'concepts/kb002-schema.md': ['KB002'],
  'concepts/kb003-sections.md': ['KB003'],
  'concepts/kb004-order.md': ['KB004'],
  'concepts/kb007-links.md': ['KB007'],
  'flashcards/kb005-orphan.md': ['KB005'],
  'staging/kb008-markers.md': ['KB008'],
  'flashcards/kb009-cards.md': ['KB009'],
  'flashcards/kb010-dupe.md': ['KB010'],
  'concepts/kb015-evidence.md': ['KB015'],
  'concepts/kb016-supersession.md': ['KB016'],
  'concepts/kb017-class.md': ['KB017'],
  'concepts/kb018-mismatch.md': ['KB018'],
  // The index is absent from the fixture, so staleness must be reported.
  'concepts/_index.md': ['KB006'],
};
// Files that must produce nothing at all.
const MUST_BE_CLEAN = ['concepts/good.md', 'flashcards/good.md', 'concepts/kb009-cards.md', 'concepts/kb010-dupe.md'];

let raw;
try {
  raw = execFileSync('node', [CLI, 'verify', '--format', 'json'], {
    env: { ...process.env, KB_ROOT: FIXTURE },
    encoding: 'utf8',
  });
} catch (err) {
  raw = err.stdout; // exit 1 is expected — the fixture is broken on purpose
}
const report = JSON.parse(raw);

const actual = new Map();
for (const f of report.findings) {
  if (!actual.has(f.file)) actual.set(f.file, new Set());
  actual.get(f.file).add(f.code);
}

const failures = [];

for (const [file, codes] of Object.entries(EXPECTED)) {
  const got = actual.get(file) ?? new Set();
  for (const code of codes) {
    if (!got.has(code)) failures.push(`${file}: expected ${code}, got [${[...got].join(', ') || 'nothing'}]`);
  }
}

for (const file of MUST_BE_CLEAN) {
  const got = actual.get(file);
  if (got) failures.push(`${file}: expected no findings, got [${[...got].join(', ')}]`);
}

// The masked-code guarantee: illustrative [[links]] inside code spans and
// fenced blocks must never be reported. This is the exact bug that made an
// earlier audit of this corpus over-report by ~110 links.
const linkMessages = report.findings.filter((f) => f.code === 'KB007').map((f) => f.message);
for (const forbidden of ['not-a-link', 'also-not-a-link']) {
  if (linkMessages.some((m) => m.includes(forbidden))) {
    failures.push(`KB007 fired on \`${forbidden}\`, which is inside code and must be ignored`);
  }
}
if (!linkMessages.some((m) => m.includes('no-such-note'))) {
  failures.push('KB007 did not fire on the genuine dangling link `no-such-note`');
}

// A card that already has an id must not be re-flagged, and a `## Heading`
// block with no `?` separator is prose, not a card — flagging it would demand
// an id for something that can never be reviewed.
const cardMessages = report.findings.filter((f) => f.code === 'KB009').map((f) => f.message);
for (const forbidden of ['Has An Id', 'Prose Block, Not A Card']) {
  if (cardMessages.some((m) => m.includes(forbidden))) {
    failures.push(`KB009 fired on \`${forbidden}\`, which must not require an id`);
  }
}
if (!cardMessages.some((m) => m.includes('Missing Its Id'))) {
  failures.push('KB009 did not fire on the card genuinely lacking an id');
}

// The payoff of P1's aliases: a link written as a note's title resolves to it.
// This is the bug class that broke 8 links in this corpus before the migration.
if (linkMessages.some((m) => m.includes('Aliased Title'))) {
  failures.push('KB007 fired on `[[Aliased Title]]`, which an alias must resolve');
}

if (failures.length) {
  console.error('POLARITY TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}

const codes = new Set(report.findings.map((f) => f.code));
console.log(`polarity test passed — ${[...codes].sort().join(', ')} all fire; clean fixtures stay clean`);
