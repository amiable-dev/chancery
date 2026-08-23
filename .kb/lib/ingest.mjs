/**
 * URL -> staging note.
 *
 * Deterministic on purpose: fetch, extract, convert, write. No judgment about
 * whether the material is any good — that is `kb assess`, and keeping the two
 * apart is what preserves staging as a reviewable buffer rather than a chute
 * straight into the corpus.
 *
 * A dedicated fetcher exists here rather than reusing WebFetch because WebFetch
 * is Claude-Code-only; ingest has to work identically under Copilot, Windsurf
 * and Devin.
 */
// The extraction stack parses hostile web content and must never load in the
// gate path (ADR-011 §2) — imported lazily, only when a fetch actually runs.
import { assertPublicHttpUrl, readCapped } from './net-guard.mjs';

const extraction = async () => {
  const [{ JSDOM, VirtualConsole }, { Readability }, { default: TurndownService }] = await Promise.all([
    import('jsdom'), import('@mozilla/readability'), import('turndown'),
  ]);
  return { JSDOM, VirtualConsole, Readability, TurndownService };
};

const UA = 'kb-pipeline/0.1 (+knowledge-base ingest; contact via repo)';
const TIMEOUT_MS = 20_000;

export const slugify = (s, maxTokens = 6) =>
  s.toLowerCase().normalize('NFKD')
    .replace(/['\u2019"\u201c\u201d]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-').filter(Boolean).slice(0, maxTokens).join('-');

/**
 * Pick a slug from the URL where the URL says it better than the title does.
 *
 * Page titles are written for humans and carry site furniture: GitHub renders
 * "GitHub - owner/repo: long description", which slugifies into a mouthful that
 * says almost nothing. github.com is the most-cited host in this corpus, so the
 * repo name is worth taking directly.
 */
export function deriveSlug(url, title) {
  try {
    const u = new URL(url);
    if (/(^|\.)github\.com$/.test(u.host)) {
      const [owner, repo] = u.pathname.split('/').filter(Boolean);
      if (owner && repo) return slugify(repo, 8);
    }
  } catch { /* fall back to the title */ }

  // Drop a leading site prefix ("GitHub - ", "InfoQ | "), then prefer the part
  // before a colon, which is usually the name rather than the tagline.
  const cleaned = title.replace(/^[A-Za-z0-9.\s]{1,15}\s[-|\u2013\u2014]\s/, '');
  const head = cleaned.split(':')[0];
  return slugify(head.length >= 8 ? head : cleaned);
}

const turndownFor = ({ TurndownService }) => {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
  td.remove(['script', 'style', 'noscript', 'iframe']);
  return td;
};

export async function fetchArticle(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    assertPublicHttpUrl(url);
    const res = await fetch(url, {
      signal: ctrl.signal, redirect: 'follow',
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    assertPublicHttpUrl(res.url);

    const ex = await extraction();
    const { JSDOM, VirtualConsole, Readability } = ex;
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('error', () => {});
    virtualConsole.on('jsdomError', () => {});

    const dom = new JSDOM(await readCapped(res), { url: res.url, virtualConsole });
    const article = new Readability(dom.window.document).parse();
    if (!article?.content) throw new Error('no extractable article content');

    return {
      url: res.url,
      title: (article.title || dom.window.document.title || url).trim(),
      markdown: turndownFor(ex).turndown(article.content).trim(),
      excerpt: article.excerpt?.trim() ?? null,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Render the staging note. Markers, not YAML — that is the staging contract in
 * kb.config.yaml, and `**Added:**` is what ages the promotion backlog.
 *
 * Tags land as `#unsorted`: the marker is required, and inventing topic tags
 * here would be judgment this command deliberately does not make. P5's facet
 * derivation replaces it.
 */
export function renderStagingNote({ title, url, markdown, excerpt }, today) {
  return [
    `# ${title}`,
    '',
    `**Source:** ${url}`,
    `**Added:** ${today}`,
    '**Tags:** #unsorted',
    '',
    ...(excerpt ? ['---', '', `> ${excerpt}`, ''] : []),
    '---',
    '',
    markdown,
    '',
  ].join('\n');
}
