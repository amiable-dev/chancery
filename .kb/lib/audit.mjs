// Semantic lint candidates (design/audit.md): every generator is pinned —
// parameters are data, hashed into the task — and audit READS observations
// (the C5 store), it never fetches. Findings are judgments; candidates are
// mechanical.

import crypto from 'node:crypto';
import { section, wikilinks, targetSlug, maskCode } from './md.mjs';

export const PARAMS = {
  contradictions: { k: 6, similarity: 'idf-token-overlap@1', tiebreak: 'codepoint', scope: 'shared-domain' },
  'stale-claims': { signals: ['evidence-drift', 'dead-citation', 'never-resolved', 'decay-language'], patterns_version: 1 },
  'concept-gaps': { min_notes: 3, tokenisation: 'lowercase, hyphen-split, no stemming', sources: ['unresolved-links', 'hyphenated-terms'] },
  'graph-rot': { k: 6, checks: ['superseded-target-links', 'domain-pair-omission'] },
};

export const paramsHash = (check) =>
  `sha256:${crypto.createHash('sha256').update(JSON.stringify(PARAMS[check])).digest('hex').slice(0, 16)}`;

export const candidateId = (check, ...participants) =>
  crypto.createHash('sha256').update([check, ...participants.map(String).sort()].join('\n')).digest('hex').slice(0, 12);

const excerpt = (note) =>
  `${section(note.body, 'Definition')}\n${section(note.body, 'Explanation')}`.trim().slice(0, 2000);

/** Top-k lexical neighbours within a shared domain, deduped a<b. */
export function contradictionCandidates(notes, nearest, limit) {
  const seen = new Set();
  const out = [];
  for (const note of notes) {
    const domain = note.data?.domain;
    if (!domain) continue;
    const pool = notes.filter((n) => n.slug !== note.slug && n.data?.domain === domain)
      .map((n) => ({ slug: n.slug, title: n.title, text: `${n.title} ${n.body}` }));
    for (const r of nearest(`${note.title} ${note.body}`, pool, PARAMS.contradictions.k)) {
      const [a, b] = [note.slug, r.slug].sort();
      const key = `${a}\0${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ candidate_id: candidateId('contradictions', a, b), a, b });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

/** Deterministic stale signals: store drift/death + decay-language matches. */
export function staleCandidates(notes, storeOf, patterns, limit) {
  const out = [];
  for (const note of notes) {
    const signals = [];
    const latest = storeOf(note.slug);
    for (const [cid, obs] of latest) {
      const summary = (note.data?.sources ?? []).find((s) => s.url && obs.url_canonical?.includes(new URL(s.url).host));
      if (obs.never_resolved) signals.push(`never-resolved:${cid}`);
      else if (obs.reachability?.startsWith('dead')) signals.push(`dead-citation:${cid}`);
      else if (summary?.hash && obs.authenticity?.content_digest && summary.hash !== obs.authenticity.content_digest) {
        signals.push(`evidence-drift:${cid}`);
      }
    }
    const body = maskCode(note.body);
    for (const p of patterns) {
      if (new RegExp(`\\b${p}\\b`, 'i').test(body)) signals.push(`decay-language:${p}`);
    }
    if (signals.length) {
      out.push({ candidate_id: candidateId('stale-claims', note.slug, ...signals), slug: note.slug, signals });
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** Terms referenced from >=3 notes that resolve to no slug AND no alias. */
export function gapCandidates(notes, limit) {
  const slugs = new Set(notes.map((n) => n.slug));
  const aliases = new Set(notes.flatMap((n) => (n.data?.aliases ?? []).map((a) => String(a).toLowerCase())));
  const titles = new Set(notes.map((n) => String(n.title).toLowerCase()));
  const refs = new Map();
  for (const note of notes) {
    const seen = new Set();
    for (const w of wikilinks(note.body)) {
      const slug = targetSlug(w.target);
      const label = w.target.toLowerCase();
      if (slugs.has(slug) || aliases.has(label) || titles.has(label)) continue;
      if (seen.has(slug)) continue;
      seen.add(slug);
      refs.set(slug, (refs.get(slug) ?? new Set()).add(note.slug));
    }
  }
  return [...refs.entries()]
    .filter(([, from]) => from.size >= PARAMS['concept-gaps'].min_notes)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(0, limit)
    .map(([term, from]) => ({ candidate_id: candidateId('concept-gaps', term), term, referencing: [...from].sort() }));
}

/** Links pointing at superseded notes + strong same-domain pairs with no edge. */
export function rotCandidates(notes, nearest, limit) {
  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  const out = [];
  for (const note of notes) {
    for (const w of wikilinks(section(note.body, 'Relationships'))) {
      const target = bySlug.get(targetSlug(w.target));
      if (target?.data?.status === 'superseded') {
        out.push({ candidate_id: candidateId('graph-rot', note.slug, target.slug, 'stale'), kind: 'stale-edge', from: note.slug, to: target.slug });
      }
    }
  }
  for (const note of notes) {
    if (out.length >= limit) break;
    const domain = note.data?.domain;
    if (!domain) continue;
    const linked = new Set(wikilinks(note.body).map((w) => targetSlug(w.target)));
    const pool = notes.filter((n) => n.slug !== note.slug && n.data?.domain === domain && !linked.has(n.slug)
      && !wikilinks(n.body).some((w) => targetSlug(w.target) === note.slug))
      .map((n) => ({ slug: n.slug, title: n.title, text: `${n.title} ${n.body}` }));
    const top = nearest(`${note.title} ${note.body}`, pool, 1)[0];
    if (top && top.score > 0) {
      const [a, b] = [note.slug, top.slug].sort();
      out.push({ candidate_id: candidateId('graph-rot', a, b, 'omission'), kind: 'missing-edge', from: a, to: b });
    }
  }
  const seen = new Set();
  return out.filter((c) => (seen.has(c.candidate_id) ? false : seen.add(c.candidate_id))).slice(0, limit);
}

export function candidateTexts(notes, candidates) {
  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  const need = new Set();
  for (const c of candidates) for (const s of [c.a, c.b, c.slug, c.from, c.to]) if (s && bySlug.has(s)) need.add(s);
  return [...need].sort().map((slug) => {
    const n = bySlug.get(slug);
    return { slug, title: n.title, excerpt: excerpt(n) };
  });
}
