/**
 * Record/derivation separation (ADR-013 D8; council packet 7).
 *
 * Everything derivable from the corpus — retrieval text, adjacency,
 * backlinks — lives in a keyed, git-ignored cache under .kb/cache/. The
 * cache is never authoritative and never hand-edited: a key mismatch means
 * rebuild (the corpus moved on), and a content mismatch AT the current key
 * means tampering or nondeterminism — a KB023 gate failure either way,
 * because `rebuild == cached` is this repo's executable determinism test.
 * The gate check is read-only; only read verbs (query) may write the cache.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { relationships } from './query.mjs';

const sha = (s) => 'sha256:' + crypto.createHash('sha256').update(s).digest('hex');

/** Content hash over slugs + bodies, order-independent — the corpus identity. */
export const corpusContentHash = (notes) =>
  sha(notes.map((n) => `${n.slug}\n${n.body}`).sort().join('\x00'));

export const derivationKey = (notes, meta) => ({
  corpus_hash: corpusContentHash(notes),
  schema_version: String(meta.schema_version),
  tool_version: String(meta.tool_version),
  policy_hash: String(meta.policy_hash ?? 'none'),
});

const canonical = (v) => {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object')
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
};

/** Pure derivation: deterministic function of (notes, meta), nothing else. */
export function deriveAll(notes, meta) {
  const sorted = [...notes].sort((a, b) => (a.slug < b.slug ? -1 : 1));
  const adjacency = {};
  const backlinks = {};
  for (const n of sorted) {
    const rels = relationships(n.body);
    if (rels.length) adjacency[n.slug] = rels.map((r) => ({ target: r.target, clause: r.clause }));
    for (const r of rels) (backlinks[r.target] ??= []).push(n.slug);
  }
  for (const k of Object.keys(backlinks)) backlinks[k].sort();
  return {
    key: derivationKey(sorted, meta),
    notes: sorted.map((n) => ({ slug: n.slug, title: n.title, data: n.data, body: n.body })),
    adjacency,
    backlinks,
  };
}

const cacheFile = (cacheDir) => path.join(cacheDir, 'derived.json');

export const loadCache = (cacheDir) => {
  const f = cacheFile(cacheDir);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; }
};

/**
 * Serve derivations: warm cache at the current key is read; anything else —
 * cold, stale key, unparseable — rebuilds and overwrites. The caller never
 * sees a stale derivation; refusal-to-serve is rebuild, not an error.
 */
export function serveDerived({ cacheDir, notes, meta }) {
  const key = derivationKey(notes, meta);
  const cached = loadCache(cacheDir);
  if (cached && canonical(cached.key) === canonical(key)) return { derived: cached, source: 'cache', wrote: false };
  const derived = deriveAll(notes, meta);
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cacheFile(cacheDir), JSON.stringify(derived, null, 1) + '\n');
  return { derived, source: 'rebuilt', wrote: true };
}

/**
 * The gate check (KB023), strictly read-only. Absent cache: honest cold
 * state. Stale key: the corpus moved on — the cache will be refreshed by
 * the next read verb, not an integrity failure. Current key with content
 * differing from a fresh rebuild: tampered or nondeterministic — error.
 */
export function checkDerivationCache({ cacheDir, notes, meta }) {
  const cached = loadCache(cacheDir);
  if (!cached) return [];
  const key = derivationKey(notes, meta);
  if (canonical(cached.key) !== canonical(key)) return [];
  const rebuilt = deriveAll(notes, meta);
  if (canonical(cached) !== canonical(rebuilt)) {
    return [{ code: 'KB023', check: 'derivations', file: '.kb/cache/derived.json',
      message: 'cached derivation at the current key does not match a fresh rebuild — hand-edited cache or nondeterministic derivation',
      remedy: 'delete .kb/cache/ (it is never authoritative) and let a read verb rebuild it' }];
  }
  return [];
}
