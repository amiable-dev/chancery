// Behavioural hardening for the network verbs (ADR-011 §2, packet-5 finding 13).
// The verbs fetch attacker-influencable URLs from CI-adjacent contexts, so:
// scheme allowlist, private/link-local/metadata address denial, and a response
// size cap. jsdom is constructed without runScripts and without resource
// loading (its defaults) — extraction parses text, it never executes content.

export const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

const PRIVATE_HOST = [
  /^localhost$/i, /^127\./, /^0\.0\.0\.0$/, /^10\./, /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./, /^169\.254\./,      // incl. cloud metadata 169.254.169.254
  /^\[?::1\]?$/, /^\[?fe80:/i, /^\[?fc/i, /^\[?fd/i,
];

/** Throws unless url is public http(s). Call on the request URL and again on res.url after redirects. */
export function assertPublicHttpUrl(url) {
  const u = new URL(url);
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error(`refusing non-http(s) URL scheme: ${u.protocol}`);
  }
  const host = u.hostname;
  if (PRIVATE_HOST.some((re) => re.test(host))) {
    throw new Error(`refusing private/link-local address: ${host}`);
  }
}

/** Reads a fetch Response body as text, refusing past the size cap. */
export async function readCapped(res, cap = MAX_RESPONSE_BYTES) {
  const reader = res.body?.getReader?.();
  if (!reader) {
    const text = await res.text();
    if (text.length > cap) throw new Error(`response exceeds ${cap} byte cap`);
    return text;
  }
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > cap) { reader.cancel(); throw new Error(`response exceeds ${cap} byte cap`); }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}
