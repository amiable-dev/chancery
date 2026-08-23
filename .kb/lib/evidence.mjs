// The C5 evidence store (validation-r1a §1): append-only observation history
// at .kb/evidence/<slug>.jsonl, written only by network verbs, read (never
// re-observed) by verify. Frontmatter keeps a compact latest-state summary;
// THIS file is authoritative, and KB018 holds the two together.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const EXTRACTION_VERSION = '1';

export const REACHABILITY = [
  'ok', 'dead-no-archive', 'dead-with-archive', 'blocked-4xx', 'paywall',
  'js-required', 'rate-limited', 'redirect-drift', 'dns-transient', 'malformed',
  'not-fetchable',
];

// Never-resolved is a *neutral mechanical flag* — "has never been observed ok"
// — not an accusation; fabrication only ever arrives as a supplied verdict.
const isFailure = (r) => r !== 'ok' && r !== 'not-fetchable';

export function canonicalUrl(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}${u.pathname}${u.search}`; // fragment dropped, nothing else munged
  } catch {
    return url; // malformed stays as written; its observation says so
  }
}

export const citeId = (slug, url) =>
  crypto.createHash('sha256').update(`${slug}\n${canonicalUrl(url)}`).digest('hex').slice(0, 12);

const storeDir = (root) => path.join(root, '.kb', 'evidence');
export const storePath = (root, slug) => path.join(storeDir(root), `${slug}.jsonl`);

export function readStore(root, slug) {
  const f = storePath(root, slug);
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

/** Latest observation per cite_id, in store order. */
export function latestByCite(observations) {
  const m = new Map();
  for (const o of observations) m.set(o.cite_id, o);
  return m;
}

/**
 * Append one observation. `runId` distinguishes observing runs (commit+date);
 * never_resolved sets mechanically at >=3 consecutive failures spanning >=2
 * distinct runs — three failures in one run never suffice (spec acceptance).
 */
export function recordObservation(root, slug, obs, runId) {
  const prior = readStore(root, slug);
  const mine = prior.filter((o) => o.cite_id === obs.cite_id);
  const last = mine[mine.length - 1];

  const failure = isFailure(obs.reachability);
  const consecutive = failure ? (last && isFailure(last.reachability) ? (last.consecutive_failures ?? 0) + 1 : 1) : 0;
  const failRuns = new Set(
    failure
      ? [...mine.slice(mine.length - (consecutive - 1)).map((o) => o.run), runId]
      : [],
  );

  const record = {
    cite_id: obs.cite_id,
    url_canonical: obs.url_canonical,
    run: runId,
    observed_in: obs.observed_in ?? null,
    reachability: obs.reachability,
    detail: obs.detail ?? null,
    authenticity: { content_digest: obs.content_digest ?? null, title_match: obs.title_match ?? null },
    archive_url: obs.archive_url ?? null,
    extraction_version: EXTRACTION_VERSION,
    first_seen: last?.first_seen ?? runId,
    consecutive_failures: consecutive,
    never_resolved: consecutive >= 3 && failRuns.size >= 2,
    ...(obs.support ? { support: obs.support } : {}),
  };

  fs.mkdirSync(storeDir(root), { recursive: true });
  fs.appendFileSync(storePath(root, slug), `${JSON.stringify(record)}\n`);
  return record;
}
