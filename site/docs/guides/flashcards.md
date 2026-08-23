# Flashcards

The learning extension: spaced-repetition decks generated from concepts, for the humans on the team. Optional by design — nothing in the core loop depends on it.

```console
$ kb cards <slug>                          # emits the drafting task
$ kb cards <slug> --draft c.json --apply   # create or refresh the deck
```

## Review history survives rewording

Every card carries a stable id (`<!-- kb:card:… -->`). On refresh, keeping a card's id **preserves its review history** through wording fixes; set `semantic_change: true` only when the card now asks a *different* question — that resets scheduling, deliberately. Cards you omit are left untouched; cards are never deleted automatically.

Decks are Obsidian-compatible (inline `<!--SR:-->` scheduling states), and card identity is enforced corpus-wide by the gate (KB009/KB010) — no duplicate ids, ever.
