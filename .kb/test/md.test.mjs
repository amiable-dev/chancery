#!/usr/bin/env node
/**
 * Markdown primitives — regression tests for two silent extraction bugs.
 *
 * Both returned an empty string rather than throwing, so they surfaced as
 * "this note has no definition" and were nearly written off as a content
 * problem. Empty-on-failure is the dangerous shape: it looks like data.
 */
import { section, maskCode, wikilinks } from '../lib/md.mjs';

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

// Bug 1: no blank line after the heading.
check('heading followed by a blank line',
  section('## Definition\n\nThe body text.\n\n## Next', 'Definition') === 'The body text.');
check('heading with NO blank line after it',
  section('## Definition\nThe body text.\n\n## Next', 'Definition') === 'The body text.');

// Bug 2: `\Z` is a literal Z in JavaScript, not an end-of-string anchor, so a
// capital Z early in the body used to truncate the capture to nothing.
check('body starting with a capital Z',
  section('## Definition\nZero-instrumentation is a pattern.\n\n## Next', 'Definition')
    === 'Zero-instrumentation is a pattern.');
check('capital Z mid-body',
  section('## Definition\nMeasures such as Z-scores apply.\n\n## Next', 'Definition')
    === 'Measures such as Z-scores apply.');
check('capital Z with no following heading (end of string)',
  section('## Definition\nZebra.', 'Definition') === 'Zebra.');

// Boundaries
check('stops at the next same-level heading',
  section('## A\nfirst\n\n## B\nsecond', 'A') === 'first');
check('a deeper heading does not terminate the section',
  section('## A\nfirst\n\n### Sub\nmore\n\n## B\nx', 'A') === 'first\n\n### Sub\nmore');
check('missing section returns empty', section('## Other\nx', 'Definition') === '');

// Code masking still holds (the ~110-link over-report guard).
check('fenced code is masked', !maskCode('```\n[[x]]\n```').includes('[[x]]'));
check('inline code is masked', !maskCode('a `[[x]]` b').includes('[[x]]'));
check('real link survives masking', wikilinks('see [[real]] and `[[fake]]`').map((l) => l.target).join() === 'real');

// The `yaml` parser rejects duplicate keys rather than silently keeping the
// last — worth pinning, because assuming the opposite led to a redundant check.
{
  const { splitFrontmatter } = await import('../lib/md.mjs');
  const dup = splitFrontmatter('---\ntitle: A\ntitle: B\n---\nbody\n');
  check('duplicate frontmatter keys are a parse error, not a silent overwrite',
    dup.data === undefined && /unique/i.test(dup.error ?? ''));
}

if (failures.length) {
  console.error('MD TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('md test passed — section extraction survives missing blank lines and stray capital Zs');
