#!/usr/bin/env node
/**
 * MCP facade acceptance (design/mcp-facade.md): protocol handshake with the
 * minimum-revision refusal, six tools listed, kb_search/kb_context byte-parity
 * with the CLI, the full propose→task→submit round-trip landing canon THROUGH
 * the gate (C6 record present, post-verify ran), and refusals surfacing with
 * the CLI's own codes.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderConcept } from '../lib/promote.mjs';

const KB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(KB_DIR, 'bin', 'kb.mjs');
const SERVER = path.join(KB_DIR, 'bin', 'kb-mcp.mjs');
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-mcp-'));
for (const d of ['concepts', 'staging', 'flashcards']) fs.mkdirSync(path.join(fixture, d), { recursive: true });
fs.writeFileSync(path.join(fixture, 'concepts', 'anchor-note.md'), renderConcept({
  slug: 'anchor-note', title: 'Anchor Note', tags: ['testing'],
  definition: 'A fixture definition long enough to satisfy the schema for retrieval.',
  explanation: 'An explanation long enough to satisfy the schema requirements.',
  key_properties: ['one', 'two'],
  relationships: [{ target: 'peer', clause: 'relates for a stated fixture reason' }],
  applications: 'Exercises the MCP suite.', see_also: ['peer'],
}, { sourceUrl: null, today: '2026-08-22' }));
execFileSync('node', [CLI, 'index'], { env: { ...process.env, KB_ROOT: fixture }, stdio: 'ignore' });

const cliRun = (args) => {
  try {
    return execFileSync('node', [CLI, ...args, '--format', 'json'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, KB_ROOT: fixture },
    });
  } catch (e) { return e.stdout ?? ''; }
};

// ---- speak JSON-RPC to the server over stdio ----
const server = spawn('node', [SERVER], { env: { ...process.env, KB_ROOT: fixture }, stdio: ['pipe', 'pipe', 'inherit'] });
let buffer = '';
const pending = new Map();
server.stdout.on('data', (d) => {
  buffer += d;
  let idx;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx); buffer = buffer.slice(idx + 1);
    if (!line.trim()) continue;
    const msg = JSON.parse(line);
    pending.get(msg.id)?.(msg);
    pending.delete(msg.id);
  }
});
let nextId = 1;
const rpc = (method, params) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, resolve);
  server.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
  setTimeout(() => { if (pending.has(id)) { pending.delete(id); reject(new Error(`rpc timeout: ${method}`)); } }, 30_000);
});
const call = async (name, args) => {
  const res = await rpc('tools/call', { name, arguments: args });
  return { text: res.result?.content?.[0]?.text ?? '', isError: res.result?.isError, raw: res };
};

try {
  // handshake: too-old revision refused, supported accepted
  const old = await rpc('initialize', { protocolVersion: '2024-11-05' });
  check('pre-stateless protocol refused', old.error && /unsupported/.test(old.error.message));
  const init = await rpc('initialize', { protocolVersion: '2025-06-18' });
  check('initialize succeeds', init.result?.serverInfo?.name === 'kb-mcp');

  const list = await rpc('tools/list', {});
  check('exactly six tools', list.result?.tools?.length === 6);

  // byte parity: kb_search ≡ CLI query phase-1; kb_context ≡ CLI context
  const viaMcp = await call('kb_search', { query: 'fixture definition anchor' });
  const viaCli = cliRun(['query', 'fixture definition anchor']);
  check('kb_search is byte-identical to CLI phase-1', viaMcp.text === viaCli);
  const ctxMcp = await call('kb_context', { for: 'promote-review', slug: 'anchor-note' });
  const ctxCli = cliRun(['context', '--for', 'promote-review', 'anchor-note']);
  check('kb_context is byte-identical to CLI', ctxMcp.text === ctxCli);

  // kb_read: flag + slug validation
  const read = JSON.parse((await call('kb_read', { slug: 'anchor-note' })).text);
  check('kb_read returns the note', read.ok && read.text.includes('Anchor Note') && read.superseded === false);
  const trav = JSON.parse((await call('kb_read', { slug: '../etc/passwd' })).text);
  check('kb_read refuses non-slug input', trav.ok === false);

  // round-trip INSIDE the gate: propose → assess task → submit → promote task → submit
  const prop = JSON.parse((await call('kb_propose', { kind: 'staging-draft', payload: {
    slug: 'mcp-born', title: 'MCP Born',
    markdown: 'A candidate staged through the facade, long enough to assess on its merits.',
  } })).text);
  check('kb_propose stages (W1)', prop.ok && fs.existsSync(path.join(fixture, 'staging', 'mcp-born.md')));
  check('the proposal records its origin', fs.readFileSync(path.join(fixture, 'staging', 'mcp-born.md'), 'utf8').includes('mcp kb_propose'));

  const task = JSON.parse((await call('kb_task', { verb: 'assess', args: { target: 'staging/mcp-born.md' } })).text);
  check('kb_task emits an envelope', /^[0-9a-f]{16}$/.test(task.envelope?.task_id));

  const verdict = {
    task_id: task.envelope.task_id, rubric: 'promotion@1', target: 'staging/mcp-born.md',
    supplier: { class: 'model-single', id: 'mcp-fixture' },
    disqualifiers: {
      'pure-announcement': { triggered: false, rationale: 'f' },
      duplicate: { triggered: false, rationale: 'f' },
      unfalsifiable: { triggered: false, rationale: 'f' },
    },
    dimensions: {
      durability: { rating: 'strong', rationale: 'f' },
      actionability: { rating: 'strong', rationale: 'f' },
      atomicity: { rating: 'strong', rationale: 'f' },
    },
  };
  const submitted = JSON.parse((await call('kb_submit', { verb: 'assess', target: 'staging/mcp-born.md', answer: verdict })).text);
  check('kb_submit applies the verdict through the gate', submitted.ok === true);

  const replay = JSON.parse((await call('kb_submit', { verb: 'assess', target: 'staging/mcp-born.md', answer: verdict })).text);
  check('replay refused with the CLI code (KB022.4)', replay.ok === false && replay.error?.code === 'KB022.4');

  const pTask = JSON.parse((await call('kb_task', { verb: 'promote', args: { slug: 'mcp-born' } })).text);
  const draft = {
    task_id: pTask.envelope.task_id,
    supplier: { class: 'model-single', id: 'mcp-fixture' }, proposer_overlap: 'unknown',
    concepts: [{
      slug: 'mcp-born', title: 'MCP Born', tags: ['testing'],
      definition: 'A drafted definition long enough to satisfy the schema requirements.',
      explanation: 'A drafted explanation long enough to satisfy the schema rules.',
      key_properties: ['alpha', 'beta'],
      relationships: [{ target: 'anchor-note', clause: 'relates for a drafted reason' }],
      applications: 'Applied in the MCP fixture.', see_also: ['anchor-note'],
    }],
  };
  const promoted = JSON.parse((await call('kb_submit', { verb: 'promote', target: 'mcp-born', answer: draft })).text);
  check('promotion lands canon through the gate', promoted.ok === true
    && fs.existsSync(path.join(fixture, 'concepts', 'mcp-born.md')));
  const c6 = JSON.parse(fs.readFileSync(path.join(fixture, '.kb', 'assessments', 'tasks', `${pTask.envelope.task_id}.json`), 'utf8'));
  check('the C6 record closed with attestation', c6.status === 'applied' && c6.supplier.class === 'model-single');

  // stale refusal surfaces identically: mutate the staging input under a fresh task
  fs.appendFileSync(path.join(fixture, 'staging', 'mcp-born.md'), '\nEdited under the task.\n');
  const stTask = JSON.parse((await call('kb_task', { verb: 'assess', args: { target: 'staging/mcp-born.md' } })).text);
  fs.appendFileSync(path.join(fixture, 'staging', 'mcp-born.md'), '\nEdited again after emission.\n');
  const stale = JSON.parse((await call('kb_submit', { verb: 'assess', target: 'staging/mcp-born.md', answer: { ...verdict, task_id: stTask.envelope.task_id } })).text);
  check('stale inputs refused with the CLI code (KB022.2)', stale.ok === false && stale.error?.code === 'KB022.2');

  // queue-proposal kind
  const qp = JSON.parse((await call('kb_propose', { kind: 'queue-proposal', payload: {
    kind: 'facet', subject: 'mcp-born', value: 'topic:mcp-facade', rationale: 'fixture',
  } })).text);
  check('queue proposals file through the engine module', qp.ok === true);
} catch (e) {
  failures.push(`harness error: ${e.message}`);
} finally {
  server.kill();
  fs.rmSync(fixture, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`mcp test FAILED:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('mcp test passed — handshake, six tools, byte parity, gated round-trip, CLI-identical refusals');
}
