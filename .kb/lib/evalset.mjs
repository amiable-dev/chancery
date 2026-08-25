/**
 * Query eval set (ADR-013 D2; spec docs/design/query-eval-set.md v2).
 *
 * Hygiene validation, the canonical eval-set hash, and the deterministic
 * harness. No model, no network, no wall clock: the harness's clock is the
 * pinned `config.now` (KB_NOW at the CLI), and identical inputs must produce
 * byte-identical reports — determinism is a hygiene TEST here, never a
 * statistic (packet 8, B4).
 */
import crypto from 'node:crypto';
import { retrieve } from './query.mjs';

const CLASSES = new Set(['standard', 'vocab-mismatch', 'no-answer']);
const PROVENANCES = new Set(['external-reader', 'council-packet', 'issue-thread', 'log-derived', 'curator']);
const DIRECTIONS = new Set(['question-first', 'answer-first']);

/** Case/punctuation/whitespace-insensitive form used for near-duplicate detection. */
export const normalizeQueryText = (t) =>
  String(t ?? '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const finding = (id, code, message) => ({ id, code, message });

/**
 * Hygiene checks over query items (G4). Returns findings; empty = gate passes.
 * Superseded items stay on file (append-only) but are exempt from duplicate
 * checks and denominators — supersede-by-new-id is the only correction path.
 */
export function validateItems(items, { concepts, curatorCap = 0.5 } = {}) {
  const out = [];
  const ids = new Map();
  const live = items.filter((q) => !q.superseded_by);

  for (const q of items) {
    const id = q.id ?? '(missing id)';
    if (!q.id || typeof q.id !== 'string') out.push(finding(id, 'EV001', 'missing id'));
    if (ids.has(q.id)) out.push(finding(id, 'EV002', 'duplicate id'));
    ids.set(q.id, q);

    if (!q.text || !String(q.text).trim()) out.push(finding(id, 'EV001', 'missing text'));
    if (!PROVENANCES.has(q.provenance)) out.push(finding(id, 'EV003', `provenance must be one of ${[...PROVENANCES].join('|')}`));
    if (q.provenance && q.provenance !== 'curator' && !q.provenance_ref)
      out.push(finding(id, 'EV003', 'non-curator items need provenance_ref'));
    if (!CLASSES.has(q.class)) out.push(finding(id, 'EV001', `class must be one of ${[...CLASSES].join('|')}`));
    if (q.authoring_direction && !DIRECTIONS.has(q.authoring_direction))
      out.push(finding(id, 'EV001', 'authoring_direction must be question-first|answer-first'));
    if (!/^sha256:[0-9a-f]{64}$/.test(q.labeled_at_corpus ?? ''))
      out.push(finding(id, 'EV004', 'labeled_at_corpus must be a sha256:<hex> corpus hash'));

    const req = q.required ?? [], forb = q.forbidden ?? [];
    for (const s of [...req, ...forb]) {
      if (concepts && !concepts.has(s)) out.push(finding(id, 'EV004', `label references unknown concept: ${s}`));
    }
    if (req.some((s) => forb.includes(s))) out.push(finding(id, 'EV004', 'required and forbidden overlap'));
    if (q.class === 'no-answer' && req.length) out.push(finding(id, 'EV001', 'no-answer items must have empty required'));
    if (q.class === 'vocab-mismatch' && !String(q.hypothesis ?? '').trim())
      out.push(finding(id, 'EV005', 'vocab-mismatch items need a hypothesis (naturalness attestation)'));
    if (q.superseded_by && !items.some((o) => o.id === q.superseded_by))
      out.push(finding(id, 'EV002', `superseded_by points at unknown id: ${q.superseded_by}`));
  }

  // Near-duplicate detection over live items only (accidental easy-item inflation).
  const seen = new Map();
  for (const q of live) {
    const n = normalizeQueryText(q.text);
    if (!n) continue;
    if (seen.has(n)) out.push(finding(q.id, 'EV006', `near-duplicate of ${seen.get(n)}`));
    else seen.set(n, q.id);
  }

  // Curator share cap over live items (R2: excluded from headlines AND capped).
  if (live.length) {
    const share = live.filter((q) => q.provenance === 'curator').length / live.length;
    if (share > curatorCap)
      out.push(finding('(set)', 'EV007', `curator share ${share.toFixed(2)} exceeds cap ${curatorCap}`));
  }
  return out;
}

/** Canonical JSON: object keys sorted recursively, so the hash ignores key order. */
const canonical = (v) => {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object')
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
};

/**
 * The one eval-set hash (B6): queries, a-priori labels, aliases, and every
 * config value that changes numbers without changing the corpus.
 */
export const evalsetHash = (surfaces) =>
  'sha256:' + crypto.createHash('sha256').update(canonical(surfaces)).digest('hex');

const rate = (hits, of) => ({ hits, of, ...(of >= 10 ? { rate: Number((hits / of).toFixed(4)) } : {}) });

/**
 * The deterministic harness. Runs the current lexical retriever (the sole
 * registered challenger until the D1 bake-off) over every live item and
 * reports honestly: curator items are EXCLUDED from headline numbers (not
 * discounted), counts print beside every rate, slices under n=10 enumerate
 * items instead of rates, and the report carries the pinned clock and the
 * eval-set hash. Scores below config.score_cutoff are abstention.
 */
export function runHarness({ notes, items, aliases = {}, config, pooledQrels = [] }) {
  const ks = config.k ?? [3];
  const cutoff = config.score_cutoff ?? 0;
  const live = items.filter((q) => !q.superseded_by);

  const perItem = live.map((q) => {
    const hits = retrieve(notes, q.text).filter((h) => (h.score ?? 0) > cutoff);
    const top = Object.fromEntries(ks.map((k) => [k, hits.slice(0, k).map((h) => h.slug)]));
    const abstained = hits.length === 0;
    let pass;
    if (q.class === 'no-answer') pass = abstained;
    else pass = (q.required ?? []).every((s) => top[ks[0]].includes(s));
    const forbiddenHit = (q.forbidden ?? []).filter((s) => top[ks[0]].includes(s));
    return { id: q.id, class: q.class, provenance: q.provenance, pass, abstained,
      returned: top[ks[0]], forbidden_hits: forbiddenHit };
  });

  // Pooled precision (packet 8, B1/B5): computable only where the reported
  // top-k is fully judged; otherwise n/a — never approximated. Strict marginal
  // treatment is primary; the lenient variant is always co-reported.
  const qrelsByQuery = new Map(pooledQrels.map((q) => [q.query, q.judgments ?? {}]));
  const headlineItems = perItem.filter((p) => p.provenance !== 'curator');
  const recallable = headlineItems.filter((p) => p.class !== 'no-answer');
  const headline = {
    n: headlineItems.length,
    [`recall_at_${ks[0]}`]: rate(recallable.filter((p) => p.pass).length, recallable.length),
    no_answer: rate(headlineItems.filter((p) => p.class === 'no-answer' && p.pass).length,
      headlineItems.filter((p) => p.class === 'no-answer').length),
    forbidden_violations: perItem.reduce((a, p) => a + p.forbidden_hits.length, 0),
  };
  {
    let judged = 0, unjudged = 0, strict = 0, lenient = 0;
    for (const p of headlineItems) {
      const j = qrelsByQuery.get(p.id);
      for (const slug of p.returned) {
        const g = j?.[slug];
        if (g === undefined) { unjudged += 1; continue; }
        judged += 1;
        if (g === 'relevant') { strict += 1; lenient += 1; }
        else if (g === 'marginal') lenient += 1;
      }
    }
    headline[`unjudged_at_${ks[0]}`] = unjudged;
    if (unjudged > 0 || judged === 0) headline[`pooled_precision_at_${ks[0]}`] = 'n/a';
    else {
      headline[`pooled_precision_at_${ks[0]}`] = rate(strict, judged);
      headline[`pooled_precision_at_${ks[0]}_lenient`] = rate(lenient, judged);
    }
  }

  const byClass = [...CLASSES].map((c) => {
    const rows = headlineItems.filter((p) => p.class === c);
    return rows.length >= 10
      ? { class: c, ...rate(rows.filter((p) => p.pass).length, rows.length) }
      : { class: c, items: rows.map((p) => ({ id: p.id, pass: p.pass })) };
  });

  return {
    watermark: 'pilot / not adjudicable',
    generated_at: config.now,
    evalset_hash: (() => { const { now: _, ...cfg } = config; return evalsetHash({ queries: items, apriori: [], pooledQrels, aliases, config: cfg }); })(),
    headline,
    slices: { by_class: byClass },
    per_item: perItem,
  };
}

// ---------------------------------------------------------------- labeling

/** Deterministic seeded shuffle (Fisher–Yates over a hash stream). */
const seededShuffle = (arr, seed) => {
  const out = [...arr];
  let h = crypto.createHash('sha256').update(seed).digest();
  let i = out.length, cursor = 0;
  const next = () => {
    if (cursor >= h.length - 4) { h = crypto.createHash('sha256').update(h).digest(); cursor = 0; }
    const v = h.readUInt32BE(cursor); cursor += 4; return v;
  };
  while (i > 1) { const j = next() % i; i -= 1; [out[i], out[j]] = [out[j], out[i]]; }
  return out;
};

/**
 * Blind labeling task (B1/B2): the judge sees the question and a shuffled,
 * attribution-free candidate list — no system, no rank, no score, and no
 * required-membership. The shuffle seed is recorded with the attestation.
 */
export function buildLabelTask(queryItem, candidateSlugs, seed) {
  return {
    query_id: queryItem.id,
    text: queryItem.text,
    seed,
    candidates: seededShuffle([...new Set(candidateSlugs)].sort(), seed),
    grades: ['relevant', 'marginal', 'irrelevant'],
  };
}

const GRADES = new Set(['relevant', 'marginal', 'irrelevant']);

/** Verdicts must grade the whole pool with known grades — nothing more, nothing less. */
export function validateLabelVerdicts(verdicts, candidateSlugs) {
  const out = [];
  const j = verdicts?.judgments ?? {};
  const pool = new Set(candidateSlugs);
  for (const [slug, grade] of Object.entries(j)) {
    if (!pool.has(slug)) out.push(finding(slug, 'EV010', 'judgment for a slug outside the pool'));
    if (!GRADES.has(grade)) out.push(finding(slug, 'EV010', `unknown grade: ${grade}`));
  }
  for (const slug of pool) if (!(slug in j)) out.push(finding(slug, 'EV010', 'pool candidate left unjudged'));
  return out;
}

// ---------------------------------------------------------------- ledger

/**
 * Delta-ledger enforcement (B6): every change to a hashed surface appends an
 * entry whose evalset_hash_after matches the recomputed hash — an unledgered
 * edit is a tail mismatch. Sequence is strictly monotonic; every entry
 * carries a written rationale.
 */
export function ledgerCheck(entries, currentHash, { initialHash } = {}) {
  const out = [];
  if (!entries.length) {
    if (initialHash !== currentHash)
      out.push(finding('(ledger)', 'EV011', 'no ledger entries and hash differs from the declared initial hash'));
    return out;
  }
  let prev = 0;
  for (const e of entries) {
    if (typeof e.seq !== 'number' || e.seq <= prev) out.push(finding(`seq:${e.seq}`, 'EV011', 'sequence must be strictly monotonic'));
    prev = Math.max(prev, e.seq ?? prev);
    if (!e.surface || !e.change) out.push(finding(`seq:${e.seq}`, 'EV011', 'entry needs surface and change'));
    if (!String(e.rationale ?? '').trim()) out.push(finding(`seq:${e.seq}`, 'EV011', 'entry needs a written rationale'));
    if (!/^sha256:[0-9a-f]{64}$/.test(e.evalset_hash_after ?? '')) out.push(finding(`seq:${e.seq}`, 'EV011', 'entry needs evalset_hash_after'));
  }
  const tail = entries[entries.length - 1];
  if (tail.evalset_hash_after !== currentHash)
    out.push(finding('(ledger)', 'EV011', 'current eval-set hash does not match the ledger tail — an unledgered change exists'));
  return out;
}

/** The published gaming signal: deltas that both follow a failing run and favor a metric. */
export const postHocFavorableDeltas = (entries) =>
  entries.filter((e) => e.follows_failing_run && e.favors_metric).length;

// ---------------------------------------------------------------- holdout

/**
 * Holdout leakage lint (B7): a holdout item id appearing ANYWHERE in a report
 * — per-item rows or serialized prose — is a failure. The ratchet leaks one
 * scalar per look; item-level feedback defeats it regardless of file secrecy.
 */
export function holdoutLint(report, holdoutIds) {
  const out = [];
  for (const p of report?.per_item ?? [])
    if (holdoutIds.has(p.id)) out.push(finding(p.id, 'EV012', 'holdout item in per-item output'));
  const blob = JSON.stringify(report ?? {});
  for (const id of holdoutIds)
    if (blob.includes(id) && !(report?.per_item ?? []).some((p) => p.id === id))
      out.push(finding(id, 'EV012', 'holdout id appears in the serialized report'));
  return out;
}
