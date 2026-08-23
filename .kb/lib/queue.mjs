/**
 * The proposal queue — the third state between "pass" and "block".
 *
 * Hard-blocking an unrecognised value makes an agent pick a wrong-but-permitted
 * one to get past the gate: you gain conformance and lose meaning. Auto-fixing
 * destroys the judgment that produced it. So the model proposes, the CLI
 * records, and a human governs.
 *
 * Entries do not block a write. `kb verify` fails only on proposals left
 * unreviewed past the ageing threshold, which turns drift into a backlog signal
 * with teeth rather than a wall an agent learns to route around.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Kinds are discovered from disk: a hardcoded list silently exempted newer
// proposal kinds (audit, support) from listing and from KB011 ageing.
const QUEUES_OF = (kbDir) => {
  const dir = path.join(kbDir, 'queue');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('-proposals.jsonl')).map((f) => f.replace('-proposals.jsonl', '')).sort();
};

const file = (kbDir, kind) => path.join(kbDir, 'queue', `${kind}-proposals.jsonl`);

function readAll(kbDir, kind) {
  const f = file(kbDir, kind);
  if (!fs.existsSync(f)) return [];
  return fs
    .readFileSync(f, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

function writeAll(kbDir, kind, entries) {
  const f = file(kbDir, kind);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, entries.map((e) => JSON.stringify(e)).join('\n') + (entries.length ? '\n' : ''));
}

/** Append a proposal. Idempotent on (kind, subject, value). */
export function propose(kbDir, kind, { subject, value, rationale, source, today }) {
  const entries = readAll(kbDir, kind);
  const key = `${subject}\0${value}`;
  if (entries.some((e) => e.status === 'open' && `${e.subject}\0${e.value}` === key)) return null;

  const entry = {
    id: crypto.createHash('sha256').update(`${kind}\0${key}`).digest('hex').slice(0, 8),
    kind, subject, value, rationale: rationale ?? null, source: source ?? null,
    status: 'open', opened: today,
  };
  writeAll(kbDir, kind, [...entries, entry]);
  return entry;
}

export function list(kbDir, { kind, status } = {}) {
  const kinds = kind ? [kind] : QUEUES_OF(kbDir);
  return kinds
    .flatMap((k) => readAll(kbDir, k))
    .filter((e) => !status || e.status === status);
}

export function resolve(kbDir, id, status, today, rationale = null) {
  for (const kind of QUEUES_OF(kbDir)) {
    const entries = readAll(kbDir, kind);
    const hit = entries.find((e) => e.id === id);
    if (!hit) continue;
    hit.status = status;
    hit.resolved = today;
    if (rationale) hit.resolution_rationale = rationale;
    writeAll(kbDir, kind, entries);
    return hit;
  }
  return null;
}

/** Open proposals older than `days`. These are what make verify fail. */
export function stale(kbDir, days, today) {
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - days);
  return list(kbDir, { status: 'open' }).filter((e) => new Date(e.opened) < cutoff);
}

export { QUEUES_OF };
