/**
 * Facet classification (P5).
 *
 * Two tiers, because the measured distribution justifies neither extreme
 * (docs/adrs/006-two-tier-facets.md). Closed axes for the working head of the
 * vocabulary; a governed open `topics` list for the useful middle band; the
 * 159-tag singleton tail goes to the queue rather than being deleted on sight.
 *
 * Every value is emitted twice — as a scalar property and as a mirrored nested
 * tag — because in Obsidian a nested tag *is* a facet. Scalars drive Bases,
 * Dataview and Docusaurus; nested tags drive the tag pane, graph groups and
 * search. Both are generated from this one file and cross-checked, so they
 * cannot drift.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

/**
 * Flow sequence in the corpus's own style: `[a, b, c]`, unquoted.
 * Safe unquoted because every facet value and tag matches ^[a-z0-9][a-z0-9/-]*$,
 * which has no YAML-significant characters. Emitting JSON here would work but
 * would reformat a line it was only asked to extend.
 */
const flow = (values) => `[${values.join(', ')}]`;

export const loadFacets = (kbDir) => parseYaml(fs.readFileSync(path.join(kbDir, 'facets.yml'), 'utf8'));

/** The nested tags a note's facet values imply, in a stable order. */
export function expectedTags(facets, data) {
  const out = [];
  for (const [axis, prefix] of Object.entries(facets.emit?.tag_prefixes ?? {})) {
    if (axis === 'topics') {
      for (const t of data.topics ?? []) out.push(`${prefix}/${t}`);
    } else if (data[axis]) {
      out.push(`${prefix}/${data[axis]}`);
    }
  }
  return out;
}

/**
 * Conformance findings for one note. Returns [] when the note carries no facet
 * values at all — P5 derivation has not reached it yet, and an unclassified
 * note is a backlog item, not an error.
 */
export function conformance(facets, data) {
  const axes = facets.axes ?? {};
  const hasAny = Object.keys(axes).some((a) => data[a]) || (data.topics ?? []).length;
  if (!hasAny) return [];

  const problems = [];

  for (const [axis, allowed] of Object.entries(axes)) {
    const value = data[axis];
    if (value && !allowed.includes(value)) {
      problems.push({ kind: 'unknown-value', axis, value, message: `\`${axis}: ${value}\` is not in the closed axis` });
    }
  }

  const curated = new Set(facets.topics?.curated ?? []);
  for (const t of data.topics ?? []) {
    if (!curated.has(t)) {
      problems.push({ kind: 'uncurated-topic', axis: 'topics', value: t, message: `topic \`${t}\` is not curated` });
    }
  }

  // The mirror must agree. If it does not, one of the two views into this note
  // is lying, and which one is lying depends on which tool you happened to use.
  const tags = new Set(data.tags ?? []);
  for (const t of expectedTags(facets, data)) {
    if (!tags.has(t)) {
      problems.push({ kind: 'missing-mirror', axis: null, value: t, message: `scalar facets imply tag \`${t}\`, which is absent` });
    }
  }
  const prefixes = Object.values(facets.emit?.tag_prefixes ?? {});
  for (const t of data.tags ?? []) {
    const prefix = t.split('/')[0];
    if (prefixes.includes(prefix) && !expectedTags(facets, data).includes(t)) {
      problems.push({ kind: 'orphan-mirror', axis: null, value: t, message: `tag \`${t}\` has no matching scalar facet` });
    }
  }

  return problems;
}

/** The classification task an agent answers for one note. */
export function buildFacetTask(facets, notes) {
  return {
    instructions:
      'Classify each note against the closed axes below. Every axis takes exactly one value, and ' +
      'that value MUST come from the list given — if nothing fits, pick the closest and add a ' +
      'proposal in `topic_proposals` explaining what is missing; do not invent an axis value. ' +
      '`topics` takes zero or more values from the curated list, for genuine specifics the axes ' +
      'cannot express. Reply with JSON conforming to facet-draft.schema.json and nothing else.',
    axes: facets.axes,
    curated_topics: facets.topics?.curated ?? [],
    notes,
    response_schema: 'facet-draft.schema.json',
  };
}

/**
 * Insert facet scalars and their mirrored tags without disturbing the rest.
 *
 * Idempotent: any prior facet scalar is removed before the new one is written.
 * Appending instead produced duplicate YAML keys on re-classification — which
 * the parser resolves by taking the last, so the file behaves correctly while
 * being malformed. That is the worst failure mode available: invisible.
 */
export function applyFacets(facets, raw, data, assignment) {
  const scalarKeys = [...Object.keys(facets.axes ?? {}), 'topics'];
  const lines = raw.split('\n').filter((l) => !scalarKeys.some((k) => new RegExp(`^${k}\\s*:`).test(l)));
  const scalarLines = [];

  for (const axis of Object.keys(facets.axes ?? {})) {
    if (assignment[axis]) scalarLines.push(`${axis}: ${assignment[axis]}`);
  }
  if (assignment.topics?.length) scalarLines.push(`topics: ${flow(assignment.topics)}`);

  const merged = { ...data, ...assignment };
  const nested = expectedTags(facets, merged);
  const existing = (data.tags ?? []).filter((t) => !Object.values(facets.emit?.tag_prefixes ?? {}).includes(t.split('/')[0]));
  const tagLine = `tags: ${flow([...existing, ...nested])}`;

  const at = lines.findIndex((l) => /^tags\s*:/.test(l));
  if (at === -1) return [...scalarLines, ...lines].join('\n');

  // Replace the tags line (and any block-list continuation) in place.
  let end = at;
  while (end + 1 < lines.length && /^\s+-\s/.test(lines[end + 1])) end++;
  return [...lines.slice(0, at), ...scalarLines, tagLine, ...lines.slice(end + 1)].join('\n');
}
