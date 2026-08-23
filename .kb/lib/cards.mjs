/**
 * Flashcard deck parsing.
 *
 * A deck is `## Heading` blocks; a block is a *card* only if it contains a lone
 * `?` separator (question above, answer below). Blocks without one are prose,
 * not cards.
 *
 * Two distinct pieces of spaced-repetition state live in these files and must
 * not be confused:
 *
 *   - frontmatter `sr-due` / `sr-interval` / `sr-ease` — the plugin's *note*
 *     review schedule, one per file.
 *   - inline `<!--SR:!date,interval,ease-->` — the plugin's *card* review
 *     schedule, written only once a card has actually been reviewed.
 *
 * Absence of an inline marker is meaningful: that card is new. Across this
 * corpus 1,240 cards exist and 5 carry review history, so synthesising markers
 * would fabricate history for 1,235 cards. Nothing here writes them.
 */
import crypto from 'node:crypto';

const CARD_ID_RE = /<!--\s*kb:card:([0-9a-f]{6,})\s*-->/;
const SR_RE = /<!--\s*SR:.*?-->/;

/** Parse a deck body into blocks, marking which are cards. */
export function parseDeck(body) {
  const lines = body.split('\n');
  const blocks = [];
  let current = null;

  lines.forEach((line, i) => {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      if (current) blocks.push(current);
      const headingText = h[1].replace(CARD_ID_RE, '').trim();
      current = { headingLine: i, heading: headingText, id: line.match(CARD_ID_RE)?.[1] ?? null, lines: [] };
    } else if (current) {
      current.lines.push({ text: line, index: i });
    }
  });
  if (current) blocks.push(current);

  for (const b of blocks) {
    const sep = b.lines.findIndex((l) => l.text.trim() === '?');
    b.isCard = sep !== -1;
    if (b.isCard) {
      b.question = b.lines.slice(0, sep).map((l) => l.text).join('\n').trim();
      b.answer = b.lines
        .slice(sep + 1)
        .map((l) => l.text)
        .join('\n')
        .replace(SR_RE, '')
        .trim();
      b.hasReviewHistory = b.lines.some((l) => SR_RE.test(l.text));
    }
  }
  return blocks;
}

/**
 * Mint a card id. Derived from content so the migration is reproducible and
 * reviewable, but treated as opaque afterwards: once written, an id is carried
 * forward verbatim through rewordings. That is the whole point — refresh has to
 * match on identity, and the heading is prose that changes.
 */
export function mintId(slug, heading, question, salt = 0) {
  const h = crypto.createHash('sha256');
  h.update(`${slug}\0${heading}\0${question}\0${salt}`);
  return h.digest('hex').slice(0, 6);
}

/** Add ` <!-- kb:card:xxx -->` to a heading line, preserving everything else. */
export function withId(headingLine, id) {
  return `${headingLine.replace(/\s+$/, '')} <!-- kb:card:${id} -->`;
}

export { CARD_ID_RE };

// ------------------------------------------------------------ rendering (P4)

/** Line span of each block, so a refresh can splice one card without touching others. */
function spans(blocks, totalLines) {
  return blocks.map((b, i) => ({
    ...b,
    start: b.headingLine,
    end: i + 1 < blocks.length ? blocks[i + 1].headingLine - 1 : totalLines - 1,
  }));
}

/** Render one card. `sr` is the existing review marker, carried through verbatim. */
export function renderCard({ heading, id, question, answer }, sr) {
  return [
    `## ${heading} <!-- kb:card:${id} -->`,
    question.trim(),
    '?',
    answer.trim(),
    ...(sr ? [sr] : []),
    '',
  ];
}

/** A fresh deck for a concept that has none. */
export function renderDeck({ slug, title, tags, deckTag, cards, today }) {
  const head = [
    '---',
    `tags: [flashcards, ${tags.join(', ')}]`,
    `sr-due: ${today}`,
    'sr-interval: 1',
    'sr-ease: 250',
    '---',
    '',
    `# ${title} — Flashcards`,
    '',
    `#flashcards/${deckTag}`,
    '',
  ];
  const body = cards.flatMap((c) => renderCard({ ...c, id: c.id ?? mintId(slug, c.heading, c.question) }, null));
  return head.concat(body).join('\n').replace(/\n+$/, '\n');
}

/**
 * Merge drafted cards into an existing deck.
 *
 * Only the blocks named in the draft are rewritten. Frontmatter, the header, and
 * every untouched card keep their exact bytes — the same discipline the P1
 * migration needed, for the same reason: churn buries the real change.
 *
 * Cards present in the deck but absent from the draft are never removed. That
 * is POLICY, and it is also the honest default: a model omitting a card is not
 * evidence the card is wrong.
 */
export function mergeDeck(slug, text, draftCards, globalIds) {
  const fmEnd = text.indexOf('\n---\n', 4);
  const head = text.slice(0, fmEnd + 5);
  const body = text.slice(fmEnd + 5);
  const lines = body.split('\n');
  const blocks = spans(parseDeck(body), lines.length);
  const byId = new Map(blocks.filter((b) => b.isCard && b.id).map((b) => [b.id, b]));

  const notes = { updated: [], added: [], scheduleReset: [], unknownId: [], untouched: [] };
  const replacements = new Map();

  for (const card of draftCards) {
    if (card.id) {
      const block = byId.get(card.id);
      if (!block) { notes.unknownId.push(card.id); continue; }

      // Carry the review marker through unless the card now asks something
      // different, in which case its history no longer describes it.
      const sr = card.semantic_change
        ? null
        : lines.slice(block.start, block.end + 1).find((l) => SR_RE.test(l))?.match(SR_RE)?.[0] ?? null;

      replacements.set(block.start, { end: block.end, lines: renderCard({ ...card, id: card.id }, sr) });
      notes.updated.push(card.id);
      if (card.semantic_change && block.hasReviewHistory) notes.scheduleReset.push(card.id);
    } else {
      let salt = 0;
      let id = mintId(slug, card.heading, card.question);
      while (globalIds.has(id)) id = mintId(slug, card.heading, card.question, ++salt);
      globalIds.add(id);
      notes.added.push(id);
      card._mintedId = id;
    }
  }

  const draftIds = new Set(draftCards.filter((c) => c.id).map((c) => c.id));
  notes.untouched = blocks.filter((b) => b.isCard && b.id && !draftIds.has(b.id)).map((b) => b.id);

  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const repl = replacements.get(i);
    if (repl) { out.push(...repl.lines); i = repl.end; continue; }
    out.push(lines[i]);
  }

  const appended = draftCards.filter((c) => c._mintedId).flatMap((c) => renderCard({ ...c, id: c._mintedId }, null));
  const merged = head + out.join('\n').replace(/\n+$/, '\n') + (appended.length ? '\n' + appended.join('\n') : '');
  return { text: merged.replace(/\n+$/, '\n'), notes };
}
