/**
 * Docusaurus export (P7).
 *
 * The vault stays the single source of truth and this is a build-time transform,
 * because Obsidian and Docusaurus disagree in three places that cannot both be
 * satisfied by one file:
 *
 *   1. Links. Obsidian wants `[[wikilinks]]`; Docusaurus needs relative `.md`
 *      links (absent a remark plugin).
 *   2. Underscore files. Docusaurus IGNORES `_`-prefixed files by default, so
 *      `concepts/_index.md` would silently never publish.
 *   3. Sidebar metadata. Docusaurus wants sidebar_position/sidebar_label;
 *      Obsidian has no use for either.
 *
 * Unresolved wikilinks degrade to plain text here rather than being dropped from
 * the source. A concept gap is a finding worth keeping in the vault
 * (.kb/POLICY.md) and simply not something a static site can link to.
 */
import { splitFrontmatter, maskCode } from './md.mjs';

// Rides in every manifest: a transform change must dirty rendered hashes.
export const TRANSFORM_VERSION = '2';

const LINK = /\[\[([^\]|#\n]+?)(?:\\?\|([^\]\n]*))?\]\]/g;

/**
 * Rewrite wikilinks, leaving code untouched. Contract (export spec): aliases
 * resolve through titleOf; anchors are not present in this corpus's wikilinks
 * (the LINK pattern excludes #, so an anchored link degrades to text — a
 * recorded gap, not a broken href); external URLs are never touched (they are
 * not wikilinks); targets are URL-encoded; unresolved links render as plain
 * text and are counted by the caller. basePath switches relative `./x.md`
 * links to site-absolute `${basePath}/x` for mounted exports.
 */
export function rewriteLinks(body, known, titleOf, { basePath = null } = {}) {
  const masked = maskCode(body);
  let out = '';
  let last = 0;
  let m;
  LINK.lastIndex = 0;

  while ((m = LINK.exec(masked)) !== null) {
    const target = m[1].trim();
    const alias = m[2]?.trim() || null;
    const slug = target.split('/').pop().replace(/\.md$/, '');
    const label = alias ?? titleOf(slug) ?? slug;

    out += body.slice(last, m.index);
    out += known.has(slug)
      ? `[${label}](${basePath ? `${basePath}/${encodeURIComponent(slug)}` : `./${encodeURIComponent(slug)}.md`})`
      : label;
    last = m.index + m[0].length;
  }
  return out + body.slice(last);
}

/** Frontmatter for a Docusaurus doc, derived from the vault's own. */
export function docFrontmatter(slug, data) {
  const facetTagPrefixes = ['domain/', 'maturity/', 'source-type/', 'topic/'];
  const tags = (data.tags ?? [])
    .filter((t) => t !== 'concept' && !facetTagPrefixes.some((p) => t.startsWith(p)));

  return {
    id: slug,
    title: data.title ?? slug,
    sidebar_label: data.title ?? slug,
    ...(data.description ? { description: data.description } : {}),
    ...(tags.length ? { tags } : {}),
    // Scalars, not the mirrored nested tags: these drive faceted filtering on the
    // site, where a `domain/security` tag would only become a stray permalink.
    ...(data.domain ? { domain: data.domain } : {}),
    ...(data.maturity ? { maturity: data.maturity } : {}),
    ...(data.source_type ? { source_type: data.source_type } : {}),
    ...(data.updated || data.date ? { last_update: { date: data.updated ?? data.date } } : {}),
  };
}

/** Transform one concept note. idPrefix namespaces the doc id for mounted exports. */
export function transformNote(slug, text, known, titleOf, stringifyYaml, { basePath = null, idPrefix = '' } = {}) {
  const { data, body } = splitFrontmatter(text);
  if (!data) return null;
  const fm = stringifyYaml({ ...docFrontmatter(slug, data), id: `${idPrefix}${slug}` }, { lineWidth: 0 }).trimEnd();
  // Drop the H1: Docusaurus renders the title from frontmatter, so keeping it
  // shows the heading twice. The leading \s* matters — splitFrontmatter leaves
  // the newline that followed the closing delimiter, so the H1 is never at index
  // 0 and a bare ^# anchor silently matches nothing.
  const withoutH1 = body.replace(/^\s*#\s+.+?\r?\n+/, '');
  return `---\n${fm}\n---\n\n${rewriteLinks(withoutH1, known, titleOf, { basePath })}`;
}

/** facets.yml doubles as the site's tags file — one vocabulary, two consumers. */
export function tagsFile(facets, stringifyYaml) {
  const out = {};
  for (const t of facets.topics?.curated ?? []) {
    out[t] = { label: t.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()), permalink: `/${t}` };
  }
  return stringifyYaml(out, { lineWidth: 0 });
}

/** Presentation-free JSON export: source structure preserved, no facet
 * flattening, no H1 handling, wikilinks intact. Its own stability contract. */
export const JSON_SCHEMA_VERSION = '1';
export function jsonCorpus(notes) {
  return {
    schema_version: JSON_SCHEMA_VERSION,
    notes: notes.map((n) => ({ slug: n.slug, file: n.file, frontmatter: n.data, body: n.body })),
  };
}

/** Merge our tags into a host's tags.yml content. Conflicts are returned, never overwritten. */
export function mergeTags(ours, host) {
  const merged = { ...host };
  const conflicts = [];
  for (const [k, v] of Object.entries(ours)) {
    if (k in host && JSON.stringify(host[k]) !== JSON.stringify(v)) conflicts.push(k);
    else merged[k] = v;
  }
  return { merged, conflicts };
}
