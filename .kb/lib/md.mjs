/**
 * Markdown/frontmatter primitives.
 *
 * The link extractor is deliberately code-aware. An earlier audit of this
 * corpus over-reported ~110 "broken links" because it counted illustrative
 * `[[links]]` written inside code spans in prose. Stripping fenced blocks and
 * inline code before matching is not an optimisation, it is correctness.
 */
import { parse as parseYaml } from 'yaml';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Split a document into { data, body, bodyOffset }. data is null when absent. */
export function splitFrontmatter(text) {
  const m = text.match(FRONTMATTER);
  if (!m) return { data: null, raw: null, body: text, bodyOffset: 0 };
  let data;
  try {
    data = parseYaml(m[1]) ?? {};
  } catch (err) {
    return { data: undefined, raw: m[1], body: text.slice(m[0].length), bodyOffset: m[0].length, error: err.message };
  }
  return { data, raw: m[1], body: text.slice(m[0].length), bodyOffset: m[0].length };
}

/** Blank out fenced code blocks and inline code spans, preserving offsets. */
export function maskCode(text) {
  const blank = (s) => s.replace(/[^\n]/g, ' ');
  return text
    .replace(/```[\s\S]*?(?:```|$)/g, blank)
    .replace(/~~~[\s\S]*?(?:~~~|$)/g, blank)
    .replace(/`[^`\n]*`/g, blank);
}

/** `## Heading` text in document order, code-masked. */
export function headings(body, level = 2) {
  const re = new RegExp(`^#{${level}}\\s+(.+?)\\s*$`, 'gm');
  return [...maskCode(body).matchAll(re)].map((m) => m[1].trim());
}

/**
 * Wikilinks outside code. Returns { target, alias, line }.
 * Handles the table-escaped `\|` alias form used inside markdown tables.
 */
export function wikilinks(text) {
  const masked = maskCode(text);
  const out = [];
  const re = /\[\[([^\]|#\n]+?)(?:\\?\|([^\]\n]*))?\]\]/g;
  let m;
  while ((m = re.exec(masked)) !== null) {
    out.push({
      target: m[1].trim(),
      alias: m[2]?.trim() ?? null,
      line: masked.slice(0, m.index).split('\n').length,
    });
  }
  return out;
}

/** Resolve a wikilink target to a bare slug: `staging/foo.md` -> `foo`. */
export function targetSlug(target) {
  const last = target.split('/').pop().trim();
  return last.replace(/\.md$/i, '');
}

/** Marker-style metadata used by staging notes: `**Source:** ...`. */
export function markers(body) {
  const out = {};
  const re = /^\*\*([A-Za-z][A-Za-z ]*):\*\*\s*(.+?)\s*$/gm;
  let m;
  while ((m = re.exec(maskCode(body))) !== null) out[m[1].trim()] = m[2].trim();
  return out;
}

/** 1-indexed line number of a top-level frontmatter key, for finding anchors. */
export function frontmatterKeyLine(raw, key) {
  if (!raw) return 1;
  const idx = raw.split('\n').findIndex((l) => new RegExp(`^${key}\\s*:`).test(l));
  return idx === -1 ? 1 : idx + 2; // +1 for the opening ---, +1 to 1-index
}

/**
 * Body of a `## Section`, up to the next heading of the same level.
 *
 * Written out because the inline version it replaces had two bugs, and both were
 * silent — they returned an empty string rather than failing.
 *
 *   1. `^## Name\s*$` returns nothing when the heading is not followed by a blank
 *      line: `\s*` eats the newline, `$` then fails, and the backtrack leaves the
 *      capture where the lazy quantifier can satisfy it with nothing.
 *   2. `\Z` is not an end-of-string anchor in JavaScript — it is an escaped
 *      literal `Z`. So `(?=^## |\Z)` stopped the lazy capture at the first
 *      capital Z in the text. Both notes that hit this had a Z early in their
 *      definition ("Zero-instrumentation…", "…such as Z-scores"), which is why
 *      it looked like a formatting problem rather than a regex one.
 *
 * `$(?![\s\S])` is the real end-of-string assertion under the `m` flag.
 */
export function section(body, name, level = 2) {
  const h = '#'.repeat(level);
  const re = new RegExp(
    `^${h}\\s+${name}[ \\t]*\\r?\\n([\\s\\S]*?)(?=^${h}\\s|$(?![\\s\\S]))`,
    'm',
  );
  return body.match(re)?.[1]?.trim() ?? '';
}
