/* The queue behind the toasts that replaced window.alert.

   A native alert is modal: it stops the page, it stacks by blocking, and it
   cannot show two things at once because the second call waits for the first
   to be dismissed. A toast has none of that for free — nothing stops a failed
   save and a failed upload arriving in the same tick, and nothing stops the
   same message being fired twice by a retry. So the queue has rules, and the
   rules are here rather than in the component. */


//three at once is the most that can be read before the first times out
export const MAX_TOASTS = 3;

//long enough to read a sentence, short enough not to sit over the footer
export const TOAST_MS = 4200;


/* Appends, keeping at most MAX_TOASTS — the newest, since an old message
   scrolling past is better than a new one never appearing.

   A message already on screen is moved to the end rather than duplicated. Two
   identical toasts stacked on top of each other read as a rendering fault
   rather than as the same thing having happened twice, and the retry loops in
   the save paths would produce exactly that. */
export function addToast(list, toast) {

  const withoutDuplicate = (list || []).filter(existing => existing.message !== toast.message);

  return [...withoutDuplicate, toast].slice(-MAX_TOASTS);

}


//by id, so a toast that has already been dismissed by hand does not get
//removed a second time when its timer catches up
export function removeToast(list, id) {
  return (list || []).filter(toast => toast.id !== id);
}
