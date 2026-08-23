#!/usr/bin/env node
/**
 * P1 migration.
 *
 * This performed the largest write in the project — 482 files — and had no
 * automated test until now; it was validated by reading diffs. The properties
 * worth pinning are the ones that made that diff reviewable in the first place.
 */
import { migrateConcept, migrateDeck } from '../lib/migrate.mjs';
import { splitFrontmatter } from '../lib/md.mjs';
import { parseDeck } from '../lib/cards.mjs';

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const CONCEPT = `---
title: "Agentic SDLC (ASDLC)"
date: 2026-04-14
tags: [concept, ai-agents, sdlc]
status: draft
---

# Agentic SDLC (ASDLC)

## Definition
d

## Sources

- [InfoQ playbook](https://infoq.com/a) — primary
- [Same link again](https://infoq.com/a) — cited twice
- bare https://example.com/b

## See Also
- x
`;

// 1. Surgical insertion. Re-serialising through a YAML emitter rewrote lines it
//    was not asked to touch (quoted titles, flow-style tags), turning a ~700-line
//    insertion into 2835 added / 512 deleted and burying the real change.
{
  const { text, changed } = migrateConcept('agentic-sdlc', CONCEPT);
  check('concept is changed', changed);
  check('quoted title is preserved verbatim', text.includes('title: "Agentic SDLC (ASDLC)"'));
  check('flow-style tags are preserved verbatim', text.includes('tags: [concept, ai-agents, sdlc]'));
  const before = CONCEPT.split('\n');
  const after = new Set(text.split('\n'));
  check('every original line survives', before.every((l) => after.has(l)));
}

// 2. Alias only where it buys something: an alias equal to the filename is noise.
{
  const aliased = splitFrontmatter(migrateConcept('agentic-sdlc', CONCEPT).text).data;
  check('alias added when the title does not slugify to the filename',
    aliased.aliases?.[0] === 'Agentic SDLC (ASDLC)');

  const plain = CONCEPT.replace('"Agentic SDLC (ASDLC)"', '"Agent Handoffs"');
  const noAlias = splitFrontmatter(migrateConcept('agent-handoffs', plain).text).data;
  check('no alias when the title already resolves', !('aliases' in noAlias));
}

// 3. Source extraction: markdown links and bare URLs, deduped, url only —
//    hash/retrieved need the network and belong to P1b.
{
  const s = splitFrontmatter(migrateConcept('agentic-sdlc', CONCEPT).text).data.sources;
  check('markdown link and bare url both extracted', s.length === 2);
  check('repeated url is deduped', s.filter((x) => x.url === 'https://infoq.com/a').length === 1);
  check('no hash is invented offline', s.every((x) => !('hash' in x) && !('retrieved' in x)));
}

// 4. Idempotent — re-running must be a no-op, or a repeat run doubles everything.
{
  const once = migrateConcept('agentic-sdlc', CONCEPT).text;
  check('second run makes no further change', migrateConcept('agentic-sdlc', once).changed === false);
}

const DECK = `---
tags: [flashcards, ai-agents]
sr-due: 2026-04-14
sr-interval: 1
sr-ease: 250
---

# D — Flashcards

## Already Has One <!-- kb:card:aaa111 -->
Q1?
?
A1.
<!--SR:!2026-04-15,1,230-->

## Needs An Id
Q2?
?
A2.

## Prose, not a card
No separator, so not a card.
`;

// 5. Deck migration mints ids and touches nothing else — critically, it must not
//    fabricate review history. Of 1,240 cards in this corpus only 5 had any.
{
  const { text, changed } = migrateDeck('d', DECK, new Set());
  check('deck is changed', changed);
  const cards = parseDeck(text.slice(text.indexOf('\n---\n', 4) + 5)).filter((b) => b.isCard);
  check('both cards now have ids', cards.length === 2 && cards.every((c) => c.id));
  check('existing id is preserved', cards.some((c) => c.id === 'aaa111'));
  check('existing review marker survives', text.includes('<!--SR:!2026-04-15,1,230-->'));
  check('no review marker is invented', (text.match(/<!--SR:/g) ?? []).length === 1);
  check('prose block is not given an id', text.includes('## Prose, not a card\n'));
  check('frontmatter is byte-identical',
    text.slice(0, DECK.indexOf('\n---\n', 4)) === DECK.slice(0, DECK.indexOf('\n---\n', 4)));
  check('deck migration is idempotent', migrateDeck('d', text, new Set()).changed === false);
}

// 6. Ids are globally unique — a collision would let a refresh overwrite the
//    wrong card in a different deck.
{
  const taken = new Set();
  migrateDeck('d', DECK, taken);
  const before = taken.size;
  migrateDeck('other-deck', DECK.replace('# D —', '# Other —'), taken);
  check('a second deck mints distinct ids', taken.size > before);
}

if (failures.length) {
  console.error('MIGRATE TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('migrate test passed — surgical, idempotent, invents no review history');
