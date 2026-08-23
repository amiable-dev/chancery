#!/usr/bin/env node
// The PR-contract check (write-paths §1/§3d): diffs touching canonical paths
// (C1 notes, C2 configuration) must ship with matching C6 apply-records, and a
// PR touching gate checks and their fixtures together is flagged as the
// ADR-002 attack shape. Usage: check-pr-writes.mjs <base-ref> [head-ref]
import { execFileSync } from 'node:child_process';

const [base, head = 'HEAD'] = process.argv.slice(2);
if (!base) { console.error('usage: check-pr-writes.mjs <base-ref> [head-ref]'); process.exit(1); }

const diff = execFileSync('git', ['diff', '--name-status', `${base}...${head}`], { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean).map((l) => {
    const [status, ...paths] = l.split('\t');
    return { status: status[0], path: paths[paths.length - 1] };
  });

const touched = (re) => diff.filter((d) => re.test(d.path));
const canonical = touched(/^(concepts|flashcards)\/(?!_index\.md)/);
const config = touched(/^\.kb\/(kb\.config\.yaml|schemas\/|facets\.yml|rubrics\/|POLICY\.md)/);
const records = touched(/^\.kb\/assessments\//).filter((d) => d.status === 'A' || d.status === 'M');
const gateCode = touched(/^\.kb\/lib\//);
const fixtures = touched(/^\.kb\/test\//);

const problems = [];
if (canonical.length && !records.length) {
  problems.push(`canonical diffs without apply-records: ${canonical.map((d) => d.path).join(', ')} — `
    + 'C1 changes arrive via the gated apply; include the .kb/assessments/ records that produced them (write-paths §1)');
}
if (config.length && !records.length) {
  problems.push(`configuration diffs without governance records: ${config.map((d) => d.path).join(', ')} — `
    + 'C2 changes ride queue acceptances or reviewed engine PRs; state which in the PR');
}
if (gateCode.length && fixtures.length) {
  console.log('NOTE: this PR touches gate code and test fixtures together — the ADR-002 attack shape. '
    + 'Review the fixture diff first: does any check get weaker?');
}
if (problems.length) {
  for (const p of problems) console.error(`check-pr-writes: ${p}`);
  process.exitCode = 1;
} else {
  console.log(`check-pr-writes: ok (${diff.length} changed path(s))`);
}
