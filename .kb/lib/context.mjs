// The context compiler (design/context-compiler.md): deterministic assembly
// of exactly the context a task needs. No clock reading anywhere; the bundle
// embeds the index hash and refuses to compile against a stale index; the
// single tail section holds every run-variant field so the prefix is
// byte-stable across budgets.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse as parseYaml } from 'yaml';
import { splitFrontmatter, wikilinks, targetSlug, section } from './md.mjs';

export const BUNDLE_SCHEMA_VERSION = '1';

export const TASKS = {
  'cards-refresh': { args: ['slug'], schema: 'card-draft.schema.json' },
  'promote-review': { args: ['slug'], schema: 'concept-draft.schema.json' },
  'audit-pair': { args: ['slugA', 'slugB'], schema: 'audit-finding.schema.json' },
  'research-brief': { args: ['query'], schema: 'query-answer.schema.json' },
  'query-answer': { args: ['query'], schema: 'query-answer.schema.json' },
};

export function loadAnchors(kbDir) {
  return parseYaml(fs.readFileSync(path.join(kbDir, 'context-anchors.yml'), 'utf8'));
}

/** Resolve one anchor to its text; null when the file or heading is missing (KB020). */
export function resolveAnchor(root, kbDir, anchor) {
  const abs = path.isAbsolute(anchor.file) ? anchor.file : path.join(anchor.file.startsWith('.kb/') ? kbDir : root, anchor.file.replace(/^\.kb\//, ''));
  if (!fs.existsSync(abs)) return null;
  const text = fs.readFileSync(abs, 'utf8');
  if (anchor.heading == null) return text;
  const body = splitFrontmatter(text).body ?? text;
  const sec = section(body, anchor.heading);
  return sec.trim() ? `## ${anchor.heading}\n${sec}` : null;
}

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

/**
 * Compile. `targets` are loaded notes ({slug,title,data,body,text,file});
 * `edges` are pre-ranked (score desc, codepoint slug — the caller pins the
 * order); `artifacts` are named strings. Returns { bundle } or { error }.
 */
export function compile({ task, targets, policy, edges, artifacts, schemaName, schemaTextValue, budget }) {
  const sections = {
    schema_version: BUNDLE_SCHEMA_VERSION,
    task,
    targets: targets.map((t) => ({ slug: t.slug, title: t.title, file: t.file, text: t.text })),
    policy,
    edges,
    artifacts,
    response_schema: { name: schemaName, schema: JSON.parse(schemaTextValue) },
  };

  const size = (v) => JSON.stringify(v).length;
  const floor = size(sections.targets) + size(sections.response_schema);
  const trims = [];

  if (budget != null) {
    if (floor > budget) {
      return { error: { code: 'CONTEXT_BUDGET_FLOOR', message: `target note(s) + response schema need ${floor} chars; budget is ${budget}`, remedy: `raise --budget to at least ${floor}` } };
    }
    // Trim whole items, lowest priority class first: artifacts, then edges,
    // then policy. Targets and the schema are the floor and never trim.
    const classes = [
      ['artifacts', sections.artifacts, (i) => i.name],
      ['edges', sections.edges, (i) => i.slug],
      ['policy', sections.policy, (i) => `${i.file}#${i.heading ?? ''}`],
    ];
    const total = () => size(sections.targets) + size(sections.response_schema)
      + size(sections.policy) + size(sections.edges) + size(sections.artifacts);
    for (const [name, arr, label] of classes) {
      while (arr.length && total() > budget) {
        const dropped = arr.pop();
        trims.push({ class: name, dropped: label(dropped) });
      }
    }
    if (total() > budget) {
      return { error: { code: 'CONTEXT_BUDGET_FLOOR', message: `even fully trimmed, the bundle needs ${total()} chars; budget is ${budget}`, remedy: `raise --budget to at least ${total()}` } };
    }
  }

  const bundle_id = sha(JSON.stringify(sections)).slice(0, 16);
  return { bundle: { ...sections, bundle_id, tail: { trims, note: 'run-variant fields live here only; the prefix is byte-stable' } } };
}

/** Rank 1-hop graph edges from a note's Relationships section. */
export function edgesFor(note, allBySlug, scoreOf) {
  const rels = section(note.body, 'Relationships');
  const links = wikilinks(rels).map((w) => targetSlug(w.target)).filter((s) => allBySlug.has(s));
  const uniq = [...new Set(links)].filter((s) => s !== note.slug);
  return uniq
    .map((slug) => {
      const n = allBySlug.get(slug);
      return { slug, title: n.title, definition: section(n.body, 'Definition').slice(0, 500), score: scoreOf(slug) };
    })
    .sort((a, b) => (b.score - a.score) || (a.slug < b.slug ? -1 : 1));
}
