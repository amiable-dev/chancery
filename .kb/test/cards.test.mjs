#!/usr/bin/env node
/**
 * Deck merge.
 *
 * This is the operation P1's card ids exist for. Before them, refresh matched
 * on heading prose — which a refresh rewrites — so it would duplicate or orphan
 * cards. The properties worth pinning are about what refresh must NOT do:
 * lose review history, delete an omitted card, or disturb a card it was not
 * asked to touch.
 */
import { mergeDeck, parseDeck } from '../lib/cards.mjs';

const SR = '<!--SR:!2026-04-15,1,230-->';
const DECK = `---
tags: [flashcards, ai-agents]
sr-due: 2026-04-14
sr-interval: 1
sr-ease: 250
---

# Deck — Flashcards

#flashcards/ai-agents

## Reviewed Card <!-- kb:card:aaa111 -->
Original question?
?
Original answer.
${SR}

## Untouched Card <!-- kb:card:bbb222 -->
Leave me exactly as I am.
?
Including this answer, byte for byte.

## Prose, not a card
No separator here, so it is not a card.
`;

const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };
const cardsOf = (text) => parseDeck(text.slice(text.indexOf('\n---\n', 4) + 5)).filter((b) => b.isCard);

// 1. A wording fix keeps the review schedule — that is the entire point of ids.
{
  const { text, notes } = mergeDeck('deck', DECK,
    [{ id: 'aaa111', heading: 'Reviewed Card', question: 'Reworded question?', answer: 'Original answer.' }], new Set());
  check('wording fix preserves review history', text.includes(SR));
  check('wording fix applies the new question', text.includes('Reworded question?'));
  check('wording fix reports no schedule reset', notes.scheduleReset.length === 0);
}

// 2. A semantic change drops it — the history described a different question.
{
  const { text, notes } = mergeDeck('deck', DECK,
    [{ id: 'aaa111', heading: 'Reviewed Card', question: 'A genuinely different question?', answer: 'New answer.', semantic_change: true }], new Set());
  check('semantic change drops review history', !text.includes(SR));
  check('semantic change is reported', notes.scheduleReset.includes('aaa111'));
}

// 3. Omitting a card leaves it alone. A model not mentioning a card is not
//    evidence the card is wrong, and POLICY forbids automated deletion.
{
  const { text, notes } = mergeDeck('deck', DECK,
    [{ id: 'aaa111', heading: 'Reviewed Card', question: 'Reworded?', answer: 'Same.' }], new Set());
  check('omitted card is not deleted', text.includes('bbb222'));
  check('omitted card keeps its exact bytes', text.includes('Including this answer, byte for byte.'));
  check('omitted card is reported as untouched', notes.untouched.includes('bbb222'));
  check('prose block survives the merge', text.includes('## Prose, not a card'));
}

// 4. A new card is appended with a minted id; an id already in use is avoided.
{
  const { text, notes } = mergeDeck('deck', DECK,
    [{ heading: 'Brand New', question: 'A new question entirely?', answer: 'A new answer.' }], new Set(['aaa111', 'bbb222']));
  const ids = cardsOf(text).map((c) => c.id);
  check('new card is appended', ids.length === 3);
  check('minted id is unique', new Set(ids).size === 3);
  check('new card is reported as added', notes.added.length === 1);
}

// 5. An unknown id means the draft was written against a stale read. Refuse
//    rather than silently creating a card the model thought already existed.
{
  const { notes } = mergeDeck('deck', DECK,
    [{ id: 'ffffff', heading: 'Ghost', question: 'Does this exist?', answer: 'No.' }], new Set());
  check('unknown id is reported', notes.unknownId.includes('ffffff'));
  check('unknown id does not become a new card', notes.added.length === 0);
}

// 6. Frontmatter is never touched by a merge.
{
  const { text } = mergeDeck('deck', DECK,
    [{ id: 'aaa111', heading: 'Reviewed Card', question: 'Reworded?', answer: 'Same.' }], new Set());
  check('frontmatter is byte-identical', text.slice(0, DECK.indexOf('\n---\n', 4)) === DECK.slice(0, DECK.indexOf('\n---\n', 4)));
}

if (failures.length) {
  console.error('CARDS TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('cards test passed — refresh preserves history, never deletes, never disturbs untouched cards');
