/**
 * Crux excerpts (ADR-013 D3; packets 7/8).
 *
 * A crux is the load-bearing verbatim passage of a source, captured when the
 * source is judged. Design constraints, all from council review:
 *
 * - Verbatim means BYTES: containment is checked against the just-fetched
 *   extracted text at capture time — the only time it can be, because the C5
 *   store retains hashes, not bytes. Survivability of the excerpt is real;
 *   re-verifiability of its verbatimness is capture-time only, stated plainly.
 * - Bounded: 500-char ceiling, lesser-of 25% for short works (the ceiling is
 *   not a safe harbor — the load-bearing passage is the heart of the work).
 * - Content-addressed sidecar store (.kb/evidence/crux/): objects named by
 *   their hash, capture events append-only per slug — deliberately separate
 *   from the C5 observation stream so liveness arithmetic never sees them.
 * - verify computes a tri-state and a per-work aggregate cap; a crux NEVER
 *   upgrades a citation's verification status.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { canonicalUrl } from './evidence.mjs';

const sha = (s) => 'sha256:' + crypto.createHash('sha256').update(s).digest('hex');

/** Byte-substring containment: contiguous by construction, no normalization. */
export function checkContainment(sourceText, excerpt) {
  if (!excerpt || !excerpt.length) return { ok: false, reason: 'empty excerpt' };
  return sourceText.includes(excerpt)
    ? { ok: true }
    : { ok: false, reason: 'not a verbatim byte-substring of the fetched source' };
}

/** Lesser-of bound: 500-char ceiling, 25% of the source for short works. */
export const cruxCap = (sourceLength, { ceiling = 500, fraction = 0.25 } = {}) =>
  Math.min(ceiling, Math.floor(sourceLength * fraction));

const cruxDir = (root) => path.join(root, '.kb', 'evidence', 'crux');
const objectPath = (root, hash) => path.join(cruxDir(root), 'objects', `${hash.slice(7)}.txt`);

/** Store the excerpt content-addressed and append a capture event. Idempotent on content. */
export function storeCrux(root, slug, { url, text, source_hash, captured_at, locator = null, license = null }) {
  const hash = sha(text);
  fs.mkdirSync(path.join(cruxDir(root), 'objects'), { recursive: true });
  const obj = objectPath(root, hash);
  if (!fs.existsSync(obj)) fs.writeFileSync(obj, text);
  const event = { kind: 'crux-capture', url_canonical: canonicalUrl(url), crux_hash: hash,
    source_hash, captured_at, locator, license, chars: text.length };
  fs.appendFileSync(path.join(cruxDir(root), `${slug}.jsonl`), JSON.stringify(event) + '\n');
  return { hash, source_hash, captured_at, ...(locator ? { locator } : {}), ...(license ? { license } : {}) };
}

export const readCruxObject = (root, hash) => {
  const p = objectPath(root, hash);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
};

/**
 * Tri-state (plus the honest extra states) for one crux against its source's
 * CURRENT frontmatter. Verified never means "the quote is true" — it means
 * the source the quote was cut from is still the source on file.
 */
export function cruxState({ crux, source, objectExists, objectHashMatches }) {
  if (crux.license === 'withheld-license') return { state: 'withheld' };
  if (!objectExists || !objectHashMatches) return { state: 'integrity-fail' };
  const r = source.reachability;
  if (r === 'dead-no-archive' || r === 'dead-with-archive') return { state: 'unverifiable' };
  if (source.hash && crux.source_hash && source.hash !== crux.source_hash) return { state: 'contested' };
  return { state: 'verified' };
}

/**
 * The gate check (KB024), read-only. Integrity failures and cap breaches are
 * errors; contested is a warning (a state to resolve, not a broken record);
 * unverifiable and withheld are states, not findings.
 */
export function checkCrux(notes, readObject, { perWorkCap = 1500 } = {}) {
  const out = [];
  const perWork = new Map(); // canonical url -> total chars
  for (const n of notes) {
    for (const s of n.data?.sources ?? []) {
      const c = s.crux;
      if (!c) continue;
      const file = `concepts/${n.slug}.md`;
      if (c.license === 'withheld-license') {
        if (c.hash) out.push({ severity: 'error', code: 'KB024', check: 'crux', file,
          message: `withheld-license crux must carry no text hash (${s.url})`,
          remedy: 'store locator + source_hash only for license-bound material' });
        continue;
      }
      const text = c.hash ? readObject(c.hash) : null;
      const st = cruxState({ crux: c, source: s, objectExists: text !== null,
        objectHashMatches: text !== null && sha(text) === c.hash });
      if (st.state === 'integrity-fail') {
        out.push({ severity: 'error', code: 'KB024', check: 'crux', file,
          message: `crux object missing or not matching its address (${c.hash?.slice(0, 20)}…)`,
          remedy: 'the crux store is append-only and content-addressed; restore the object or supersede the crux' });
        continue;
      }
      if (st.state === 'contested') {
        out.push({ severity: 'warning', code: 'KB024', check: 'crux', file,
          message: `crux captured from a source version that has since drifted (${s.url})`,
          remedy: 'refetch and re-confirm the excerpt (a new capture event), or leave contested — never silently overwrite' });
      }
      if (text !== null) {
        const key = canonicalUrl(s.url);
        perWork.set(key, (perWork.get(key) ?? 0) + text.length);
      }
    }
  }
  for (const [url, chars] of perWork) {
    if (chars > perWorkCap) {
      out.push({ severity: 'error', code: 'KB024', check: 'crux', file: '.kb/evidence/crux/',
        message: `aggregate excerpt length for ${url} is ${chars} chars (cap ${perWorkCap}) — per-item bounds cannot see assembled takings`,
        remedy: 'trim or supersede excerpts citing this work; the cap is a copyright posture, not a style rule' });
    }
  }
  return out;
}
