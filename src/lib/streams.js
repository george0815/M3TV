/* Building a new channel or playlist list out of an old one.

   Every one of these returns a new array and leaves its argument alone. That is
   the whole point of them: the add, edit and remove paths each used to push,
   assign or splice into the array held in state, which changes the current
   state in place before setStreams has run — react then compares the two, sees
   the same array, and may not re-render at all. The fixes were made one call
   site at a time and the same mistake could be made again in the next one, so
   the rule lives in one place now with tests on it. */


//appends without touching the original
export function addEntry(list, entry) {
  return [...(list || []), entry];
}


//replaces the entry at index, leaving every other one exactly as it was. An
//index that is not in the list changes nothing.
export function replaceEntry(list, index, entry) {
  return (list || []).map((item, i) => i === index ? entry : item);
}


//filter rather than splice, which would edit the array in place
export function removeEntry(list, index) {
  return (list || []).filter((_, i) => i !== index);
}


/* What comes back from the m3u parser, made safe to render.

   The parser only attaches inf to an entry that had an #EXTINF line before it,
   and the check on the result only ever inspected the first segment. So a
   playlist with one malformed entry anywhere after the first passed validation
   and then threw while rendering — which in react unmounts the tree and leaves
   a blank screen. Give every segment something renderable, falling back to the
   url as a label. */
export function normaliseSegments(segments) {
  return (segments || []).map(segment =>
    segment.inf ? segment : {...segment, inf: {title: segment.url}}
  );
}


/* Did the fetch bring back a playlist, or a web page pretending to be one?

   A url that 404s to an HTML error page parses as a playlist whose first entry
   is the doctype, which is how a mistyped address used to end up as a grid of
   one broken tile. */
export function isUsablePlaylist(channels) {
  return channels.length > 0 && channels[0].url !== "<!DOCTYPE html>";
}
