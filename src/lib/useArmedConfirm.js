import { useState, useRef, useEffect, useContext } from 'react';
import { ToastContext } from '../App';

/* Asking "are you sure?" without a browser dialog.

   window.confirm blocks the page and is drawn by the browser, the same two
   complaints that got window.alert replaced. But an alert only announces, so a
   toast could take it over directly; a confirm asks, and a toast cannot ask.

   So the question moves onto the button that raised it. The first press arms
   it and says in a toast what the second press will do; the second press does
   it. The pointer is already on the button, so the confirmation cannot be
   clicked past without being where the warning is — which is more than a
   dialog managed, since the habit with those is to hit OK before reading.

   It disarms itself after a few seconds, so a half-pressed delete is not left
   primed for whoever sits down next. */

export const ARM_MS = 6000;

export function useArmedConfirm() {

  const { notify } = useContext(ToastContext);

  //which button is armed, or null. Keyed rather than a boolean because one
  //screen can hold more than one of these — Login has both logout and delete.
  const [armedKey, setArmedKey] = useState(null);

  const timer = useRef(null);

  //a timer outliving the component would set state on something unmounted
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function disarm() {
    window.clearTimeout(timer.current);
    timer.current = null;
    setArmedKey(null);
  }

  /* confirm(key, message, action) — call it from the button's own handler and
     let it decide which press this is. */
  function confirm(key, message, action) {

    if (armedKey === key) {
      disarm();
      action();
      return;
    }

    setArmedKey(key);
    notify(message, "danger");

    timer.current = window.setTimeout(() => { timer.current = null; setArmedKey(null); }, ARM_MS);

  }

  //for the armed styling on the button itself, so it is not the toast alone
  //saying that the next press is the one that counts
  const isArmed = (key) => armedKey === key;

  return { confirm, disarm, isArmed };

}
