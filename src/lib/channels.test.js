import { describe, it, expect } from 'vitest';
import { matchChannels, pageCount, clampPage, pageOf, PAGE_SIZE } from './channels';

//a list of n channels titled "Channel 1" upwards
const list = (n) => Array.from({length: n}, (_, i) => ({
  inf: {title: `Channel ${i + 1}`},
  url: `https://example.com/${i + 1}.m3u8`,
}));


describe('matchChannels', () => {

  it('returns everything when nothing is being searched for', () => {
    expect(matchChannels(list(3), '')).toHaveLength(3);
    //the search prompt returns null when it is dismissed
    expect(matchChannels(list(3), null)).toHaveLength(3);
    expect(matchChannels(list(3), undefined)).toHaveLength(3);
  });

  it('matches on any part of the title, in either case', () => {
    const data = [{inf: {title: 'BBC One'}}, {inf: {title: 'ITV'}}, {inf: {title: 'bbc two'}}];
    expect(matchChannels(data, 'bbc').map(m => m.channel.inf.title)).toEqual(['BBC One', 'bbc two']);
    expect(matchChannels(data, 'BBC')).toHaveLength(2);
    expect(matchChannels(data, 'one')).toHaveLength(1);
  });

  /* The one that matters. playChannel(index) and the next/prev/random keys all
     look items back up in the unfiltered array, so a filtered position handed
     to them plays a different channel than the one that was clicked. */
  it('keeps each match paired with its index in the unfiltered list', () => {
    const data = [{inf: {title: 'ITV'}}, {inf: {title: 'BBC One'}}, {inf: {title: 'Channel 4'}}];
    const matches = matchChannels(data, 'bbc');

    expect(matches).toHaveLength(1);
    expect(matches[0].index).toBe(1);
    expect(data[matches[0].index]).toBe(data[1]);
  });

  //titles are optional in m3u files, and a missing one used to throw here
  //rather than simply not matching
  it('does not throw on entries without a title', () => {
    const data = [{url: 'https://example.com/a.m3u8'}, {inf: {}}, {inf: {title: 'BBC'}}, null];
    expect(() => matchChannels(data, 'bbc')).not.toThrow();
    expect(matchChannels(data, 'bbc')).toHaveLength(1);
  });

  it('finds nothing when nothing matches', () => {
    expect(matchChannels(list(5), 'zzz')).toEqual([]);
  });

  it('survives a missing list', () => {
    expect(matchChannels(undefined, 'bbc')).toEqual([]);
    expect(matchChannels(null, '')).toEqual([]);
  });

});


describe('pageCount', () => {

  it('fits twelve tiles to a page', () => {
    expect(PAGE_SIZE).toBe(12);
    expect(pageCount(12)).toBe(1);
    expect(pageCount(13)).toBe(2);
    expect(pageCount(24)).toBe(2);
    expect(pageCount(25)).toBe(3);
  });

  //an empty result is still one blank page. zero would make the clamp below
  //hand back -1, and the grid would render nothing at all
  it('never reports fewer than one page', () => {
    expect(pageCount(0)).toBe(1);
  });

});


describe('clampPage', () => {

  it('leaves a page that exists alone', () => {
    expect(clampPage(0, 30)).toBe(0);
    expect(clampPage(1, 30)).toBe(1);
    expect(clampPage(2, 30)).toBe(2);
  });

  /* The footer buttons live in the parent and do not know how many results a
     search left behind, so the page number arriving here can point past the
     end. Landing on the last page of results beats a blank screen. */
  it('pulls an overshooting page back to the last one with results', () => {
    expect(clampPage(9, 30)).toBe(2);
    expect(clampPage(1, 5)).toBe(0);
  });

  it('holds at zero for an empty result', () => {
    expect(clampPage(4, 0)).toBe(0);
    expect(clampPage(-1, 30)).toBe(0);
  });

});


describe('pageOf', () => {

  const matches = matchChannels(list(25), '');

  it('hands back one screenful at a time', () => {
    expect(pageOf(matches, 0)).toHaveLength(12);
    expect(pageOf(matches, 1)).toHaveLength(12);
    expect(pageOf(matches, 2)).toHaveLength(1);
  });

  it('starts each page where the last one ended', () => {
    expect(pageOf(matches, 0)[0].channel.inf.title).toBe('Channel 1');
    expect(pageOf(matches, 1)[0].channel.inf.title).toBe('Channel 13');
    expect(pageOf(matches, 2)[0].channel.inf.title).toBe('Channel 25');
  });

  //same clamp as above, applied where the tiles are actually sliced
  it('shows the last page rather than an empty one when asked past the end', () => {
    expect(pageOf(matches, 8)).toEqual(pageOf(matches, 2));
  });

  it('carries the unfiltered indices through the slice', () => {
    const data = [...list(12), {inf: {title: 'BBC One'}}, ...list(3)];
    const found = pageOf(matchChannels(data, 'BBC One'), 0);

    expect(found).toHaveLength(1);
    expect(found[0].index).toBe(12);
  });

});
