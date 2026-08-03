// Exercises the two pieces of the proxy that are easy to get subtly wrong:
// rewriting HLS manifests, and deciding what is a legal target.
//
// Run with: node test/manifest.test.mjs

import { rewriteManifest, parseTarget } from "../src/worker.js";

const P = "https://proxy.example.workers.dev/";
let fail = 0;

function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) {
    fail++;
    console.log(`FAIL  ${name}\n      got  ${JSON.stringify(got)}\n      want ${JSON.stringify(want)}`);
  } else {
    console.log(`PASS  ${name}`);
  }
}

// ---- manifest rewriting -------------------------------------------------

const base = "http://cdn.example.com/live/stream.m3u8";

check("relative segment resolves against the manifest and routes back",
  rewriteManifest("#EXTINF:6,\nseg1.ts", base, P).split("\n")[1],
  P + "http://cdn.example.com/live/seg1.ts");

check("absolute segment is still routed back through the proxy",
  rewriteManifest("#EXTINF:6,\nhttp://other.example.com/x.ts", base, P).split("\n")[1],
  P + "http://other.example.com/x.ts");

check("root-relative segment resolves against host, not manifest dir",
  rewriteManifest("#EXTINF:6,\n/abs/seg.ts", base, P).split("\n")[1],
  P + "http://cdn.example.com/abs/seg.ts");

check("comment lines without a URI are untouched",
  rewriteManifest("#EXTM3U\n#EXT-X-VERSION:3", base, P),
  "#EXTM3U\n#EXT-X-VERSION:3");

check("EXT-X-KEY URI is rewritten",
  rewriteManifest('#EXT-X-KEY:METHOD=AES-128,URI="key.bin"', base, P),
  `#EXT-X-KEY:METHOD=AES-128,URI="${P}http://cdn.example.com/live/key.bin"`);

check("EXT-X-MEDIA URI is rewritten",
  rewriteManifest('#EXT-X-MEDIA:TYPE=AUDIO,URI="audio/en.m3u8"', base, P),
  `#EXT-X-MEDIA:TYPE=AUDIO,URI="${P}http://cdn.example.com/live/audio/en.m3u8"`);

check("variant playlists in a master are rewritten too",
  rewriteManifest("#EXT-X-STREAM-INF:BANDWIDTH=1\n720p.m3u8", base, P).split("\n")[1],
  P + "http://cdn.example.com/live/720p.m3u8");

check("query strings on segments survive",
  rewriteManifest("#EXTINF:6,\nseg.ts?token=abc123", base, P).split("\n")[1],
  P + "http://cdn.example.com/live/seg.ts?token=abc123");

check("blank lines are preserved",
  rewriteManifest("#EXTM3U\n\nseg.ts", base, P).split("\n")[1], "");

// a rewritten manifest must not contain any bare upstream URL left over
const full = rewriteManifest(
  ['#EXTM3U', '#EXT-X-KEY:METHOD=AES-128,URI="https://cdn.example.com/k"',
   '#EXTINF:6,', 'seg1.ts', '#EXTINF:6,', 'https://cdn.example.com/seg2.ts'].join("\n"),
  base, P);
const leaked = full.split("\n").filter(l =>
  /https?:\/\//.test(l) && !l.includes(P));
check("no upstream URL escapes the rewrite", leaked, []);

// ---- target parsing -----------------------------------------------------

const t = (u) => parseTarget(new URL(u));

check("plain target parses",
  t(P + "http://cdn.example.com/a.m3u8")?.toString(),
  "http://cdn.example.com/a.m3u8");

check("query string is preserved on the target",
  t(P + "http://cdn.example.com/a.m3u8?token=xyz")?.toString(),
  "http://cdn.example.com/a.m3u8?token=xyz");

check("encoded target is accepted",
  t(P + encodeURIComponent("http://cdn.example.com/a.m3u8"))?.toString(),
  "http://cdn.example.com/a.m3u8");

check("empty target rejected",            t(P), null);
check("non-http scheme rejected",         t(P + "file:///etc/passwd"), null);
check("localhost rejected",               t(P + "http://localhost/x"), null);
check("loopback ip rejected",             t(P + "http://127.0.0.1/x"), null);
check("private 10.x rejected",            t(P + "http://10.0.0.5/x"), null);
check("private 192.168.x rejected",       t(P + "http://192.168.1.1/x"), null);
check("link-local rejected",              t(P + "http://169.254.169.254/latest/meta-data"), null);
check("private 172.16-31 rejected",       t(P + "http://172.20.0.1/x"), null);
check("public 172.x still allowed",       t(P + "http://172.32.0.1/x")?.hostname, "172.32.0.1");

console.log(fail ? `\n${fail} FAILED` : "\nall passed");
process.exit(fail ? 1 : 0);
