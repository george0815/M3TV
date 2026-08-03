// m3tv stream proxy.
//
// Sits between the browser and a stream so that two things the browser would
// otherwise refuse become possible:
//
//   1. streams whose server sends no Access-Control-Allow-Origin, which hls.js
//      cannot fetch because it pulls the manifest and segments over XHR
//   2. http:// streams requested from the https:// site, which the browser
//      blocks as mixed content before CORS is ever considered
//
// Both are solved the same way: the browser talks to this over https and with
// permissive CORS, and this talks to the upstream however the upstream likes.
//
// Usage is prefix style, matching VITE_CORS_PROXY in the app:
//
//   https://<worker>/https://example.com/stream.m3u8
//
// Deployed with `npx wrangler deploy` from this directory. See README.md.

const HOP_BY_HOP = new Set([
  "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
  "te", "trailer", "transfer-encoding", "upgrade", "host",
]);

// Blocked so this cannot be pointed at anything on a private network. It is a
// public endpoint, so treat every target as hostile until checked.
const PRIVATE_HOST = /^(localhost$|127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0$|\[?::1\]?$|172\.(1[6-9]|2\d|3[01])\.)/i;

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || "")
    .split(",").map(s => s.trim()).filter(Boolean);
}

// An empty allowlist means "reflect any origin". That is deliberately not the
// default: an open relay is someone else's bandwidth bill and abuse vector.
function corsOrigin(request, env) {
  const list = allowedOrigins(env);
  const origin = request.headers.get("Origin");
  if (list.length === 0) return null;
  if (list.includes("*")) return origin || "*";
  return origin && list.includes(origin) ? origin : null;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Range, Content-Type",
    "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges, Content-Type",
    "Vary": "Origin",
  };
}

// The target is everything after the leading slash, with the query string put
// back on — stream URLs routinely carry credentials in the query, and dropping
// them silently would look like an authentication failure.
export function parseTarget(requestUrl) {
  const raw = requestUrl.pathname.slice(1) + requestUrl.search;
  if (!raw) return null;

  let candidate = raw;
  // tolerate a fully encoded target as well as a raw one
  if (!/^https?:\/\//i.test(candidate)) {
    try { candidate = decodeURIComponent(candidate); } catch { return null; }
  }
  if (!/^https?:\/\//i.test(candidate)) return null;

  let target;
  try { target = new URL(candidate); } catch { return null; }
  if (PRIVATE_HOST.test(target.hostname)) return null;
  return target;
}

// A manifest is a list of further URLs, and hls.js will fetch those itself. If
// they are absolute they would go straight to the upstream and hit exactly the
// two blockers this exists to avoid, so every URL in the body is rewritten to
// come back through here. This is the part a naive byte-relay proxy misses:
// playback starts, then stalls after the first segment.
export function rewriteManifest(body, manifestUrl, proxyBase) {
  const through = (ref) => {
    let absolute;
    try { absolute = new URL(ref, manifestUrl).toString(); } catch { return ref; }
    return proxyBase + absolute;
  };

  return body.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return line;

    // tag lines carry their URLs in URI="..." (EXT-X-KEY, EXT-X-MEDIA, EXT-X-MAP)
    if (trimmed.startsWith("#")) {
      return line.replace(/URI="([^"]+)"/g, (_, ref) => `URI="${through(ref)}"`);
    }

    // anything else that is not a comment is a media or variant URL
    return through(trimmed);
  }).join("\n");
}

function isManifest(target, contentType) {
  if (/mpegurl|x-mpegurl/i.test(contentType)) return true;
  return /\.m3u8?(\?|$)/i.test(target.pathname + target.search);
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const origin = corsOrigin(request, env);

    if (request.method === "OPTIONS") {
      return origin
        ? new Response(null, { status: 204, headers: corsHeaders(origin) })
        : new Response("origin not allowed", { status: 403 });
    }

    if (!origin) {
      return new Response(
        "origin not allowed — set ALLOWED_ORIGINS for this worker",
        { status: 403 },
      );
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("method not allowed", { status: 405, headers: corsHeaders(origin) });
    }

    const target = parseTarget(requestUrl);
    if (!target) {
      return new Response(
        "usage: /<absolute http(s) url>",
        { status: 400, headers: corsHeaders(origin) },
      );
    }

    // Range must survive: without it seeking breaks and some servers refuse to
    // serve media at all.
    const upstreamHeaders = new Headers();
    for (const h of ["range", "accept", "user-agent"]) {
      const v = request.headers.get(h);
      if (v) upstreamHeaders.set(h, v);
    }
    if (!upstreamHeaders.has("user-agent")) upstreamHeaders.set("user-agent", "m3tv-proxy");

    let upstream;
    try {
      upstream = await fetch(target.toString(), {
        method: request.method,
        headers: upstreamHeaders,
        redirect: "follow",
      });
    } catch (err) {
      return new Response(`upstream fetch failed: ${err}`, { status: 502, headers: corsHeaders(origin) });
    }

    const headers = new Headers();
    for (const [k, v] of upstream.headers) {
      if (!HOP_BY_HOP.has(k.toLowerCase())) headers.set(k, v);
    }
    for (const [k, v] of Object.entries(corsHeaders(origin))) headers.set(k, v);

    const contentType = upstream.headers.get("content-type") || "";

    if (request.method !== "HEAD" && upstream.ok && isManifest(target, contentType)) {
      // upstream.url reflects any redirects, so relative refs resolve correctly
      const proxyBase = `${requestUrl.origin}/`;
      const rewritten = rewriteManifest(await upstream.text(), upstream.url || target.toString(), proxyBase);
      headers.delete("content-length");
      headers.set("content-type", contentType || "application/vnd.apple.mpegurl");
      return new Response(rewritten, { status: upstream.status, headers });
    }

    // segments and everything else stream straight through, unbuffered
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
