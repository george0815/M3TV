import { describe, it, expect } from 'vitest';
import { embedUrl } from './music';

const DEFAULT = "https://www.youtube.com/embed/5k3uAtQ8vlg";
const params = (s) => new URL(s).searchParams;


describe('embedUrl', () => {

  //youtube-nocookie serves the same player without the tracking cookies the
  //console complains about, and this page has no use for them
  it('sends youtube to the no-cookie host', () => {
    expect(new URL(embedUrl(DEFAULT)).hostname).toBe("www.youtube-nocookie.com");
  });

  it('leaves a no-cookie url alone', () => {
    const already = "https://www.youtube-nocookie.com/embed/5k3uAtQ8vlg";
    expect(new URL(embedUrl(already)).hostname).toBe("www.youtube-nocookie.com");
  });

  //the music url is a free text field and people put other things in it
  it('does not rewrite a host that is not youtube', () => {
    const other = "https://example.com/embed/track";
    expect(new URL(embedUrl(other)).hostname).toBe("example.com");
  });

  it('asks for autoplay and no related videos', () => {
    const p = params(embedUrl(DEFAULT));
    expect(p.get("autoplay")).toBe("1");
    expect(p.get("rel")).toBe("0");
  });

  /* loop=1 is ignored on a single-video embed unless playlist names the same
     video — youtube treats looping as a playlist behaviour. Without it the
     background music stopped at the end of the track. */
  it('names the video as its own playlist so looping works', () => {
    const p = params(embedUrl(DEFAULT));
    expect(p.get("loop")).toBe("1");
    expect(p.get("playlist")).toBe("5k3uAtQ8vlg");
  });

  /* The frame is only on the page while the music is on, so there is nothing
     for a muted player to be. Muting used to be done by changing this address,
     which navigates the frame and leaves an entry in the page's history —
     that is what made back need pressing twice. */
  it('never mutes, even when the address it was given says to', () => {
    const muted = "https://www.youtube.com/embed/5k3uAtQ8vlg?mute=1";

    expect(params(embedUrl(DEFAULT)).has("mute")).toBe(false);
    expect(params(embedUrl(muted)).has("mute")).toBe(false);
  });

  /* The old code appended "?rel=0&..." whatever was already there, so a url
     with its own query string came out carrying two question marks. */
  it('keeps parameters already on the url instead of doubling the query', () => {
    const withStart = "https://www.youtube.com/embed/5k3uAtQ8vlg?start=42";
    const out = embedUrl(withStart);

    expect(out.split("?").length - 1).toBe(1);
    expect(params(out).get("start")).toBe("42");
  });

  it('does not add a playlist when there is no embed id to name', () => {
    expect(params(embedUrl("https://example.com/track.mp3")).has("playlist")).toBe(false);
  });

  //typed into a free text field, so it reaches here mid-edit
  it('hands back something that is not a url rather than throwing', () => {
    expect(() => embedUrl("not a url")).not.toThrow();
    expect(embedUrl("not a url")).toBe("not a url");
  });

  it('survives an empty setting', () => {
    expect(embedUrl("")).toBe("");
    expect(embedUrl(undefined)).toBe("");
  });

});
