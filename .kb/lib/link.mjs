/**
 * Cross-linking (P5).
 *
 * Two findings this addresses, both invisible to the dangling-link check:
 *
 *   - An *isolated* note — one nothing links to — is not broken, so nothing
 *     fails, but it is effectively unreachable by browsing. The corpus median is
 *     9 inbound links, so a zero stands out.
 *   - A *one-way* link. `kb promote` writes a new concept's outbound
 *     relationships but cannot edit the notes it points at, so every promoted
 *     concept starts isolated no matter how well it is linked outward. The
 *     reciprocal backlink is the missing half.
 *
 * Nothing here rewrites or deletes an existing link (.kb/POLICY.md). Suggestions
 * become queue proposals; only an explicit --apply appends, and only additively.
 */
import fs from 'node:fs';
import path from 'node:path';
import { splitFrontmatter, wikilinks, targetSlug, section } from './md.mjs';

/** Inbound link counts across a collection, self-links excluded. */
export function linkGraph(notes) {
  const slugs = new Set(notes.map((n) => n.slug));
  const inbound = new Map([...slugs].map((s) => [s, new Set()]));

  for (const note of notes) {
    for (const link of wikilinks(note.text)) {
      const t = targetSlug(link.target);
      if (slugs.has(t) && t !== note.slug) inbound.get(t).add(note.slug);
    }
  }
  return inbound;
}

/** Links that exist in one direction only — candidates for a backlink. */
export function oneWay(notes) {
  const slugs = new Set(notes.map((n) => n.slug));
  const out = new Map(notes.map((n) => [
    n.slug,
    new Set(wikilinks(n.text).map((l) => targetSlug(l.target)).filter((t) => slugs.has(t) && t !== n.slug)),
  ]));

  const pairs = [];
  for (const [from, targets] of out) {
    for (const to of targets) {
      if (!out.get(to)?.has(from)) pairs.push({ from, to });
    }
  }
  return pairs;
}

/** The cross-link task an agent answers for weakly-connected notes. */
export function buildLinkTask(targets, neighboursFor) {
  return {
    instructions:
      'Propose cross-links for each note below. A relationship needs a clause saying HOW the two ' +
      'relate — "related to X" is not a relationship and will be rejected. Only propose links to ' +
      'slugs listed in that note\'s candidates. Prefer few strong links over many weak ones: if ' +
      'nothing genuinely relates, return an empty list for that note rather than padding it. ' +
      'Set reciprocal true when the target note would equally benefit from linking back. ' +
      'Reply with JSON conforming to link-draft.schema.json and nothing else.',
    notes: targets.map((t) => ({
      slug: t.slug,
      title: t.title,
      definition: t.definition,
      inbound_count: t.inbound,
      candidates: neighboursFor(t.slug).map((n) => ({ slug: n.slug, title: n.title })),
    })),
    response_schema: 'link-draft.schema.json',
  };
}

/**
 * Append relationship bullets to a note's `## Relationships` section.
 * Additive only — existing bullets are never touched, and a duplicate target is
 * skipped rather than repeated.
 */
export function appendRelationships(text, additions) {
  const { body } = splitFrontmatter(text);
  const existing = new Set(wikilinks(body).map((l) => targetSlug(l.target)));
  const fresh = additions.filter((a) => !existing.has(a.target));
  if (!fresh.length) return { text, added: 0 };

  const lines = text.split('\n');
  const start = lines.findIndex((l) => /^##\s+Relationships\s*$/.test(l));
  if (start === -1) return { text, added: 0 };

  // Insert after the last bullet of the section, before the next heading.
  let end = start + 1;
  let lastBullet = start;
  while (end < lines.length && !/^##\s/.test(lines[end])) {
    if (/^\s*-\s/.test(lines[end])) lastBullet = end;
    end++;
  }
  const anchor = lastBullet > start ? lastBullet : start;
  const bullets = fresh.map((a) => `- [[${a.target}]] — ${a.clause.trim()}`);

  return {
    text: [...lines.slice(0, anchor + 1), ...bullets, ...lines.slice(anchor + 1)].join('\n'),
    added: bullets.length,
  };
}

export function loadNotes(root, collection, listNotes) {
  return listNotes(collection).map((n) => {
    const text = fs.readFileSync(n.abs, 'utf8');
    const { data, body } = splitFrontmatter(text);
    return {
      ...n, text, body,
      title: data?.title ?? n.slug,
      definition: section(body, 'Definition').slice(0, 500),
    };
  });
}

export { path };
