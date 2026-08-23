#!/usr/bin/env node
// Fails when the CI matrix carries a dead Node line — the real mechanism
// behind ADR-011 §1's "the floor moves when an LTS line dies" (packet-5 X1:
// no dependabot ecosystem watches the Node calendar; this scheduled check does).
// EOL dates are data, from the Node.js release schedule; extend when new LTS
// lines enter the matrix.
import fs from 'node:fs';

const EOL = { 18: '2025-04-30', 20: '2026-04-30', 22: '2027-04-30', 24: '2028-04-30' };
const workflow = fs.readFileSync('.github/workflows/kb-verify.yml', 'utf8');
const m = workflow.match(/node:\s*\[([^\]]+)\]/);
if (!m) { console.error('check-node-eol: no node matrix found'); process.exitCode = 1; }
else {
  const today = new Date().toISOString().slice(0, 10); // a scheduled job, not the hermetic gate — the clock is allowed here
  const dead = m[1].match(/\d+/g).filter((v) => (EOL[v] ?? '9999') < today);
  if (dead.length) {
    console.error(`check-node-eol: matrix carries EOL Node line(s): ${dead.join(', ')} — bump the matrix, engines, .nvmrc, and the runtime floor`);
    process.exitCode = 1;
  } else {
    console.log('check-node-eol: matrix lines all supported');
  }
}
