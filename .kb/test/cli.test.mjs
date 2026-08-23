#!/usr/bin/env node
/**
 * CLI surface.
 *
 * Every agent-facing contract lives here: exit codes, and the promise that
 * output outside a TTY is parseable JSON. An agent handed a stack trace invents
 * fixes to make the red text go away, and in a prose repo that means damaged
 * notes — so even a crash has to be JSON. The `--help` exit code was wrong until
 * caught by hand; that is exactly the class of thing a smoke test is for.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'kb.mjs');
const failures = [];
const check = (name, cond) => { if (!cond) failures.push(name); };

const run = (args) => {
  try {
    return { code: 0, out: execFileSync('node', [CLI, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { code: e.status, out: e.stdout ?? '' };
  }
};

// Exit codes: help is a successful request for help; an unknown command is not.
check('--help exits 0', run(['--help']).code === 0);
check('no command exits 0', run([]).code === 0);
check('unknown command exits 1', run(['definitely-not-a-command']).code === 1);

// Non-TTY output must be machine-readable for every command an agent may call.
for (const args of [['verify'], ['index', '--check'], ['link', 'check'], ['queue'], ['migrate']]) {
  const { out } = run(args);
  let parsed = null;
  try { parsed = JSON.parse(out); } catch { /* left null */ }
  check(`\`kb ${args.join(' ')}\` emits JSON outside a TTY`, parsed !== null);
}

// A crash is still JSON, with the failing command named.
{
  const { code, out } = run(['assess', 'concepts/does-not-exist.md']);
  let parsed = null;
  try { parsed = JSON.parse(out); } catch { /* left null */ }
  check('a thrown error is reported as JSON', parsed !== null);
  check('the error names the command', parsed?.error?.command === 'assess');
  check('a crash exits non-zero', code !== 0);
}

// verify's report shape is a contract: CI and every harness adapter read it.
{
  const r = JSON.parse(run(['verify']).out);
  check('verify reports ok', typeof r.ok === 'boolean');
  check('verify reports a summary', typeof r.summary?.errors === 'number' && typeof r.summary?.checked === 'number');
  check('findings carry a stable code, file and remedy',
    Array.isArray(r.findings) && r.findings.every((f) => f.code && f.file && f.remedy && f.severity));
}

// A large report on a FAILING run must not be truncated. process.exit() tears
// the process down before a piped stdout flushes, cutting the JSON off at the
// ~8KB pipe buffer — and only on the runs with enough findings to matter.
{
  const fixture = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'fixture');
  let raw;
  try {
    raw = execFileSync('node', [CLI, 'verify', '--format', 'json'],
      { encoding: 'utf8', env: { ...process.env, KB_ROOT: fixture } });
  } catch (e) { raw = e.stdout ?? ''; }
  let parsed = null;
  try { parsed = JSON.parse(raw); } catch { /* left null */ }
  check('a failing run with a large report still emits complete JSON', parsed !== null);
  check('the large report is genuinely large', raw.length > 4000);
}

// Bulk writers must default to dry-run — POLICY, and the reason a bad migration
// stayed reviewable.
check('migrate does not write without --apply', JSON.parse(run(['migrate']).out).applied === false);

if (failures.length) {
  console.error('CLI TEST FAILED\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('cli test passed — exit codes, JSON on every path including crashes, dry-run by default');
