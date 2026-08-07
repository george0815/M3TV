/* Searching and paging the channel grid.

   Pulled out of Channelwrapper so the arithmetic can be checked on its own —
   it is the part with the off-by-one in it, and the part that has to keep an
   entry's index in the original list alive across a filter. */


//twelve tiles to a screen, which is what the grid is laid out for
export const PAGE_SIZE = 12;


/* Entries matching the current search, each paired with its index in the
   unfiltered list. The index has to survive filtering because playChannel(index)
   and the next/prev/random keys all look items back up in the original array —
   pass a filtered position there and it plays the wrong channel. */
export function matchChannels(data, search) {

  return (data || []).map((channel, index) => ({channel, index}))
    .filter(({channel}) => {

      if (search === "" || search === null || typeof search === "undefined") { return true; }

      //titles are optional in m3u files, and a missing one used to throw
      //here rather than simply not matching
      return (channel && channel.inf && channel.inf.title ? channel.inf.title : "")
        .toLowerCase().includes(search.toLowerCase());

    });

}


//how many pages the matches fill. never zero: an empty result is still one
//(blank) page, and a page count of zero makes the clamp below go negative
export function pageCount(matchTotal, perPage = PAGE_SIZE) {
  return Math.max(1, Math.ceil(matchTotal / perPage));
}


/* The requested page is clamped rather than trusted, because the footer buttons
   live in the parent and don't know how many results a search left —
   overshooting lands on the last page of results instead of a blank screen. */
export function clampPage(page, matchTotal, perPage = PAGE_SIZE) {
  return Math.max(0, Math.min(page || 0, pageCount(matchTotal, perPage) - 1));
}


//the slice of matches actually on screen
export function pageOf(matches, page, perPage = PAGE_SIZE) {
  const safe = clampPage(page, matches.length, perPage);
  return matches.slice(safe * perPage, safe * perPage + perPage);
}
