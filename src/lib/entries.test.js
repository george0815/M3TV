import { describe, it, expect } from 'vitest';
import { validateEntry, looksLikePlaylist, MAX_PLAYLIST_BYTES } from './entries';

const NUL = String.fromCharCode(0);
const BOM = String.fromCharCode(0xFEFF);


describe('validateEntry', () => {

  it('accepts a well formed entry', () => {
    expect(validateEntry({title: 'BBC One', url: 'https://example.com/one.m3u8'}, [])).toBe(null);
  });

  it('names the missing field rather than a catch-all', () => {
    expect(validateEntry({title: '', url: 'https://example.com/a.m3u8'}, [])).toBe('needTitle');
    expect(validateEntry({title: 'BBC One', url: ''}, [])).toBe('needUrl');
  });

  //the check used to be for an empty string, so a space got through and saved
  //an entry with a blank label on the tile
  it('treats a whitespace-only title as missing', () => {
    expect(validateEntry({title: '   ', url: 'https://example.com/a.m3u8'}, [])).toBe('needTitle');
  });

  it('treats a whitespace-only url as missing', () => {
    expect(validateEntry({title: 'BBC One', url: ' \t '}, [])).toBe('needUrl');
  });

  it('rejects anything that is not http or https', () => {
    expect(validateEntry({title: 'x', url: 'ftp://example.com/a.m3u8'}, [])).toBe('badUrl');
    expect(validateEntry({title: 'x', url: 'javascript:alert(1)'}, [])).toBe('badUrl');
    expect(validateEntry({title: 'x', url: 'example.com/a.m3u8'}, [])).toBe('badUrl');
  });

  //passes the scheme test and still is not a url
  it('rejects a url with the right scheme and nothing else', () => {
    expect(validateEntry({title: 'x', url: 'http://'}, [])).toBe('badUrl');
  });

  it('accepts http as well as https', () => {
    expect(validateEntry({title: 'x', url: 'http://example.com/a.m3u8'}, [])).toBe(null);
  });

  it('rejects a url already in the list', () => {
    const existing = [{url: 'https://example.com/a.m3u8'}];
    expect(validateEntry({title: 'x', url: 'https://example.com/a.m3u8'}, existing)).toBe('duplicate');
  });

  //a stray space either side must not be enough to sneak a second copy in
  it('compares urls trimmed when looking for duplicates', () => {
    const existing = [{url: '  https://example.com/a.m3u8  '}];
    expect(validateEntry({title: 'x', url: 'https://example.com/a.m3u8'}, existing)).toBe('duplicate');
  });

  /* The edit path passes the index being edited. Without it, saving an entry
     without changing its url reported the entry as a duplicate of itself. */
  it('does not count the entry being edited as its own duplicate', () => {
    const existing = [{url: 'https://example.com/a.m3u8'}, {url: 'https://example.com/b.m3u8'}];
    expect(validateEntry({title: 'x', url: 'https://example.com/a.m3u8'}, existing, 0)).toBe(null);
  });

  it('still catches an edit onto another entry\'s url', () => {
    const existing = [{url: 'https://example.com/a.m3u8'}, {url: 'https://example.com/b.m3u8'}];
    expect(validateEntry({title: 'x', url: 'https://example.com/b.m3u8'}, existing, 0)).toBe('duplicate');
  });

  //a local playlist carries the file's own text here, not an address
  it('skips the url checks for a local playlist', () => {
    const contents = '#EXTM3U\nhttps://example.com/a.ts';
    expect(validateEntry({title: 'x', url: contents, isLocal: true}, [])).toBe(null);
  });

  it('does not deduplicate local playlists by their contents', () => {
    const contents = '#EXTM3U\nhttps://example.com/a.ts';
    expect(validateEntry({title: 'x', url: contents, isLocal: true}, [{url: contents}])).toBe(null);
  });

  it('still requires a title and contents for a local playlist', () => {
    expect(validateEntry({title: '', url: '#EXTM3U', isLocal: true}, [])).toBe('needTitle');
    expect(validateEntry({title: 'x', url: '', isLocal: true}, [])).toBe('needUrl');
  });

  //entries saved before playlists were normalised can be missing fields, and
  //reading through them used to throw here instead of failing the entry
  it('survives a ragged existing list', () => {
    const existing = [null, undefined, {}, {url: null}];
    expect(validateEntry({title: 'x', url: 'https://example.com/a.m3u8'}, existing)).toBe(null);
  });

  it('survives a missing existing list', () => {
    expect(validateEntry({title: 'x', url: 'https://example.com/a.m3u8'}, undefined)).toBe(null);
    expect(validateEntry({title: 'x', url: 'https://example.com/a.m3u8'}, null)).toBe(null);
  });

  it('survives an entry with nothing in it', () => {
    expect(validateEntry({}, [])).toBe('needTitle');
  });

});


describe('looksLikePlaylist', () => {

  it('accepts a playlist with the header', () => {
    expect(looksLikePlaylist('#EXTM3U\n#EXTINF:-1,One\nhttps://example.com/a.ts')).toBe(true);
  });

  it('accepts the header in any case, and after a byte order mark', () => {
    expect(looksLikePlaylist('#extm3u\nhttps://example.com/a.ts')).toBe(true);
    expect(looksLikePlaylist(BOM + '#EXTM3U\nhttps://example.com/a.ts')).toBe(true);
    expect(looksLikePlaylist('\n  #EXTM3U')).toBe(true);
  });

  /* Deliberately loose: a bare list of urls is valid m3u and plenty of
     providers ship exactly that, so demanding the header would reject files
     that work perfectly well. */
  it('accepts a headerless list of urls', () => {
    expect(looksLikePlaylist('https://example.com/a.ts\nhttps://example.com/b.ts')).toBe(true);
  });

  it('rejects binary, which is what picking a video or a photo by mistake looks like', () => {
    expect(looksLikePlaylist('RIFF' + NUL + NUL + 'WEBP')).toBe(false);
  });

  //the binary check comes first for a reason: a video file can happen to
  //contain a url in its metadata
  it('rejects binary even when a url appears in it', () => {
    expect(looksLikePlaylist(NUL + 'ftyp\nhttps://example.com/a.ts')).toBe(false);
  });

  it('rejects ordinary text', () => {
    expect(looksLikePlaylist('Dear Sir,\n\nthank you for your letter.')).toBe(false);
    expect(looksLikePlaylist('<!DOCTYPE html><title>404</title>')).toBe(false);
  });

  it('rejects nothing at all', () => {
    expect(looksLikePlaylist('')).toBe(false);
    expect(looksLikePlaylist(undefined)).toBe(false);
    expect(looksLikePlaylist(null)).toBe(false);
  });

  //only the head is inspected, so a file that is 8 KB of prose before its
  //first url is not a playlist as far as this is concerned
  it('only looks at the start of the file', () => {
    const padding = 'x'.repeat(9000);
    expect(looksLikePlaylist(padding + '\nhttps://example.com/a.ts')).toBe(false);
  });

});


describe('MAX_PLAYLIST_BYTES', () => {

  //a firestore document caps at 1 MiB for the whole of a user's saved data,
  //which is the tighter of the two limits a local playlist has to fit inside
  it('is the firestore document limit', () => {
    expect(MAX_PLAYLIST_BYTES).toBe(1048576);
  });

});
