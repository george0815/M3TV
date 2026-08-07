/* The rules for what counts as a saveable channel or playlist.

   These live apart from utils.js so they can be loaded on their own. utils.js
   initialises firebase and constructs an Audio element for every sound effect
   the moment it is imported, which needs a browser — nothing here does, so
   nothing here should have to drag that in. utils.js re-exports the lot, so
   the components carry on importing from where they always did. */


/* Shared by all four save paths — add and edit, channels and playlists — so the
   rules cannot drift apart between them, which is exactly what had happened:
   adding accepted an empty title while editing rejected it.

   Returns null when the entry is good, or the translation key naming the first
   thing wrong with it, so the caller can say which field to fix instead of the
   old catch-all "please fill out the required fields".

   `existing` is the list being saved into and `skipIndex` the entry being
   edited, which must not count as a duplicate of itself. */
export function validateEntry({ title, url, isLocal }, existing, skipIndex) {

  const name = (title || "").trim();
  const link = (url || "").trim();

  //trimmed, so a title of nothing but spaces no longer counts as filled in
  if (!name) { return "needTitle"; }
  if (!link) { return "needUrl"; }

  //a local playlist carries the file's contents here rather than an address,
  //so there is nothing to check the shape of
  if (!isLocal) {

    if (!/^https?:\/\//i.test(link)) { return "badUrl"; }

    try { new URL(link); } catch { return "badUrl"; }

    const clash = (existing || []).some((entry, i) =>
      i !== skipIndex && ((entry && entry.url) || "").trim() === link);

    if (clash) { return "duplicate"; }

  }

  return null;

}


/* A local playlist is stored as the file's own text, and that text has to fit
   somewhere: a firestore document caps at 1 MiB for the whole of a user's saved
   data, and localStorage at roughly 5 MB for everyone signed out. Anything past
   this cannot be saved at all, so it is worth refusing before the read rather
   than failing silently afterwards. */
export const MAX_PLAYLIST_BYTES = 1024 * 1024;


/* Is this text plausibly an m3u playlist?

   Deliberately loose. A playlist does not have to carry the #EXTM3U header — a
   bare list of urls is perfectly valid m3u and plenty of providers ship exactly
   that — so demanding the header would reject working files. What this is
   really for is catching someone picking a photo or a video by mistake, which
   is why the binary check comes first. */
export function looksLikePlaylist(text) {

  const head = (text || "").slice(0, 8192);

  //a NUL byte anywhere near the start means it is not text at all
  if (head.includes("\u0000")) { return false; }

  if (/^\uFEFF?\s*#EXTM3U/i.test(head)) { return true; }

  //otherwise accept it if it contains at least one line that is a url
  return /^\s*https?:\/\/\S+/mi.test(head);

}
