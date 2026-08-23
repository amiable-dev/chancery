# kb.config.yaml

The collection registry — adding a collection here (plus a schema) is what makes per-collection operations work without new code.

```yaml
version: 1

collections:
  staging:
    path: staging
    frontmatter: markers          # H1 + **Source:** / **Added:** / **Tags:**
    markers: [Source, Added, Tags]
    exclude: [README.md]

  concepts:
    path: concepts
    frontmatter: yaml
    schema: concept.schema.json   # in .kb/schemas/
    sections: [Definition, Explanation, Key Properties, Relationships, Applications, Sources, See Also]
    exclude: [_index.md]

  flashcards:
    path: flashcards
    frontmatter: yaml
    schema: flashcard.schema.json
    cards: true                   # enables card-identity checks (KB009/010)
    derives_from: concepts        # every deck needs a parent concept (KB005)

checks:                            # severity per check family: error | warn
  schema: error
  sections: error
  links: warn                      # an unresolved wikilink is a recorded gap

queue:
  stale_after_days: 14             # KB011 — proposals age into a failure
```

The `version` field participates in every task envelope: a migration that bumps it stales in-flight tasks rather than letting old answers apply against a new ontology.
