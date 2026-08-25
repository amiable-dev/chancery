#!/usr/bin/env node
/**
 * kb — the deterministic layer of the knowledge pipeline.
 *
 * `kb verify` is the contract (docs/architecture/overview.md). Harness adapters
 * make an agent's first draft right; they cannot enforce anything, because an
 * agent may decline to run a command, invoke it with invented arguments, or
 * summarise its output instead of applying it. CI running this is what holds.
 *
 * P0 implements: verify, index.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import Ajv from 'ajv/dist/2020.js'; // schemas declare draft 2020-12; the default export is draft-07
import addFormats from 'ajv-formats';

import { splitFrontmatter, headings, wikilinks, targetSlug, markers, frontmatterKeyLine, section } from '../lib/md.mjs';
import { finding, reportJson, reportHuman, summarise, pickFormat } from '../lib/findings.mjs';
import { buildIndex } from '../lib/index-gen.mjs';
import { parseDeck, renderDeck, mergeDeck } from '../lib/cards.mjs';
import { migrateConcept, migrateDeck } from '../lib/migrate.mjs';
import { fetchAll, fetchExtract } from '../lib/sources.mjs';
import { fetchArticle, renderStagingNote, deriveSlug } from '../lib/ingest.mjs';
import { loadRubric, nearest, buildTask, route } from '../lib/rubric.mjs';
import * as queue from '../lib/queue.mjs';
import { buildDraftTask, renderConcept, stagingSourceUrl, unresolvedTargets } from '../lib/promote.mjs';
import { loadFacets, conformance, buildFacetTask, applyFacets } from '../lib/facets.mjs';
import { linkGraph, oneWay, buildLinkTask, appendRelationships, loadNotes } from '../lib/link.mjs';
import { transformNote, tagsFile, rewriteLinks, jsonCorpus, mergeTags, provenanceExceptions, renderProvenance, TRANSFORM_VERSION, JSON_SCHEMA_VERSION } from '../lib/export-docusaurus.mjs';
import { loadProcedures, render as renderAdapters } from './install-knowledge.mjs';
import { retrieve, buildQueryTask, checkCitations } from '../lib/query.mjs';
import * as evalset from '../lib/evalset.mjs';
import * as derivations from '../lib/derivations.mjs';
import * as envlib from '../lib/envelope.mjs';
import * as evidence from '../lib/evidence.mjs';
import { TASKS as CONTEXT_TASKS, loadAnchors, resolveAnchor, compile as compileContext, edgesFor } from '../lib/context.mjs';
import { appendLog, formatLine, checkLog } from '../lib/log.mjs';
import { PARAMS as AUDIT_PARAMS, paramsHash, contradictionCandidates, staleCandidates, gapCandidates, rotCandidates, candidateTexts } from '../lib/audit.mjs';

const today = () => new Date().toISOString().slice(0, 10);

// Supported-LTS floor (ADR-011 §1): refuse below it with a clear message —
// harnesses supply their own Node, so the check must live here, not in docs.
{
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 22) {
    console.error(JSON.stringify({ ok: false, error: {
      message: `kb requires Node >= 22 (supported LTS lines); this is ${process.versions.node}`,
      remedy: 'run under Node 22.x or 24.x (e.g. nvm install 24)',
    } }));
    process.exit(1); // deliberate hard exit: nothing has run, nothing buffers
  }
}

// Root discovery (npm-installability): an installed `kb` must govern the
// repo it is run IN, never the package it is run FROM. Resolution order:
//   1. KB_ROOT env — content root override; config/schemas stay with the
//      package (the test-fixture contract, unchanged — used by the polarity
//      test to run the real checks against broken fixtures).
//   2. Nearest ancestor of cwd carrying .kb/kb.config.yaml — that repo's own
//      .kb supplies config, schemas, rubrics, procedures (a cloned Chancery
//      repo governs itself; identical behaviour when developing in this one).
//   3. Fallback: the package's parent (engine run from an unrelated cwd).
const PKG_KB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG_VERSION = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(PKG_KB, '..', 'package.json'), 'utf8')).version ?? '0'; }
  catch { return '0'; }
})();
const discoverRoot = () => {
  let d = process.cwd();
  for (;;) {
    if (fs.existsSync(path.join(d, '.kb', 'kb.config.yaml'))) return d;
    const parent = path.dirname(d);
    if (parent === d) return null;
    d = parent;
  }
};
const { KB_DIR, ROOT } = (() => {
  if (process.env.KB_ROOT) return { KB_DIR: PKG_KB, ROOT: path.resolve(process.env.KB_ROOT) };
  const found = discoverRoot();
  if (found) return { KB_DIR: path.join(found, '.kb'), ROOT: found };
  return { KB_DIR: PKG_KB, ROOT: path.resolve(PKG_KB, '..') };
})();
// Queue state follows the content root (fixtures carry their own queues);
// for a self-governing repo this is identical to KB_DIR.
const QUEUE_DIR_OF = (root) => path.join(root, '.kb');
const QUEUE_DIR = QUEUE_DIR_OF(ROOT);

const loadConfig = () => parseYaml(fs.readFileSync(path.join(KB_DIR, 'kb.config.yaml'), 'utf8'));

const listNotes = (collection) => {
  const dir = path.join(ROOT, collection.path);
  if (!fs.existsSync(dir)) return [];
  const exclude = new Set(collection.exclude ?? []);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !exclude.has(f))
    .sort()
    .map((f) => ({ file: path.posix.join(collection.path, f), slug: f.replace(/\.md$/, ''), abs: path.join(dir, f) }));
};

const schemaText = (name) => fs.readFileSync(path.join(KB_DIR, 'schemas', name), 'utf8');

// One refusal shape for the whole KB022 family (envelope spec §2).
const refusal = (command, format, r) => {
  console.log(format === 'json'
    ? JSON.stringify({ ok: false, error: { command, code: r.code, message: r.message, remedy: r.remedy } }, null, 2)
    : `REFUSED [${r.code}] — ${r.message}\n         ${r.remedy}`);
  return 1;
};

// Canon-mutating applies record what was learned beside what changed
// (design/log.md). Appended only after a successful apply — a rolled-back
// write never logs, so the log never asserts a change that didn't land.
const logApply = (entry) => appendLog(ROOT, today(), [formatLine(entry)]);

// One observing run = one commit+date pair; distinct runs are what the
// never-resolved rule counts (evidence spec).
const runId = () => {
  let head = null;
  try { head = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* fixtures */ }
  return `${head ?? 'no-git'}:${today()}`;
};

// ---------------------------------------------------------------- checks

function checkYamlCollection(name, collection, cfg, ajv, out) {
  const validate = collection.schema
    ? ajv.compile(JSON.parse(fs.readFileSync(path.join(KB_DIR, 'schemas', collection.schema), 'utf8')))
    : null;

  for (const note of listNotes(collection)) {
    checkNoteText(note, fs.readFileSync(note.abs, 'utf8'), collection, cfg, validate, out);
  }
}

function checkNoteText(note, text, collection, cfg, validate, out) {
  {
    const { data, raw, body, error } = splitFrontmatter(text);

    if (data === null || data === undefined) {
      out.push(finding({
        severity: 'error', code: 'KB001', check: 'schema', file: note.file, line: 1,
        message: error ? `frontmatter is not valid YAML: ${error}` : 'file has no YAML frontmatter',
        remedy: `add a --- delimited frontmatter block matching .kb/schemas/${collection.schema}`,
      }));
      return;
    }

    if (validate && !validate(data)) {
      for (const e of validate.errors) {
        const field = (e.instancePath || `/${e.params?.additionalProperty ?? ''}`).replace(/^\//, '') || null;
        out.push(finding({
          severity: cfg.checks.schema, code: 'KB002', check: 'schema', file: note.file,
          line: frontmatterKeyLine(raw, (field ?? '').split('/')[0]), field,
          message: `frontmatter ${field ? `\`${field}\` ` : ''}${e.message}`,
          remedy: `conform to .kb/schemas/${collection.schema}`,
        }));
      }
    }

    // A superseded note is a pointer by design (validation-r1a §3): its body
    // deliberately lacks the required sections.
    if (collection.sections && data?.status !== 'superseded') checkSections(note, body, collection, cfg, out);
  }
}

/**
 * Post-apply gate (envelope spec §3.4): write, verify just the touched files,
 * and roll the whole set back if any error surfaces. Partial application does
 * not exist. Returns [] on success, the error findings on rollback.
 */
function applyWithRollback(writes, collection, cfg) {
  // One apply at a time (.kb/lock, mcp-facade spec): the facade's subprocess
  // inherits this, so both surfaces contend on the same lock. A dead holder's
  // lock is reclaimed by pid liveness.
  const lockDir = path.join(ROOT, '.kb', 'lock');
  const pidFile = path.join(lockDir, 'pid');
  fs.mkdirSync(path.dirname(lockDir), { recursive: true }); // the atomic mkdir below needs its parent
  try {
    fs.mkdirSync(lockDir, { recursive: false });
  } catch {
    let alive = false;
    try { process.kill(Number(fs.readFileSync(pidFile, 'utf8')), 0); alive = true; } catch { /* stale */ }
    if (alive) throw new Error('another apply holds .kb/lock — retry when it finishes');
    fs.rmSync(lockDir, { recursive: true, force: true });
    fs.mkdirSync(lockDir, { recursive: false });
  }
  fs.writeFileSync(pidFile, String(process.pid));
  try {
    return applyLocked(writes, collection, cfg);
  } finally {
    fs.rmSync(lockDir, { recursive: true, force: true });
  }
}

function applyLocked(writes, collection, cfg) {
  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = collection.schema
    ? ajv.compile(JSON.parse(fs.readFileSync(path.join(KB_DIR, 'schemas', collection.schema), 'utf8')))
    : null;
  const before = writes.map((w) => ({ ...w, prior: fs.existsSync(w.abs) ? fs.readFileSync(w.abs, 'utf8') : null }));
  for (const w of writes) fs.writeFileSync(w.abs, w.text);
  const out = [];
  for (const w of writes) checkNoteText({ file: w.file, abs: w.abs }, w.text, collection, cfg, validate, out);
  const errors = out.filter((f) => f.severity === 'error');
  if (errors.length) {
    for (const b of before) (b.prior === null ? fs.unlinkSync(b.abs) : fs.writeFileSync(b.abs, b.prior));
  }
  return errors;
}

function checkSections(note, body, collection, cfg, out) {
  const present = headings(body, 2);
  const seenAt = new Map();
  present.forEach((h, i) => { if (!seenAt.has(h)) seenAt.set(h, i); });

  const found = [];
  for (const required of collection.sections) {
    if (!seenAt.has(required)) {
      out.push(finding({
        severity: cfg.checks.sections, code: 'KB003', check: 'sections', file: note.file,
        message: `missing required section \`## ${required}\``,
        remedy: `add \`## ${required}\`; required order is ${collection.sections.join(' -> ')}`,
      }));
    } else {
      found.push({ name: required, at: seenAt.get(required) });
    }
  }

  for (let i = 1; i < found.length; i++) {
    if (found[i].at < found[i - 1].at) {
      out.push(finding({
        severity: cfg.checks.sections, code: 'KB004', check: 'sections', file: note.file,
        message: `section \`## ${found[i].name}\` appears before \`## ${found[i - 1].name}\``,
        remedy: `required order is ${collection.sections.join(' -> ')}; extra sections between them are fine`,
      }));
      break;
    }
  }
}

function checkStagingMarkers(collection, cfg, out) {
  for (const note of listNotes(collection)) {
    const found = markers(fs.readFileSync(note.abs, 'utf8'));
    for (const required of collection.markers ?? []) {
      if (!(required in found)) {
        out.push(finding({
          severity: 'error', code: 'KB008', check: 'schema', file: note.file,
          message: `staging note missing \`**${required}:**\` marker`,
          remedy: `add \`**${required}:**\` under the H1; required markers are ${collection.markers.join(', ')}`,
        }));
      }
    }
  }
}

function checkDerivation(name, collection, cfg, collections, out) {
  const parent = collections[collection.derives_from];
  if (!parent) return;
  const parents = new Set(listNotes(parent).map((n) => n.slug));

  for (const note of listNotes(collection)) {
    if (!parents.has(note.slug)) {
      out.push(finding({
        severity: cfg.checks.derivation, code: 'KB005', check: 'derivation', file: note.file,
        message: `no ${collection.derives_from} note with slug \`${note.slug}\``,
        remedy: `every ${name} note derives from the ${collection.derives_from} note sharing its slug — create it, or remove this file`,
      }));
    }
  }
}

function checkIndex(name, collection, cfg, out) {
  if (!collection.index) return;
  const abs = path.join(ROOT, collection.index);
  const expected = buildIndex(ROOT, collection);
  const actual = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;

  if (actual !== expected) {
    out.push(finding({
      severity: cfg.checks.index, code: 'KB006', check: 'index', file: collection.index,
      message: actual === null ? 'generated index is missing' : 'generated index does not match its source notes',
      remedy: 'run `kb index` — this file is generated, never hand-edited',
    }));
  }
}

/**
 * Card identity. Refresh matches cards by id, so a card without one cannot be
 * refreshed without duplicating or orphaning it, and a duplicate id would let a
 * refresh overwrite the wrong card.
 */
function checkCardIds(collection, cfg, out) {
  const seen = new Map();

  for (const note of listNotes(collection)) {
    const { body } = splitFrontmatter(fs.readFileSync(note.abs, 'utf8'));
    if (body === undefined) continue;

    for (const block of parseDeck(body)) {
      if (!block.isCard) continue;

      if (!block.id) {
        out.push(finding({
          severity: cfg.checks.card_ids ?? 'error', code: 'KB009', check: 'cards',
          file: note.file, line: block.headingLine + 1,
          message: `card \`## ${block.heading}\` has no kb:card id`,
          remedy: 'run `kb migrate --apply` to mint ids; refresh matches cards by id, not by heading',
        }));
        continue;
      }

      const prior = seen.get(block.id);
      if (prior) {
        out.push(finding({
          severity: cfg.checks.card_ids ?? 'error', code: 'KB010', check: 'cards',
          file: note.file, line: block.headingLine + 1,
          message: `card id \`${block.id}\` is already used by ${prior}`,
          remedy: 'ids must be unique across all decks — change one by hand; never reuse',
        }));
      } else {
        seen.set(block.id, `${note.file}:${block.headingLine + 1}`);
      }
    }
  }
}

/**
 * Facet conformance. A note with no facets yet is not a finding — P5 derivation
 * is incremental, and an unclassified note is backlog, not breakage.
 */
function checkFacets(cfg, out) {
  const facets = loadFacets(KB_DIR);
  for (const note of listNotes(cfg.collections.concepts)) {
    const { data, raw } = splitFrontmatter(fs.readFileSync(note.abs, 'utf8'));
    if (!data) continue;
    for (const p of conformance(facets, data)) {
      out.push(finding({
        severity: cfg.checks.facets ?? 'error', code: 'KB012', check: 'facets',
        file: note.file, line: frontmatterKeyLine(raw, p.axis ?? 'tags'), field: p.axis,
        message: p.message,
        remedy: p.kind === 'unknown-value' || p.kind === 'uncurated-topic'
          ? 'use a value from .kb/facets.yml, or propose one via `kb queue`'
          : 'run `kb facets --draft ... --apply` — scalars and nested tags are generated together',
      }));
    }
  }
}

/**
 * Adapters are generated from .kb/procedures/, so a hand-edit or a stale
 * regeneration means the four harnesses are being told something the procedures
 * no longer say. Same rule the generated index lives under.
 */
function checkAdapters(cfg, out) {
  if (!fs.existsSync(path.join(KB_DIR, 'procedures'))) return;
  // Repo-level concern: a content fixture under KB_ROOT has no adapters to be
  // stale, and checking anyway drowns the fixture report in phantom findings.
  if (process.env.KB_ROOT) return;
  let files;
  try {
    files = renderAdapters(loadProcedures(KB_DIR), ROOT);
  } catch (err) {
    out.push(finding({
      severity: cfg.checks.adapters ?? 'error', code: 'KB014', check: 'adapters',
      file: '.kb/procedures/', message: `procedures could not be compiled: ${err.message}`,
      remedy: 'fix the procedure frontmatter, then run `npm run adapters`',
    }));
    return;
  }
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(ROOT, rel);
    const current = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    if (current === content) continue;
    out.push(finding({
      severity: cfg.checks.adapters ?? 'error', code: 'KB014', check: 'adapters', file: rel,
      message: current === null ? 'generated adapter is missing' : 'generated adapter does not match .kb/procedures/',
      remedy: 'run `npm run adapters` — these files are generated, never hand-edited',
    }));
  }
}

/**
 * validation-r1a checks. KB015: a citation with an evidence record must carry
 * a valid liveness state (absence of any record is a warning — the pre-R1a
 * migration story). KB016: supersession integrity. KB017: provenance classes
 * (missing = error only once kb.config records validation_migration:
 * r1a-complete; unclassified and all-internal = warnings, per-note
 * aggregated). KB018: summary liveness must match the latest observation —
 * the hash is the accepted baseline and intentionally lags until --accept.
 */
function checkEvidence(collections, cfg, out) {
  const concepts = collections.concepts ?? [];
  const migrated = cfg.validation_migration === 'r1a-complete';
  const bySlug = new Map(concepts.map((n) => [n.slug, n.data]));

  for (const note of concepts) {
    const sources = note.data?.sources ?? [];
    const urlSources = sources.filter((s) => s.url);
    const store = evidence.latestByCite(evidence.readStore(ROOT, note.slug));

    let unclassified = 0;
    let missingClass = 0;
    let unobserved = 0;
    let internalOnly = urlSources.length > 0;
    for (const s of urlSources) {
      const latest = store.get(evidence.citeId(note.slug, s.url));
      if (latest) {
        if (!s.reachability || !evidence.REACHABILITY.includes(s.reachability)) {
          out.push(finding({
            severity: 'error', code: 'KB015', check: 'evidence', file: note.file, field: 'sources',
            message: `citation ${s.url} has an evidence record but no valid liveness state in its summary`,
            remedy: 're-run `kb sources --apply` (or `kb revalidate`) to sync the summary',
          }));
        } else if (s.reachability !== latest.reachability) {
          out.push(finding({
            severity: 'error', code: 'KB018', check: 'evidence', file: note.file, field: 'sources',
            message: `summary says \`${s.reachability}\` but the latest observation says \`${latest.reachability}\` for ${s.url}`,
            remedy: 'the store is authoritative — re-run the network verb to sync the summary',
          }));
        }
      } else if (s.reachability) {
        out.push(finding({
          severity: 'error', code: 'KB015', check: 'evidence', file: note.file, field: 'sources',
          message: `citation ${s.url} claims liveness \`${s.reachability}\` with no evidence record behind it`,
          remedy: 'liveness states come from observations; remove the field or run the network verb',
        }));
      } else {
        unobserved++;
      }
      if (s.class === 'unclassified') unclassified++;
      else if (!s.class) missingClass++;
      if (s.class !== 'internal-synthesis' && s.class !== 'model-inference') internalOnly = false;
    }

    if (unobserved) {
      out.push(finding({
        severity: 'warn', code: 'KB015', check: 'evidence', file: note.file, field: 'sources',
        message: `${unobserved} citation(s) not yet observed`,
        remedy: 'a network verb records first observations; until then this is a recorded gap',
      }));
    }
    if (missingClass) {
      out.push(finding({
        severity: migrated ? 'error' : 'warn', code: 'KB017', check: 'provenance', file: note.file, field: 'sources',
        message: `${missingClass} source(s) missing a provenance class`,
        remedy: 'run `kb migrate --apply` (backfills `class: unclassified`), then classify',
      }));
    }
    if (unclassified) {
      out.push(finding({
        severity: 'warn', code: 'KB017', check: 'provenance', file: note.file, field: 'sources',
        message: `${unclassified} source(s) still \`unclassified\` — a visible backlog, not a claim`,
        remedy: 'assign external-primary/-secondary/internal-synthesis/model-inference as sources are reviewed',
      }));
    }
    if (internalOnly) {
      out.push(finding({
        severity: 'warn', code: 'KB017', check: 'provenance', file: note.file, field: 'sources',
        message: 'every source is internal-class — no external corroboration recorded (invariant 7)',
        remedy: 'internal citations are navigation, never corroboration; add an external source or accept the gap',
      }));
    }

    // KB016 — supersession integrity (authoritative direction: superseded_by)
    const sb = note.data?.superseded_by ?? [];
    const sp = note.data?.supersedes ?? [];
    if (sb.length && note.data?.status !== 'superseded') {
      out.push(finding({
        severity: 'error', code: 'KB016', check: 'supersession', file: note.file, field: 'status',
        message: 'superseded_by present but status is not `superseded`',
        remedy: 'use `kb supersede` — it sets both in one transaction',
      }));
    }
    if (note.data?.status === 'superseded' && !sb.length) {
      out.push(finding({
        severity: 'error', code: 'KB016', check: 'supersession', file: note.file, field: 'superseded_by',
        message: 'status is `superseded` with no successor recorded',
        remedy: 'a superseded note names its successor(s); use `kb supersede`',
      }));
    }
    for (const target of sb) {
      const succ = bySlug.get(target);
      if (!succ) {
        out.push(finding({
          severity: 'error', code: 'KB016', check: 'supersession', file: note.file, field: 'superseded_by',
          message: `superseded_by names a missing note: ${target}`,
          remedy: 'targets must exist; fix the slug or restore the successor',
        }));
      } else if (!(succ.supersedes ?? []).includes(note.slug)) {
        out.push(finding({
          severity: 'error', code: 'KB016', check: 'supersession', file: note.file, field: 'superseded_by',
          message: `no reciprocal supersedes entry on ${target}`,
          remedy: '`kb supersede` writes both sides atomically; re-run it or add the entry',
        }));
      }
    }
    for (const target of sp) {
      const old = bySlug.get(target);
      if (old && !(old.superseded_by ?? []).includes(note.slug)) {
        out.push(finding({
          severity: 'error', code: 'KB016', check: 'supersession', file: note.file, field: 'supersedes',
          message: `supersedes ${target}, which does not point back`,
          remedy: 'superseded_by on the old note is authoritative — reconcile the pair',
        }));
      }
    }
    // cycle walk along superseded_by
    let hops = 0;
    const seen = new Set([note.slug]);
    let frontier = sb;
    while (frontier.length && hops < 32) {
      const next = [];
      for (const s of frontier) {
        if (seen.has(s)) {
          out.push(finding({
            severity: 'error', code: 'KB016', check: 'supersession', file: note.file, field: 'superseded_by',
            message: `supersession cycle through ${s}`,
            remedy: 'supersession is acyclic by rule; break the loop',
          }));
          frontier = [];
          break;
        }
        seen.add(s);
        next.push(...(bySlug.get(s)?.superseded_by ?? []));
      }
      frontier = next;
      hops++;
    }
  }
}

/**
 * KB021 (export spec): when an export tree is present, the publication filter
 * must hold on it — no excluded-class content, no page for a superseded slug,
 * and the manifest must exist. The exporter can never produce a violation;
 * this catches a hand-edited tree becoming a second source of truth.
 */
function checkExportTree(cfg, out) {
  for (const root of ['docs-site', path.join('site', 'docs', 'kb')]) checkOneExportTree(root, cfg, out);
}

function checkOneExportTree(rel, cfg, out) {
  const outDir = path.join(ROOT, rel);
  if (!fs.existsSync(outDir)) return;
  if (!fs.existsSync(path.join(outDir, 'kb-export-manifest.json'))) {
    out.push(finding({
      severity: 'error', code: 'KB021', check: 'export', file: 'docs-site',
      message: 'export tree present without its manifest',
      remedy: 'regenerate with `kb export` — the tree is derived, never hand-maintained',
    }));
    return;
  }
  const superseded = new Set(listNotes(cfg.collections.concepts)
    .filter((n) => splitFrontmatter(fs.readFileSync(n.abs, 'utf8')).data?.status === 'superseded')
    .map((n) => n.slug));
  const EXCLUDED = /(^|\/)(staging|queue|assessments|evidence|log|maintenance)(\/|$)/;
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name);
      const relPath = path.relative(outDir, abs).split(path.sep).join('/');
      if (e.isDirectory()) { walk(abs); continue; }
      if (EXCLUDED.test(relPath)) {
        out.push(finding({
          severity: 'error', code: 'KB021', check: 'export', file: `${rel}/${relPath}`,
          message: 'excluded-class content inside the export tree',
          remedy: 'C3-C6, log/ and maintenance/ never ship; regenerate with `kb export`',
        }));
      }
      const m = relPath.match(/^concepts\/([a-z0-9-]+)\.md$/);
      if (m && superseded.has(m[1])) {
        out.push(finding({
          severity: 'error', code: 'KB021', check: 'export', file: `${rel}/${relPath}`,
          message: `superseded note published as a page: ${m[1]}`,
          remedy: 'superseded notes ship as manifest redirects, never pages; regenerate',
        }));
      }
    }
  };
  walk(outDir);
}

function checkAnchors(cfg, out) {
  if (process.env.KB_ROOT) return; // anchors bind the real repo's policy files
  let anchors;
  try { anchors = loadAnchors(KB_DIR); } catch { return; }
  for (const [task, list] of Object.entries(anchors.tasks ?? {})) {
    for (const a of list ?? []) {
      if (resolveAnchor(ROOT, KB_DIR, a) === null) {
        out.push(finding({
          severity: 'error', code: 'KB020', check: 'context', file: '.kb/context-anchors.yml',
          message: `task \`${task}\` anchors ${a.file}#${a.heading ?? '(whole file)'} which does not resolve`,
          remedy: 'fix the anchor or restore the heading — a silent heading edit would change every bundle',
        }));
      }
    }
  }
}

function checkLinks(collections, cfg, out) {
  // Aliases are resolvable targets in Obsidian, so they are resolvable here.
  // This is the whole reason P1 adds them: `[[Agentic SDLC (ASDLC)]]` resolves
  // to agentic-sdlc.md natively once the alias exists.
  const known = new Set();
  for (const c of Object.values(collections)) {
    for (const n of listNotes(c)) {
      known.add(n.slug);
      const { data } = splitFrontmatter(fs.readFileSync(n.abs, 'utf8'));
      for (const a of data?.aliases ?? []) known.add(a);
    }
  }

  for (const [name, c] of Object.entries(collections)) {
    for (const note of listNotes(c)) {
      const text = fs.readFileSync(note.abs, 'utf8');
      for (const link of wikilinks(text)) {
        const slug = targetSlug(link.target);
        if (known.has(slug)) continue;
        out.push(finding({
          severity: cfg.checks.links, code: 'KB007', check: 'links', file: note.file, line: link.line,
          message: `wikilink \`[[${link.target}]]\` has no target in this repo`,
          remedy: 'recorded as a concept gap — do NOT delete or rewrite the link (.kb/POLICY.md)',
        }));
      }
    }
  }
}

// ---------------------------------------------------------------- commands

function verify(argv) {
  const cfg = loadConfig();
  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const out = [];
  let checked = 0;

  for (const [name, collection] of Object.entries(cfg.collections)) {
    checked += listNotes(collection).length;
    if (collection.frontmatter === 'markers') checkStagingMarkers(collection, cfg, out);
    else checkYamlCollection(name, collection, cfg, ajv, out);
    if (collection.derives_from) checkDerivation(name, collection, cfg, cfg.collections, out);
    if (collection.cards) checkCardIds(collection, cfg, out);
    checkIndex(name, collection, cfg, out);
  }
  checkFacets(cfg, out);
  checkAdapters(cfg, out);
  checkAnchors(cfg, out);
  checkExportTree(cfg, out);
  checkLinks(cfg.collections, cfg, out);
  checkEvidence({
    concepts: listNotes(cfg.collections.concepts)
      .map((n) => ({ ...n, data: splitFrontmatter(fs.readFileSync(n.abs, 'utf8')).data })),
  }, cfg, out);

  // D8: rebuild == cached — the executable determinism test. Read-only here;
  // only read verbs write the cache, and an absent cache is honest cold state.
  {
    const notesFull = listNotes(cfg.collections.concepts).map((n) => {
      const { data, body } = splitFrontmatter(fs.readFileSync(n.abs, 'utf8'));
      return { slug: n.slug, title: data?.title ?? n.slug, data, body };
    });
    for (const f of derivations.checkDerivationCache({
      cacheDir: path.join(KB_DIR, 'cache'), notes: notesFull,
      meta: { schema_version: cfg.version, tool_version: PKG_VERSION, policy_hash: 'none' },
    })) out.push(finding({ severity: 'error', ...f }));
  }

  for (const e of queue.stale(QUEUE_DIR, cfg.queue?.stale_after_days ?? 14, today())) {
    out.push(finding({
      severity: cfg.checks.stale_proposals ?? 'error', code: 'KB011', check: 'queue',
      file: `.kb/queue/${e.kind}-proposals.jsonl`,
      message: `proposal \`${e.id}\` (${e.subject} -> ${e.value}) open since ${e.opened}`,
      remedy: `review it: \`kb queue accept ${e.id}\` or \`kb queue reject ${e.id}\``,
    }));
  }

  const format = pickFormat(argv.format);
  console.log(format === 'json' ? reportJson(out, checked) : reportHuman(out, checked));
  return summarise(out, checked).ok ? 0 : 1;
}

function index(argv) {
  const cfg = loadConfig();
  const written = [];

  for (const collection of Object.values(cfg.collections)) {
    if (!collection.index) continue;
    const abs = path.join(ROOT, collection.index);
    const next = buildIndex(ROOT, collection);
    const prev = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
    if (next !== prev) {
      if (!argv.check) fs.writeFileSync(abs, next);
      written.push(collection.index);
    }
  }

  const result = { ok: !(argv.check && written.length), changed: written, checked: !!argv.check };
  if (!argv.quiet) {
    const format = pickFormat(argv.format);
    console.log(format === 'json' ? JSON.stringify(result, null, 2)
      : written.length ? `${argv.check ? 'stale' : 'wrote'}: ${written.join(', ')}` : 'index up to date');
  }
  return result.ok ? 0 : 1;
}

/**
 * P1 migration. Dry-run by default and gated on a clean tree, because it is a
 * bulk rewrite — the class of operation that corrupted the predecessor vault
 * (.kb/POLICY.md). `--apply` is refused unless the change is reviewable
 * afterwards as a diff.
 */
function migrate(argv) {
  const cfg = loadConfig();
  const changes = [];
  const globalIds = new Set();

  for (const [name, collection] of Object.entries(cfg.collections)) {
    if (collection.frontmatter !== 'yaml') continue;
    for (const note of listNotes(collection)) {
      const text = fs.readFileSync(note.abs, 'utf8');
      const result = collection.cards
        ? migrateDeck(note.slug, text, globalIds)
        : migrateConcept(note.slug, text);
      if (result.changed) changes.push({ file: note.file, abs: note.abs, notes: result.notes, text: result.text });
    }
  }

  if (argv.apply && changes.length) {
    let dirty = '';
    try {
      dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).trim();
    } catch {
      dirty = ''; // not a git repo — nothing to protect
    }
    if (dirty) {
      const msg = 'refusing --apply with a dirty working tree: a bulk rewrite must be reviewable as a diff';
      const format = pickFormat(argv.format);
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'migrate', message: msg } }, null, 2)
        : `REFUSED — ${msg}\n         commit or stash first (.kb/POLICY.md)`);
      return 1;
    }
    for (const c of changes) fs.writeFileSync(c.abs, c.text);
    logApply({ verb: 'migrate', target: 'corpus', disposition: 'applied', rationale: `${changes.length} file(s)` });

    // Evidence-store backfill: the summaries being migrated are real prior
    // observations (recorded before the store existed) — relocate, don't
    // fabricate. Idempotent: a cite with any history is left alone.
    for (const note of listNotes(cfg.collections.concepts)) {
      const { data } = splitFrontmatter(fs.readFileSync(note.abs, 'utf8'));
      const have = evidence.latestByCite(evidence.readStore(ROOT, note.slug));
      for (const s of data?.sources ?? []) {
        if (!s.url || (!s.hash && !s.unreachable)) continue;
        const cid = evidence.citeId(note.slug, s.url);
        if (have.has(cid)) continue;
        evidence.recordObservation(ROOT, note.slug, {
          cite_id: cid, url_canonical: evidence.canonicalUrl(s.url),
          reachability: s.reachability ?? (s.hash ? 'ok' : 'dns-transient'),
          detail: s.reason ? `migrated: ${s.reason}` : 'migrated from frontmatter summary',
          content_digest: s.hash ?? null,
        }, `migrated:${s.retrieved ?? s.checked ?? 'unknown'}`);
      }
    }
  }

  const format = pickFormat(argv.format);
  const payload = {
    ok: true,
    applied: !!argv.apply,
    files: changes.length,
    changes: changes.map(({ file, notes }) => ({ file, notes })),
  };

  if (format === 'json') {
    console.log(JSON.stringify(payload, null, 2));
  } else if (!changes.length) {
    console.log('migrate: nothing to do');
  } else {
    for (const c of changes) console.log(`  ${c.file}  ${c.notes.join(', ')}`);
    console.log(`\n${argv.apply ? 'APPLIED' : 'DRY RUN'} — ${changes.length} file(s)` +
      (argv.apply ? '' : '\nre-run with --apply to write (requires a clean git tree)'));
  }
  return 0;
}

/**
 * P1b — fetch every cited source and record a content hash, so `kb revalidate`
 * has something falsifiable to compare against. Network-bound and best-effort:
 * never runs in CI, and a dead citation is recorded as `unreachable` rather
 * than silently skipped.
 */
async function sources(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);

  // Gather every source lacking a hash, deduped by URL — one fetch serves every
  // concept citing it.
  const pending = new Map();
  for (const collection of Object.values(cfg.collections)) {
    if (collection.frontmatter !== 'yaml' || collection.cards) continue;
    for (const note of listNotes(collection)) {
      const { data } = splitFrontmatter(fs.readFileSync(note.abs, 'utf8'));
      for (const s of data?.sources ?? []) {
        if (s.hash || (s.unreachable && !argv.retryDead)) continue;
        if (!pending.has(s.url)) pending.set(s.url, []);
        pending.get(s.url).push(note.abs);
      }
    }
  }

  let urls = [...pending.keys()];
  if (argv.limit) urls = urls.slice(0, argv.limit);

  if (!argv.apply) {
    const payload = { ok: true, applied: false, pendingUrls: urls.length, references: [...pending.values()].flat().length };
    console.log(format === 'json' ? JSON.stringify(payload, null, 2)
      : `${urls.length} unique URL(s) need a hash, across ${payload.references} citation(s)\n` +
        're-run with --apply to fetch (live network; requires a clean git tree)');
    return 0;
  }

  let dirty = '';
  try { dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { dirty = ''; }
  if (dirty) {
    const msg = 'refusing --apply with a dirty working tree: a bulk rewrite must be reviewable as a diff';
    console.log(format === 'json' ? JSON.stringify({ ok: false, error: { command: 'sources', message: msg } }, null, 2)
      : `REFUSED — ${msg}`);
    return 1;
  }

  const tty = process.stdout.isTTY;
  const results = await fetchAll(urls, {
    onProgress: (done, total) => { if (tty) process.stderr.write(`\rfetching ${done}/${total}`); },
  });
  if (tty) process.stderr.write('\n');

  // Write results back into every note citing each URL.
  const touched = new Set();
  for (const collection of Object.values(cfg.collections)) {
    if (collection.frontmatter !== 'yaml' || collection.cards) continue;
    for (const note of listNotes(collection)) {
      const text = fs.readFileSync(note.abs, 'utf8');
      const { data, body, raw } = splitFrontmatter(text);
      if (!data?.sources) continue;

      let changed = false;
      const next = data.sources.map((s) => {
        const r = results.get(s.url);
        if (!r || s.hash) return s;
        if (s.unreachable && !argv.retryDead) return s;
        changed = true;
        // A 403/429 means "this host blocks bots", not "this citation rotted".
        // Keeping the reason is what lets revalidate tell permanently
        // unverifiable sources apart from genuinely dead ones.
        // Carry curator-set metadata through the rewrite: an observation updates
        // what we fetched, never what a human (or judged pass) recorded about
        // the source. Dropping `class` here cost 157 classifications once.
        const keep = {};
        for (const k of ['title', 'class']) if (s[k] !== undefined) keep[k] = s[k];
        return r.unreachable
          ? { url: s.url, ...keep, unreachable: true, reachability: r.reachability, reason: r.reason, checked: r.checked,
              ...(r.archive ? { archive: r.archive } : {}) }
          : { url: s.url, ...keep, hash: r.hash, retrieved: r.retrieved, reachability: 'ok' };
      });
      if (!changed) continue;

      // Every fetch is an observation: append to the C5 store for this note.
      const rid = runId();
      for (const s of data.sources) {
        const r = results.get(s.url);
        if (!r || (s.hash && !argv.retryDead)) continue;
        evidence.recordObservation(ROOT, note.slug, {
          cite_id: evidence.citeId(note.slug, s.url),
          url_canonical: evidence.canonicalUrl(s.url),
          reachability: r.reachability ?? (r.unreachable ? 'dns-transient' : 'ok'),
          detail: r.reason ?? null,
          content_digest: r.hash ?? null,
          archive_url: r.archive ?? null,
        }, rid);
      }

      // Replace only the `sources:` block; everything above it stays byte-identical.
      const lines = raw.split('\n');
      const start = lines.findIndex((l) => /^sources\s*:/.test(l));
      const end = lines.findIndex((l, i) => i > start && /^[A-Za-z_]/.test(l));
      const rendered = stringifyYaml({ sources: next }, { lineWidth: 0 }).trimEnd().split('\n');
      const rebuilt = [...lines.slice(0, start), ...rendered, ...(end === -1 ? [] : lines.slice(end))];
      fs.writeFileSync(note.abs, `---\n${rebuilt.join('\n')}\n---\n${body}`);
      touched.add(note.file);
    }
  }

  const ok = [...results.values()].filter((r) => r.hash);
  const dead = [...results.values()].filter((r) => r.unreachable);
  const payload = {
    ok: true, applied: true, fetched: results.size, hashed: ok.length,
    unreachable: dead.length, filesTouched: touched.size,
    failures: dead.map(({ url, reason }) => ({ url, reason })),
  };

  if (format === 'json') console.log(JSON.stringify(payload, null, 2));
  else {
    console.log(`fetched ${results.size} — ${ok.length} hashed, ${dead.length} unreachable, ${touched.size} file(s) updated`);
    for (const f of dead) console.log(`  DEAD  ${f.reason.padEnd(22)} ${f.url}`);
  }
  return 0;
}

/** P2 — URL(s) into staging/. Deterministic; merit is `kb assess`. */
async function ingest(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const dir = path.join(ROOT, cfg.collections.staging.path);
  const results = [];

  for (const url of argv.urls) {
    try {
      const article = await fetchArticle(url);
      const slug = argv.slug ?? deriveSlug(article.url, article.title);
      const file = path.posix.join(cfg.collections.staging.path, `${slug}.md`);
      const abs = path.join(dir, `${slug}.md`);

      fs.mkdirSync(dir, { recursive: true });
      try {
        fs.writeFileSync(abs, renderStagingNote(article, today()), { flag: argv.force ? 'w' : 'wx' });
      } catch (e) {
        if (e.code === 'EEXIST') {
          results.push({ url, ok: false, file, reason: 'already exists — pass --force to overwrite' });
          continue;
        }
        throw e;
      }
      results.push({ url, ok: true, file, title: article.title });
    } catch (err) {
      results.push({ url, ok: false, reason: err.message });
    }
  }

  if (format === 'json') console.log(JSON.stringify({ ok: results.every((r) => r.ok), results }, null, 2));
  else for (const r of results) console.log(r.ok ? `  wrote ${r.file}  ${r.title}` : `  FAILED ${r.url}: ${r.reason}`);
  return results.every((r) => r.ok) ? 0 : 1;
}

/**
 * P2 — the judgment boundary. Without --verdict this emits a self-contained
 * task for an agent to answer; with one it validates the answer and applies the
 * rubric's routing table. `kb` never calls a model itself, because anything in
 * the verify path must run without a secret.
 */
function assess(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const rubric = loadRubric(KB_DIR, argv.rubric ?? 'promotion');
  const target = argv.target;
  if (!target) throw new Error('assess needs a target file');

  const abs = path.join(ROOT, target);
  if (!fs.existsSync(abs)) throw new Error(`no such file: ${target}`);

  if (!argv.verdict) {
    const concepts = listNotes(cfg.collections.concepts).map((n) => {
      const { data, body } = splitFrontmatter(fs.readFileSync(n.abs, 'utf8'));
      return { slug: n.slug, title: data?.title ?? n.slug, text: `${data?.title ?? ''} ${(data?.tags ?? []).join(' ')} ${body}` };
    });
    const text = fs.readFileSync(abs, 'utf8');
    const task = buildTask(rubric, ROOT, target, text, nearest(text, concepts));
    const wrapped = envlib.emit(ROOT, {
      verb: 'assess', taskClass: 'rubric-ordinal', target,
      inputs: [
        { name: target, text },
        { name: `rubric:${argv.rubric ?? 'promotion'}`, text: JSON.stringify(rubric) },
        { name: 'schema:rubric-verdict.schema.json', text: schemaText('rubric-verdict.schema.json') },
      ],
      allowedWrites: ['.kb/queue/*.jsonl', '.kb/assessments/*.json'],
      schemaVersion: String(cfg.version), task,
    });
    console.log(JSON.stringify(wrapped, null, 2));
    return 0;
  }

  const verdict = JSON.parse(fs.readFileSync(path.resolve(argv.verdict), 'utf8'));
  const gate = envlib.check(ROOT, verdict, {
    verb: 'assess', schemaVersion: String(cfg.version),
    resolveInput: (name) => {
      if (name.startsWith('rubric:')) return JSON.stringify(loadRubric(KB_DIR, name.slice('rubric:'.length)));
      if (name.startsWith('schema:')) return schemaText(name.slice('schema:'.length));
      return undefined;
    },
  });
  if (!gate.ok) return refusal('assess', format, gate);
  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(KB_DIR, 'schemas', 'rubric-verdict.schema.json'), 'utf8')));
  if (!validate(verdict)) {
    const errors = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'assess', message: 'verdict fails schema', errors } }, null, 2)
      : `INVALID VERDICT\n${errors.map((e) => `  ${e}`).join('\n')}`);
    return 1;
  }

  // Every dimension must be rated: a missing one is an unanswered question, and
  // routing on a partial answer would silently treat it as absent.
  const missing = rubric.dimensions.map((d) => d.id).filter((id) => !verdict.dimensions?.[id]);
  if (missing.length) {
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'assess', message: `unrated dimensions: ${missing.join(', ')}` } }, null, 2)
      : `INVALID VERDICT — unrated dimensions: ${missing.join(', ')}`);
    return 1;
  }

  const decision = route(rubric, verdict);

  if (decision.action === 'queue' || argv.queue) {
    queue.propose(QUEUE_DIR, 'promotion', {
      subject: target, value: decision.action,
      rationale: decision.reason, source: `${rubric.id}@${rubric.version}`, today: today(),
    });
  }

  // Persist the verdict: `kb promote` requires one, and the concept it creates
  // stamps `review:` from it, so a promoted note records why it was promoted.
  const recordDir = path.join(ROOT, '.kb', 'assessments');
  fs.mkdirSync(recordDir, { recursive: true });
  fs.writeFileSync(
    path.join(recordDir, `${path.basename(target, '.md')}.json`),
    JSON.stringify({ target, rubric: `${rubric.id}@${rubric.version}`, assessed: today(), ...decision, verdict }, null, 2),
  );

  envlib.commit(gate, { answer: verdict, written: [`.kb/assessments/${path.basename(target, '.md')}.json`] });

  const payload = { ok: true, target, task_id: verdict.task_id, rubric: `${rubric.id}@${rubric.version}`, ...decision };
  console.log(format === 'json' ? JSON.stringify(payload, null, 2)
    : `${decision.action.toUpperCase()} — ${target}\n  ${decision.reason}`);
  return 0;
}

/**
 * Initialise a fresh Chancery-governed repository in the current directory:
 * the default ontology from the package, empty collections, generated
 * harness adapters, and a first index — `kb verify` is green immediately.
 */
function init(argv) {
  const format = pickFormat(argv.format);
  const target = process.cwd();

  const existing = discoverRoot();
  if (existing && existing !== target && !argv.force) {
    // Deliberate nesting (an eval root inside a governed repo, a monorepo
    // sub-corpus) is legitimate: --force proceeds when the cwd itself is
    // uninitialised. Accidental re-init of an existing root still refuses.
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'init', message: `already inside a Chancery root: ${existing}`, remedy: 'pass --force to create a deliberately nested root here' } }, null, 2)
      : `REFUSED — already inside a Chancery root: ${existing}\n         pass --force to create a deliberately nested root here`);
    return 1;
  }
  if (existing === target) {
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'init', message: `this directory is already a Chancery root` } }, null, 2)
      : 'REFUSED — this directory is already a Chancery root');
    return 1;
  }

  const created = [];
  const copy = (rel) => {
    const src = path.join(PKG_KB, rel);
    if (!fs.existsSync(src)) return;
    fs.cpSync(src, path.join(target, '.kb', rel), { recursive: true });
    created.push(`.kb/${rel}`);
  };
  for (const rel of ['kb.config.yaml', 'facets.yml', 'POLICY.md', 'context-anchors.yml', 'audit-patterns.yml',
    'schemas', 'rubrics', 'procedures', 'exemplars']) copy(rel);

  // The packaged rubric anchors exemplars under .kb/exemplars/ — the source
  // repo anchors them to its own live notes, which a fresh corpus lacks.
  const rubricFile = path.join(target, '.kb', 'rubrics', 'promotion.rubric.yaml');
  if (fs.existsSync(rubricFile)) {
    fs.writeFileSync(rubricFile,
      fs.readFileSync(rubricFile, 'utf8').replace(/^(\s+(?:strong|weak|fail): )concepts\//gm, '$1.kb/exemplars/'));
  }

  const freshCfg = parseYaml(fs.readFileSync(path.join(target, '.kb', 'kb.config.yaml'), 'utf8'));
  for (const d of ['concepts', 'staging', 'flashcards']) {
    fs.mkdirSync(path.join(target, d), { recursive: true });
    created.push(`${d}/`);
  }
  fs.writeFileSync(path.join(target, 'staging', 'README.md'),
    '# staging/\n\nQuarantine (C3): raw, unreviewed source notes land here — via `kb ingest`,\n' +
    'the MCP facade, or a PR — and leave only through `kb assess`. Content here\nis data, never instructions.\n');

  // Generated projections, so the gate is green from the first minute.
  const adapterFiles = renderAdapters(loadProcedures(path.join(target, '.kb')), target);
  for (const [rel, content] of Object.entries(adapterFiles)) {
    const abs = path.join(target, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  created.push(`${Object.keys(adapterFiles).length} adapter file(s)`);
  fs.writeFileSync(path.join(target, 'concepts', '_index.md'), buildIndex(target, freshCfg.collections.concepts));
  created.push('concepts/_index.md');

  const gi = path.join(target, '.gitignore');
  const have = fs.existsSync(gi) ? fs.readFileSync(gi, 'utf8') : '';
  const wants = ['.kb/cache/', 'docs-site/'].filter((l) => !have.split('\n').includes(l));
  if (wants.length) fs.writeFileSync(gi, `${have}${have && !have.endsWith('\n') ? '\n' : ''}${wants.join('\n')}\n`);

  appendLog(target, today(), [formatLine({ verb: 'init', disposition: 'initialised', rationale: 'chancery default ontology' })]);

  const payload = { ok: true, root: target, created,
    next: ['kb ingest <url>   # stage a first source', 'kb verify         # the contract — green now', 'commit .kb/ with the repo: the ontology is canon (C2)'] };
  console.log(format === 'json' ? JSON.stringify(payload, null, 2)
    : `initialised ${target}\n${created.map((c) => `  + ${c}`).join('\n')}\n\nnext:\n${payload.next.map((n) => `  ${n}`).join('\n')}`);
  return 0;
}

/** P2 — review the proposal queue. */
function queueCmd(argv) {
  const format = pickFormat(argv.format);
  const [sub, id] = argv.rest;

  if (sub === 'accept-tension') {
    // The third terminal state (ADR-005): a legitimately unresolved tension,
    // governed as open without KB011 reddening the corpus. Rationale required.
    if (!argv.why) throw new Error('accept-tension requires --why "<rationale>"');
    const hit = queue.resolve(QUEUE_DIR, id, 'accepted-tension', today(), argv.why);
    if (hit) logApply({ verb: 'queue', target: id, disposition: 'accepted-tension', rationale: `${hit.subject} -> ${hit.value}; ${argv.why}` });
    const payload = hit ? { ok: true, resolved: hit } : { ok: false, error: { message: `no open proposal \`${id}\`` } };
    console.log(format === 'json' ? JSON.stringify(payload, null, 2)
      : hit ? `accepted-tension ${id} — ${hit.subject}` : `no proposal ${id}`);
    return hit ? 0 : 1;
  }

  if (sub === 'accept' || sub === 'reject') {
    const hit = queue.resolve(QUEUE_DIR, id, sub === 'accept' ? 'accepted' : 'rejected', today());
    if (hit) logApply({ verb: 'queue', target: id, disposition: `${sub}ed`, rationale: `${hit.subject} -> ${hit.value}` });
    const payload = hit ? { ok: true, resolved: hit } : { ok: false, error: { message: `no open proposal \`${id}\`` } };
    console.log(format === 'json' ? JSON.stringify(payload, null, 2)
      : hit ? `${sub}ed ${id} — ${hit.subject}` : `no proposal ${id}`);
    return hit ? 0 : 1;
  }

  const entries = queue.list(QUEUE_DIR, { status: argv.all ? undefined : 'open' });
  if (format === 'json') console.log(JSON.stringify({ ok: true, entries }, null, 2));
  else if (!entries.length) console.log('queue: empty');
  else for (const e of entries) console.log(`  ${e.id}  ${e.kind.padEnd(9)} ${e.status.padEnd(8)} ${e.subject} -> ${e.value}`);
  return 0;
}

/**
 * P3 — staging note into concept note(s). Two phases, like assess: without
 * --draft this emits the drafting task; with one it validates and renders.
 */
function promote(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const slug = argv.target?.replace(/^staging\//, '').replace(/\.md$/, '');
  if (!slug) throw new Error('promote needs a staging slug or path');

  const stagingFile = path.posix.join(cfg.collections.staging.path, `${slug}.md`);
  const abs = path.join(ROOT, stagingFile);
  if (!fs.existsSync(abs)) throw new Error(`no such staging note: ${stagingFile}`);
  const stagingText = fs.readFileSync(abs, 'utf8');

  const recordFile = path.join(ROOT, '.kb', 'assessments', `${slug}.json`);
  const record = fs.existsSync(recordFile) ? JSON.parse(fs.readFileSync(recordFile, 'utf8')) : null;

  // Promotion is gated on assessment: without it the rubric is decorative, and
  // anything ingested could walk straight into the corpus unjudged.
  if (!argv.force && record?.action !== 'promote' && record?.action !== 'split') {
    const msg = record
      ? `assessment routed this to \`${record.action}\`, not promote`
      : 'no assessment on record — run `kb assess` first';
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'promote', message: msg } }, null, 2)
      : `REFUSED — ${msg}\n         pass --force to override`);
    return 1;
  }

  const concepts = listNotes(cfg.collections.concepts).map((n) => {
    const { data, body } = splitFrontmatter(fs.readFileSync(n.abs, 'utf8'));
    return { slug: n.slug, title: data?.title ?? n.slug, text: `${data?.title ?? ''} ${(data?.tags ?? []).join(' ')} ${body}` };
  });

  const promoteInputs = () => [
    { name: stagingFile, text: fs.readFileSync(abs, 'utf8') },
    { name: `assessment:${slug}`, text: fs.existsSync(recordFile) ? fs.readFileSync(recordFile, 'utf8') : 'none' },
    { name: 'schema:concept-draft.schema.json', text: schemaText('concept-draft.schema.json') },
  ];

  if (!argv.draft) {
    const task = buildDraftTask(stagingFile, stagingText, nearest(stagingText, concepts, 10), cfg.collections.concepts.sections, record);
    console.log(JSON.stringify(envlib.emit(ROOT, {
      verb: 'promote', taskClass: 'drafting', target: stagingFile,
      inputs: promoteInputs(),
      allowedWrites: [`${cfg.collections.concepts.path}/*.md`, '.kb/queue/*.jsonl'],
      schemaVersion: String(cfg.version), task,
    }), null, 2));
    return 0;
  }

  const drafted = JSON.parse(fs.readFileSync(path.resolve(argv.draft), 'utf8'));
  const gate = envlib.check(ROOT, drafted, {
    verb: 'promote', schemaVersion: String(cfg.version),
    resolveInput: (name) => {
      if (name === `assessment:${slug}`) return fs.existsSync(recordFile) ? fs.readFileSync(recordFile, 'utf8') : 'none';
      if (name.startsWith('schema:')) return schemaText(name.slice('schema:'.length));
      return undefined;
    },
  });
  if (!gate.ok) return refusal('promote', format, gate);
  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(KB_DIR, 'schemas', 'concept-draft.schema.json'), 'utf8')));
  if (!validate(drafted)) {
    const errors = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'promote', message: 'draft fails schema', errors } }, null, 2)
      : `INVALID DRAFT\n${errors.map((e) => `  ${e}`).join('\n')}`);
    return 1;
  }

  const existing = new Set(concepts.map((c) => c.slug));
  const collisions = drafted.concepts.filter((d) => existing.has(d.slug));
  if (collisions.length && !argv.force) {
    const msg = `slug already exists: ${collisions.map((c) => c.slug).join(', ')}`;
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'promote', message: msg } }, null, 2)
      : `REFUSED — ${msg}\n         a duplicate slug would overwrite a concept; rename or pass --force`);
    return 1;
  }

  const sourceUrl = stagingSourceUrl(stagingText);
  const gaps = unresolvedTargets(drafted.concepts, existing);

  const writes = drafted.concepts.map((draft) => ({
    file: path.posix.join(cfg.collections.concepts.path, `${draft.slug}.md`),
    abs: path.join(ROOT, cfg.collections.concepts.path, `${draft.slug}.md`),
    text: renderConcept(draft, { sourceUrl, today: today() }),
    title: draft.title,
  }));

  // Answer-controlled paths go through the write-set guard — a slug is never
  // trusted to be a path (envelope spec §3.1).
  const guard = envlib.guardWrites(gate.record.envelope, ROOT, writes.map((w) => w.file));
  if (!guard.ok) return refusal('promote', format, guard);

  const written = writes.map((w) => ({ file: w.file, title: w.title }));
  if (argv.apply) {
    const errors = applyWithRollback(writes, cfg.collections.concepts, cfg);
    if (errors.length) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'promote', message: 'post-apply verify failed — rolled back', findings: errors } }, null, 2)
        : `ROLLED BACK — post-apply verify failed\n${errors.map((e) => `  ${e.code} ${e.file}: ${e.message}`).join('\n')}`);
      return 1;
    }
    index({ quiet: true, check: false });
    envlib.commit(gate, { answer: drafted, written: writes.map((w) => w.file) });
    logApply({ verb: 'promote', target: stagingFile, disposition: 'applied',
      rationale: `${writes.length} concept(s): ${writes.map((w) => path.basename(w.file, '.md')).join(', ')}` });
  }

  const payload = { ok: true, applied: !!argv.apply, source: stagingFile, written, gaps };
  if (format === 'json') console.log(JSON.stringify(payload, null, 2));
  else {
    for (const w of written) console.log(`  ${argv.apply ? 'wrote' : 'would write'} ${w.file}  ${w.title}`);
    for (const g of gaps) console.log(`  gap: ${g.from} -> [[${g.target}]] (${g.kind}) — recorded, link left in place`);
    if (!argv.apply) console.log('\nDRY RUN — re-run with --apply to write');
  }
  return 0;
}

/**
 * P4 — concept into flashcards. Two phases again: emit a drafting task, then
 * validate and render. Refresh matches on the card ids minted in P1, which is
 * what makes it safe to rewrite a card without duplicating or orphaning it.
 */
function cards(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const slug = argv.target?.replace(/^(concepts|flashcards)\//, '').replace(/\.md$/, '');
  if (!slug) throw new Error('cards needs a concept slug');

  const conceptAbs = path.join(ROOT, cfg.collections.concepts.path, `${slug}.md`);
  if (!fs.existsSync(conceptAbs)) throw new Error(`no such concept: ${slug}`);
  const concept = splitFrontmatter(fs.readFileSync(conceptAbs, 'utf8'));

  const deckFile = path.posix.join(cfg.collections.flashcards.path, `${slug}.md`);
  const deckAbs = path.join(ROOT, deckFile);
  const existing = fs.existsSync(deckAbs) ? fs.readFileSync(deckAbs, 'utf8') : null;
  const cardsInputs = () => [
    { name: path.posix.join(cfg.collections.concepts.path, `${slug}.md`), text: fs.readFileSync(conceptAbs, 'utf8') },
    ...(fs.existsSync(deckAbs)
      ? [{ name: deckFile, text: fs.readFileSync(deckAbs, 'utf8') }]
      : [{ name: 'deck:none', text: 'none' }]),
    { name: 'schema:card-draft.schema.json', text: schemaText('card-draft.schema.json') },
  ];

  if (!argv.draft) {
    const current = existing
      ? parseDeck(splitFrontmatter(existing).body)
          .filter((b) => b.isCard)
          .map((b) => ({ id: b.id, heading: b.heading, question: b.question, answer: b.answer, reviewed: b.hasReviewHistory }))
      : [];
    const task = {
      target: deckFile,
      mode: existing ? 'refresh' : 'create',
      instructions:
        'Write spaced-repetition cards for the concept below. One idea per card; the question must ' +
        'be answerable from the concept alone. When refreshing, keep the `id` of any card you are ' +
        'revising and set semantic_change true only if the card now asks a different question — ' +
        'that drops its review history, so do not set it for wording fixes. Omit a card entirely to ' +
        'leave it untouched; cards are never deleted automatically. New cards need no id. ' +
        'Reply with JSON conforming to card-draft.schema.json and nothing else.',
      existing_cards: current,
      concept: { title: concept.data?.title, tags: concept.data?.tags, body: concept.body },
      response_schema: 'card-draft.schema.json',
    };
    console.log(JSON.stringify(envlib.emit(ROOT, {
      verb: 'cards', taskClass: 'drafting', target: slug,
      inputs: cardsInputs(),
      allowedWrites: [deckFile],
      schemaVersion: String(cfg.version), task,
    }), null, 2));
    return 0;
  }

  const drafted = JSON.parse(fs.readFileSync(path.resolve(argv.draft), 'utf8'));
  const gate = envlib.check(ROOT, drafted, {
    verb: 'cards', schemaVersion: String(cfg.version),
    resolveInput: (name) => {
      if (name === 'deck:none') return fs.existsSync(deckAbs) ? null : 'none';
      if (name.startsWith('schema:')) return schemaText(name.slice('schema:'.length));
      return undefined;
    },
  });
  if (!gate.ok) return refusal('cards', format, gate);

  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(KB_DIR, 'schemas', 'card-draft.schema.json'), 'utf8')));
  if (!validate(drafted)) {
    const errors = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'cards', message: 'draft fails schema', errors } }, null, 2)
      : `INVALID DRAFT\n${errors.map((e) => `  ${e}`).join('\n')}`);
    return 1;
  }

  // Ids must be unique across every deck, not just this one.
  const globalIds = new Set();
  for (const n of listNotes(cfg.collections.flashcards)) {
    for (const b of parseDeck(splitFrontmatter(fs.readFileSync(n.abs, 'utf8')).body)) if (b.id) globalIds.add(b.id);
  }

  let text, notes;
  if (existing) {
    ({ text, notes } = mergeDeck(slug, existing, drafted.cards, globalIds));
  } else {
    const tags = (concept.data?.tags ?? []).filter((t) => t !== 'concept');
    text = renderDeck({
      slug, title: concept.data?.title ?? slug, tags,
      deckTag: tags[0] ?? 'general', cards: drafted.cards, today: today(),
    });
    notes = { updated: [], added: drafted.cards.length, scheduleReset: [], unknownId: [], untouched: [] };
  }

  if (notes.unknownId?.length) {
    const msg = `draft references card id(s) not in this deck: ${notes.unknownId.join(', ')}`;
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'cards', message: msg } }, null, 2)
      : `REFUSED — ${msg}\n         an unknown id means the draft is stale; re-read the deck`);
    return 1;
  }

  if (argv.apply) {
    const errors = applyWithRollback([{ file: deckFile, abs: deckAbs, text }], cfg.collections.flashcards, cfg);
    if (errors.length) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'cards', message: 'post-apply verify failed — rolled back', findings: errors } }, null, 2)
        : `ROLLED BACK — post-apply verify failed\n${errors.map((e) => `  ${e.code} ${e.file}: ${e.message}`).join('\n')}`);
      return 1;
    }
    envlib.commit(gate, { answer: drafted, written: [deckFile] });
    logApply({ verb: 'cards', target: slug, disposition: existing ? 'refreshed' : 'created',
      rationale: `+${Array.isArray(notes.added) ? notes.added.length : notes.added} ~${notes.updated.length ?? 0}` });
  }

  const payload = { ok: true, applied: !!argv.apply, mode: existing ? 'refresh' : 'create', file: deckFile, ...notes };
  if (format === 'json') console.log(JSON.stringify(payload, null, 2));
  else {
    console.log(`  ${argv.apply ? 'wrote' : 'would write'} ${deckFile} (${payload.mode})`);
    const n = (x) => (Array.isArray(x) ? x.length : x);
    console.log(`    ${n(notes.added)} added, ${n(notes.updated)} updated, ${n(notes.untouched)} left untouched`);
    if (n(notes.scheduleReset)) console.log(`    ${n(notes.scheduleReset)} card(s) lost review history (semantic_change)`);
    if (!argv.apply) console.log('\nDRY RUN — re-run with --apply to write');
  }
  return 0;
}

/**
 * P5 — facet classification. Emits a task for unclassified notes, or applies a
 * returned assignment. Novel values never fail: they become queue proposals.
 */
function facets(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const spec = loadFacets(KB_DIR);
  const notes = listNotes(cfg.collections.concepts)
    .map((n) => ({ ...n, ...splitFrontmatter(fs.readFileSync(n.abs, 'utf8')) }));

  if (!argv.draft) {
    const unclassified = notes.filter((n) => !Object.keys(spec.axes).some((a) => n.data?.[a]));
    // Evenly spaced, not the first N. The corpus is alphabetical and heavily
    // front-loaded with `agent-*` notes, so a head sample would test one domain
    // and tell you nothing about whether the axes span the whole corpus.
    const want = argv.sample ?? argv.limit ?? 25;
    const picked = argv.sample
      ? Array.from({ length: Math.min(want, unclassified.length) },
                   (_, i) => unclassified[Math.floor((i * unclassified.length) / want)])
      : unclassified.slice(0, want);
    const batch = picked.map((n) => ({
      slug: n.slug, title: n.data?.title, tags: n.data?.tags,
      definition: section(n.body, 'Definition').slice(0, 700),
    }));
    const task = {
      ...buildFacetTask(spec, batch),
      remaining_unclassified: unclassified.length - batch.length,
      sampling: argv.sample ? 'evenly spaced across the unclassified set' : 'first N',
    };
    console.log(JSON.stringify(envlib.emit(ROOT, {
      verb: 'facets', taskClass: 'classification', target: `batch:${picked.length}`,
      inputs: [
        ...picked.map((n) => ({ name: n.file, text: fs.readFileSync(n.abs, 'utf8') })),
        { name: 'facets.yml', text: fs.readFileSync(path.join(KB_DIR, 'facets.yml'), 'utf8') },
        { name: 'schema:facet-draft.schema.json', text: schemaText('facet-draft.schema.json') },
      ],
      allowedWrites: [`${cfg.collections.concepts.path}/*.md`, '.kb/queue/*.jsonl'],
      schemaVersion: String(cfg.version), task,
    }), null, 2));
    return 0;
  }

  const drafted = JSON.parse(fs.readFileSync(path.resolve(argv.draft), 'utf8'));
  const gate = envlib.check(ROOT, drafted, {
    verb: 'facets', schemaVersion: String(cfg.version),
    resolveInput: (name) => {
      if (name === 'facets.yml') return fs.readFileSync(path.join(KB_DIR, 'facets.yml'), 'utf8');
      if (name.startsWith('schema:')) return schemaText(name.slice('schema:'.length));
      return undefined;
    },
  });
  if (!gate.ok) return refusal('facets', format, gate);

  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(KB_DIR, 'schemas', 'facet-draft.schema.json'), 'utf8')));
  if (!validate(drafted)) {
    const errors = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'facets', message: 'draft fails schema', errors } }, null, 2)
      : `INVALID DRAFT\n${errors.map((e) => `  ${e}`).join('\n')}`);
    return 1;
  }

  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  const applied = [];
  const rejected = [];
  const writes = [];

  for (const a of drafted.assignments) {
    const note = bySlug.get(a.slug);
    if (!note) { rejected.push({ slug: a.slug, why: 'no such concept' }); continue; }
    if (!spec.axes.domain.includes(a.domain)) { rejected.push({ slug: a.slug, why: `domain \`${a.domain}\` not in closed axis` }); continue; }

    // Uncurated topics are dropped from the write and queued, never silently kept.
    const curated = new Set(spec.topics?.curated ?? []);
    const keep = (a.topics ?? []).filter((t) => curated.has(t));
    for (const t of (a.topics ?? []).filter((t) => !curated.has(t))) {
      queue.propose(QUEUE_DIR, 'facet', { subject: a.slug, value: `topic:${t}`, rationale: a.rationale ?? null, source: 'facets', today: today() });
    }

    const next = applyFacets(spec, note.raw, note.data, { ...a, topics: keep });
    writes.push({ file: note.file, abs: note.abs, text: `---\n${next}\n---\n${note.body}` });
    applied.push(a.slug);
  }

  const guard = envlib.guardWrites(gate.record.envelope, ROOT, writes.map((w) => w.file));
  if (!guard.ok) return refusal('facets', format, guard);

  if (argv.apply && writes.length) {
    const errors = applyWithRollback(writes, cfg.collections.concepts, cfg);
    if (errors.length) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'facets', message: 'post-apply verify failed — rolled back', findings: errors } }, null, 2)
        : `ROLLED BACK — post-apply verify failed\n${errors.map((e) => `  ${e.code} ${e.file}: ${e.message}`).join('\n')}`);
      return 1;
    }
    // Tags feed the generated index, so it must be rebuilt in the same breath.
    index({ quiet: true, check: false });
    envlib.commit(gate, { answer: drafted, written: writes.map((w) => w.file) });
    logApply({ verb: 'facets', target: `batch:${applied.length}`, disposition: 'classified',
      rationale: `${writes.length} note(s) written` });
  }

  for (const p of drafted.topic_proposals ?? []) {
    queue.propose(QUEUE_DIR, 'facet', { subject: p.for_slug ?? '(vocabulary)', value: `topic:${p.value}`, rationale: p.rationale, source: 'facets', today: today() });
  }
  // An axis gap is a defect in the axis, not a missing detail — closed axes are
  // supposed to span the corpus. Queued separately so it reads that way.
  for (const p of drafted.axis_proposals ?? []) {
    queue.propose(QUEUE_DIR, 'vocab', { subject: p.for_slug ?? '(axis)', value: `${p.axis}:${p.value}`, rationale: p.rationale, source: 'facets', today: today() });
  }

  const payload = { ok: rejected.length === 0, applied: !!argv.apply, classified: applied.length, rejected };
  if (format === 'json') console.log(JSON.stringify(payload, null, 2));
  else {
    console.log(`  ${argv.apply ? 'classified' : 'would classify'} ${applied.length} concept(s)`);
    for (const r of rejected) console.log(`  REJECTED ${r.slug}: ${r.why}`);
    if (!argv.apply) console.log('\nDRY RUN — re-run with --apply to write');
  }
  return rejected.length ? 1 : 0;
}

/**
 * P5 — cross-linking. `check` reports weakly-connected notes; `suggest` emits a
 * task and turns the answer into queue proposals; `--apply` appends bullets
 * additively. Never rewrites or removes an existing link.
 */
function link(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const notes = loadNotes(ROOT, cfg.collections.concepts, listNotes);
  const inbound = linkGraph(notes);

  const isolated = notes.filter((n) => inbound.get(n.slug).size === 0);
  const sub = argv.rest[0];

  if (sub === 'check' || (!argv.draft && !sub)) {
    const oneWays = oneWay(notes);
    const payload = {
      ok: true, concepts: notes.length,
      isolated: isolated.map((n) => n.slug),
      one_way_links: oneWays.length,
      median_inbound: [...notes.map((n) => inbound.get(n.slug).size)].sort((a, b) => a - b)[Math.floor(notes.length / 2)],
    };
    if (format === 'json') console.log(JSON.stringify(payload, null, 2));
    else {
      console.log(`  ${notes.length} concepts, median ${payload.median_inbound} inbound link(s)`);
      console.log(`  ${isolated.length} isolated (nothing links to them):`);
      for (const n of isolated) console.log(`     ${n.slug}`);
      console.log(`  ${oneWays.length} one-way link(s) — candidates for a reciprocal backlink`);
    }
    return 0;
  }

  if (sub === 'suggest' && !argv.draft) {
    const conceptsForShortlist = notes.map((n) => ({ slug: n.slug, title: n.title, text: `${n.title} ${n.body}` }));
    const targetNotes = (argv.slug ? notes.filter((n) => n.slug === argv.slug) : isolated).slice(0, argv.limit ?? 10);
    const targets = targetNotes
      .map((n) => ({ slug: n.slug, title: n.title, definition: n.definition, inbound: inbound.get(n.slug).size }));
    const neighboursFor = (slug) => {
      const self = notes.find((n) => n.slug === slug);
      return nearest(`${self.title} ${self.body}`, conceptsForShortlist.filter((c) => c.slug !== slug), 8);
    };
    console.log(JSON.stringify(envlib.emit(ROOT, {
      verb: 'link', taskClass: 'drafting', target: argv.slug ?? `isolated:${targets.length}`,
      inputs: [
        ...targetNotes.map((n) => ({ name: n.file, text: n.text })),
        { name: 'schema:link-draft.schema.json', text: schemaText('link-draft.schema.json') },
      ],
      allowedWrites: [`${cfg.collections.concepts.path}/*.md`, '.kb/queue/*.jsonl'],
      schemaVersion: String(cfg.version), task: buildLinkTask(targets, neighboursFor),
    }), null, 2));
    return 0;
  }

  const drafted = JSON.parse(fs.readFileSync(path.resolve(argv.draft), 'utf8'));
  const gate = envlib.check(ROOT, drafted, {
    verb: 'link', schemaVersion: String(cfg.version),
    resolveInput: (name) => (name.startsWith('schema:') ? schemaText(name.slice('schema:'.length)) : undefined),
  });
  if (!gate.ok) return refusal('link', format, gate);

  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(KB_DIR, 'schemas', 'link-draft.schema.json'), 'utf8')));
  if (!validate(drafted)) {
    const errors = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'link', message: 'draft fails schema', errors } }, null, 2)
      : `INVALID DRAFT\n${errors.map((e) => `  ${e}`).join('\n')}`);
    return 1;
  }

  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  const pending = new Map();
  const rejected = [];

  for (const l of drafted.links) {
    if (!bySlug.has(l.from) || !bySlug.has(l.target)) { rejected.push({ ...l, why: 'unknown slug' }); continue; }
    if (!pending.has(l.from)) pending.set(l.from, []);
    pending.get(l.from).push({ target: l.target, clause: l.clause });
    if (l.reciprocal) {
      if (!pending.has(l.target)) pending.set(l.target, []);
      pending.get(l.target).push({ target: l.from, clause: l.reciprocal_clause ?? l.clause });
    }
    queue.propose(QUEUE_DIR, 'link', {
      subject: l.from, value: l.target, rationale: l.clause, source: 'link', today: today(),
    });
  }

  let added = 0;
  const touched = [];
  const writes = [];
  for (const [slug, additions] of pending) {
    const note = bySlug.get(slug);
    const res = appendRelationships(note.text, additions);
    if (!res.added) continue;
    writes.push({ file: note.file, abs: note.abs, text: res.text });
    added += res.added;
    touched.push({ file: note.file, added: res.added });
  }

  const guard = envlib.guardWrites(gate.record.envelope, ROOT, writes.map((w) => w.file));
  if (!guard.ok) return refusal('link', format, guard);

  if (argv.apply && writes.length) {
    const errors = applyWithRollback(writes, cfg.collections.concepts, cfg);
    if (errors.length) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'link', message: 'post-apply verify failed — rolled back', findings: errors } }, null, 2)
        : `ROLLED BACK — post-apply verify failed\n${errors.map((e) => `  ${e.code} ${e.file}: ${e.message}`).join('\n')}`);
      return 1;
    }
    envlib.commit(gate, { answer: drafted, written: writes.map((w) => w.file) });
    logApply({ verb: 'link', target: `${writes.length} note(s)`, disposition: 'applied',
      rationale: `+${added} link(s)` });
  }

  const payload = { ok: rejected.length === 0, applied: !!argv.apply, links: added, touched, rejected };
  if (format === 'json') console.log(JSON.stringify(payload, null, 2));
  else {
    for (const t2 of touched) console.log(`  ${argv.apply ? '+' : 'would add'} ${t2.added} link(s) -> ${t2.file}`);
    for (const r of rejected) console.log(`  REJECTED ${r.from} -> ${r.target}: ${r.why}`);
    if (!argv.apply) console.log('\nDRY RUN — re-run with --apply to write');
  }
  return rejected.length ? 1 : 0;
}

/**
 * Supersession (validation-r1a §3): one atomic, gated transition. The old note
 * gets status: superseded + superseded_by and its body leans to a pointer
 * (the sanctioned POLICY exception); each successor gains supersedes. Two-file
 * (or N-file) transaction: all writes stage, subset-verify, then land — or none.
 */
function supersede(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const oldSlug = argv.target;
  const by = (argv.by ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!oldSlug || !by.length) throw new Error('usage: kb supersede <old-slug> --by <new-slug[,new-slug]> [--apply]');

  const notes = new Map(listNotes(cfg.collections.concepts).map((n) => [n.slug, n]));
  const old = notes.get(oldSlug);
  if (!old) throw new Error(`no such concept: ${oldSlug}`);
  const missing = by.filter((s) => !notes.has(s));
  if (missing.length) throw new Error(`successor(s) do not exist: ${missing.join(', ')}`);
  if (by.includes(oldSlug)) throw new Error('a note cannot supersede itself');

  const oldParsed = splitFrontmatter(fs.readFileSync(old.abs, 'utf8'));
  if (oldParsed.data?.status === 'superseded') {
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'supersede', message: `${oldSlug} is already superseded` } }, null, 2)
      : `REFUSED — ${oldSlug} is already superseded`);
    return 1;
  }

  // Old note: frontmatter surgically updated, body leaned to a pointer.
  const oldLines = oldParsed.raw.split('\n');
  const statusIdx = oldLines.findIndex((l) => /^status\s*:/.test(l));
  if (statusIdx === -1) oldLines.push('status: superseded');
  else oldLines[statusIdx] = 'status: superseded';
  oldLines.push(`superseded_by: [${by.join(', ')}]`);
  const title = oldParsed.data?.title ?? oldSlug;
  const pointer = `# ${title}\n\n> Superseded by ${by.map((s) => `[[${s}]]`).join(', ')} — full text in git history (\`git log -- ${old.file}\`).\n`;
  const writes = [{ file: old.file, abs: old.abs, text: `---\n${oldLines.join('\n')}\n---\n\n${pointer}` }];

  // Each successor gains the reciprocal supersedes entry (additive).
  for (const s of by) {
    const succ = notes.get(s);
    const parsed = splitFrontmatter(fs.readFileSync(succ.abs, 'utf8'));
    const have = parsed.data?.supersedes ?? [];
    if (have.includes(oldSlug)) continue;
    const lines = parsed.raw.split('\n');
    const idx = lines.findIndex((l) => /^supersedes\s*:/.test(l));
    if (idx === -1) lines.push(`supersedes: [${[...have, oldSlug].join(', ')}]`);
    else lines[idx] = `supersedes: [${[...have, oldSlug].join(', ')}]`;
    writes.push({ file: succ.file, abs: succ.abs, text: `---\n${lines.join('\n')}\n---\n${parsed.body}` });
  }

  if (!argv.apply) {
    console.log(format === 'json'
      ? JSON.stringify({ ok: true, applied: false, would_write: writes.map((w) => w.file) }, null, 2)
      : writes.map((w) => `  would write ${w.file}`).join('\n') + '\n\nDRY RUN — re-run with --apply');
    return 0;
  }

  // The leaned pointer must skip section checks: superseded notes are exempt
  // from KB003/KB004 by status (see checkNoteText), so subset verify covers
  // schema validity only. Rollback restores every file byte-identically.
  const errors = applyWithRollback(writes, cfg.collections.concepts, cfg);
  if (errors.length) {
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'supersede', message: 'post-apply verify failed — rolled back', findings: errors } }, null, 2)
      : `ROLLED BACK\n${errors.map((e) => `  ${e.code} ${e.file}: ${e.message}`).join('\n')}`);
    return 1;
  }
  index({ quiet: true, check: false });
  logApply({ verb: 'supersede', target: oldSlug, disposition: 'superseded', rationale: `by ${by.join(', ')}` });

  const payload = { ok: true, applied: true, superseded: oldSlug, by, written: writes.map((w) => w.file) };
  console.log(format === 'json' ? JSON.stringify(payload, null, 2)
    : writes.map((w) => `  wrote ${w.file}`).join('\n'));
  return 0;
}

/**
 * Support verdicts (validation-r1a §2): a NETWORK verb — snapshots land in the
 * gitignored cache; the committed record is digests + verdicts. Two-phase,
 * evidence-verdict task class (panels excluded by the envelope).
 */
async function support(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const slug = argv.target?.replace(/^concepts\//, '').replace(/\.md$/, '');
  if (!slug) throw new Error('support needs a concept slug');
  const abs = path.join(ROOT, cfg.collections.concepts.path, `${slug}.md`);
  if (!fs.existsSync(abs)) throw new Error(`no such concept: ${slug}`);
  const noteText = fs.readFileSync(abs, 'utf8');
  const { data, body } = splitFrontmatter(noteText);
  const noteFile = path.posix.join(cfg.collections.concepts.path, `${slug}.md`);

  const cacheDir = path.join(ROOT, '.kb', 'cache', 'snapshots');
  const urlSources = (data?.sources ?? []).filter((s) => s.url && !s.unreachable);
  const cites = urlSources.slice(0, Math.min(argv.limit ?? 5, 5)).map((s) => ({
    cite_id: evidence.citeId(slug, s.url), url: s.url,
  }));
  if (!cites.length) throw new Error(`${slug} has no reachable URL citations to judge`);

  if (!argv.verdicts) {
    fs.mkdirSync(cacheDir, { recursive: true });
    const rid = runId();
    const snapshots = [];
    for (const c of cites) {
      const cacheFile = path.join(cacheDir, `${c.cite_id}.txt`);
      if (!fs.existsSync(cacheFile)) {
        if (argv.noFetch) { snapshots.push({ ...c, skipped: 'no cached snapshot (--no-fetch)' }); continue; }
        try {
          const got = await fetchExtract(c.url);
          const capped = got.text.slice(0, 256 * 1024);
          fs.writeFileSync(cacheFile, capped);
          evidence.recordObservation(ROOT, slug, {
            cite_id: c.cite_id, url_canonical: evidence.canonicalUrl(c.url),
            reachability: 'ok', content_digest: got.hash,
          }, rid);
        } catch (err) {
          snapshots.push({ ...c, skipped: String(err.message).slice(0, 80) });
          continue;
        }
      }
      snapshots.push({ ...c, text: fs.readFileSync(cacheFile, 'utf8') });
    }
    const usable = snapshots.filter((s) => s.text);
    if (!usable.length) throw new Error('no judgeable citations (all skipped) — see snapshots in output');

    const task = {
      note: { slug, title: data?.title, body },
      citations: usable.map((s) => ({ cite_id: s.cite_id, url: s.url, extracted_text: s.text })),
      skipped: snapshots.filter((s) => s.skipped).map(({ cite_id, url, skipped }) => ({ cite_id, url, skipped })),
      instructions:
        'For each citation, find the claims in the note that this source bears on. Quote each claim ' +
        'VERBATIM from the note body as claim_quote (12-600 chars, exact substring — it is checked ' +
        'mechanically). Verdict per (claim, citation): SUPPORTED / UNCERTAIN / CONTRADICTED, judged ' +
        'only from the extracted text, with a one-clause rationale. Reply as JSON per ' +
        'support-verdict.schema.json and nothing else.',
      response_schema: 'support-verdict.schema.json',
    };
    console.log(JSON.stringify(envlib.emit(ROOT, {
      verb: 'support', taskClass: 'evidence-verdict', target: slug,
      inputs: [
        { name: noteFile, text: noteText },
        ...usable.map((s) => ({ name: `cite:${s.cite_id}`, text: s.text })),
        { name: 'schema:support-verdict.schema.json', text: schemaText('support-verdict.schema.json') },
      ],
      allowedWrites: ['.kb/evidence/*.jsonl', '.kb/queue/*.jsonl'],
      schemaVersion: String(cfg.version), task,
    }), null, 2));
    return 0;
  }

  const answer = JSON.parse(fs.readFileSync(path.resolve(argv.verdicts), 'utf8'));
  const gate = envlib.check(ROOT, answer, {
    verb: 'support', schemaVersion: String(cfg.version),
    resolveInput: (name) => {
      if (name.startsWith('cite:')) {
        const f = path.join(cacheDir, `${name.slice(5)}.txt`);
        return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
      }
      if (name.startsWith('schema:')) return schemaText(name.slice('schema:'.length));
      return undefined;
    },
  });
  if (!gate.ok) return refusal('support', format, gate);

  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = ajv.compile(JSON.parse(schemaText('support-verdict.schema.json')));
  if (!validate(answer)) {
    const errors = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'support', message: 'verdicts fail schema', errors } }, null, 2)
      : `INVALID\n${errors.map((e) => `  ${e}`).join('\n')}`);
    return 1;
  }

  // The verbatim rule: every claim_quote must be an exact substring of the
  // note body the task was emitted against (the note file is an envelope
  // input, so "current body" and "emission body" are the same or we refused).
  const fabricated = answer.verdicts.filter((v) => !body.includes(v.claim_quote));
  if (fabricated.length) {
    const msg = `claim_quote(s) are not verbatim substrings of the note: ${fabricated.map((v) => v.claim_quote.slice(0, 40)).join(' | ')}`;
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'support', message: msg } }, null, 2)
      : `REFUSED — ${msg}`);
    return 1;
  }

  const rid = runId();
  const knownCites = new Set(cites.map((c) => c.cite_id));
  const byCite = new Map();
  for (const v of answer.verdicts) {
    if (!knownCites.has(v.cite_id)) continue; // unknown cite: not in this note's set
    if (!byCite.has(v.cite_id)) byCite.set(v.cite_id, []);
    byCite.get(v.cite_id).push({ claim_quote: v.claim_quote, verdict: v.verdict, rationale: v.rationale, task_id: answer.task_id });
  }
  for (const [cid, verdicts] of byCite) {
    const url = cites.find((c) => c.cite_id === cid).url;
    evidence.recordObservation(ROOT, slug, {
      cite_id: cid, url_canonical: evidence.canonicalUrl(url),
      reachability: 'ok', support: verdicts,
    }, rid);
  }
  for (const v of answer.verdicts.filter((v) => v.verdict !== 'SUPPORTED')) {
    queue.propose(QUEUE_DIR, 'support', {
      subject: slug, value: `${v.verdict}:${v.cite_id}`,
      rationale: `${v.claim_quote.slice(0, 120)} — ${v.rationale}`, source: 'support', today: today(),
    });
  }
  envlib.commit(gate, { answer, written: [`.kb/evidence/${slug}.jsonl`] });

  const counts = { SUPPORTED: 0, UNCERTAIN: 0, CONTRADICTED: 0 };
  for (const v of answer.verdicts) counts[v.verdict]++;
  const payload = { ok: true, slug, recorded: answer.verdicts.length, ...counts };
  console.log(format === 'json' ? JSON.stringify(payload, null, 2)
    : `recorded ${payload.recorded} verdict(s): ${counts.SUPPORTED} supported, ${counts.UNCERTAIN} uncertain, ${counts.CONTRADICTED} contradicted`);
  return 0;
}

/**
 * P6 — revalidation. Re-fetch cited sources and compare against the stored
 * content hash. Drift is a *finding*, never an automatic edit: the source moving
 * does not tell you the concept is now wrong, only that a human or model should
 * look. Confirmed-reviewed drift is accepted explicitly via --accept.
 *
 * Time-gated by nature. Hashes captured today will report nothing for weeks;
 * that is the tool working, not failing.
 */
async function revalidate(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const notes = listNotes(cfg.collections.concepts)
    .map((n) => ({ ...n, ...splitFrontmatter(fs.readFileSync(n.abs, 'utf8')) }))
    .filter((n) => (n.data?.sources ?? []).some((s) => s.hash));

  const targets = argv.slug ? notes.filter((n) => n.slug === argv.slug) : notes;

  if (argv.accept) {
    const note = notes.find((n) => n.slug === argv.accept);
    if (!note) throw new Error(`no such concept with hashed sources: ${argv.accept}`);
    const results = await fetchAll(note.data.sources.filter((s) => s.hash).map((s) => s.url));
    const next = note.data.sources.map((s) => {
      const r = results.get(s.url);
      return r?.hash ? { ...s, hash: r.hash, retrieved: r.retrieved } : s;
    });
    const lines = note.raw.split('\n');
    const start = lines.findIndex((l) => /^sources\s*:/.test(l));
    const end = lines.findIndex((l, i) => i > start && /^[A-Za-z_]/.test(l));
    const rendered = stringifyYaml({ sources: next }, { lineWidth: 0 }).trimEnd().split('\n');
    fs.writeFileSync(note.abs, `---\n${[...lines.slice(0, start), ...rendered, ...(end === -1 ? [] : lines.slice(end))].join('\n')}\n---\n${note.body}`);
    console.log(format === 'json' ? JSON.stringify({ ok: true, accepted: argv.accept }, null, 2)
      : `accepted current content as the new baseline for ${argv.accept}`);
    return 0;
  }

  const urls = [...new Set(targets.flatMap((n) => n.data.sources.filter((s) => s.hash).map((s) => s.url)))]
    .slice(0, argv.limit ?? 9999);
  if (!urls.length) {
    console.log(format === 'json' ? JSON.stringify({ ok: true, checked: 0, drifted: [] }, null, 2) : 'nothing to revalidate');
    return 0;
  }

  const tty = process.stdout.isTTY;
  const results = await fetchAll(urls, { onProgress: (d, t2) => { if (tty) process.stderr.write(`\rchecking ${d}/${t2}`); } });
  if (tty) process.stderr.write('\n');

  const drifted = [];
  const vanished = [];
  const rid = runId();
  for (const note of targets) {
    let reachChanged = false;
    for (const s of note.data.sources) {
      const r = results.get(s.url);
      if (!s.hash || !r) continue;
      evidence.recordObservation(ROOT, note.slug, {
        cite_id: evidence.citeId(note.slug, s.url),
        url_canonical: evidence.canonicalUrl(s.url),
        reachability: r.reachability ?? (r.unreachable ? 'dns-transient' : 'ok'),
        detail: r.reason ?? null,
        content_digest: r.hash ?? null,
        archive_url: r.archive ?? null,
      }, rid);
      const newReach = r.reachability ?? (r.unreachable ? 'dns-transient' : 'ok');
      if ((s.reachability ?? 'ok') !== newReach) { s.reachability = newReach; reachChanged = true; }
      if (r.unreachable) vanished.push({ slug: note.slug, url: s.url, reason: r.reason });
      else if (r.hash !== s.hash) drifted.push({ slug: note.slug, url: s.url, since: s.retrieved });
    }
    // Liveness state syncs into the summary (KB018); the hash stays — it is
    // the accepted baseline, moved only by --accept after drift review.
    if (reachChanged) {
      const lines = note.raw.split('\n');
      const start = lines.findIndex((l) => /^sources\s*:/.test(l));
      const end = lines.findIndex((l, i) => i > start && /^[A-Za-z_]/.test(l));
      const rendered = stringifyYaml({ sources: note.data.sources }, { lineWidth: 0 }).trimEnd().split('\n');
      fs.writeFileSync(note.abs, `---\n${[...lines.slice(0, start), ...rendered, ...(end === -1 ? [] : lines.slice(end))].join('\n')}\n---\n${note.body}`);
    }
  }

  for (const d of drifted) {
    queue.propose(QUEUE_DIR, 'vocab', {
      subject: d.slug, value: `source-drift:${d.url}`,
      rationale: `content changed since ${d.since}; check whether the concept still reflects it`,
      source: 'revalidate', today: today(),
    });
  }

  const payload = { ok: true, checkedUrls: urls.length, drifted, vanished };
  if (format === 'json') console.log(JSON.stringify(payload, null, 2));
  else {
    console.log(`  checked ${urls.length} url(s) across ${targets.length} concept(s)`);
    console.log(`  ${drifted.length} drifted, ${vanished.length} newly unreachable`);
    for (const d of drifted) console.log(`    DRIFT  ${d.slug}  ${d.url}  (baseline ${d.since})`);
    for (const v of vanished) console.log(`    GONE   ${v.slug}  ${v.url}  (${v.reason})`);
    if (drifted.length) console.log('\n  queued for review — accept a new baseline with `kb revalidate --accept <slug>`');
  }
  return 0;
}

/** P7 — build-time transform to a Docusaurus docs tree. Generated; never edited. */
function exportCmd(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const target = argv.rest[0] ?? 'docusaurus';

  // Per-renderer flag applicability (export spec): an inapplicable flag is an
  // error, never a silent no-op.
  const FLAGS = {
    docusaurus: new Set(['base-path', 'id-prefix', 'merge-tags', 'host-tags', 'include-status', 'out']),
    mkdocs: new Set(['base-path', 'include-status', 'out']),
    json: new Set(['include-status', 'out']),
  };
  if (!FLAGS[target]) throw new Error(`unknown export target: ${target} (docusaurus | mkdocs | json)`);
  for (const [flag, set] of [['base-path', argv.basePath], ['id-prefix', argv.idPrefix], ['merge-tags', argv.mergeTags], ['host-tags', argv.hostTags]]) {
    if (set != null && set !== false && !FLAGS[target].has(flag)) throw new Error(`--${flag} does not apply to the ${target} renderer`);
  }

  // --out safety: never inside canon, .git, or governance trees; symlinks resolved.
  const outDir = path.resolve(ROOT, argv.out ?? 'docs-site');
  const real = (d) => { try { return fs.realpathSync(d); } catch { return d; } };
  // Both raw and realpathed forms are checked: macOS aliases /var to
  // /private/var, and a symlinked --out must not sidestep the guard either.
  const roots = [...new Set([path.resolve(ROOT), real(ROOT)])];
  const outs = [...new Set([outDir, real(path.dirname(outDir)) + path.sep + path.basename(outDir)])];
  const DIRS = ['concepts', 'flashcards', 'staging', '.kb', '.git', 'log', 'maintenance'];
  for (const r of roots) {
    for (const o of outs) {
      if (o === r || DIRS.some((d) => { const f = path.join(r, d); return o === f || o.startsWith(f + path.sep); })) {
        throw new Error(`refusing --out inside a canonical or governance tree: ${path.relative(ROOT, outDir) || '.'}`);
      }
    }
  }

  // Publication filter: C1 non-superseded notes ship; superseded become
  // redirect entries in the manifest, never pages; C3-C6, log/ and
  // maintenance/ never enter this function's inputs at all.
  const includeStatus = argv.includeStatus ? new Set(argv.includeStatus.split(',')) : null;
  const all = listNotes(cfg.collections.concepts)
    .map((n) => ({ ...n, ...splitFrontmatter(fs.readFileSync(n.abs, 'utf8')) }));
  const superseded = all.filter((n) => n.data?.status === 'superseded');
  const notes = all.filter((n) => n.data?.status !== 'superseded'
    && (!includeStatus || includeStatus.has(n.data?.status)));
  const known = new Set(notes.map((n) => n.slug));
  const titles = new Map(notes.map((n) => [n.slug, n.data?.title]));
  const titleOf = (s) => titles.get(s);
  const redirects = Object.fromEntries(superseded.map((n) => [n.slug, n.data?.superseded_by ?? []]));

  const basePath = argv.basePath ?? null;
  // Mounted exports get a namespace by default — id collisions with the host
  // are the motivating break (export spec).
  const idPrefix = argv.idPrefix ?? (basePath ? 'kb/' : '');
  if (known.has('index')) throw new Error('a concept slug `index` collides with the generated index doc');

  // Build to a temp sibling, land atomically: partial trees never exist.
  const tmpDir = `${outDir}.tmp-${process.pid}`;
  fs.rmSync(tmpDir, { recursive: true, force: true });
  const files = {}; // relpath -> sha256 of rendered bytes
  const put = (rel, content) => {
    const abs = path.join(tmpDir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
    files[rel] = `sha256:${crypto.createHash('sha256').update(content).digest('hex')}`;
  };

  // D4: provenance grading, computed here at build time from records — the
  // admitting assessment (supplier, routed action) reached through the log's
  // promote lines, override dates from the queue's resolution records, and
  // source classes from the notes themselves. The norm for this corpus:
  // model-single supplier, external-primary sources, no override. Exceptions
  // only are rendered; the norm renders nothing.
  const PROVENANCE_NORM = { supplier: 'model-single', source_class: 'external-primary' };
  const admissions = (() => {
    const bySlug = new Map();
    const logDir = path.join(ROOT, 'log');
    const lines = fs.existsSync(logDir)
      ? fs.readdirSync(logDir).filter((f) => f.endsWith('.md'))
          .flatMap((f) => fs.readFileSync(path.join(logDir, f), 'utf8').split('\n')) : [];
    const resolved = new Map(queue.list(QUEUE_DIR, {})
      .filter((e) => e.kind === 'promotion' && e.status === 'accepted')
      .map((e) => [String(e.subject), e.resolved ?? null]));
    for (const ln of lines) {
      const m = ln.match(/^- promote staging\/(.+?)\.md → applied; \d+ concept\(s\): ([^;]+)/);
      if (!m) continue;
      const stem = m[1];
      const aFile = path.join(KB_DIR, 'assessments', `${stem}.json`);
      if (!fs.existsSync(aFile)) continue;
      const a = JSON.parse(fs.readFileSync(aFile, 'utf8'));
      const override = a.action !== 'promote' && a.action !== 'split';
      const admission = { supplier: a.verdict?.supplier ?? null, action: a.action,
        override, override_date: override ? (resolved.get(`staging/${stem}.md`) ?? a.assessed ?? null) : null };
      for (const s of m[2].split(',').map((x) => x.trim())) bySlug.set(s, admission);
    }
    return bySlug;
  })();
  const gradesOf = (note) => provenanceExceptions({ data: note.data, admission: admissions.get(note.slug) ?? null }, PROVENANCE_NORM);

  let delinked = 0;
  if (target === 'json') {
    put('corpus.json', `${JSON.stringify(jsonCorpus(notes, gradesOf), null, 2)}\n`);
  } else {
    for (const note of notes) {
      const grades = gradesOf(note);
      const out = target === 'docusaurus'
        ? transformNote(note.slug, note.raw ? `---\n${note.raw}\n---\n${note.body}` : fs.readFileSync(note.abs, 'utf8'), known, titleOf, stringifyYaml, { basePath, idPrefix, provenance: grades })
        : `# ${note.data?.title ?? note.slug}\n\n${rewriteLinks(note.body.replace(/^\s*#\s+.+?\r?\n+/, ''), known, titleOf, { basePath })}${renderProvenance(grades)}`;
      if (!out) continue;
      put(path.posix.join('concepts', `${note.slug}.md`), out);
      for (const l of wikilinks(note.body)) if (!known.has(targetSlug(l.target))) delinked++;
    }
    const idx = buildIndex(ROOT, cfg.collections.concepts)
      .replace(/^# Concept Index/, target === 'docusaurus'
        ? `---\nid: ${idPrefix}index\ntitle: Concept Index\nsidebar_position: 0\n---\n\n# Concept Index` : '# Concept Index')
      .replace(/\[\[([a-z0-9-]+)\\\|([^\]]+)\]\]/g, (_, s, label) => (known.has(s)
        ? `[${label}](${basePath ? `${basePath}/${s}` : `./${s}.md`})` : label));
    put(path.posix.join('concepts', 'index.md'), idx);
    if (target === 'docusaurus') {
      put(path.posix.join('concepts', '_category_.json'),
        `${JSON.stringify({ label: 'Concepts', position: 1, link: { type: 'doc', id: `${idPrefix}index` } }, null, 2)}\n`);
      const ours = parseYaml(tagsFile(loadFacets(KB_DIR), stringifyYaml)) ?? {};
      if (argv.mergeTags) {
        if (!argv.hostTags) throw new Error('--merge-tags requires --host-tags <file>');
        const host = parseYaml(fs.readFileSync(path.resolve(argv.hostTags), 'utf8')) ?? {};
        const { merged, conflicts } = mergeTags(ours, host);
        if (conflicts.length) {
          fs.rmSync(tmpDir, { recursive: true, force: true });
          console.log(format === 'json'
            ? JSON.stringify({ ok: false, error: { command: 'export', message: `tag conflict(s) with the host: ${conflicts.join(', ')}`, remedy: 'reconcile the host tags.yml; nothing was written' } }, null, 2)
            : `CONFLICT — host tags differ: ${conflicts.join(', ')}\n         nothing was written`);
          return 1;
        }
        put('tags.yml', stringifyYaml(merged, { lineWidth: 0 }));
      } else {
        put('tags.yml', stringifyYaml(ours, { lineWidth: 0 }));
      }
    }
  }

  // The manifest hashes RENDERED output and pins every version that shaped it
  // — a transform change must dirty it even when sources are unchanged.
  const manifest = {
    schema_version: '1',
    renderer: target,
    transform_version: TRANSFORM_VERSION,
    json_schema_version: target === 'json' ? JSON_SCHEMA_VERSION : undefined,
    config: { base_path: basePath, id_prefix: idPrefix || null, include_status: argv.includeStatus ?? null },
    redirects,
    files: Object.fromEntries(Object.entries(files).sort(([a], [b]) => (a < b ? -1 : 1))),
  };
  put('kb-export-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.renameSync(tmpDir, outDir);

  const payload = { ok: true, renderer: target, out: path.relative(ROOT, outDir),
    docs: Object.keys(files).filter((f) => f.endsWith('.md')).length,
    redirects: Object.keys(redirects).length, unresolved_links_flattened: delinked };
  console.log(format === 'json' ? JSON.stringify(payload, null, 2)
    : `  wrote ${payload.docs} doc(s) via ${target} to ${payload.out}/ (${payload.redirects} redirect(s), ${delinked} unresolved link(s) flattened)`);
  return 0;
}

/**
 * P9 — ask the corpus. Two phases like every other judgment command: emit the
 * retrieval, then validate the answer against what was actually retrieved.
 */
/**
 * Semantic lint (design/audit.md): candidates are mechanical and pinned
 * (params hashed into every task); findings are supplied judgments under
 * the envelope; the report is a derived rendering; only queue ageing has
 * teeth, and terminal dispositions stop the clock.
 */
function audit(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  // spec says --check; that name is the boolean `kb index --check` flag, so the filter is --only
  const checks = argv.only ? [argv.only] : Object.keys(AUDIT_PARAMS);
  const limit = argv.limit ?? 10;

  const notes = listNotes(cfg.collections.concepts).map((n) => {
    const text = fs.readFileSync(n.abs, 'utf8');
    const { data, body } = splitFrontmatter(text);
    return { ...n, text, data, body, title: data?.title ?? n.slug };
  });
  const patterns = parseYaml(fs.readFileSync(path.join(KB_DIR, 'audit-patterns.yml'), 'utf8')).patterns ?? [];

  const generate = (check) => {
    if (check === 'contradictions') return contradictionCandidates(notes, nearest, limit);
    if (check === 'stale-claims') return staleCandidates(notes, (slug) => evidence.latestByCite(evidence.readStore(ROOT, slug)), patterns, limit);
    if (check === 'concept-gaps') return gapCandidates(notes, limit);
    if (check === 'graph-rot') return rotCandidates(notes, nearest, limit);
    throw new Error(`unknown check: ${check}`);
  };

  if (!argv.findings) {
    const candidates = {};
    for (const c of checks) candidates[c] = { params: AUDIT_PARAMS[c], params_hash: paramsHash(c), items: generate(c) };
    const all = Object.values(candidates).flatMap((c) => c.items);
    if (!all.length) {
      console.log(JSON.stringify({ ok: true, note: 'no candidates — nothing to judge', checks }, null, 2));
      return 0;
    }
    const texts = candidateTexts(notes, all);
    const task = {
      instructions:
        'Judge each candidate using ONLY the excerpts provided. Every quote field must be a VERBATIM ' +
        'substring of the named note (checked mechanically). "cannot-tell" is a legitimate verdict. ' +
        'A rationale is never evidence — it explains the judgment, it does not corroborate it. ' +
        'Reply as JSON per audit-finding.schema.json and nothing else.',
      candidates,
      notes: texts,
      response_schema: 'audit-finding.schema.json',
    };
    console.log(JSON.stringify(envlib.emit(ROOT, {
      verb: 'audit', taskClass: 'structuring', target: checks.join('+'),
      inputs: [
        ...texts.map((n) => ({ name: path.posix.join(cfg.collections.concepts.path, `${n.slug}.md`), text: fs.readFileSync(path.join(ROOT, cfg.collections.concepts.path, `${n.slug}.md`), 'utf8') })),
        { name: 'audit-patterns.yml', text: fs.readFileSync(path.join(KB_DIR, 'audit-patterns.yml'), 'utf8') },
        { name: 'schema:audit-finding.schema.json', text: schemaText('audit-finding.schema.json') },
      ],
      allowedWrites: ['.kb/queue/*.jsonl', 'maintenance/*.md'],
      schemaVersion: String(cfg.version), task,
    }), null, 2));
    return 0;
  }

  const answer = JSON.parse(fs.readFileSync(path.resolve(argv.findings), 'utf8'));
  const gate = envlib.check(ROOT, answer, {
    verb: 'audit', schemaVersion: String(cfg.version),
    resolveInput: (name) => {
      if (name === 'audit-patterns.yml') return fs.readFileSync(path.join(KB_DIR, 'audit-patterns.yml'), 'utf8');
      if (name.startsWith('schema:')) return schemaText(name.slice('schema:'.length));
      return undefined;
    },
  });
  if (!gate.ok) return refusal('audit', format, gate);

  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = ajv.compile(JSON.parse(schemaText('audit-finding.schema.json')));
  if (!validate(answer)) {
    const errors = validate.errors.slice(0, 12).map((e) => `${e.instancePath || '/'} ${e.message}`);
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'audit', message: 'findings fail schema', errors } }, null, 2)
      : `INVALID\n${errors.map((e) => `  ${e}`).join('\n')}`);
    return 1;
  }

  // The verbatim rule: every quote must appear in the note it names.
  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  const fabricated = [];
  for (const f of answer.findings) {
    const quotes = f.check === 'contradictions'
      ? [[f.a, f.quote_a], [f.b, f.quote_b]]
      : f.check === 'stale-claims' && f.quote ? [[f.slug, f.quote]] : [];
    for (const [slug, quote] of quotes) {
      if (!bySlug.get(slug)?.body.includes(quote)) fabricated.push(`${slug}: "${quote.slice(0, 40)}..."`);
    }
  }
  if (fabricated.length) {
    const msg = `quote(s) are not verbatim substrings of the named notes: ${fabricated.join(' | ')}`;
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'audit', message: msg } }, null, 2)
      : `REFUSED — ${msg}`);
    return 1;
  }

  // Actionable findings queue with content-derived identity (dedupe on rerun);
  // benign verdicts are recorded in the report only.
  const BENIGN = new Set(['no-conflict', 'fine', 'current', 'not-a-concept']);
  let queued = 0;
  for (const f of answer.findings) {
    if (BENIGN.has(f.verdict)) continue;
    const entry = queue.propose(QUEUE_DIR, 'audit', {
      subject: `${f.check}:${f.candidate_id}`, value: f.verdict,
      rationale: f.rationale, source: 'audit', today: today(),
    });
    if (entry) queued++;
  }

  // Derived report: rebuildable from the queue + C6 artifacts; verify ignores it.
  const reportDir = path.join(ROOT, 'maintenance');
  fs.mkdirSync(reportDir, { recursive: true });
  let reportFile = path.join(reportDir, `${today()}-audit.md`);
  if (fs.existsSync(reportFile)) reportFile = path.join(reportDir, `${today()}-audit-${gate.record.envelope.task_id.slice(0, 6)}.md`);
  const lines = [`# Audit — ${today()}`, '', `Task \`${answer.task_id}\` · ${answer.findings.length} finding(s), ${queued} queued`, ''];
  for (const f of answer.findings) {
    lines.push(`- **${f.check}** \`${f.candidate_id}\` -> ${f.verdict}: ${f.rationale}`);
  }
  fs.writeFileSync(reportFile, `${lines.join('\n')}\n`);

  envlib.commit(gate, { answer, written: [path.relative(ROOT, reportFile)] });

  const payload = { ok: true, findings: answer.findings.length, queued, report: path.relative(ROOT, reportFile) };
  console.log(format === 'json' ? JSON.stringify(payload, null, 2)
    : `  ${payload.findings} finding(s), ${queued} queued -> ${payload.report}`);
  return 0;
}

/**
 * The log verb (design/log.md): typed research provenance — `gap`, `miss`,
 * `note` — plus the git-aware `check` that CI runs beside the hermetic gate
 * (merge-base append-only + canon<->log coupling; KB019).
 */
function logCmd(argv) {
  const format = pickFormat(argv.format);
  const [sub, ...restText] = argv.rest;

  if (sub === 'check') {
    const { findings, degraded } = checkLog(ROOT, argv.base ?? null);
    const payload = degraded
      ? { ok: true, degraded: true, note: 'no merge-base resolvable (shallow clone or no remote) — append-only not checkable here' }
      : { ok: findings.length === 0, findings };
    console.log(format === 'json' ? JSON.stringify(payload, null, 2)
      : degraded ? 'log check: degraded (no merge-base) — warning only'
        : findings.length ? findings.map((f) => `  ${f.code} ${f.message}\n        ${f.remedy}`).join('\n')
          : 'log check: append-only holds, coupling satisfied');
    return payload.ok ? 0 : 1;
  }

  if (sub === 'gap' || sub === 'miss' || sub === 'note') {
    const text = restText.join(' ').trim();
    if (!text) throw new Error(`usage: kb log ${sub} "<text>"`);
    if (text.length > 200) throw new Error('log entries cap at 200 chars — the log is public at Gear 2; keep it terse');
    const file = appendLog(ROOT, today(), [formatLine({ verb: sub, disposition: 'recorded', rationale: text })]);
    console.log(format === 'json' ? JSON.stringify({ ok: true, file }, null, 2) : `  logged -> ${file}`);
    return 0;
  }

  throw new Error('usage: kb log gap|miss|note "<text>"  |  kb log check [--base <ref>]');
}

/**
 * Context compiler (design/context-compiler.md): deterministic bundles, one
 * per task mode. Always JSON — the bundle IS the contract. Refuses a stale
 * index rather than silently varying, and never reads a clock.
 */
function context(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const mode = argv.for;
  const spec = CONTEXT_TASKS[mode];
  if (!spec) throw new Error(`--for must be one of: ${Object.keys(CONTEXT_TASKS).join(' | ')}`);

  // Derived inputs are corpus state: a stale index refuses compilation.
  const idx = buildIndex(ROOT, cfg.collections.concepts);
  const idxAbs = path.join(ROOT, cfg.collections.concepts.path, '_index.md');
  const current = fs.existsSync(idxAbs) ? fs.readFileSync(idxAbs, 'utf8') : '';
  if (current !== idx) {
    console.log(JSON.stringify({ ok: false, error: { command: 'context', code: 'CONTEXT_STALE_INDEX',
      message: 'the generated index is stale — the bundle would embed unreproducible state',
      remedy: 'run `kb index` first (KB006)' } }, null, 2));
    return 1;
  }

  const notes = listNotes(cfg.collections.concepts).map((n) => {
    const text = fs.readFileSync(n.abs, 'utf8');
    const { data, body } = splitFrontmatter(text);
    return { ...n, text, data, body, title: data?.title ?? n.slug };
  });
  const bySlug = new Map(notes.map((n) => [n.slug, n]));

  const need = (slug) => {
    const n = bySlug.get(slug?.replace(/^concepts\//, '').replace(/\.md$/, ''));
    if (!n) throw new Error(`no such concept: ${slug}`);
    return n;
  };

  let targets = [];
  if (spec.args[0] === 'slug') targets = [need(argv.rest[0])];
  else if (spec.args[0] === 'slugA') targets = [need(argv.rest[0]), need(argv.rest[1])];
  else if (!argv.query) throw new Error(`--for ${mode} needs --query "<text>"`);

  // Policy excerpts through the committed anchor map; dangling = KB020, and
  // the command refuses rather than emitting a bundle missing its policy.
  const anchors = loadAnchors(KB_DIR).tasks?.[mode] ?? [];
  const policy = [];
  for (const a of anchors) {
    const text = resolveAnchor(ROOT, KB_DIR, a);
    if (text === null) {
      console.log(JSON.stringify({ ok: false, error: { command: 'context', code: 'KB020',
        message: `dangling context anchor: ${a.file}#${a.heading ?? '(whole file)'}`,
        remedy: 'fix .kb/context-anchors.yml or restore the heading' } }, null, 2));
      return 1;
    }
    policy.push({ file: a.file, heading: a.heading ?? null, text });
  }

  // Edges: 1 hop from each target, scored against the target text.
  const edges = [];
  for (const target of targets) {
    const scored = new Map(nearest(target.text, notes.filter((n) => n.slug !== target.slug)
      .map((n) => ({ slug: n.slug, title: n.title, text: `${n.title} ${n.body}` })), 9999)
      .map((r) => [r.slug, r.score]));
    edges.push(...edgesFor(target, bySlug, (s) => scored.get(s) ?? 0));
  }

  // Task artifacts: the deck for cards-refresh; C5 verdicts for audit-pair.
  const artifacts = [];
  if (mode === 'cards-refresh') {
    const deckAbs = path.join(ROOT, cfg.collections.flashcards.path, `${targets[0].slug}.md`);
    if (fs.existsSync(deckAbs)) artifacts.push({ name: `deck:${targets[0].slug}`, text: fs.readFileSync(deckAbs, 'utf8') });
  }
  if (mode === 'audit-pair') {
    for (const target of targets) {
      const obs = evidence.readStore(ROOT, target.slug).filter((o) => o.support || o.reachability !== 'ok');
      if (obs.length) artifacts.push({ name: `evidence:${target.slug}`, text: JSON.stringify(obs) });
    }
  }
  if (mode === 'promote-review') {
    const rec = path.join(ROOT, '.kb', 'assessments', `${targets[0].slug}.json`);
    if (fs.existsSync(rec)) artifacts.push({ name: `assessment:${targets[0].slug}`, text: fs.readFileSync(rec, 'utf8') });
  }
  if (mode === 'research-brief' || mode === 'query-answer') {
    // Query modes: retrieval stands in for explicit targets.
    const hits = retrieve(notes, argv.query, { filters: {}, limit: argv.limit ?? 6 });
    for (const h of hits) {
      const n = bySlug.get(h.slug);
      targets.push(n);
    }
  }

  const result = compileContext({
    task: { mode, ...(argv.query ? { query: argv.query } : {}), index_hash: `sha256:${idxHash(idx)}` },
    targets, policy, edges, artifacts,
    schemaName: spec.schema, schemaTextValue: schemaText(spec.schema),
    budget: argv.budget != null ? Number(argv.budget) : null,
  });
  if (result.error) {
    console.log(JSON.stringify({ ok: false, error: { command: 'context', ...result.error } }, null, 2));
    return 1;
  }
  console.log(JSON.stringify({ ok: true, bundle: result.bundle }, null, 2));
  return 0;
}

const idxHash = (s) => { const c = crypto.createHash('sha256'); c.update(s); return c.digest('hex').slice(0, 16); };

function query(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const question = argv.rest.join(' ').trim();
  if (!question) throw new Error('query needs a question');

  const loaded = listNotes(cfg.collections.concepts).map((n) => {
    const { data, body } = splitFrontmatter(fs.readFileSync(n.abs, 'utf8'));
    return { slug: n.slug, data, body, title: data?.title ?? n.slug };
  });
  // D8: the derivation cache is a keyed convenience, never authoritative —
  // key mismatch silently rebuilds. verify holds it to rebuild==cached.
  const { derived } = derivations.serveDerived({
    cacheDir: path.join(KB_DIR, 'cache'), notes: loaded,
    meta: { schema_version: cfg.version, tool_version: PKG_VERSION, policy_hash: 'none' },
  });
  const notes = derived.notes;

  const filters = { domain: argv.domain, maturity: argv.maturity };
  const hits = retrieve(notes, question, { filters, limit: argv.limit ?? 6 });

  // Read-only verb: the envelope is stateless — the id derives from question +
  // retrieved content, so the same query against the same corpus re-derives it
  // and nothing accumulates in C6 per query (envelope spec §2, stateless note).
  const statelessId = () => envlib.deriveStatelessId({
    verb: 'query', target: question,
    inputs: hits.map((h) => ({ name: h.slug, text: `${h.title ?? h.slug}\n${h.definition ?? ''}` })),
    schemaVersion: String(cfg.version),
  });

  if (!argv.answer) {
    console.log(JSON.stringify({
      envelope: { task_id: statelessId(), verb: 'query', stateless: true },
      task: buildQueryTask(question, hits, filters),
    }, null, 2));
    return 0;
  }

  const answer = JSON.parse(fs.readFileSync(path.resolve(argv.answer), 'utf8'));
  if (answer.task_id && answer.task_id !== statelessId()) {
    return refusal('query', format, {
      code: envlib.REFUSALS.STALE_INPUTS.code,
      message: 'the corpus or question changed since this task was emitted',
      remedy: 're-run the query and answer the fresh emission',
    });
  }
  const ajv = addFormats(new Ajv({ allErrors: true, strict: false }));
  const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(KB_DIR, 'schemas', 'query-answer.schema.json'), 'utf8')));
  if (!validate(answer)) {
    const errors = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'query', message: 'answer fails schema', errors } }, null, 2)
      : `INVALID ANSWER\n${errors.map((e) => `  ${e}`).join('\n')}`);
    return 1;
  }

  const ungrounded = checkCitations(answer, hits);
  if (ungrounded.length) {
    const msg = `citations to concepts that were not retrieved: ${ungrounded.join(', ')}`;
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'query', message: msg } }, null, 2)
      : `UNGROUNDED — ${msg}\n         the answer reached past its evidence`);
    return 1;
  }

  const payload = { ok: true, question: answer.question, answer: answer.answer,
                    citations: answer.citations, gaps: answer.gaps ?? [], retrieved: hits.map((h) => h.slug) };
  if (format === 'json') console.log(JSON.stringify(payload, null, 2));
  else {
    console.log(`\n${answer.answer}\n`);
    for (const c of answer.citations) console.log(`  [${c.slug}] ${c.supports}`);
    for (const g of payload.gaps) console.log(`  GAP: ${g}`);
  }
  return 0;
}

/** ADR-013 D2 — the query eval set: hygiene gate, canonical hash, pinned-clock harness. */
function evalsetCmd(argv) {
  const cfg = loadConfig();
  const format = pickFormat(argv.format);
  const [sub] = argv.rest;
  const dir = path.join(ROOT, 'eval', 'queries');
  if (!fs.existsSync(dir)) {
    console.log(format === 'json'
      ? JSON.stringify({ ok: false, error: { command: 'evalset', message: 'no eval/queries directory' } }, null, 2)
      : 'REFUSED — no eval/queries directory (see docs/design/query-eval-set.md)');
    return 1;
  }
  const readJsonl = (f) => fs.existsSync(f)
    ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
  const items = readJsonl(path.join(dir, 'queries.jsonl'));
  const apriori = readJsonl(path.join(dir, 'qrels', 'apriori.jsonl'));
  const aliasFile = path.join(dir, 'aliases.yaml');
  const aliases = fs.existsSync(aliasFile) ? (parseYaml(fs.readFileSync(aliasFile, 'utf8')) ?? {}) : {};
  const config = parseYaml(fs.readFileSync(path.join(dir, 'config.yaml'), 'utf8')) ?? {};

  const notes = listNotes(cfg.collections.concepts).map((n) => {
    const { data, body } = splitFrontmatter(fs.readFileSync(n.abs, 'utf8'));
    return { slug: n.slug, title: data?.title ?? n.slug, data, body };
  });
  const concepts = new Set(notes.map((n) => n.slug));

  // The corpus content hash pins what the run measured — commit-independent,
  // so a dirty tree is measured as what it is.
  const corpusHash = 'sha256:' + crypto.createHash('sha256')
    .update(notes.map((n) => `${n.slug}\n${n.body}`).sort().join('\x00')).digest('hex');

  const pooledPath = path.join(dir, 'qrels', 'pooled', 'v1.jsonl');
  const pooledAll = readJsonl(pooledPath);
  const surfaces = { queries: items, apriori, pooledQrels: pooledAll, aliases, config };
  const hash = evalset.evalsetHash(surfaces);

  if (sub === 'hash') {
    console.log(format === 'json' ? JSON.stringify({ ok: true, evalset_hash: hash, corpus_hash: corpusHash }, null, 2)
      : `${hash}\n${corpusHash}`);
    return 0;
  }

  if (sub === 'check' || sub === undefined) {
    const findings = evalset.validateItems(items, { concepts, curatorCap: config.curator_cap ?? 0.5 });
    const payload = { ok: findings.length === 0, evalset_hash: hash, items: items.length, findings };
    console.log(format === 'json' ? JSON.stringify(payload, null, 2)
      : findings.length
        ? `FAIL — ${findings.length} finding(s)\n${findings.map((f) => `  ${f.code} ${f.id}: ${f.message}`).join('\n')}`
        : `PASS — ${items.length} item(s), hash ${hash.slice(0, 23)}…`);
    return findings.length ? 1 : 0;
  }

  const ledgerFile = path.join(dir, 'ledger.jsonl');
  const ledgerAll = readJsonl(ledgerFile);
  const genesis = ledgerAll[0]?.type === 'genesis' ? ledgerAll[0] : null;
  const ledgerEntries = genesis ? ledgerAll.slice(1) : ledgerAll;

  if (sub === 'ledger') {
    const [, action] = argv.rest;
    if (action === 'add') {
      for (const f of ['surface', 'change', 'rationale'])
        if (!argv[f]) throw new Error(`ledger add requires --${f}`);
      const entry = { seq: (ledgerEntries[ledgerEntries.length - 1]?.seq ?? 0) + 1,
        evalset_hash_after: hash, surface: argv.surface, change: argv.change, rationale: argv.rationale,
        follows_failing_run: Boolean(argv['follows-failing-run']), favors_metric: Boolean(argv['favors-metric']) };
      fs.appendFileSync(ledgerFile, JSON.stringify(entry) + '\n');
      console.log(format === 'json' ? JSON.stringify({ ok: true, entry }, null, 2) : `ledgered seq ${entry.seq} (${entry.surface})`);
      return 0;
    }
    if (action === 'genesis') {
      if (ledgerAll.length) throw new Error('ledger already has entries');
      fs.writeFileSync(ledgerFile, JSON.stringify({ seq: 0, type: 'genesis', evalset_hash_after: hash }) + '\n');
      console.log(format === 'json' ? JSON.stringify({ ok: true, genesis: hash }, null, 2) : `genesis ${hash.slice(0, 23)}…`);
      return 0;
    }
    console.log(JSON.stringify({ ok: true, genesis: genesis?.evalset_hash_after ?? null, entries: ledgerEntries,
      post_hoc_favorable_deltas: evalset.postHocFavorableDeltas(ledgerEntries) }, null, 2));
    return 0;
  }

  if (sub === 'label') {
    const [, qid] = argv.rest;
    const q = items.find((i) => i.id === qid && !i.superseded_by);
    if (!q) throw new Error(`no live query item: ${qid}`);
    // Pool: the registered challenger's top-(max k) ∪ the a-priori required set.
    // The task itself is blind — required-membership never travels with it.
    const kMax = Math.max(...(config.k ?? [3]));
    const hits = retrieve(notes, q.text).filter((h) => (h.score ?? 0) > (config.score_cutoff ?? 0)).slice(0, kMax);
    const pool = [...new Set([...hits.map((h) => h.slug), ...(q.required ?? [])])];
    const rubricText = fs.readFileSync(path.join(dir, 'rubric.md'), 'utf8');

    if (!argv.verdicts) {
      const task = evalset.buildLabelTask(q, pool, `${hash}:${qid}`);
      task.definitions = Object.fromEntries(task.candidates.map((s) => {
        const n = notes.find((x) => x.slug === s);
        const m = n?.body.match(/## Definition\n([\s\S]*?)(\n## |$)/);
        return [s, (m?.[1] ?? '').trim().slice(0, 600)];
      }));
      const wrapped = envlib.emit(ROOT, {
        verb: 'evalset-label', taskClass: 'classification', target: qid,
        inputs: [
          { name: `evalset:${qid}`, text: JSON.stringify({ id: q.id, text: q.text }) },
          { name: 'evalset:rubric', text: rubricText },
        ],
        allowedWrites: ['eval/queries/qrels/pooled/*.jsonl'],
        schemaVersion: String(cfg.version),
        task: { instructions: 'Grade every candidate against the question alone, per the rubric. You see no ranks, scores, or origins. Reply {"task_id":..., "judgments": {"<slug>": "relevant|marginal|irrelevant"}, "supplier": {...}} and nothing else.', ...task },
      });
      console.log(JSON.stringify(wrapped, null, 2));
      return 0;
    }

    const verdicts = JSON.parse(fs.readFileSync(path.resolve(argv.verdicts), 'utf8'));
    const gate = envlib.check(ROOT, verdicts, {
      verb: 'evalset-label', schemaVersion: String(cfg.version),
      resolveInput: (name) => name === 'evalset:rubric' ? rubricText
        : name === `evalset:${qid}` ? JSON.stringify({ id: q.id, text: q.text }) : undefined,
    });
    if (!gate.ok) return refusal('evalset', format, gate);
    const bad = evalset.validateLabelVerdicts(verdicts, pool);
    if (bad.length) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'evalset', message: 'invalid judgments', findings: bad } }, null, 2)
        : `INVALID — ${bad.map((f) => `${f.id}: ${f.message}`).join('; ')}`);
      return 1;
    }
    const outDirQ = path.join(dir, 'qrels', 'pooled');
    fs.mkdirSync(outDirQ, { recursive: true });
    const row = { query: qid, judgments: verdicts.judgments, seed: `${hash}:${qid}`,
      pool_evalset_hash: hash, supplier: verdicts.supplier ?? null };
    fs.appendFileSync(path.join(outDirQ, 'v1.jsonl'), JSON.stringify(row) + '\n');
    // A label append moves the one hash, so it ledgers itself: the tail-match
    // invariant stays mechanical and no judgment lands off the books.
    const newHash = evalset.evalsetHash({ ...surfaces, pooledQrels: [...pooledAll, row] });
    const seq = (ledgerEntries[ledgerEntries.length - 1]?.seq ?? 0) + 1;
    fs.appendFileSync(ledgerFile, JSON.stringify({ seq, evalset_hash_after: newHash, surface: 'qrels',
      change: `labeled ${qid} (${Object.keys(verdicts.judgments).length} candidates)`,
      rationale: `blind pooled judgment, supplier ${verdicts.supplier?.id ?? 'unattested'}, seed ${row.seed.slice(0, 20)}…`,
      follows_failing_run: false, favors_metric: false }) + '\n');
    envlib.commit(gate, { answer: verdicts, written: [`eval/queries/qrels/pooled/v1.jsonl`, 'eval/queries/ledger.jsonl'] });
    console.log(format === 'json' ? JSON.stringify({ ok: true, query: qid, judged: Object.keys(verdicts.judgments).length }, null, 2)
      : `labeled ${qid}: ${Object.keys(verdicts.judgments).length} candidates`);
    return 0;
  }

  if (sub === 'run') {
    // Unledgered surface changes refuse the run (B6): the ledger tail must
    // match the recomputed hash, or someone edited a surface off the books.
    const ledgerBad = evalset.ledgerCheck(ledgerEntries, hash, { initialHash: genesis?.evalset_hash_after });
    if (ledgerBad.length) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'evalset', message: 'ledger check failed', findings: ledgerBad } }, null, 2)
        : `REFUSED — ledger: ${ledgerBad.map((f) => f.message).join('; ')}`);
      return 1;
    }
    // The clock is pinned (packet 8 B4/D5): KB_NOW, else the HEAD commit
    // date. Never wall time — a deterministic harness must not flap daily.
    let now = process.env.KB_NOW;
    if (!now) {
      try { now = execFileSync('git', ['log', '-1', '--format=%cI'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); }
      catch { /* fall through */ }
    }
    if (!now) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'evalset', message: 'no pinned clock: set KB_NOW or run inside git' } }, null, 2)
        : 'REFUSED — no pinned clock: set KB_NOW or run inside git');
      return 1;
    }
    const findings = evalset.validateItems(items, { concepts, curatorCap: config.curator_cap ?? 0.5 });
    if (findings.length) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'evalset', message: 'hygiene failing; fix `kb evalset check` first', findings } }, null, 2)
        : 'REFUSED — hygiene failing; run `kb evalset check`');
      return 1;
    }
    const report = evalset.runHarness({ notes, items, aliases, config: { ...config, now }, pooledQrels: pooledAll });
    report.corpus_hash = corpusHash;
    report.post_hoc_favorable_deltas = evalset.postHocFavorableDeltas(ledgerEntries);
    const holdoutIds = new Set(readJsonl(path.join(dir, 'holdout', 'queries.jsonl')).map((q) => q.id));
    const leak = evalset.holdoutLint(report, holdoutIds);
    if (leak.length) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'evalset', message: 'holdout leakage', findings: leak } }, null, 2)
        : `REFUSED — holdout leakage: ${leak.map((f) => f.id).join(', ')}`);
      return 1;
    }
    const outDir = path.join(dir, 'results');
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${report.evalset_hash.slice(7, 19)}-${corpusHash.slice(7, 19)}.json`);
    const rendered = JSON.stringify(report, null, 2) + '\n';
    // G4 artifact reproduction: an existing artifact for this (evalset, corpus)
    // key must match byte-for-byte, or the committed numbers are not these.
    if (fs.existsSync(outFile) && fs.readFileSync(outFile, 'utf8') !== rendered) {
      console.log(format === 'json'
        ? JSON.stringify({ ok: false, error: { command: 'evalset', message: `artifact mismatch: ${path.relative(ROOT, outFile)} does not reproduce` } }, null, 2)
        : `FAIL — artifact mismatch: ${path.relative(ROOT, outFile)} does not reproduce`);
      return 1;
    }
    fs.writeFileSync(outFile, rendered);
    const h = report.headline;
    console.log(format === 'json' ? JSON.stringify({ ok: true, artifact: path.relative(ROOT, outFile), watermark: report.watermark, headline: h }, null, 2)
      : `${report.watermark}\n  headline n=${h.n}  recall@${config.k?.[0] ?? 3}: ${JSON.stringify(h[`recall_at_${config.k?.[0] ?? 3}`])}\n  artifact: ${path.relative(ROOT, outFile)}`);
    return 0;
  }

  console.log(format === 'json'
    ? JSON.stringify({ ok: false, error: { command: 'evalset', message: `unknown subcommand: ${sub}` } }, null, 2)
    : `unknown subcommand: ${sub} (check | hash | run)`);
  return 1;
}

// ---------------------------------------------------------------- dispatch

const COMMANDS = { init, verify, index, migrate, sources, ingest, assess, promote, cards, facets, link, supersede, support, revalidate, audit, context, log: logCmd, query, export: exportCmd, queue: queueCmd, evalset: evalsetCmd };

const USAGE = `kb — knowledge pipeline

  kb init                              initialise a fresh governed repo here
  kb verify  [--format human|json]     validate the corpus; the CI contract
  kb index   [--check] [--format ...]  regenerate generated indexes
  kb migrate [--apply] [--format ...]  P1 frontmatter + card-identity migration
                                       (dry-run by default; --apply needs a clean tree)
  kb sources [--apply] [--limit N] [--retry-dead]
                                       P1b fetch cited sources, record content hashes
                                       (live network; never runs in CI)

  kb ingest <url...> [--force]         P2 fetch a URL into staging/
  kb assess <file> [--rubric id]       P2 emit a judgment task for an agent
  kb assess <file> --verdict v.json    ...then route the answer deterministically
  kb promote <slug>                    P3 emit a drafting task for an agent
  kb promote <slug> --draft d.json [--apply]
                                       ...then render and write the concept(s)
  kb cards <slug>                      P4 emit a card-drafting task for an agent
  kb cards <slug> --draft c.json [--apply]
                                       ...then create or refresh the deck
  kb facets [--limit N] [--sample N]   P5 emit a classification task
                                       (--sample spreads across the corpus)
  kb facets --draft f.json [--apply]   ...then apply scalars + mirrored tags
  kb link check                        P5 isolated notes + one-way links
  kb link suggest [--slug S] [--limit N]  ...emit a cross-link task
  kb link --draft l.json [--apply]     ...append relationships (additive only)
  kb export docusaurus [--out D] [--base-path /kb] [--id-prefix kb/]
                       [--merge-tags --host-tags F] [--include-status s,s]
  kb export mkdocs|json [--out D]      other renderers (shared filter + manifest)
  kb audit [--only <check>] [--limit N]
                                       semantic lint: emit judging tasks
                                       checks: contradictions | stale-claims |
                                               concept-gaps | graph-rot
  kb audit --findings f.json           validate + queue findings, write report
  kb log gap|miss|note "<text>"        record research provenance (<=200 chars)
  kb log check [--base <ref>]          append-only + canon<->log coupling (CI)
  kb context --for <task> <args> [--budget N]
                                       compile a deterministic task bundle
                                       tasks: cards-refresh <slug> | promote-review <slug> |
                                              audit-pair <a> <b> | research-brief --query q |
                                              query-answer --query q
  kb supersede <old> --by <new[,new]> [--apply]
                                       mark a note superseded; leans it to a pointer
  kb support <slug> [--limit N] [--no-fetch]
                                       emit support-verdict tasks (network; snapshots cached)
  kb support <slug> --verdicts v.json  record verdicts into the evidence store
  kb revalidate [--slug S] [--limit N]  P6 re-fetch sources, report content drift
                                       (both record observations in .kb/evidence/)
  kb revalidate --accept <slug>        ...accept current content as the baseline
  kb query "<question>" [--domain D] [--maturity M]
                                       P9 retrieve concepts + their relationships
  kb query "<question>" --answer a.json  ...validate an answer's citations
  kb export docusaurus [--out DIR]     P7 build a Docusaurus docs tree
  kb queue [accept|reject <id>] [--all]  review proposals

Output is JSON outside a TTY. Exit 1 on any error-severity finding.
Policy: .kb/POLICY.md   Design: docs/architecture/overview.md`;

const [cmd, ...rest] = process.argv.slice(2);

// Flags that take a value. Naming them is what keeps an option's VALUE from
// being mistaken for a positional: `kb query "q" --answer a.json` was appending
// the filename to the question, which silently changed what got retrieved and
// then rejected the answer's citations as ungrounded.
const VALUE_FLAGS = new Set([
  '--format', '--limit', '--sample', '--rubric', '--verdict', '--draft', '--answer',
  '--slug', '--accept', '--out', '--domain', '--maturity', '--by', '--verdicts', '--why',
  '--for', '--query', '--budget', '--base', '--findings', '--only',
  '--base-path', '--id-prefix', '--host-tags', '--include-status',
  '--surface', '--change', '--rationale',
]);
const BOOL_FLAGS = new Set(['--check', '--apply', '--retry-dead', '--force', '--all', '--no-fetch', '--merge-tags', '--follows-failing-run', '--favors-metric']);

const parseArgs = (rest) => {
  const opts = {};
  const positional = [];
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (VALUE_FLAGS.has(a)) { opts[a] = rest[++i] ?? null; continue; }
    if (BOOL_FLAGS.has(a)) { opts[a] = true; continue; }
    if (a.startsWith('--')) continue; // unknown flag: ignored, never positional
    positional.push(a);
  }
  const num = (k) => (opts[k] == null ? null : Number(opts[k]));
  return {
    format: opts['--format'] ?? null,
    check: !!opts['--check'],
    apply: !!opts['--apply'],
    limit: num('--limit'),
    sample: num('--sample'),
    retryDead: !!opts['--retry-dead'],
    force: !!opts['--force'],
    all: !!opts['--all'],
    rubric: opts['--rubric'] ?? null,
    verdict: opts['--verdict'] ?? null,
    draft: opts['--draft'] ?? null,
    answer: opts['--answer'] ?? null,
    slug: opts['--slug'] ?? null,
    accept: opts['--accept'] ?? null,
    out: opts['--out'] ?? null,
    domain: opts['--domain'] ?? null,
    maturity: opts['--maturity'] ?? null,
    by: opts['--by'] ?? null,
    verdicts: opts['--verdicts'] ?? null,
    why: opts['--why'] ?? null,
    noFetch: !!opts['--no-fetch'],
    for: opts['--for'] ?? null,
    query: opts['--query'] ?? null,
    budget: opts['--budget'] ?? null,
    base: opts['--base'] ?? null,
    findings: opts['--findings'] ?? null,
    only: opts['--only'] ?? null,
    basePath: opts['--base-path'] ?? null,
    idPrefix: opts['--id-prefix'] ?? null,
    hostTags: opts['--host-tags'] ?? null,
    includeStatus: opts['--include-status'] ?? null,
    mergeTags: !!opts['--merge-tags'],
    surface: opts['--surface'] ?? null,
    change: opts['--change'] ?? null,
    rationale: opts['--rationale'] ?? null,
    'follows-failing-run': !!opts['--follows-failing-run'],
    'favors-metric': !!opts['--favors-metric'],
    urls: positional.filter((a) => /^https?:\/\//.test(a)),
    target: positional.find((a) => !/^https?:\/\//.test(a)) ?? null,
    rest: positional,
  };
};

/**
 * Exit status is assigned, never forced with process.exit(): that tears the
 * process down before a piped stdout has flushed, silently truncating the
 * report at the ~8KB pipe buffer. It only bites on a large report AND a
 * non-zero exit — precisely the run whose output a consumer most needs whole.
 */
async function main() {
  if (!cmd || cmd === '--help' || cmd === '-h' || !COMMANDS[cmd]) {
    console.log(USAGE);
    // An explicit --help is a successful request for help, not a usage error.
    return !cmd || cmd === '--help' || cmd === '-h' ? 0 : 1;
  }
  try {
    return await COMMANDS[cmd](parseArgs(rest));
  } catch (err) {
    // Structured even on crash: an agent must never be handed a bare stack trace.
    console.log(JSON.stringify({ ok: false, error: { command: cmd, message: err.message } }, null, 2));
    return 2;
  }
}

process.exitCode = await main();
