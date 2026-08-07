/* Deleting an account, in the order it has to happen.

   The order is the whole reason this is a module of its own rather than a few
   lines in the component. Deleting the firebase auth user does **not** delete
   anything in firestore, and firestore.rules only allows a user to touch
   /data/{their own uid} while they are signed in as that user. So deleting the
   account first strands the document: nobody can reach it afterwards, not the
   user and not a later sign-up on the same email, and clearing it needs
   console access.

   Deleting the document first has a survivable worst case — the account lives
   on with nothing saved to it, and the user can simply try again.

   Every step is passed in rather than imported, so the sequence can be tested
   without a firebase project and without deleting anything real. */


/* Firebase reports a stale session, a wrong password and a rate limit through
   the same call, and each one needs a different thing said back to the user.
   Anything unrecognised falls through to the generic message rather than
   surfacing a raw error code. */
export function reauthReason(error) {

  switch (error && error.code) {

    //firebase collapses "wrong password" into invalid-credential on newer
    //projects, so both mean the same thing here
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "deleteWrongPassword";

    case "auth/too-many-requests":
      return "tooManyAttempts";

    default:
      return "deleteReauthFailed";

  }

}


/* Returns {ok, reason, dataDeleted}. `reason` is a translation key, so the
   caller can say what happened without knowing anything about firebase, and
   `dataDeleted` tells it whether the saved channels and playlists are already
   gone — which decides whether the local copies should be cleared too. */
export async function deleteAccount({ reauthenticate, deleteDocument, deleteAuthUser }) {

  //a session more than a few minutes old cannot delete itself, so this is
  //required rather than merely a confirmation step
  try {
    await reauthenticate();
  }
  catch (error) {
    return { ok: false, reason: reauthReason(error), dataDeleted: false };
  }

  //the saved channels and playlists go first — see above
  try {
    await deleteDocument();
  }
  catch {
    return { ok: false, reason: "deleteDataFailed", dataDeleted: false };
  }

  //and only then the account itself
  try {
    await deleteAuthUser();
  }
  catch {
    return { ok: false, reason: "deleteAccountFailed", dataDeleted: true };
  }

  return { ok: true, reason: "accountDeleted", dataDeleted: true };

}
