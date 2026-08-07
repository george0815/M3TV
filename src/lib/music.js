/* The address of the background music iframe.

   This was built by string concatenation at the point of use, which got three
   things wrong: it appended "?rel=0&..." unconditionally, so a url that
   already carried a query string came out with two question marks in it; it
   pointed at youtube.com, which sets cookies on a page that has no use for
   them; and it asked for loop=1, which on its own does nothing to an embed. */


//the id sits at the end of an /embed/ path
function videoId(url) {
  const match = /\/embed\/([^/?#]+)/.exec(url.pathname + url.search);
  return match ? match[1] : null;
}


/* youtube-nocookie serves the same player without the tracking cookies, which
   is most of what the console complains about on this page. Anything that is
   not youtube is left exactly as it was given — the music url is a free text
   field and people put other things in it. */
function privacyHost(url) {

  if (/(^|\.)youtube\.com$/i.test(url.hostname)) {
    url.hostname = url.hostname.replace(/youtube\.com$/i, "youtube-nocookie.com");
  }

  return url;

}


export function embedUrl(source) {

  if (!source) { return ""; }

  let url;
  try { url = privacyHost(new URL(source)); }
  catch {
    //not a url at all. Hand it back rather than throwing during render — the
    //field it comes from accepts anything typed into it.
    return source;
  }

  //set rather than appended, so a url that already carries parameters keeps
  //them and does not end up with a second question mark
  url.searchParams.set("rel", "0");
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("loop", "1");

  /* loop=1 is ignored on a single-video embed unless the playlist parameter
     names that same video — youtube treats looping as a playlist behaviour.
     Without this the background music simply stopped at the end of the track. */
  const id = videoId(url);
  if (id) { url.searchParams.set("playlist", id); }

  /* There is no muted state to represent any more — the frame is on the page
     when the music is on and gone when it is off, because muting it by
     changing this address put an entry in the session history and cost the
     viewer an extra press of back. So mute always comes off, including when
     it was typed into the field by hand. */
  url.searchParams.delete("mute");

  return url.toString();

}
