import { describe, it, expect } from 'vitest';
import {
  isUserCancellation, shouldRedirectInstead, authErrorReason,
  hasPassword, hasGoogle, reauthMethod,
} from './auth';

const err = (code) => ({ code });
const user = (...ids) => ({ providerData: ids.map(providerId => ({ providerId })) });


describe('isUserCancellation', () => {

  it('treats closing the popup as a cancellation, not a failure', () => {
    expect(isUserCancellation(err("auth/popup-closed-by-user"))).toBe(true);
  });

  /* An impatient double click opens a second popup and firebase cancels the
     request for it — but the first popup is still up and may yet succeed.
     Reporting a failure over a sign-in that is still running would be wrong. */
  it('treats a superseded popup request as a cancellation', () => {
    expect(isUserCancellation(err("auth/cancelled-popup-request"))).toBe(true);
  });

  it('does not swallow a real failure', () => {
    expect(isUserCancellation(err("auth/network-request-failed"))).toBe(false);
    expect(isUserCancellation(err("auth/operation-not-allowed"))).toBe(false);
    expect(isUserCancellation(undefined)).toBe(false);
  });

});


describe('shouldRedirectInstead', () => {

  //mobile safari and in-app browsers block popups; the redirect flow works
  //everywhere, so these mean "go the other way" rather than "it broke"
  it('recognises the environments where a popup cannot open', () => {
    expect(shouldRedirectInstead(err("auth/popup-blocked"))).toBe(true);
    expect(shouldRedirectInstead(err("auth/operation-not-supported-in-this-environment"))).toBe(true);
    expect(shouldRedirectInstead(err("auth/web-storage-unsupported"))).toBe(true);
  });

  //closing it yourself is not a reason to retry a different way
  it('does not retry after a cancellation', () => {
    expect(shouldRedirectInstead(err("auth/popup-closed-by-user"))).toBe(false);
  });

  it('does not retry after a real failure', () => {
    expect(shouldRedirectInstead(err("auth/network-request-failed"))).toBe(false);
    expect(shouldRedirectInstead(null)).toBe(false);
  });

});


describe('authErrorReason', () => {

  it('names the linking case, which needs its own answer', () => {
    expect(authErrorReason(err("auth/account-exists-with-different-credential"))).toBe("linkNeeded");
  });

  /* These two mean the firebase console was never set up. A generic "something
     went wrong" would send someone hunting for a bug in the app. */
  it('separates unconfigured project from everything else', () => {
    expect(authErrorReason(err("auth/operation-not-allowed"))).toBe("googleNotEnabled");
    expect(authErrorReason(err("auth/unauthorized-domain"))).toBe("domainNotAllowed");
  });

  it('keeps a wrong password reading as a wrong password, however firebase phrases it', () => {
    expect(authErrorReason(err("auth/invalid-credential"))).toBe("loginFailed");
    expect(authErrorReason(err("auth/wrong-password"))).toBe("loginFailed");
    expect(authErrorReason(err("auth/user-not-found"))).toBe("loginFailed");
  });

  it('separates a rate limit and a network drop from a generic failure', () => {
    expect(authErrorReason(err("auth/too-many-requests"))).toBe("tooManyAttempts");
    expect(authErrorReason(err("auth/network-request-failed"))).toBe("networkFailed");
  });

  //an unrecognised code must not reach the screen raw
  it('falls back to a message rather than a code', () => {
    expect(authErrorReason(err("auth/something-new"))).toBe("signInFailed");
    expect(authErrorReason(new Error("no code"))).toBe("signInFailed");
    expect(authErrorReason(undefined)).toBe("signInFailed");
  });

});


describe('provider inspection', () => {

  it('reads a password account', () => {
    expect(hasPassword(user("password"))).toBe(true);
    expect(hasGoogle(user("password"))).toBe(false);
  });

  it('reads a google account', () => {
    expect(hasGoogle(user("google.com"))).toBe(true);
    expect(hasPassword(user("google.com"))).toBe(false);
  });

  //once linked, an account has both
  it('reads a linked account as having both', () => {
    const linked = user("password", "google.com");
    expect(hasPassword(linked)).toBe(true);
    expect(hasGoogle(linked)).toBe(true);
  });

  it('survives a user with nothing on it', () => {
    expect(hasPassword({})).toBe(false);
    expect(hasGoogle(null)).toBe(false);
    expect(hasPassword({ providerData: [null] })).toBe(false);
  });

});


describe('reauthMethod', () => {

  /* An account created through Google has no password, so asking for one
     before deleting it would be an unanswerable question. */
  it('asks google to confirm a google-only account', () => {
    expect(reauthMethod(user("google.com"))).toBe("google");
  });

  it('asks for the password when there is one', () => {
    expect(reauthMethod(user("password"))).toBe("password");
    expect(reauthMethod(user("password", "google.com"))).toBe("password");
  });

  //nothing to go on: the password field is the one that can be shown safely,
  //and firebase will reject it rather than deleting anything
  it('defaults to google when the account says nothing', () => {
    expect(reauthMethod({})).toBe("google");
  });

});
