// Server-only TinyFish client (Search + Fetch). Docs: https://docs.tinyfish.ai
const SEARCH_URL = "https://api.search.tinyfish.ai";
const FETCH_URL = "https://api.fetch.tinyfish.ai";

export class TinyFishError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function key() {
  const k = process.env["TINYFISH_API_KEY"];
  if (!k) throw new TinyFishError("TinyFish is not configured (missing TINYFISH_API_KEY).", 503);
  return k;
}

export function tinyfishConfigured() {
  return Boolean(process.env["TINYFISH_API_KEY"]);
}

async function withRetry(fn: () => Promise<Response>, attempts = 3): Promise<Response> {
  let last: Response | null = null;
  for (let i = 0; i < attempts; i++) {
    const res = await fn();
    if (res.status !== 429 && res.status < 500) return res;
    last = res;
    const ra = Number(res.headers.get("retry-after"));
    const wait = Number.isFinite(ra) && ra > 0 ? ra * 1000 : 800 * 2 ** i + Math.random() * 300;
    await new Promise((r) => setTimeout(r, Math.min(wait, 8000)));
  }
  return last!;
}

export type SearchResult = { position: number; site_name?: string; title: string; snippet?: string; url: string };

export async function tinyfishSearch(query: string, opts: { location?: string | undefined; purpose?: string } = {}) {
  const params = new URLSearchParams({ query });
  if (opts.location) params.set("location", opts.location);
  if (opts.purpose) params.set("purpose", opts.purpose.slice(0, 2000));
  params.set("exclude_domains", "facebook.com,instagram.com,youtube.com,pinterest.com,quora.com,reddit.com,twitter.com,x.com,linkedin.com");
  const res = await withRetry(() =>
    fetch(`${SEARCH_URL}?${params}`, { headers: { "X-API-Key": key() } }),
  );
  const body = await res.text();
  if (!res.ok) throw new TinyFishError(`TinyFish Search failed [${res.status}]: ${body.slice(0, 300)}`, res.status);
  let json: { results?: SearchResult[] };
  try {
    json = JSON.parse(body);
  } catch {
    throw new TinyFishError("TinyFish Search returned a malformed response.", 502);
  }
  return (json.results ?? []).filter((r) => r && typeof r.url === "string");
}

export type FetchResult = { url: string; final_url?: string; title?: string | null; description?: string | null; published_date?: string | null; text?: string | null };
export type FetchError = { url: string; error?: string; code?: string; message?: string };

export async function tinyfishFetch(urls: string[], purpose: string) {
  const res = await withRetry(() =>
    fetch(FETCH_URL, {
      method: "POST",
      headers: { "X-API-Key": key(), "Content-Type": "application/json" },
      body: JSON.stringify({ urls: urls.slice(0, 10), purpose: purpose.slice(0, 2000), format: "markdown", ttl: 3600, per_url_timeout_ms: 40000 }),
    }),
  );
  const body = await res.text();
  if (!res.ok) throw new TinyFishError(`TinyFish Fetch failed [${res.status}]: ${body.slice(0, 300)}`, res.status);
  try {
    const json = JSON.parse(body) as { results?: FetchResult[]; errors?: FetchError[] };
    return { results: json.results ?? [], errors: json.errors ?? [] };
  } catch {
    throw new TinyFishError("TinyFish Fetch returned a malformed response.", 502);
  }
}
