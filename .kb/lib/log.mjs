// The log (design/log.md): what was LEARNED, beside what changed. Monthly
// shards under log/, engine-written on canon-mutating applies, with a line
// grammar so consumers can parse and verify can hold lines immutable.
// Enforcement is git-aware (merge-base), so it lives in `kb log check` —
// run by CI beside the hermetic gate, never inside `kb verify` (ADR-002
// forbids the gate reading history).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const shardPath = (root, date) => path.join(root, 'log', `${date.slice(0, 7)}.md`);

const NORMALISE = (s) => s.normalize('NFC').replace(/\r/g, '').replace(/\n/g, ' ').trimEnd();

/** Grammar: `- <verb> <target> → <disposition>[; <rationale>]` under `## <UTC date>`. */
export function formatLine({ verb, target, disposition, rationale }) {
  const head = `- ${verb}${target ? ` ${target}` : ''} → ${disposition}`;
  return NORMALISE(rationale ? `${head}; ${rationale}` : head);
}

/** Append lines under today's day header in this month's shard. */
export function appendLog(root, date, lines) {
  if (!lines.length) return null;
  const file = shardPath(root, date);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const header = `## ${date}`;
  let next = existing;
  if (!existing.trimEnd().split('\n').includes(header)) {
    next = `${existing}${existing && !existing.endsWith('\n') ? '\n' : ''}${existing ? '\n' : ''}${header}\n`;
  } else if (!next.endsWith('\n')) {
    next += '\n';
  }
  next += `${lines.map(NORMALISE).join('\n')}\n`;
  fs.writeFileSync(file, next);
  return path.relative(root, file);
}

const git = (root, args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

/** Is `needle` an in-order subsequence of `haystack`? Merges interleave; base lines must survive verbatim and ordered. */
const isSubsequence = (needle, haystack) => {
  let i = 0;
  for (const line of haystack) if (i < needle.length && line === needle[i]) i++;
  return i === needle.length;
};

const CANON_RE = /^(concepts|flashcards)\/(?!_index\.md)|^\.kb\/(kb\.config\.yaml|schemas\/|facets\.yml|rubrics\/|POLICY\.md|context-anchors\.yml|audit-patterns\.yml)/;

/**
 * The KB019 pair, checked against a base ref:
 * (a) append-only — every log line at base survives, unchanged and in order;
 * (b) coupling — a diff touching canon (C1/C2) adds at least one log line.
 * Returns { findings, degraded } — degraded=true when no base resolves
 * (shallow clone, no remote): the check warns rather than lying.
 */
export function checkLog(root, baseRef) {
  const findings = [];
  let base = baseRef;
  if (!base) {
    try { base = git(root, ['merge-base', 'HEAD', 'origin/HEAD']).trim(); }
    catch {
      try { base = git(root, ['merge-base', 'HEAD', 'origin/main']).trim(); }
      catch { return { findings, degraded: true }; }
    }
  }

  let baseShards = [];
  try {
    baseShards = git(root, ['ls-tree', '-r', '--name-only', base, 'log/']).trim().split('\n').filter(Boolean);
  } catch { /* no log/ at base */ }

  for (const shard of baseShards) {
    let baseText = '';
    try { baseText = git(root, ['show', `${base}:${shard}`]); } catch { baseText = ''; }
    const abs = path.join(root, shard);
    const headText = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    if (headText === null) {
      findings.push({ code: 'KB019', message: `log shard deleted: ${shard}`, remedy: 'log shards are append-only; restore it' });
      continue;
    }
    const baseLines = baseText.split('\n').filter((l) => l.trim());
    const headLines = headText.split('\n').filter((l) => l.trim());
    if (!isSubsequence(baseLines, headLines)) {
      findings.push({
        code: 'KB019', message: `log shard ${shard} lost or mutated lines present at ${base.slice(0, 8)}`,
        remedy: 'existing log lines never change; new lines only append',
      });
    }
  }

  let diff = [];
  try {
    diff = git(root, ['diff', '--name-status', `${base}...HEAD`]).trim().split('\n').filter(Boolean)
      .map((l) => { const [status, ...p] = l.split('\t'); return { status: status[0], path: p[p.length - 1] }; });
  } catch { return { findings, degraded: true }; }

  const canonTouched = diff.filter((d) => CANON_RE.test(d.path));
  const logAdded = diff.some((d) => d.path.startsWith('log/') && (d.status === 'A' || d.status === 'M'));
  if (canonTouched.length && !logAdded) {
    findings.push({
      code: 'KB019',
      message: `canon-mutating diff (${canonTouched.length} file(s)) carries no log line`,
      remedy: 'gated applies write their own lines; hand edits add one via `kb log note "<what changed and why>"`',
    });
  }
  return { findings, degraded: false };
}
