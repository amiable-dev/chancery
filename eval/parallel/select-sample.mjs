#!/usr/bin/env node
/**
 * Deterministic sample selection (pre-registered in README.md — no RNG).
 * Emits sample.json: 22 ok-reachability + 3 degraded URLs, stratified by
 * the domain of each URL's alphabetically-first citing concept.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const files = fs.readdirSync(path.join(REPO, 'concepts'))
  .filter((f) => f.endsWith('.md') && f !== '_index.md').sort();

const byUrl = new Map(); // url -> {domain, reach, concepts: []}
for (const f of files) {
  const t = fs.readFileSync(path.join(REPO, 'concepts', f), 'utf8');
  const m = t.match(/^---\n([\s\S]*?)\n---/);
  if (!m) continue;
  const d = parse(m[1]);
  for (const s of d.sources ?? []) {
    if (!s.url) continue;
    const e = byUrl.get(s.url) ?? { domain: d.domain ?? '?', reach: s.reachability ?? 'unknown', concepts: [] };
    e.concepts.push(f.replace(/\.md$/, ''));
    byUrl.set(s.url, e); // first citing concept (alphabetical file order) sets the domain
  }
}

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const entries = [...byUrl.entries()].map(([url, e]) => ({ url, ...e, order: sha(url) }));
const ok = entries.filter((e) => e.reach === 'ok');
const degraded = entries.filter((e) => e.reach !== 'ok');

const domainSizes = {};
for (const e of ok) domainSizes[e.domain] = (domainSizes[e.domain] ?? 0) + 1;
const domains = Object.entries(domainSizes).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([d]) => d);

const quota = {};
for (const d of domains.slice(0, 15)) quota[d] = 1;           // one per domain
for (const d of domains.slice(0, 7)) quota[d]++;              // remaining 7 to the largest

const picked = [];
for (const d of domains) {
  const pool = ok.filter((e) => e.domain === d).sort((a, b) => (a.order < b.order ? -1 : 1));
  for (let i = 0; i < (quota[d] ?? 0) && i < pool.length; i++) picked.push(pool[i]);
}
const degradedPick = degraded.sort((a, b) => (a.order < b.order ? -1 : 1)).slice(0, 3);

const sample = [...picked, ...degradedPick].map(({ url, domain, reach, concepts }) => ({ url, domain, reach, kpm_concepts: concepts }));
fs.writeFileSync(path.join(HERE, 'sample.json'), `${JSON.stringify({ selected: sample.length, ok: picked.length, degraded: degradedPick.length, sample }, null, 2)}\n`);
console.log(`selected ${sample.length} (${picked.length} ok + ${degradedPick.length} degraded) across ${new Set(picked.map((e) => e.domain)).size} domains`);
