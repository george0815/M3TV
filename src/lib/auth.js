/* Reading what firebase auth is telling us.

   The sign-in paths raise a dozen different error codes and they do not all
   mean the same kind of thing: some are the user changing their mind, some are
   a project that has not been configured, and one of them is not an error at
   all but an instruction to try a different way in. Sorting them is the part
   worth having on its own, and worth having tests on. */


/* Cancelling is not a failure and must not be reported as one.

   Closing the popup raises popup-closed-by-user, and opening a second popup
   while one is already up raises cancelled-popup-request — which happens on an
   impatient double click, where the *first* popup is the one that survives.
   Saying "sign-in failed" over a sign-in that is still going would be wrong. */
export function isUserCancellation(error) {

  switch (error && error.code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return true;
    default:
      return false;
  }

}


/* A popup cannot always be opened: mobile safari and the in-app browsers
   inside other apps block them, and some environments have no popup at all.
   None of that is fatal — the redirect flow works everywhere — so these codes
   mean "go the other way", not "tell the user something broke". */
export function shouldRedirectInstead(error) {

  switch (error && error.code) {
    case "auth/popup-blocked":
    case "auth/operation-not-supported-in-this-environment":
    case "auth/web-storage-unsupported":
      return true;
    default:
      return false;
  }

}


/* Everything else, as a translation key.

   operation-not-allowed and unauthorized-domain are singled out because they
   are not the user's fault and not transient: they mean the firebase console
   has not been set up, and a generic "something went wrong" would send someone
   hunting for a problem in the app. */
export function authErrorReason(error) {

  switch (error && error.code) {

    case "auth/account-exists-with-different-credential":
      return "linkNeeded";

    case "auth/operation-not-allowed":
      return "googleNotEnabled";

    case "auth/unauthorized-domain":
      return "domainNotAllowed";

    case "auth/network-request-failed":
      return "networkFailed";

    case "auth/too-many-requests":
      return "tooManyAttempts";

    //firebase collapses "no such user" and "wrong password" into
    //invalid-credential on newer projects
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "loginFailed";

    default:
      return "signInFailed";

  }

}


//which ways in an account has. An account can have both, once linked.
function providers(user) {
  return ((user && user.providerData) || []).map(entry => entry && entry.providerId);
}

export function hasPassword(user) {
  return providers(user).includes("password");
}

export function hasGoogle(user) {
  return providers(user).includes("google.com");
}


/* How to prove who you are before deleting the account.

   Firebase refuses to delete a session more than a few minutes old, so this
   has to happen either way — but an account created through Google has no
   password to ask for, and asking for one would be unanswerable. */
export function reauthMethod(user) {
  return hasPassword(user) ? "password" : "google";
}
