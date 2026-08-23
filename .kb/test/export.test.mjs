#!/usr/bin/env node
/**
 * Docusaurus export.
 *
 * The vault is the source of truth and this is a transform, so the properties
 * worth pinning are the three places Obsidian and Docusaurus genuinely disagree.
 */
import { stringify as stringifyYaml } from 'yaml';
import { rewriteLinks, docFrontmatter, transformNote } from '../lib/export-docusaurus.mjs';

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };
const known = new Set(['target-note', 'other']);
const titleOf = (s) => ({ 'target-note': 'Target Note' })[s];

// 1. Wikilinks become relative .md links; the alias wins over the title.
check('bare wikilink uses the target title',
  rewriteLinks('see [[target-note]] here', known, titleOf) === 'see [Target Note](./target-note.md) here');
check('aliased wikilink keeps its alias',
  rewriteLinks('see [[target-note|My Words]]', known, titleOf) === 'see [My Words](./target-note.md)');
check('table-escaped alias pipe is handled',
  rewriteLinks('| [[target-note\\|Label]] |', known, titleOf) === '| [Label](./target-note.md) |');

// 2. An unresolved link degrades to plain text rather than a dead link — the
//    vault keeps the wikilink, the site simply cannot point at nothing.
check('unresolved link becomes plain text',
  rewriteLinks('see [[no-such-note]] here', known, titleOf) === 'see no-such-note here');
check('unresolved aliased link keeps the alias text',
  rewriteLinks('[[no-such|Some Words]]', known, titleOf) === 'Some Words');

// 3. Links inside code are never rewritten — same guarantee as the link checker.
check('inline code is untouched',
  rewriteLinks('use `[[target-note]]` syntax', known, titleOf) === 'use `[[target-note]]` syntax');
check('fenced code is untouched',
  rewriteLinks('```\n[[target-note]]\n```', known, titleOf).includes('[[target-note]]'));

// 4. Frontmatter: facet scalars carry over for filtering, their mirrored nested
//    tags do not — on the site those would only become stray tag permalinks.
{
  const fm = docFrontmatter('x', {
    title: 'X', tags: ['concept', 'mcp', 'domain/security', 'topic/mcp', 'maturity/emerging'],
    domain: 'security', maturity: 'emerging', source_type: 'research', date: '2026-08-21',
  });
  check('mirrored facet tags are stripped', !fm.tags.some((t) => t.includes('/')));
  check('the `concept` marker tag is stripped', !fm.tags.includes('concept'));
  check('real tags survive', fm.tags.includes('mcp'));
  check('facet scalars carry over', fm.domain === 'security' && fm.source_type === 'research');
  check('id and sidebar_label are set', fm.id === 'x' && fm.sidebar_label === 'X');
}

// 5. The H1 is dropped — Docusaurus renders the title from frontmatter, so
//    keeping it would show the heading twice.
{
  const out = transformNote('x', '---\ntitle: "X"\ntags: [concept]\n---\n\n# X\n\n## Definition\nBody.\n', known, titleOf, stringifyYaml);
  check('body H1 removed', !/^# X$/m.test(out.split('---').slice(2).join('---')));
  check('section heading kept', out.includes('## Definition'));
}

if (failures.length) {
  console.error('EXPORT TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('export test passed — links, facets and headings translate; code stays untouched');
