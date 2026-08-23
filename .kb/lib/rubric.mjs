/**
 * Rubric runner — the deterministic half of a judgment.
 *
 * `kb` never calls a model. It cannot: anything in the verify path must run
 * without a secret, or the "works in all four harnesses" property breaks. So
 * the split is literal — this module *emits* a judgment task and *routes* the
 * answer, and an agent supplies the judgment in between.
 *
 * Scoring is the model's job. Routing is arithmetic-free: a lookup over
 * discrete ordinal values, which is auditable and does not drift when a model's
 * internal calibration does.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { splitFrontmatter, section } from './md.mjs';

export function loadRubric(kbDir, id) {
  const file = path.join(kbDir, 'rubrics', `${id}.rubric.yaml`);
  if (!fs.existsSync(file)) throw new Error(`no rubric \`${id}\` at ${path.relative(kbDir, file)}`);
  return parseYaml(fs.readFileSync(file, 'utf8'));
}

// ------------------------------------------------------------ shortlisting

const STOP = new Set(
  ('the a an and or of for to in on with is are be as by from that this it its at ' +
   'can not but if then than into over under how what why when which').split(' '),
);

const tokenise = (text) =>
  (text.toLowerCase().match(/[a-z][a-z0-9+-]{2,}/g) ?? []).filter((t) => !STOP.has(t));

/**
 * Nearest existing notes by IDF-weighted cosine over tokens.
 *
 * Lexical, not embeddings — deliberately. At this corpus size embeddings buy
 * little, need a cache with hash invalidation, and (via an API) a secret that
 * the gate may not have. The model receiving this shortlist does the semantic
 * work; this only has to avoid missing an obvious neighbour.
 */
export function nearest(targetText, notes, limit = 6) {
  const docs = notes.map((n) => ({ ...n, tokens: tokenise(n.text) }));
  const df = new Map();
  for (const d of docs) for (const t of new Set(d.tokens)) df.set(t, (df.get(t) ?? 0) + 1);
  const idf = (t) => Math.log((docs.length + 1) / ((df.get(t) ?? 0) + 1)) + 1;

  const vec = (tokens) => {
    const tf = new Map();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    const v = new Map();
    let norm = 0;
    for (const [t, n] of tf) {
      const w = (1 + Math.log(n)) * idf(t);
      v.set(t, w);
      norm += w * w;
    }
    norm = Math.sqrt(norm) || 1;
    for (const [t, w] of v) v.set(t, w / norm);
    return v;
  };

  const q = vec(tokenise(targetText));
  return docs
    .map((d) => {
      const v = vec(d.tokens);
      let score = 0;
      for (const [t, w] of q) score += w * (v.get(t) ?? 0);
      return { slug: d.slug, title: d.title, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ------------------------------------------------------------ task emission

const excerpt = (file, chars = 600) => {
  if (!fs.existsSync(file)) return '(exemplar missing)';
  const { data, body } = splitFrontmatter(fs.readFileSync(file, 'utf8'));
  const def = section(body, 'Definition') || body.trim();
  return `${data?.title ?? path.basename(file)} — ${def.slice(0, chars)}`;
};

/** Build the self-contained judgment task an agent answers. */
export function buildTask(rubric, root, target, targetText, neighbours) {
  return {
    rubric: `${rubric.id}@${rubric.version}`,
    target,
    instructions:
      'Judge the note below against this rubric. Answer disqualifiers first: if any is true, ' +
      'the note is discarded regardless of the dimensions, so do not soften a true disqualifier. ' +
      'Rate each dimension on the ordinal scale only — never a number — and anchor each rating ' +
      'against the exemplars given. Every judgment needs a one-sentence rationale. ' +
      'Reply with JSON conforming to rubric-verdict.schema.json and nothing else.',
    disqualifiers: rubric.disqualifiers.map(({ id, prompt }) => ({ id, prompt })),
    dimensions: rubric.dimensions.map((d) => ({
      id: d.id,
      scale: d.scale,
      prompt: d.prompt,
      exemplars: Object.fromEntries(
        Object.entries(d.exemplars ?? {}).map(([rating, rel]) => [rating, excerpt(path.join(root, rel))]),
      ),
    })),
    nearest_existing_concepts: neighbours.map((n) => ({ slug: n.slug, title: n.title })),
    note: targetText,
    response_schema: 'rubric-verdict.schema.json',
  };
}

// ------------------------------------------------------------ routing

const matches = (rule, ratings) =>
  Object.entries(rule.when ?? {}).every(([dim, allowed]) => allowed.includes(ratings[dim]));

/** Apply the rubric's routing table to a validated verdict. */
export function route(rubric, verdict) {
  const fired = Object.entries(verdict.disqualifiers ?? {})
    .filter(([, v]) => v.triggered)
    .map(([id]) => id);

  // Knockouts are absolute — this is the whole reason they are not weights.
  if (fired.length) {
    return { action: 'discard', reason: `disqualified: ${fired.join(', ')}`, disqualifiers: fired };
  }

  const ratings = Object.fromEntries(
    Object.entries(verdict.dimensions ?? {}).map(([id, v]) => [id, v.rating]),
  );

  for (const rule of rubric.routing) {
    if (rule.default) continue;
    if (matches(rule, ratings)) {
      return { action: rule.action, reason: `matched ${JSON.stringify(rule.when)}`, ratings };
    }
  }
  const fallback = rubric.routing.find((r) => r.default);
  return { action: fallback?.default ?? 'queue', reason: 'no routing rule matched', ratings };
}
