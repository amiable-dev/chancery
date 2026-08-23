#!/usr/bin/env node
/**
 * Local stdio MCP facade (design/mcp-facade.md; ADR-008 decision 2).
 *
 * A second SURFACE, not a second implementation: every tool call delegates to
 * the CLI as a subprocess, which is what makes byte-parity trivial and means
 * the engine's envelope checks, write-set guard, post-apply verify, rollback,
 * and lock are all the same code on both surfaces. Colocated stdio only —
 * no network listener exists in this build (a bridge is prohibited; ADR-008).
 *
 * Threat model (spec §4): the repo root binds once at startup; slugs resolve
 * through a strict pattern + the engine's index, never path joins; responses
 * and proposals are size-capped; proposals are rate-limited and stamped with
 * their origin; writes are refused on a dirty worktree. Content returned by
 * kb_read is DATA — a note instructing an agent to call kb_propose is the
 * confused-deputy loop; propose-only W1 bounds it, human review of C3/C4 is
 * the backstop.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PKG_KB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(PKG_KB, 'bin', 'kb.mjs');
// Same root discovery as the CLI (which every call delegates to): serve the
// repo the server is started IN; KB_ROOT keeps the fixture contract.
const discoverRoot = () => {
  let d = process.cwd();
  for (;;) {
    if (fs.existsSync(path.join(d, '.kb', 'kb.config.yaml'))) return d;
    const parent = path.dirname(d);
    if (parent === d) return null;
    d = parent;
  }
};
const FOUND_ROOT = discoverRoot();
const ROOT = process.env.KB_ROOT ? path.resolve(process.env.KB_ROOT) : (FOUND_ROOT ?? path.resolve(PKG_KB, '..'));

const MIN_PROTOCOL = '2025-06-18';
const MAX_RESULT = 1024 * 1024;
const MAX_READ = 256 * 1024;
const MAX_PROPOSAL = 256 * 1024;
const RATE_LIMIT = 30; // proposals per minute
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

const proposeTimes = [];

const runCli = (args) => {
  try {
    return { code: 0, out: execFileSync('node', [CLI, ...args, '--format', 'json'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: process.env, cwd: ROOT,
    }) };
  } catch (e) {
    return { code: e.status ?? 1, out: e.stdout ?? JSON.stringify({ ok: false, error: { message: String(e.message).slice(0, 200) } }) };
  }
};

const dirtyWorktree = () => {
  try {
    return execFileSync('git', ['status', '--porcelain', '--untracked-files=no'],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() !== '';
  } catch {
    return false; // not a git repo (fixtures): nothing to protect
  }
};

const err = (message, remedy) => JSON.stringify({ ok: false, error: { message, ...(remedy ? { remedy } : {}) } }, null, 2);

// Phase-2 invocation per verb — the versioned verb registry (spec §Tools).
const SUBMIT = {
  assess: (t, f) => ['assess', t, '--verdict', f],
  promote: (t, f) => ['promote', t, '--draft', f, '--apply'],
  cards: (t, f) => ['cards', t, '--draft', f, '--apply'],
  facets: (t, f) => ['facets', '--draft', f, '--apply'],
  link: (t, f) => ['link', 'suggest', '--draft', f, '--apply'],
  support: (t, f) => ['support', t, '--verdicts', f],
};
const TASK = {
  assess: (a) => ['assess', a.target],
  promote: (a) => ['promote', a.slug],
  cards: (a) => ['cards', a.slug],
  facets: (a) => ['facets', ...(a.sample ? ['--sample', String(a.sample)] : []), ...(a.limit ? ['--limit', String(a.limit)] : [])],
  link: (a) => ['link', 'suggest', ...(a.slug ? ['--slug', a.slug] : []), ...(a.limit ? ['--limit', String(a.limit)] : [])],
  support: (a) => ['support', a.slug, ...(a.limit ? ['--limit', String(a.limit)] : []), ...(a.noFetch ? ['--no-fetch'] : [])],
};

const TOOLS = [
  { name: 'kb_search', description: 'Query the corpus; byte-identical to `kb query` phase-1 JSON (hits + relationship edges + a stateless envelope).',
    inputSchema: { type: 'object', required: ['query'], properties: {
      query: { type: 'string' }, domain: { type: 'string' }, maturity: { type: 'string' }, limit: { type: 'number' } } } },
  { name: 'kb_read', description: 'Read one concept note by slug (resolved through the index, never a path). Superseded notes are flagged.',
    inputSchema: { type: 'object', required: ['slug'], properties: { slug: { type: 'string' } } } },
  { name: 'kb_context', description: 'Compile a deterministic task bundle (`kb context`).',
    inputSchema: { type: 'object', required: ['for'], properties: {
      for: { enum: ['cards-refresh', 'promote-review', 'audit-pair', 'research-brief', 'query-answer'] },
      slug: { type: 'string' }, slugA: { type: 'string' }, slugB: { type: 'string' },
      query: { type: 'string' }, budget: { type: 'number' } } } },
  { name: 'kb_propose', description: 'W1 only: stage material or file a queue proposal. Never writes canon.',
    inputSchema: { type: 'object', required: ['kind', 'payload'], properties: {
      kind: { enum: ['url', 'staging-draft', 'queue-proposal'] }, payload: { type: 'object' } } } },
  { name: 'kb_task', description: 'Phase-1 emission for a judgment verb; returns the envelope-wrapped task.',
    inputSchema: { type: 'object', required: ['verb', 'args'], properties: {
      verb: { enum: Object.keys(TASK) }, args: { type: 'object' } } } },
  { name: 'kb_submit', description: 'Phase-2: the identical gated apply — envelope checks, write-set guard, post-apply verify, rollback.',
    inputSchema: { type: 'object', required: ['verb', 'answer'], properties: {
      verb: { enum: Object.keys(SUBMIT) }, target: { type: 'string' }, answer: { type: 'object' } } } },
];

function callTool(name, args) {
  switch (name) {
    case 'kb_search': {
      const a = ['query', args.query];
      if (args.domain) a.push('--domain', args.domain);
      if (args.maturity) a.push('--maturity', args.maturity);
      if (args.limit) a.push('--limit', String(args.limit));
      return runCli(a).out;
    }
    case 'kb_read': {
      if (!SLUG_RE.test(args.slug ?? '')) return err('slug must match ^[a-z0-9][a-z0-9-]*$');
      const abs = path.join(ROOT, 'concepts', `${args.slug}.md`);
      if (!fs.existsSync(abs)) return err(`no such concept: ${args.slug}`);
      const text = fs.readFileSync(abs, 'utf8');
      if (text.length > MAX_READ) return err(`note exceeds the ${MAX_READ} byte read cap`);
      const superseded = /^status:\s*superseded/m.test(text);
      return JSON.stringify({ ok: true, slug: args.slug, superseded, text }, null, 2);
    }
    case 'kb_context': {
      const a = ['context', '--for', args.for];
      if (args.for === 'audit-pair') a.push(args.slugA, args.slugB);
      else if (args.slug) a.push(args.slug);
      if (args.query) a.push('--query', args.query);
      if (args.budget) a.push('--budget', String(args.budget));
      return runCli(a).out;
    }
    case 'kb_propose': {
      const now = Date.now();
      while (proposeTimes.length && now - proposeTimes[0] > 60_000) proposeTimes.shift();
      if (proposeTimes.length >= RATE_LIMIT) return err(`proposal rate limit: ${RATE_LIMIT}/min`, 'wait and retry');
      if (JSON.stringify(args.payload ?? {}).length > MAX_PROPOSAL) return err(`payload exceeds ${MAX_PROPOSAL} bytes`);
      proposeTimes.push(now);
      const p = args.payload ?? {};
      if (args.kind === 'url') {
        if (typeof p.url !== 'string') return err('payload.url required for kind: url');
        return runCli(['ingest', p.url]).out;
      }
      if (args.kind === 'staging-draft') {
        if (dirtyWorktree()) return err('worktree is dirty — staging writes are refused', 'commit or stash first');
        if (!SLUG_RE.test(p.slug ?? '')) return err('payload.slug must match ^[a-z0-9][a-z0-9-]*$');
        if (typeof p.markdown !== 'string' || !p.markdown.trim()) return err('payload.markdown required');
        const abs = path.join(ROOT, 'staging', `${p.slug}.md`);
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        // The origin rides in the markers: every proposal records how it arrived.
        const note = [`# ${p.title ?? p.slug}`, '',
          `> **Source**: ${p.source ?? 'mcp:kb_propose'}`,
          `> **Added**: ${new Date().toISOString().slice(0, 10)}`,
          `> **Tags**: ${p.tags ?? 'unsorted'}`,
          `> **Via**: mcp kb_propose`, '', p.markdown.trim(), ''].join('\n');
        try {
          fs.writeFileSync(abs, note, { flag: 'wx' });
        } catch (e) {
          if (e.code === 'EEXIST') return err(`staging/${p.slug}.md already exists`);
          throw e;
        }
        return JSON.stringify({ ok: true, file: `staging/${p.slug}.md`, next: 'kb assess staging/' + p.slug + '.md' }, null, 2);
      }
      if (args.kind === 'queue-proposal') {
        if (dirtyWorktree()) return err('worktree is dirty — queue writes are refused', 'commit or stash first');
        for (const k of ['kind', 'subject', 'value']) if (typeof p[k] !== 'string') return err(`payload.${k} required for kind: queue-proposal`);
        return proposeViaEngine(p);
      }
      return err(`unknown kind: ${args.kind}`);
    }
    case 'kb_task': {
      const build = TASK[args.verb];
      if (!build) return err(`unknown verb: ${args.verb}`);
      return runCli(build(args.args ?? {})).out;
    }
    case 'kb_submit': {
      const build = SUBMIT[args.verb];
      if (!build) return err(`unknown verb: ${args.verb}`);
      if (dirtyWorktree()) return err('worktree is dirty — the gated apply is refused', 'commit or stash first (same rule as CLI bulk --apply)');
      // mkdtemp gives a mode-0700 dir, so the answer file can't be preempted
      // by another local user in the shared tmp dir (symlink planting).
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-mcp-answer-'));
      const tmp = path.join(tmpDir, 'answer.json');
      fs.writeFileSync(tmp, JSON.stringify(args.answer ?? {}));
      try {
        return runCli(build(args.target, tmp)).out;
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    }
    default:
      return err(`unknown tool: ${name}`);
  }
}

// queue-proposal goes through the engine's queue module in-process (the CLI
// has no bare "propose" verb; the module IS the engine code path).
async function proposeViaEngine(p) {
  const { propose } = await import('../lib/queue.mjs');
  const entry = propose(path.join(ROOT, '.kb'), p.kind, {
    subject: p.subject, value: p.value, rationale: p.rationale ?? null,
    source: 'mcp', today: new Date().toISOString().slice(0, 10),
  });
  return JSON.stringify(entry ? { ok: true, proposal: entry } : { ok: true, deduped: true }, null, 2);
}

// ---- newline-delimited JSON-RPC 2.0 over stdio ----
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const send = (msg) => process.stdout.write(`${JSON.stringify(msg)}\n`);

rl.on('line', async (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;
  if (id === undefined) return; // notification

  try {
    if (method === 'initialize') {
      const v = params?.protocolVersion ?? '';
      if (v < MIN_PROTOCOL) {
        send({ jsonrpc: '2.0', id, error: { code: -32602, message: `protocol ${v} unsupported; minimum is ${MIN_PROTOCOL}` } });
        return;
      }
      send({ jsonrpc: '2.0', id, result: {
        protocolVersion: v, capabilities: { tools: {} },
        serverInfo: { name: 'kb-mcp', version: '0.1.0' },
      } });
      return;
    }
    if (method === 'tools/list') {
      send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      return;
    }
    if (method === 'tools/call') {
      let text = await callTool(params?.name, params?.arguments ?? {});
      if (typeof text !== 'string') text = String(text);
      if (text.length > MAX_RESULT) text = err(`result exceeds the ${MAX_RESULT} byte cap`);
      let isError = false;
      try { isError = JSON.parse(text)?.ok === false; } catch { /* non-json passthrough */ }
      send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }], isError } });
      return;
    }
    if (method === 'ping') { send({ jsonrpc: '2.0', id, result: {} }); return; }
    send({ jsonrpc: '2.0', id, error: { code: -32601, message: `unknown method: ${method}` } });
  } catch (e) {
    send({ jsonrpc: '2.0', id, error: { code: -32603, message: String(e.message).slice(0, 200) } });
  }
});
