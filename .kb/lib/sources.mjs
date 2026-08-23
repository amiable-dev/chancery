/**
 * Source fetching and content hashing (P1b).
 *
 * The hash is over *extracted article text*, never raw HTML. Raw markup changes
 * on essentially every load — ads, CSRF tokens, build ids, relative timestamps —
 * so hashing it would report drift constantly and mean nothing. Readability
 * strips to the body content, which changes when the substance does.
 *
 * A failed fetch is recorded, not hidden. A rotted citation is a real finding
 * about the corpus, and the `unreachable` flag is what makes it visible instead
 * of leaving the source silently unverifiable forever.
 */
import crypto from 'node:crypto';

// The extraction stack parses hostile web content and must never load in the
// gate path (ADR-011 §2) — imported lazily, only when a fetch actually runs.
import { assertPublicHttpUrl, readCapped } from './net-guard.mjs';

const extraction = async () => {
  const [{ JSDOM, VirtualConsole }, { Readability }] = await Promise.all([
    import('jsdom'), import('@mozilla/readability'),
  ]);
  return { JSDOM, VirtualConsole, Readability };
};

const UA = 'kb-pipeline/0.1 (+knowledge-base source verification; contact via repo)';
const TIMEOUT_MS = 12_000;

export const hashText = (text) =>
  'sha256:' + crypto.createHash('sha256').update(text.replace(/\s+/g, ' ').trim()).digest('hex');

/** Extract stable article text; falls back to whole-document text. */
async function extractText(html, url) {
  const { JSDOM, VirtualConsole, Readability } = await extraction();
  // jsdom is noisy about CSS/JS it cannot run; none of it affects text extraction.
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('error', () => {});
  virtualConsole.on('jsdomError', () => {});

  const dom = new JSDOM(html, { url, virtualConsole });
  try {
    const article = new Readability(dom.window.document).parse();
    if (article?.textContent?.trim().length > 200) return article.textContent;
  } catch {
    /* fall through */
  }
  return dom.window.document.body?.textContent ?? '';
}

/** Fetch one URL and return { url, hash, retrieved, unreachable?, reason? }. */
export async function fetchSource(url, today) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    assertPublicHttpUrl(url);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*' },
    });

    if (!res.ok) {
      const reachability = await classifyHttpFailure(url, res.status);
      return { url, unreachable: true, reachability: reachability.state, archive: reachability.archive,
               reason: `HTTP ${res.status}`, checked: today };
    }
    assertPublicHttpUrl(res.url); // a redirect must not land somewhere private
    // Redirect drift: landed on a different host's root — the citation now
    // points at a homepage, not the cited document.
    if (new URL(res.url).host !== new URL(url).host && new URL(res.url).pathname === '/') {
      return { url, unreachable: true, reachability: 'redirect-drift', reason: `redirected to ${res.url}`, checked: today };
    }

    const type = res.headers.get('content-type') ?? '';
    if (!/html|xml|text\/plain/i.test(type)) {
      // PDFs and similar are byte-stable; hash them directly.
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength > 5 * 1024 * 1024) return { url, unreachable: true, reachability: 'malformed', reason: 'exceeds size cap', checked: today };
      return { url, reachability: 'ok', hash: 'sha256:' + crypto.createHash('sha256').update(buf).digest('hex'), retrieved: today };
    }

    const text = await extractText(await readCapped(res), url);
    if (!text.trim()) return { url, unreachable: true, reachability: 'js-required', reason: 'no extractable text', checked: today };
    return { url, reachability: 'ok', hash: hashText(text), retrieved: today };
  } catch (err) {
    const reason = err.name === 'AbortError' ? `timeout after ${TIMEOUT_MS / 1000}s` : (err.cause?.code ?? err.message);
    const code = err.cause?.code ?? '';
    const reachability = err.message?.includes('refusing') ? 'malformed'
      : err.name === 'TypeError' && /Invalid URL/i.test(err.message) ? 'malformed'
      : /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT/.test(code) || err.name === 'AbortError' ? 'dns-transient'
      : 'dns-transient';
    return { url, unreachable: true, reachability, reason: String(reason).slice(0, 80), checked: today };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch many URLs with a concurrency cap and per-host serialisation, so a host
 * cited 57 times is not hit 57 times at once.
 */
export async function fetchAll(urls, { concurrency = 6, onProgress } = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const byHost = new Map();
  for (const url of urls) {
    let host;
    try {
      host = new URL(url).host;
    } catch {
      host = url;
    }
    if (!byHost.has(host)) byHost.set(host, []);
    byHost.get(host).push(url);
  }

  const queues = [...byHost.values()];
  const results = new Map();
  let done = 0;

  const worker = async () => {
    for (;;) {
      const queue = queues.pop();
      if (!queue) return;
      for (const url of queue) {
        results.set(url, await fetchSource(url, today));
        onProgress?.(++done, urls.length);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, queues.length) }, worker));
  return results;
}

/** Classify an HTTP failure status; 404/410 consult the Wayback availability API. */
async function classifyHttpFailure(url, status) {
  if (status === 401 || status === 403) return { state: 'blocked-4xx' };
  if (status === 402) return { state: 'paywall' };
  if (status === 429) return { state: 'rate-limited' };
  if (status === 404 || status === 410) {
    const archive = await checkArchive(url);
    return archive ? { state: 'dead-with-archive', archive } : { state: 'dead-no-archive' };
  }
  if (status >= 500) return { state: 'dns-transient' }; // transient bucket; the HTTP status rides in `reason`
  return { state: 'blocked-4xx' };
}

async function checkArchive(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = JSON.parse(await readCapped(res, 64 * 1024));
    const hit = data?.archived_snapshots?.closest;
    return hit?.available ? hit.url : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch + extract full text (for support-task snapshots). Same guards as fetchSource. */
export async function fetchExtract(url) {
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
    const text = await extractText(await readCapped(res), res.url);
    if (!text.trim()) throw new Error('no extractable text');
    return { url: res.url, text, hash: hashText(text) };
  } finally {
    clearTimeout(timer);
  }
}
