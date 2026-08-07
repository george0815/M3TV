import { useContext } from 'react';
import { ToastContext } from '../App';

/* The stack that replaced window.alert.

   Deliberately not interactive beyond dismissing: an alert stopped the page
   and demanded an OK, which is heavier than any of these messages warrant —
   every one of them is either "that did not work" or "that worked". The one
   place a real decision is needed, deleting an account, arms a button instead.

   role="status" rather than "alert" for the ordinary ones: alert interrupts a
   screen reader mid-sentence, which is right for something dangerous and rude
   for a save confirmation. */
function Toasts() {

  const { toasts, dismiss } = useContext(ToastContext);

  if (toasts.length === 0) { return null; }

  return (
    <div id="toastStack">
      {toasts.map(toast =>
        <div
          key={toast.id}
          className={toast.tone === "danger" ? "saveToast warningToast" : "saveToast"}
          role={toast.tone === "danger" ? "alert" : "status"}
          onClick={() => dismiss(toast.id)}
        >{toast.message}</div>
      )}
    </div>
  );

}

export default Toasts;
