# m3tv stream proxy

A Cloudflare Worker that lets the app play streams the browser would otherwise
refuse.

## Why it exists

Two separate things block IPTV streams in a browser, and only one of them is
CORS:

| Blocker | What happens | Affects |
| --- | --- | --- |
| No `Access-Control-Allow-Origin` | hls.js cannot read the manifest or segments, because it fetches them over XHR | Chrome, Firefox |
| Mixed content — an `http://` stream on the `https://` site | The browser refuses the request outright, before CORS is considered | Every browser |

Both go away if the browser talks to something over `https` that sends
permissive CORS headers, and that thing talks to the upstream however the
upstream likes. That is all this is.

Safari and iOS play HLS through the browser's own media pipeline rather than
XHR, so CORS never applies there — but mixed content still does, so the proxy
is still needed for `http://` streams.

`upgrade-insecure-requests` is not a fix for the second row. It rewrites the
request to `https`, which fails differently on a stream that only serves
`http`. The repo has commits both adding and removing it.

## Deploying

From this directory:

```bash
npx wrangler login
npx wrangler deploy
```

That prints a URL like `https://m3tv-proxy.<your-subdomain>.workers.dev`.

Then set it on the app, **with a trailing slash** — the app prefixes it to the
target URL:

- Amplify console → App settings → Environment variables →
  `VITE_CORS_PROXY` = `https://m3tv-proxy.<your-subdomain>.workers.dev/`
- Locally, the same line in `.env`

Vite inlines the value at build time, so this needs a rebuild to take effect,
not just a redeploy of existing artifacts.

## Locking it down

`ALLOWED_ORIGINS` in `wrangler.toml` is the only thing preventing this from
being an open relay that anyone can point at anything on your request budget.
It is an exact-match, comma-separated list, and an empty value rejects
everything rather than allowing everything.

Update it if the site moves or you add a preview domain:

```toml
ALLOWED_ORIGINS = "https://m3tv.net,https://main.xxxx.amplifyapp.com,http://localhost:3000"
```

Targets on private address space (`localhost`, `10.x`, `192.168.x`,
`169.254.x`, `172.16-31.x`) are rejected, so it cannot be used to reach
anything inside a network from outside it.

## What it does per request

1. Rejects the request unless `Origin` is in `ALLOWED_ORIGINS`
2. Rejects non-`http(s)` schemes and private address targets
3. Forwards `Range`, so seeking works and servers that require it are happy
4. Follows redirects
5. **Rewrites HLS manifests** so every URL inside comes back through the proxy
6. Streams everything else through unbuffered

Step 5 is the one that matters. A manifest is a list of further URLs, and
hls.js fetches those itself — if they are absolute they go straight to the
upstream and hit the very blockers this exists to avoid. A proxy that only
relays bytes appears to work, then stalls after the first segment. Relative
refs, root-relative refs, `EXT-X-KEY`, `EXT-X-MEDIA` and `EXT-X-MAP` URIs and
variant playlists in a master are all rewritten.

## Tests

Run from the repository root, alongside the app's own suites:

```bash
npm test
```

Covers manifest rewriting and target validation, including that no upstream URL
survives a rewrite and that private address ranges are refused.

## Cost

Cloudflare does not charge egress on Workers, which is the reason to run this
here rather than on Lambda or a container host — live video is measured in GB
per viewer-hour, and everywhere else meters that.

Requests are metered: 100k/day free, then $5/month for 10M. One hour of a
stream with 6-second segments is roughly 600–900 requests, so the free tier is
on the order of 100 viewer-hours per day.
