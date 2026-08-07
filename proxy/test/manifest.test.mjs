// Exercises the two pieces of the proxy that are easy to get subtly wrong:
// rewriting HLS manifests, and deciding what is a legal target.
//
// Run with the rest of the suites: npm test

import { describe, it, expect } from "vitest";
import { rewriteManifest, parseTarget } from "../src/worker.js";

const P = "https://proxy.example.workers.dev/";
const base = "http://cdn.example.com/live/stream.m3u8";

//the line a rewrite produced, for a manifest whose second line is the url
const second = (body) => rewriteManifest(body, base, P).split("\n")[1];


/* A manifest is a list of further urls, and hls.js fetches those itself. Left
   absolute they would go straight to the upstream and hit exactly the two
   blockers the proxy exists to avoid — no CORS headers, and mixed content — so
   every url in the body has to come back through here. This is the part a
   naive byte-relay proxy misses: playback starts, then stalls after the first
   segment. */

describe("rewriteManifest", () => {

  it("resolves a relative segment against the manifest and routes it back", () => {
    expect(second("#EXTINF:6,\nseg1.ts")).toBe(P + "http://cdn.example.com/live/seg1.ts");
  });

  it("routes an absolute segment back through the proxy too", () => {
    expect(second("#EXTINF:6,\nhttp://other.example.com/x.ts")).toBe(P + "http://other.example.com/x.ts");
  });

  //against the host, not the directory the manifest sits in
  it("resolves a root-relative segment against the host", () => {
    expect(second("#EXTINF:6,\n/abs/seg.ts")).toBe(P + "http://cdn.example.com/abs/seg.ts");
  });

  it("leaves comment lines without a URI alone", () => {
    expect(rewriteManifest("#EXTM3U\n#EXT-X-VERSION:3", base, P)).toBe("#EXTM3U\n#EXT-X-VERSION:3");
  });

  //tag lines carry their urls in URI="...", and the decryption key is fetched
  //over XHR like everything else
  it("rewrites the EXT-X-KEY URI", () => {
    expect(rewriteManifest('#EXT-X-KEY:METHOD=AES-128,URI="key.bin"', base, P))
      .toBe(`#EXT-X-KEY:METHOD=AES-128,URI="${P}http://cdn.example.com/live/key.bin"`);
  });

  it("rewrites the EXT-X-MEDIA URI", () => {
    expect(rewriteManifest('#EXT-X-MEDIA:TYPE=AUDIO,URI="audio/en.m3u8"', base, P))
      .toBe(`#EXT-X-MEDIA:TYPE=AUDIO,URI="${P}http://cdn.example.com/live/audio/en.m3u8"`);
  });

  it("rewrites the EXT-X-MAP URI", () => {
    expect(rewriteManifest('#EXT-X-MAP:URI="init.mp4"', base, P))
      .toBe(`#EXT-X-MAP:URI="${P}http://cdn.example.com/live/init.mp4"`);
  });

  //a master playlist lists variant playlists, which are then fetched and
  //rewritten in turn
  it("rewrites the variant playlists in a master", () => {
    expect(second("#EXT-X-STREAM-INF:BANDWIDTH=1\n720p.m3u8"))
      .toBe(P + "http://cdn.example.com/live/720p.m3u8");
  });

  //stream urls routinely carry credentials in the query, and dropping them
  //looks like an authentication failure
  it("keeps the query string on a segment", () => {
    expect(second("#EXTINF:6,\nseg.ts?token=abc123"))
      .toBe(P + "http://cdn.example.com/live/seg.ts?token=abc123");
  });

  it("preserves blank lines", () => {
    expect(second("#EXTM3U\n\nseg.ts")).toBe("");
  });

  it("leaves a line it cannot resolve as it found it", () => {
    expect(rewriteManifest("#EXTINF:6,\n:::", "not a url", P).split("\n")[1]).toBe(":::");
  });

  //the whole point, stated once over a manifest with a bit of everything in it
  it("lets no upstream url escape", () => {
    const full = rewriteManifest([
      "#EXTM3U",
      '#EXT-X-KEY:METHOD=AES-128,URI="https://cdn.example.com/k"',
      "#EXTINF:6,",
      "seg1.ts",
      "#EXTINF:6,",
      "https://cdn.example.com/seg2.ts",
    ].join("\n"), base, P);

    const leaked = full.split("\n").filter(l => /https?:\/\//.test(l) && !l.includes(P));
    expect(leaked).toEqual([]);
  });

});


describe("parseTarget", () => {

  const t = (u) => parseTarget(new URL(u));

  it("parses a plain target", () => {
    expect(t(P + "http://cdn.example.com/a.m3u8")?.toString()).toBe("http://cdn.example.com/a.m3u8");
  });

  it("keeps the query string on the target", () => {
    expect(t(P + "http://cdn.example.com/a.m3u8?token=xyz")?.toString())
      .toBe("http://cdn.example.com/a.m3u8?token=xyz");
  });

  it("accepts a fully encoded target as well as a raw one", () => {
    expect(t(P + encodeURIComponent("http://cdn.example.com/a.m3u8"))?.toString())
      .toBe("http://cdn.example.com/a.m3u8");
  });

  it("rejects an empty target", () => {
    expect(t(P)).toBe(null);
  });

  it("rejects a scheme that is not http or https", () => {
    expect(t(P + "file:///etc/passwd")).toBe(null);
  });

  /* This is a public endpoint, so every target is hostile until checked.
     Without these it is a hole straight through to whatever the worker can
     reach — the link-local case is the cloud metadata service. */
  it("rejects loopback", () => {
    expect(t(P + "http://localhost/x")).toBe(null);
    expect(t(P + "http://127.0.0.1/x")).toBe(null);
  });

  it("rejects private ranges", () => {
    expect(t(P + "http://10.0.0.5/x")).toBe(null);
    expect(t(P + "http://192.168.1.1/x")).toBe(null);
    expect(t(P + "http://172.20.0.1/x")).toBe(null);
  });

  it("rejects link-local, which is where the metadata service lives", () => {
    expect(t(P + "http://169.254.169.254/latest/meta-data")).toBe(null);
  });

  //172.16 through 172.31 are private, the rest of 172 is not
  it("still allows the public part of 172", () => {
    expect(t(P + "http://172.32.0.1/x")?.hostname).toBe("172.32.0.1");
    expect(t(P + "http://172.15.0.1/x")?.hostname).toBe("172.15.0.1");
  });

});
