import { describe, it, expect } from 'vitest';
import { addEntry, replaceEntry, removeEntry, normaliseSegments, isUsablePlaylist } from './streams';

const a = {inf: {title: 'A'}, url: 'https://example.com/a.m3u8'};
const b = {inf: {title: 'B'}, url: 'https://example.com/b.m3u8'};
const c = {inf: {title: 'C'}, url: 'https://example.com/c.m3u8'};


/* Every one of these has to leave its argument alone. The add, edit and remove
   paths each used to push, assign or splice into the array held in state,
   which changes the current state in place before setStreams has run — react
   then compares the two, sees the same array, and may not re-render at all. */

describe('addEntry', () => {

  it('appends', () => {
    expect(addEntry([a, b], c)).toEqual([a, b, c]);
  });

  it('leaves the original list untouched', () => {
    const before = [a, b];
    const after = addEntry(before, c);

    expect(before).toHaveLength(2);
    expect(after).not.toBe(before);
  });

  it('appends to an empty or missing list', () => {
    expect(addEntry([], a)).toEqual([a]);
    expect(addEntry(undefined, a)).toEqual([a]);
  });

});


describe('replaceEntry', () => {

  it('replaces the entry at the index', () => {
    expect(replaceEntry([a, b, c], 1, {inf: {title: 'B2'}})).toEqual([a, {inf: {title: 'B2'}}, c]);
  });

  it('leaves the original list untouched', () => {
    const before = [a, b, c];
    const after = replaceEntry(before, 1, {inf: {title: 'B2'}});

    expect(before[1]).toBe(b);
    expect(after).not.toBe(before);
  });

  //the entries either side are the same objects, not copies of them
  it('does not disturb the other entries', () => {
    const after = replaceEntry([a, b, c], 1, {inf: {title: 'B2'}});

    expect(after[0]).toBe(a);
    expect(after[2]).toBe(c);
  });

  it('changes nothing for an index that is not in the list', () => {
    expect(replaceEntry([a, b], 7, c)).toEqual([a, b]);
    expect(replaceEntry([a, b], undefined, c)).toEqual([a, b]);
  });

});


describe('removeEntry', () => {

  it('removes the entry at the index', () => {
    expect(removeEntry([a, b, c], 1)).toEqual([a, c]);
    expect(removeEntry([a, b, c], 0)).toEqual([b, c]);
    expect(removeEntry([a, b, c], 2)).toEqual([a, b]);
  });

  it('leaves the original list untouched', () => {
    const before = [a, b, c];
    const after = removeEntry(before, 1);

    expect(before).toHaveLength(3);
    expect(after).not.toBe(before);
  });

  it('changes nothing for an index that is not in the list', () => {
    expect(removeEntry([a, b], 7)).toEqual([a, b]);
  });

  it('empties a list of one', () => {
    expect(removeEntry([a], 0)).toEqual([]);
  });

});


describe('normaliseSegments', () => {

  /* The parser only attaches inf to an entry that had an #EXTINF line before
     it, and the check on the result only ever looked at the first segment. So
     a playlist with one malformed entry anywhere after the first passed
     validation and then threw while rendering — which in react unmounts the
     tree and leaves a blank screen. */
  it('gives a segment with no inf a title from its url', () => {
    const out = normaliseSegments([{url: 'https://example.com/a.ts'}]);
    expect(out[0].inf.title).toBe('https://example.com/a.ts');
  });

  it('fixes a malformed segment anywhere in the list, not just the first', () => {
    const out = normaliseSegments([a, {url: 'https://example.com/x.ts'}, b]);
    expect(out.every(segment => segment.inf && segment.inf.title)).toBe(true);
  });

  it('leaves a segment that already has a title exactly as it was', () => {
    const out = normaliseSegments([a]);
    expect(out[0]).toBe(a);
  });

  it('keeps the rest of a fixed segment', () => {
    const out = normaliseSegments([{url: 'https://example.com/a.ts', duration: 6}]);
    expect(out[0].duration).toBe(6);
  });

  it('survives an empty or missing result', () => {
    expect(normaliseSegments([])).toEqual([]);
    expect(normaliseSegments(undefined)).toEqual([]);
  });

});


describe('isUsablePlaylist', () => {

  it('accepts a playlist with channels in it', () => {
    expect(isUsablePlaylist([a, b])).toBe(true);
  });

  it('rejects a playlist with nothing in it', () => {
    expect(isUsablePlaylist([])).toBe(false);
  });

  //a mistyped address 404s to an HTML error page, which parses as a playlist
  //whose first entry is the doctype
  it('rejects an html error page', () => {
    expect(isUsablePlaylist([{url: '<!DOCTYPE html>'}])).toBe(false);
  });

});
