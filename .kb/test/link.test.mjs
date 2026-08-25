#!/usr/bin/env node
/**
 * Cross-linking.
 *
 * The invariant is additive-only: `kb link` may add a relationship bullet, but
 * .kb/POLICY.md forbids rewriting or removing an existing link, and the
 * 2026-07-26 incident that policy exists for was caused by exactly this class of
 * bulk link operation.
 */
import { appendRelationships, linkGraph, oneWay, validateLinkSuggestions } from '../lib/link.mjs';

const NOTE = `---
title: "A"
tags: [concept]
status: draft
---

# A

## Definition
d

## Relationships

- [[existing-target]] — already related for a stated reason

## Applications
Mentions \`[[not-a-link]]\` inside code, which must never count.

## Sources
- s

## See Also
- [[existing-target]]
`;

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

// 1. Additive: a new bullet lands inside Relationships, and the existing one survives.
{
  const { text, added } = appendRelationships(NOTE, [{ target: 'new-target', clause: 'relates for a clearly stated reason' }]);
  check('one bullet added', added === 1);
  check('existing relationship survives', text.includes('[[existing-target]] — already related for a stated reason'));
  check('new bullet is inside Relationships',
    text.indexOf('[[new-target]]') > text.indexOf('## Relationships') &&
    text.indexOf('[[new-target]]') < text.indexOf('## Applications'));
  check('no section is lost', ['## Definition', '## Applications', '## Sources', '## See Also'].every((s) => text.includes(s)));
}

// 2. A target already linked is skipped, not duplicated.
{
  const { added } = appendRelationships(NOTE, [{ target: 'existing-target', clause: 'a second clause for the same target' }]);
  check('duplicate target is skipped', added === 0);
}

// 3. Nothing is ever removed or reworded — the original text is a prefix-preserving
//    subset of the result, line for line.
{
  const { text } = appendRelationships(NOTE, [{ target: 'new-target', clause: 'relates for a clearly stated reason' }]);
  const before = NOTE.split('\n');
  const after = new Set(text.split('\n'));
  check('every original line survives verbatim', before.every((l) => after.has(l)));
}

// 4. Graph counts distinct *sources*, not occurrences, and ignores self-links
//    and links inside code.
{
  const notes = [
    { slug: 'a', text: '[[b]] and again [[b]] and [[a]]' },
    { slug: 'b', text: 'nothing' },
    { slug: 'c', text: 'code only: `[[b]]`' },
  ];
  const g = linkGraph(notes);
  check('repeated link from one source counts once', g.get('b').size === 1);
  check('self-link is excluded', g.get('a').size === 0);
  check('link inside code is ignored', !g.get('b').has('c'));
}

// 5. One-way detection is direction-sensitive.
{
  const pairs = oneWay([
    { slug: 'a', text: '[[b]]' },
    { slug: 'b', text: '[[a]]' },
    { slug: 'c', text: '[[a]]' },
  ]);
  check('reciprocated pair is not flagged', !pairs.some((p) => p.from === 'a' && p.to === 'b'));
  check('one-way link is flagged', pairs.some((p) => p.from === 'c' && p.to === 'a'));
}

if (failures.length) {
  console.error('LINK TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
// ---- D7: suggest-links — model proposals validated, queued, never auto-applied ----
{
  const known = new Set(['alpha', 'beta', 'gamma']);
  const existing = new Map([['alpha', new Set(['beta'])]]); // alpha already links beta
  const v = (links) => validateLinkSuggestions('alpha', links, { known, existing });

  const good = v([{ target: 'gamma', clause: 'shares the seed-expansion mechanism with alpha' }]);
  check('valid suggestion passes', good.findings.length === 0 && good.accepted.length === 1);
  check('unknown target rejected', v([{ target: 'ghost', clause: 'x y z' }]).findings.length > 0);
  check('self-link rejected', v([{ target: 'alpha', clause: 'links to itself somehow' }]).findings.length > 0);
  check('missing clause rejected', v([{ target: 'gamma' }]).findings.length > 0);
  check('bare relatedness clause rejected', v([{ target: 'gamma', clause: 'related to gamma' }]).findings.length > 0);
  const dup = v([{ target: 'beta', clause: 'already linked in the note body today' }]);
  check('already-linked pair skipped with a reason, not accepted',
    dup.accepted.length === 0 && dup.skipped.length === 1 && /already/.test(dup.skipped[0].reason));
  const twice = v([
    { target: 'gamma', clause: 'shares the seed-expansion mechanism with alpha' },
    { target: 'gamma', clause: 'second phrasing of the same pair' }]);
  check('duplicate targets within one submission collapse to one',
    twice.accepted.length === 1 && twice.skipped.length === 1);
}

console.log('link test passed — additive only, no original line is ever lost');
