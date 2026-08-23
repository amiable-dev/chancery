#!/usr/bin/env node
// Renders kb-report.json into $GITHUB_STEP_SUMMARY and asserts report.ok —
// the summary and the exit status can never disagree (packet-5 kb-verify #1/#5).
// Tolerates a missing or malformed report by failing loudly, not by throwing
// away the real failure. Markdown-significant characters in finding text are
// escaped: findings quote corpus content, which is untrusted.
import fs from 'node:fs';

const esc = (s) => String(s ?? '').replace(/[|\\`<>]/g, (c) => `\\${c}`).replace(/\r?\n/g, ' ');
const out = [];
const summaryPath = process.env.GITHUB_STEP_SUMMARY;
const write = () => { if (summaryPath) fs.appendFileSync(summaryPath, `${out.join('\n')}\n`); };

let report = null;
try {
  report = JSON.parse(fs.readFileSync(process.argv[2] ?? 'kb-report.json', 'utf8'));
} catch (e) {
  out.push('## kb verify — NO REPORT', '', `could not read report: ${esc(e.message)}`);
  write();
  console.error('report-summary: no readable report');
  process.exitCode = 1;
}

if (report) {
  const s = report.summary ?? {};
  out.push(`## kb verify — ${report.ok ? 'PASS' : 'FAIL'}`, '',
    `${s.checked ?? '?'} files checked · ${s.errors ?? '?'} error(s) · ${s.warnings ?? '?'} warning(s)`, '');
  const errors = (report.findings ?? []).filter((f) => f.severity === 'error');
  if (errors.length) {
    out.push('| code | file | message |', '|---|---|---|');
    for (const f of errors) out.push(`| ${esc(f.code)} | \`${esc(f.file)}${f.line ? `:${f.line}` : ''}\` | ${esc(f.message)} |`);
    out.push('');
  }
  const warns = (report.findings ?? []).filter((f) => f.severity === 'warn');
  if (warns.length) {
    out.push(`<details><summary>${warns.length} warning(s) — recorded gaps, not failures</summary>`, '');
    for (const f of warns) out.push(`- \`${esc(f.file)}${f.line ? `:${f.line}` : ''}\` ${esc(f.message)}`);
    out.push('', '</details>');
  }
  write();
  if (report.ok !== true) {
    console.error('report-summary: report.ok is not true');
    process.exitCode = 1;
  }
}
