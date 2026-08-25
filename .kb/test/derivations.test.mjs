#!/usr/bin/env node
/**
 * Record/derivation separation (ADR-013 D8, packet 7).
 *
 * Derived artifacts are a keyed, git-ignored cache: never authoritative,
 * never hand-edited, refusing to serve on key mismatch — and `rebuild ==
 * cached` is an executable determinism test in the gate. Both polarities:
 * the check must catch a tampered cache and pass an honest one.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { corpusContentHash, deriveAll, derivationKey, serveDerived, checkDerivationCache } from '../lib/derivations.mjs';
import { retrieve } from '../lib/query.mjs';

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const note = (slug, title, def, rels = '') => ({
  slug, title, data: { title, domain: 'llm', maturity: 'established', tags: ['concept'] },
  body: `## Definition\n${def}\n\n## Relationships\n${rels}\n\n## Sources\n- s\n`,
});
const NOTES = [
  note('alpha', 'Alpha', 'First concept about retrieval ranking.', '- [[beta]] — feeds beta its seeds'),
  note('beta', 'Beta', 'Second concept about graph expansion.'),
];
const META = { schema_version: '1', tool_version: '0.1.3', policy_hash: 'none' };

// ---- pure derivation: deterministic, key-sensitive ----
{
  const d1 = deriveAll(NOTES, META);
  const d2 = deriveAll(JSON.parse(JSON.stringify(NOTES)), { ...META });
  check('derivation byte-deterministic', JSON.stringify(d1) === JSON.stringify(d2));
  check('key carries corpus hash', d1.key.corpus_hash === corpusContentHash(NOTES) && /^sha256:/.test(d1.key.corpus_hash));
  check('key moves with the corpus', deriveAll([NOTES[0]], META).key.corpus_hash !== d1.key.corpus_hash);
  check('key moves with tool version', derivationKey(NOTES, { ...META, tool_version: '9.9.9' }).tool_version === '9.9.9'
    && JSON.stringify(derivationKey(NOTES, { ...META, tool_version: '9.9.9' })) !== JSON.stringify(d1.key));
  check('adjacency extracted with clauses', d1.adjacency.alpha?.[0]?.target === 'beta'
    && d1.adjacency.alpha[0].clause === 'feeds beta its seeds');
  check('backlinks inverted', Array.isArray(d1.backlinks.beta) && d1.backlinks.beta.includes('alpha'));
}

// ---- serve: cold build writes, warm hit reads, stale key rebuilds ----
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-deriv-'));
  const r1 = serveDerived({ cacheDir: dir, notes: NOTES, meta: META });
  check('cold cache rebuilds and writes', r1.source === 'rebuilt' && fs.existsSync(path.join(dir, 'derived.json')));
  const r2 = serveDerived({ cacheDir: dir, notes: NOTES, meta: META });
  check('warm cache serves from disk', r2.source === 'cache');
  check('cache and rebuild agree', JSON.stringify(r1.derived) === JSON.stringify(r2.derived));
  const r3 = serveDerived({ cacheDir: dir, notes: [NOTES[0]], meta: META });
  check('key mismatch refuses stale cache and rebuilds', r3.source === 'rebuilt');
  fs.rmSync(dir, { recursive: true, force: true });
}

// ---- the gate check: rebuild == cached, both polarities, read-only ----
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-deriv-'));
  check('absent cache is honest (cold), no findings', checkDerivationCache({ cacheDir: dir, notes: NOTES, meta: META }).length === 0);
  serveDerived({ cacheDir: dir, notes: NOTES, meta: META });
  check('honest cache passes', checkDerivationCache({ cacheDir: dir, notes: NOTES, meta: META }).length === 0);
  // stale key (corpus moved on): not an integrity failure — it refuses to serve anyway
  check('stale-key cache is not an error', checkDerivationCache({ cacheDir: dir, notes: [NOTES[0]], meta: META }).length === 0);
  // hand-edited cache at a CURRENT key is the attack shape
  const f = path.join(dir, 'derived.json');
  const tampered = JSON.parse(fs.readFileSync(f, 'utf8'));
  tampered.backlinks.beta = [];
  fs.writeFileSync(f, JSON.stringify(tampered));
  const findings = checkDerivationCache({ cacheDir: dir, notes: NOTES, meta: META });
  check('tampered cache at a current key fails KB023', findings.length > 0 && findings[0].code === 'KB023');
  const before = fs.readFileSync(f, 'utf8');
  checkDerivationCache({ cacheDir: dir, notes: NOTES, meta: META });
  check('the gate check never writes', fs.readFileSync(f, 'utf8') === before);
  fs.rmSync(dir, { recursive: true, force: true });
}

// ---- equivalence: retrieval over cached derivations matches direct ----
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-deriv-'));
  const { derived } = serveDerived({ cacheDir: dir, notes: NOTES, meta: META });
  const direct = retrieve(NOTES, 'retrieval ranking seeds');
  const viaCache = retrieve(derived.notes, 'retrieval ranking seeds');
  check('retrieval over cached notes matches direct retrieval',
    JSON.stringify(direct.map((h) => [h.slug, h.score])) === JSON.stringify(viaCache.map((h) => [h.slug, h.score])));
  fs.rmSync(dir, { recursive: true, force: true });
}

if (failures.length) {
  console.error('derivations test FAILED:\n  - ' + failures.join('\n  - '));
  process.exit(1);
}
console.log('derivations test passed — keyed cache never authoritative, rebuild==cached in the gate, tamper caught, retrieval equivalence holds');
