/**
 * staging -> concepts (P3).
 *
 * Same boundary as `assess`: the model supplies content, the CLI supplies
 * structure. Sections are *rendered* from schema-validated fields rather than
 * written as prose, so a promoted concept cannot arrive with a missing or
 * misordered section — the two failure modes KB003/KB004 exist to catch.
 *
 * Provenance travels as the source URL, not as a pointer at the staging file.
 * Staging is a transient buffer here; a link into it would rot the moment the
 * buffer is cleared, which is exactly the triad breakage this repo was cut to
 * escape. The URL is durable and feeds revalidation.
 */
import fs from 'node:fs';
import path from 'node:path';
import { stringify as stringifyYaml } from 'yaml';
import { markers } from './md.mjs';

const LIST_MARKER = /^\s*(?:[-*+]\s|\d+\.\s)/m;

/** The drafting task an agent answers. */
export function buildDraftTask(stagingFile, stagingText, neighbours, sections, verdict) {
  return {
    target: stagingFile,
    instructions:
      'Write one or more concept notes from the staging note below. Each concept must be a single ' +
      'idea stated independently of the source\'s framing — if the note carries several unrelated ' +
      'ideas, return several concepts rather than one broad one. `definition` is one paragraph and ' +
      'must contain no list markers. Every entry in `relationships` needs a clause saying HOW the ' +
      'two relate; a bare link is not a relationship. Only reference slugs that appear in ' +
      'existing_concepts, or another concept you are returning in this same response. ' +
      'Reply with JSON conforming to concept-draft.schema.json and nothing else.',
    rendered_sections: sections,
    existing_concepts: neighbours.map((n) => ({ slug: n.slug, title: n.title })),
    prior_assessment: verdict
      ? { action: verdict.action, dimensions: verdict.ratings ?? null, proposed: verdict.proposed_concepts ?? null }
      : null,
    staging_note: stagingText,
    response_schema: 'concept-draft.schema.json',
  };
}

/** Render one drafted concept into its final markdown. */
export function renderConcept(draft, { sourceUrl, today }) {
  if (LIST_MARKER.test(draft.definition)) {
    throw new Error(`concept \`${draft.slug}\`: definition must be one paragraph with no list markers`);
  }

  // The staging note's Source is frequently cited again in extra_sources; a
  // duplicated URL would be hashed twice and read as two independent citations.
  const urls = [...new Set([...(sourceUrl ? [sourceUrl] : []), ...(draft.extra_sources ?? [])])];

  const frontmatter = {
    title: draft.title,
    ...(draft.aliases?.length ? { aliases: draft.aliases } : {}),
    date: today,
    tags: draft.tags.includes('concept') ? draft.tags : ['concept', ...draft.tags],
    status: 'draft',
    ...(urls.length ? { sources: urls.map((url) => ({ url })) } : {}),
  };

  const body = [
    `# ${draft.title}`,
    '',
    '## Definition',
    '',
    draft.definition.trim(),
    '',
    '## Explanation',
    '',
    draft.explanation.trim(),
    '',
    '## Key Properties',
    '',
    ...draft.key_properties.map((p) => `- ${p.trim()}`),
    '',
    '## Relationships',
    '',
    ...(draft.relationships.length
      ? draft.relationships.map((r) => `- [[${r.target}]] — ${r.clause.trim()}`)
      : ['- _No relationships recorded yet._']),
    '',
    '## Applications',
    '',
    draft.applications.trim(),
    '',
    '## Sources',
    '',
    ...urls.map((u) => `- ${u}`),
    '',
    '## See Also',
    '',
    ...(draft.see_also.length ? draft.see_also.map((s) => `- [[${s}]]`) : ['- _None yet._']),
    '',
  ].join('\n');

  return `---\n${stringifyYaml(frontmatter, { lineWidth: 0 }).trimEnd()}\n---\n\n${body}`;
}

/** `**Source:**` from a staging note — the URL that becomes the concept's provenance. */
export function stagingSourceUrl(text) {
  const m = markers(text).Source ?? '';
  return m.match(/https?:\/\/\S+/)?.[0] ?? null;
}

/**
 * Targets that do not resolve. Not fatal — an unresolved link is a concept gap,
 * never an error (.kb/POLICY.md) — but worth surfacing at creation time, when
 * it is cheapest to fix.
 */
export function unresolvedTargets(drafts, existingSlugs) {
  const known = new Set([...existingSlugs, ...drafts.map((d) => d.slug)]);
  const out = [];
  for (const d of drafts) {
    for (const r of d.relationships) if (!known.has(r.target)) out.push({ from: d.slug, target: r.target, kind: 'relationship' });
    for (const s of d.see_also) if (!known.has(s)) out.push({ from: d.slug, target: s, kind: 'see_also' });
  }
  return out;
}
