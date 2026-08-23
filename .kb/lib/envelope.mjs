// The protocol envelope — task↔answer binding for every judgment verb.
// Spec: docs/design/protocol-envelope.md. This module owns emission, the
// refusal checks (the KB022 family), the write-set guard, and the C6 record
// lifecycle. Records live under <root>/.kb/assessments/tasks/ so content
// fixtures (KB_ROOT) keep their records inside the fixture.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const ENVELOPE_VERSION = '1';

// Task classes and the supplier classes allowed to answer them (spec §3b).
export const TASK_CLASSES = {
  drafting: ['human', 'model-single', 'model-panel'],
  'rubric-ordinal': ['human', 'model-single', 'model-panel'],
  classification: ['human', 'model-single', 'model-panel'],
  'evidence-verdict': ['human', 'model-single'],
  structuring: ['human', 'model-single', 'model-panel'],
};

// Refusal codes: stable, documented in the overview registry as the KB022 family.
export const REFUSALS = {
  UNKNOWN_TASK: { code: 'KB022.1', remedy: 're-emit the task and answer the new emission' },
  STALE_INPUTS: { code: 'KB022.2', remedy: 'inputs changed since emission — re-emit the task' },
  SCHEMA_MISMATCH: { code: 'KB022.3', remedy: 'a migration changed the schema — re-emit the task' },
  REPLAY: { code: 'KB022.4', remedy: 'this task was already applied; emit a fresh task for further changes' },
  WRITE_OUT_OF_SET: { code: 'KB022.5', remedy: 'the answer implies writes outside the declared set — nothing was written' },
  SUPPLIER_CLASS: { code: 'KB022.6', remedy: 'this task class does not accept that supplier class' },
};

const sha = (text) => crypto.createHash('sha256').update(text).digest('hex');

export function hashInputs(inputs) {
  const out = {};
  for (const { name, text } of inputs) out[name] = `sha256:${sha(text)}`;
  return out;
}

function gitHead(root) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null; // content fixtures are not git repos; binding rests on input hashes
  }
}

const recordsDir = (root) => path.join(root, '.kb', 'assessments', 'tasks');
const recordPath = (root, id) => path.join(recordsDir(root), `${id}.json`);

/**
 * Phase 1. Build the envelope, persist the open C6 record, and return the
 * wrapped task for printing. Re-emission with identical inputs reuses the
 * task id and leaves an applied record alone (idempotent emission).
 */
export function emit(root, { verb, taskClass, target, inputs, allowedWrites, schemaVersion, task }) {
  const input_hashes = hashInputs(inputs);
  const idBasis = [
    verb, target ?? '', ENVELOPE_VERSION, schemaVersion,
    ...Object.entries(input_hashes).sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => `${k}=${v}`),
  ].join('\n');
  const task_id = sha(idBasis).slice(0, 16);

  const envelope = {
    task_id,
    verb,
    task_class: taskClass,
    envelope_version: ENVELOPE_VERSION,
    schema_version: schemaVersion,
    corpus_commit: gitHead(root),
    input_hashes,
    allowed_writes: allowedWrites,
    untrusted_payload: true,
  };

  const file = recordPath(root, task_id);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(recordsDir(root), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify({ envelope, status: 'open' }, null, 2)}\n`);
  }
  return { envelope, task };
}

/**
 * Phase 2 gate. Inputs are re-resolved from the names recorded at emission —
 * repo-relative paths read from the tree, logical names ('rubric', 'schema')
 * through the caller's resolver — so a changed, moved, or vanished input
 * refuses the answer. Returns { ok, record, file } or a refusal.
 */
export function check(root, answer, { verb, schemaVersion, resolveInput }) {
  const refuse = (r, message) => ({ ok: false, code: r.code, message, remedy: r.remedy });

  const id = answer?.task_id;
  if (!id || !/^[0-9a-f]{16}$/.test(id)) {
    return refuse(REFUSALS.UNKNOWN_TASK, 'answer carries no task_id (or a malformed one)');
  }
  const file = recordPath(root, id);
  if (!fs.existsSync(file)) return refuse(REFUSALS.UNKNOWN_TASK, `no emitted task ${id}`);
  const record = JSON.parse(fs.readFileSync(file, 'utf8'));
  const env = record.envelope;

  if (env.verb !== verb) {
    return refuse(REFUSALS.UNKNOWN_TASK, `task ${id} was emitted for \`${env.verb}\`, not \`${verb}\``);
  }
  if (record.status === 'applied') return refuse(REFUSALS.REPLAY, `task ${id} was already applied`);
  if (env.schema_version !== schemaVersion) {
    return refuse(REFUSALS.SCHEMA_MISMATCH, `task ${id} was emitted under schema ${env.schema_version}, current is ${schemaVersion}`);
  }

  const resolve = (name) => {
    const special = resolveInput?.(name);
    if (special !== undefined) return special; // null = resolver says gone
    const abs = path.join(root, name);
    return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  };
  const stale = [];
  for (const [name, hash] of Object.entries(env.input_hashes)) {
    const text = resolve(name);
    if (text === null || `sha256:${sha(text)}` !== hash) stale.push(name);
  }
  if (stale.length) {
    return refuse(REFUSALS.STALE_INPUTS, `input(s) changed since emission: ${stale.join(', ')}`);
  }

  const supplierClass = answer.supplier?.class;
  if (supplierClass) {
    const allowed = TASK_CLASSES[env.task_class] ?? [];
    if (!allowed.includes(supplierClass)) {
      return refuse(REFUSALS.SUPPLIER_CLASS, `task class \`${env.task_class}\` does not accept supplier class \`${supplierClass}\``);
    }
  }

  return { ok: true, record, file };
}

/**
 * Write-set guard. Every path the apply intends to touch must match a declared
 * pattern (only `dir/*.ext` and literal forms exist), resolve inside the root,
 * and contain no traversal. Slugs never become paths except through here.
 */
export function guardWrites(env, root, files) {
  const patterns = env.allowed_writes ?? [];
  // A pattern is either a literal repo-relative path or `dir/*.ext` — one
  // wildcard, matching exactly one path segment. Nothing richer exists.
  const matches = (p, file) => {
    if (!p.includes('*')) return file === p;
    const [prefix, suffix] = p.split('*');
    if (!file.startsWith(prefix) || !file.endsWith(suffix)) return false;
    const middle = file.slice(prefix.length, file.length - suffix.length);
    return middle.length > 0 && !middle.includes('/');
  };
  const bad = [];
  for (const file of files) {
    const norm = path.posix.normalize(file.split(path.sep).join('/'));
    const escapes = path.isAbsolute(file) || norm.startsWith('..')
      || !path.resolve(root, norm).startsWith(path.resolve(root) + path.sep);
    if (escapes || !patterns.some((p) => matches(p, norm))) bad.push(norm);
  }
  return bad.length
    ? { ok: false, code: REFUSALS.WRITE_OUT_OF_SET.code, message: `write(s) outside allowed_writes: ${bad.join(', ')}`, remedy: REFUSALS.WRITE_OUT_OF_SET.remedy }
    : { ok: true };
}

/**
 * Close the loop: mark the record applied and store the supplier attestation,
 * decision provenance, answer digest and written set (the C6 audit fields).
 * proposer_overlap defaults to 'unknown' — present on every record by rule.
 */
export function commit(checkResult, { answer, written, decisionProvenance }) {
  const record = checkResult.record;
  record.status = 'applied';
  record.answer_digest = `sha256:${sha(JSON.stringify(answer))}`;
  record.supplier = answer.supplier ?? { class: 'unknown' };
  record.proposer_overlap = answer.proposer_overlap ?? 'unknown';
  record.decision_provenance = decisionProvenance ?? (answer.supplier?.class === 'human' ? 'human' : 'model');
  record.written = written ?? [];
  fs.writeFileSync(checkResult.file, `${JSON.stringify(record, null, 2)}\n`);
  return record;
}

/**
 * Stateless envelope for read-only verbs (query): the id is derived, not
 * stored — the same question against the same corpus re-derives the same id,
 * so an answer binds without a C6 record and nothing accumulates per query.
 */
export function deriveStatelessId({ verb, target, inputs, schemaVersion }) {
  const input_hashes = hashInputs(inputs);
  const basis = [
    verb, target ?? '', ENVELOPE_VERSION, schemaVersion,
    ...Object.entries(input_hashes).sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => `${k}=${v}`),
  ].join('\n');
  return sha(basis).slice(0, 16);
}
