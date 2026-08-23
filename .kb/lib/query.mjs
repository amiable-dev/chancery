/**
 * Corpus query (P9).
 *
 * The pattern this design descends from has three operations — Ingest, Query,
 * Lint — and until now this implemented two. Every other task-emitting command
 * *maintains* the corpus; none retrieved from it, which forfeits the whole
 * argument for compiling a knowledge base: that the cross-references are
 * already there and asking is therefore cheap.
 *
 * Retrieval is lexical, reusing the ranker the rubric shortlist already uses
 * (design decision 3: no embeddings at this corpus size). What makes it more
 * than grep is the two additions below — facet filters, and returning each
 * concept's relationship clauses so the model receives graph edges rather than
 * isolated nodes.
 */
import { nearest } from './rubric.mjs';
import { section, wikilinks, targetSlug } from './md.mjs';

/** `## Relationships` bullets as {target, clause} — the edges, not just the nodes. */
export function relationships(body) {
  const sec = section(body, 'Relationships');
  const out = [];
  for (const line of sec.split('\n')) {
    if (!/^\s*-\s/.test(line)) continue;
    const link = wikilinks(line)[0];
    if (!link) continue;
    const clause = line.replace(/^\s*-\s*/, '').replace(/\[\[[^\]]*\]\]/, '').replace(/^\s*[—:-]\s*/, '').trim();
    out.push({ target: targetSlug(link.target), clause });
  }
  return out;
}

/** Narrow by facet before ranking — this is what the P5 classification was for. */
export function applyFilters(notes, filters) {
  return notes.filter((n) =>
    Object.entries(filters).every(([k, v]) => !v || n.data?.[k] === v));
}

export function retrieve(notes, question, { filters = {}, limit = 6 } = {}) {
  const pool = applyFilters(notes, filters);
  const ranked = nearest(question, pool.map((n) => ({
    slug: n.slug, title: n.title, text: `${n.title} ${(n.data?.tags ?? []).join(' ')} ${n.body}`,
  })), limit);

  const bySlug = new Map(pool.map((n) => [n.slug, n]));
  return ranked.filter((r) => r.score > 0).map((r) => {
    const n = bySlug.get(r.slug);
    // A superseded note still surfaces (its successor may not match the query
    // wording) but at half rank, and the hit says so (validation-r1a §3).
    const superseded = n.data?.status === 'superseded';
    if (superseded) r.score = r.score / 2;
    return {
      slug: n.slug,
      ...(superseded ? { superseded_by: n.data?.superseded_by ?? [] } : {}),
      title: n.title,
      domain: n.data?.domain ?? null,
      maturity: n.data?.maturity ?? null,
      definition: section(n.body, 'Definition'),
      relationships: relationships(n.body),
      sources: (n.data?.sources ?? []).map((s) => s.url),
    };
  });
}

export function buildQueryTask(question, hits, filters) {
  return {
    question,
    filters,
    instructions:
      'Answer the question using ONLY the concepts below. Cite every concept you rely on by slug, ' +
      'with one clause saying what it supports — a citation to a note you did not use is noise, and ' +
      'a claim without one will be rejected. The `relationships` on each concept are the corpus\'s ' +
      'own cross-references: prefer following them to inferring a connection yourself. If the ' +
      'retrieved concepts cannot answer the question, say so and record what is missing in `gaps` ' +
      'rather than filling it from your own knowledge. Reply with JSON conforming to ' +
      'query-answer.schema.json and nothing else.',
    concepts: hits,
    response_schema: 'query-answer.schema.json',
  };
}

/**
 * A citation naming a concept that was never retrieved is ungrounded — the
 * model reached past its evidence. Deterministic, cheap, and the difference
 * between a grounded answer and a plausible one.
 */
export function checkCitations(answer, hits) {
  const shown = new Set(hits.map((h) => h.slug));
  return (answer.citations ?? []).filter((c) => !shown.has(c.slug)).map((c) => c.slug);
}
