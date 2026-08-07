/* What the clock reads.

   Split out of the component because the two bugs that were in here — reading
   the hours in UTC while the date underneath was local, and an unpadded minute
   rendering five past two as "2:5" — are both invisible in a rendered
   component unless you happen to look at it at the wrong minute of the wrong
   day. Given a Date they are one assertion each. */


export function getClientLocale() {
  if (typeof Intl !== 'undefined') {
    try {
      return Intl.NumberFormat().resolvedOptions().locale;
    } catch (err) {
      console.error("Cannot get locale from Intl");
    }
  }
}


/* Local time, not UTC. The date below has always been local, so reading the
   hours in UTC put the two out of step by the whole timezone offset, and made
   them disagree outright either side of midnight.

   Minutes are padded the same way the date parts are. The hour deliberately is
   not — a leading zero on the hour is not how a clock like this reads. */
export function formatTime(date) {
  return date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
}


//short weekday in the viewer's own language, then a zero-padded MM/DD
export function formatDate(date, locale) {
  return date.toLocaleDateString(locale, { weekday: 'short' })
    + " " + ("0" + (date.getMonth() + 1)).slice(-2)
    + "/" + ("0" + date.getDate()).slice(-2);
}
