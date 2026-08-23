#!/usr/bin/env node
/**
 * Harness adapters.
 *
 * These are the original deliverable — skills usable from Claude Code, Copilot,
 * Windsurf and Devin — and each surface has a constraint that makes the file
 * inert or rejected if broken. Those constraints are what this pins.
 */
import { loadProcedures, render } from '../bin/install-knowledge.mjs';
import { parse as parseYaml } from 'yaml';

const procs = loadProcedures();
const files = render(procs);
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };
const fm = (text) => parseYaml(text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)[1]);

check('procedures were found', procs.length >= 5);
check('every procedure declares name, description and verb',
  procs.every((p) => p.name && p.description && p.verb));

// Claude Code / Devin / Windsurf skills: exceeding the six spec fields is a hard
// error on claude.ai and the Skills API, not a warning.
const SPEC = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
for (const [rel, text] of Object.entries(files)) {
  if (!rel.endsWith('SKILL.md')) continue;
  const keys = Object.keys(fm(text));
  check(`${rel}: frontmatter stays within the six spec fields`, keys.every((k) => SPEC.has(k)));
  check(`${rel}: has a description`, !!fm(text).description);
}

// Copilot: applyTo is required — without it the instructions file is inert.
for (const [rel, text] of Object.entries(files)) {
  if (!rel.includes('.instructions.md')) continue;
  check(`${rel}: applyTo present`, !!fm(text).applyTo);
}

// Windsurf: 6,000 chars is the tightest documented cap, and a retired combined
// cap may still be enforced silently.
for (const [rel, text] of Object.entries(files)) {
  if (!rel.startsWith('.windsurf/rules/')) continue;
  check(`${rel}: within the 6000-char budget`, text.length <= 6000);
  check(`${rel}: declares a trigger`, !!fm(text).trigger);
}

// Claude Code does not read AGENTS.md; it needs an import.
check('CLAUDE.md imports AGENTS.md', files['CLAUDE.md'].includes('@AGENTS.md'));
check('AGENTS.md is marker-managed', files['AGENTS.md'].includes('BEGIN kb-pipeline'));

// Every surface must carry the policy and the contract, or an agent will treat
// the adapter as the authority instead of CI.
for (const [rel, text] of Object.entries(files)) {
  if (rel === 'CLAUDE.md') continue;
  check(`${rel}: cites the policy or the verify contract`,
    text.includes('.kb/POLICY.md') || text.includes('kb verify'));
}

// Coverage: every skill maps to a real kb verb.
const VERBS = ['ingest', 'assess', 'promote', 'cards', 'facets', 'link', 'verify'];
check('all pipeline verbs have a procedure',
  VERBS.every((v) => procs.some((p) => p.verb.includes(v))));

// Deterministic: rendering twice must be byte-identical, or KB014 would flap.
check('render is deterministic', JSON.stringify(render(procs)) === JSON.stringify(files));

if (failures.length) {
  console.error('ADAPTERS TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log(`adapters test passed — ${Object.keys(files).length} files, per-harness constraints held`);
