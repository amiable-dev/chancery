/**
 * Findings and reporting.
 *
 * Output is machine-readable by default outside a TTY. An agent shown a raw
 * stack trace will invent fixes to make the red text go away, and in a prose
 * repo that means damaged notes — so every finding carries a stable code, the
 * exact location, and an explicit permitted remedy.
 */

export const CODES = {
  KB001: 'frontmatter missing or unparseable',
  KB002: 'frontmatter fails collection schema',
  KB003: 'required section missing',
  KB004: 'required sections out of order',
  KB005: 'derived note has no parent',
  KB006: 'generated index is stale',
  KB007: 'wikilink resolves to nothing',
  KB008: 'staging marker missing',
  KB015: 'citation liveness state missing or unbacked',
  KB016: 'supersession integrity violation',
  KB017: 'source provenance class missing or unresolved',
  KB018: 'liveness summary disagrees with the evidence store',
  KB020: 'context anchor does not resolve',
  KB021: 'export tree violates the publication filter',
};

export function finding({ severity, code, check, file, line, field, message, remedy }) {
  return { severity, code, check, file, line: line ?? null, field: field ?? null, message, remedy };
}

export function summarise(findings, checked) {
  const errors = findings.filter((f) => f.severity === 'error').length;
  const warnings = findings.filter((f) => f.severity === 'warn').length;
  return { ok: errors === 0, errors, warnings, checked };
}

export function reportJson(findings, checked) {
  const summary = summarise(findings, checked);
  return JSON.stringify({ ok: summary.ok, summary, findings }, null, 2);
}

export function reportHuman(findings, checked) {
  const summary = summarise(findings, checked);
  const lines = [];
  const bySeverity = { error: [], warn: [] };
  for (const f of findings) bySeverity[f.severity]?.push(f);

  for (const sev of ['error', 'warn']) {
    if (!bySeverity[sev].length) continue;
    lines.push(`\n${sev === 'error' ? 'ERRORS' : 'WARNINGS'} (${bySeverity[sev].length})`);
    for (const f of bySeverity[sev]) {
      const loc = f.line ? `${f.file}:${f.line}` : f.file;
      lines.push(`  ${f.code} ${loc}`);
      lines.push(`        ${f.message}`);
      if (f.remedy) lines.push(`        remedy: ${f.remedy}`);
    }
  }

  lines.push(
    `\n${summary.ok ? 'PASS' : 'FAIL'} — ${checked} files checked, ` +
      `${summary.errors} error(s), ${summary.warnings} warning(s)`,
  );
  return lines.join('\n');
}

/** TTY gets prose; anything capturing stdout (CI, an agent) gets JSON. */
export function pickFormat(explicit) {
  if (explicit) return explicit;
  return process.stdout.isTTY ? 'human' : 'json';
}
