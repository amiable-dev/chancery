/**
 * P1 migration — deterministic frontmatter and card-identity work.
 *
 * Everything here is computed from what is already in the file. Nothing is
 * invented. Two fields that the design originally scheduled for P1 are
 * deliberately NOT written:
 *
 *   - `description` needs judgment, so it batches with the P5 facet pass where
 *     a model is already reading every note once.
 *   - `sources[].hash` / `retrieved` need the network. Extracting the URLs is
 *     offline and happens here; fetching and hashing them is P1b.
 *
 * Writing either one speculatively would put unverified data behind a field
 * whose entire purpose is verifiability.
 */
import { stringify as stringifyYaml } from 'yaml';
import { splitFrontmatter } from './md.mjs';
import { parseDeck, mintId, withId } from './cards.mjs';

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Insert keys into existing frontmatter text without re-serialising it.
 *
 * Round-tripping through a YAML emitter is the obvious implementation and the
 * wrong one: it rewrites lines it was not asked to touch — dropping the corpus's
 * quoted titles and expanding flow-style `tags: [a, b]` into block lists. That
 * turned a ~700-line insertion into 2,835 added / 512 deleted across 242 files,
 * burying the real change in style churn and making the migration unreviewable.
 * Every untouched byte stays untouched.
 */
function insertAfterKey(rawLines, afterKey, insertion) {
  const at = rawLines.findIndex((l) => new RegExp(`^${afterKey}\\s*:`).test(l));
  if (at === -1) return [...insertion, ...rawLines];
  return [...rawLines.slice(0, at + 1), ...insertion, ...rawLines.slice(at + 1)];
}

/** YAML 1.2 is a JSON superset, so a JSON array is a valid flow sequence —
 *  and flow matches how this corpus already writes `tags`. */
const flowList = (values) => JSON.stringify(values);

/** Markdown links and bare URLs inside the `## Sources` section, deduped. */
function extractSources(body) {
  const section = body.match(/^## Sources\s*$([\s\S]*?)(?=^## |\Z)/m);
  if (!section) return [];
  const urls = [];
  const md = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;
  let m;
  while ((m = md.exec(section[1])) !== null) urls.push(m[1]);
  const bare = /(?<!\()\b(https?:\/\/[^\s)\]<>]+)/g;
  while ((m = bare.exec(section[1])) !== null) urls.push(m[1]);
  return [...new Set(urls.map((u) => u.replace(/[.,;]+$/, '')))].map((url) => ({ url }));
}

/** Concept: add `aliases` where the title would not resolve, and `sources`. */
export function migrateConcept(slug, text) {
  const { data, body, raw } = splitFrontmatter(text);
  if (!data) return { changed: false, text, notes: ['no frontmatter'] };

  let lines = raw.split('\n');
  const notes = [];

  // R1a backfill (validation-r1a §4/§5): every source entry gains
  // `class: unclassified` (an honest sentinel, never a fabricated
  // classification) and a liveness state derived from the summary it already
  // carries — hash+retrieved was an `ok` observation recorded before the
  // evidence store existed. The whole sources block is re-rendered, the
  // pattern `kb sources` already establishes.
  const legacyReach = (s) => {
    if (s.reachability) return s.reachability;
    if (s.hash && !s.unreachable) return 'ok';
    const r = s.reason ?? '';
    if (/HTTP 40[13]/.test(r)) return 'blocked-4xx';
    if (/HTTP 402/.test(r)) return 'paywall';
    if (/HTTP 429/.test(r)) return 'rate-limited';
    if (/HTTP 4(04|10)/.test(r)) return 'dead-no-archive';
    if (/no extractable/.test(r)) return 'js-required';
    return 'dns-transient';
  };
  // Liveness only where an observation basis exists (hash or a recorded
  // failure); a never-fetched citation stays state-free — absence is the
  // honest signal (KB015 warns on it, which is the point).
  const observed = (s) => s.hash || s.unreachable;
  const needsR1a = (data.sources ?? []).some((s) => s.url && (!s.class || (!s.reachability && observed(s))));
  if (needsR1a) {
    const next = data.sources.map((s) => (s.url
      ? { ...s, class: s.class ?? 'unclassified', ...(observed(s) && !s.reachability ? { reachability: legacyReach(s) } : {}) }
      : s));
    const sIdx = lines.findIndex((l) => /^sources\s*:/.test(l));
    const sEnd = lines.findIndex((l, i) => i > sIdx && /^[A-Za-z_]/.test(l));
    const rendered = stringifyYaml({ sources: next }, { lineWidth: 0 }).trimEnd().split('\n');
    lines = [...lines.slice(0, sIdx), ...rendered, ...(sEnd === -1 ? [] : lines.slice(sEnd))];
    notes.push('sources gained class + liveness state');
  }

  // Only where it buys something: if the title already slugifies to the
  // filename, Obsidian resolves [[Title]] natively and an alias is noise.
  if (!('aliases' in data) && slugify(data.title ?? '') !== slug) {
    lines = insertAfterKey(lines, 'title', [`aliases: ${flowList([data.title])}`]);
    notes.push(`alias "${data.title}"`);
  }

  if (!('sources' in data)) {
    const sources = extractSources(body).map((s) => ({ ...s, class: 'unclassified' }));
    if (sources.length) {
      lines = [...lines, ...stringifyYaml({ sources }, { lineWidth: 0 }).trimEnd().split('\n')];
      notes.push(`${sources.length} source url(s)`);
    }
  }

  if (!notes.length) return { changed: false, text, notes };
  return { changed: true, text: `---\n${lines.join('\n')}\n---\n${body}`, notes };
}

/** Deck: mint a stable id for every card that lacks one. Touches nothing else. */
export function migrateDeck(slug, text, globalIds) {
  const { data, body, raw } = splitFrontmatter(text);
  if (!data) return { changed: false, text, notes: ['no frontmatter'] };

  const blocks = parseDeck(body);
  const lines = body.split('\n');
  let minted = 0;

  for (const block of blocks) {
    if (!block.isCard || block.id) {
      if (block.id) globalIds.add(block.id);
      continue;
    }
    let salt = 0;
    let id = mintId(slug, block.heading, block.question);
    while (globalIds.has(id)) id = mintId(slug, block.heading, block.question, ++salt);
    globalIds.add(id);
    lines[block.headingLine] = withId(lines[block.headingLine], id);
    minted++;
  }

  if (!minted) return { changed: false, text, notes: [] };
  return {
    changed: true,
    text: `---\n${raw}\n---\n${lines.join('\n')}`,
    notes: [`${minted} card id(s)`],
  };
}
