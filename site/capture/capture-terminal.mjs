#!/usr/bin/env node
/**
 * Generate the landing-page terminal from REAL captured CLI output
 * (ADR-012 §5's recorded upgrade path — no simulated transcripts).
 *
 * Two captures, both genuine:
 *   1. `kb verify --format human` against this repository — the real gate,
 *      real file counts, real summary line.
 *   2. Evidence drift, manufactured honestly: a disposable fixture cites
 *      https://httpbin.org/uuid (content changes on every fetch), so
 *      `kb sources --apply` records a real baseline and `kb revalidate`
 *      genuinely observes a different digest — the DRIFT lines below are
 *      the CLI's own output about a real content change.
 *
 * Output: site/docs/js/terminal-capture.js (window.KBL_TERMINAL).
 * Regenerate: node site/capture/capture-terminal.mjs   (network required)
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderConcept } from '../../.kb/lib/promote.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const CLI = path.join(REPO, '.kb', 'bin', 'kb.mjs');
const SOURCE_URL = 'https://httpbin.org/uuid';

const run = (args, opts = {}) => {
  try {
    return execFileSync('node', [CLI, ...args, '--format', 'human'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts,
    });
  } catch (e) { return e.stdout ?? ''; }
};

// ---- capture 1: the real gate on the real repo ----
const verifyOut = run(['verify'], { cwd: REPO });
const passLine = verifyOut.trim().split('\n').at(-1);
if (!/^(PASS|FAIL) — /.test(passLine)) throw new Error(`unexpected verify tail: ${passLine}`);

// ---- capture 2: real drift in a disposable fixture ----
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-capture-'));
for (const d of ['concepts', 'staging', 'flashcards']) fs.mkdirSync(path.join(fixture, d), { recursive: true });
fs.writeFileSync(path.join(fixture, 'concepts', 'drift-demo.md'), renderConcept({
  slug: 'drift-demo', title: 'Drift Demo', tags: ['testing'],
  definition: 'A fixture concept citing a source whose content changes on every fetch.',
  explanation: 'Exists so the landing-page terminal can show genuine evidence drift.',
  key_properties: ['real fetches', 'real digests'],
  relationships: [{ target: 'drift-demo', clause: 'self-reference for the fixture' }],
  applications: 'Captured output for chancery.dev.', see_also: [],
}, { sourceUrl: SOURCE_URL, today: new Date().toISOString().slice(0, 10) }));

const env = { ...process.env, KB_ROOT: fixture };
const sourcesOut = run(['sources', '--apply'], { env });   // real observation 1 — the baseline
console.error('[sources]', sourcesOut.trim().slice(0, 200));
let revalidateOut = '';
for (let attempt = 0; attempt < 3; attempt++) {
  revalidateOut = run(['revalidate'], { env });        // real observation 2 — a different digest
  console.error('[revalidate ' + attempt + ']', revalidateOut.trim().slice(0, 200));
  if (/DRIFT/.test(revalidateOut)) break;
}
fs.rmSync(fixture, { recursive: true, force: true });
if (!/DRIFT/.test(revalidateOut)) throw new Error('no drift observed — source may be static or unreachable');

// ---- style the real lines per the design tokens ----
const TEAL = '#53d6c2', OK = '#33d6c2', TXT = '#c5d0e2', BRIGHT = '#e8ecf4', FAIL = '#ff7a8a', DIM = '#7f8ba0';
const lines = [];
const push = (mark, markColor, text, color) => lines.push([mark, markColor, text, color]);
push('$ ', TEAL, 'kb verify', BRIGHT);
push('', '#fff', passLine, passLine.startsWith('PASS') ? OK : FAIL);
push('', '#fff', ' ', TXT);
push('$ ', TEAL, 'kb revalidate', BRIGHT);
for (const raw of revalidateOut.split('\n')) {
  const line = raw.replace(/\s+$/, '');
  if (!line.trim()) continue;
  if (/DRIFT/.test(line)) push('  ✗ ', FAIL, line.trim(), TXT);
  else if (/queued for review/.test(line)) push('→ ', TEAL, line.trim(), DIM);
  else push('  ', '#fff', line.trim(), TXT);
}

const captured = new Date().toISOString().slice(0, 10);
const out = `/* GENERATED — real CLI output, captured ${captured}.
 * capture 1: kb verify --format human, this repository.
 * capture 2: kb sources --apply + kb revalidate against ${SOURCE_URL}
 *            (content changes per fetch, so the drift is genuine).
 * Regenerate: node site/capture/capture-terminal.mjs */
window.KBL_TERMINAL = ${JSON.stringify({ captured, source: SOURCE_URL, lines }, null, 2)};
`;
fs.writeFileSync(path.join(HERE, '..', 'docs', 'js', 'terminal-capture.js'), out);
console.log(`captured ${lines.length} real lines -> site/docs/js/terminal-capture.js`);
for (const l of lines) console.log(' ', (l[0] + l[2]).slice(0, 90));
