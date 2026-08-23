/**
 * Generates concepts/_index.md.
 *
 * One generator, used both by `kb index` (to write) and `kb verify` (to compare).
 * They cannot drift, which is the point — a hand-edit to the index is a lint
 * failure rather than something that silently survives until the next rebuild.
 *
 * Alias pipes inside table cells must be escaped as `\|` or the cell breaks.
 * That has been the single most common regeneration bug in the predecessor
 * vault, so it lives here in exactly one place.
 */
import fs from 'node:fs';
import path from 'node:path';
import { splitFrontmatter } from './md.mjs';

export function buildIndex(root, collection) {
  const dir = path.join(root, collection.path);
  const exclude = new Set(collection.exclude ?? []);

  const rows = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !exclude.has(f))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const { data } = splitFrontmatter(fs.readFileSync(path.join(dir, f), 'utf8'));
      const tags = (data?.tags ?? []).filter((t) => t !== 'concept');
      return { title: data?.title ?? slug, slug, tags };
    })
    // Codepoint order, NOT localeCompare: ICU collation varies by Node build and
    // platform, and this file is compared byte-for-byte in CI. A locale-sensitive
    // sort here means the index is "stale" on one machine and clean on another.
    .sort((a, b) => {
      const x = a.title.toLowerCase();
      const y = b.title.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });

  const lines = [
    '# Concept Index',
    '',
    'All concept notes in this repo, alphabetical order.',
    '',
    '| Concept | Tags |',
    '|---------|------|',
    ...rows.map((r) => `| [[${r.slug}\\|${r.title.replace(/\\/g, '\\\\').replace(/\|/g, '\\|')}]] | ${r.tags.join(', ')} |`),
  ];

  return lines.join('\n') + '\n';
}
