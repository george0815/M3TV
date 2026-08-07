import { describe, it, expect, vi } from 'vitest';
import { deleteAccount, reauthReason } from './account';

//a set of steps that all succeed, recording the order they ran in
const steps = (order = []) => ({
  order,
  reauthenticate: vi.fn(async () => { order.push('reauth'); }),
  deleteDocument: vi.fn(async () => { order.push('document'); }),
  deleteAuthUser: vi.fn(async () => { order.push('account'); }),
});

const fails = (code) => async () => {
  const error = new Error(code || 'nope');
  error.code = code;
  throw error;
};


describe('deleteAccount', () => {

  it('reports success once every step has run', async () => {
    const result = await deleteAccount(steps());
    expect(result).toEqual({ ok: true, reason: 'accountDeleted', dataDeleted: true });
  });

  /* The one that matters. firestore.rules only lets a user touch
     /data/{their own uid} while signed in as that user, so deleting the auth
     user first strands the document where nobody can ever reach it — not the
     user, not a later sign-up on the same email. Only console access clears
     it after that. */
  it('deletes the saved data before the account itself', async () => {
    const s = steps();
    await deleteAccount(s);
    expect(s.order).toEqual(['reauth', 'document', 'account']);
  });

  it('confirms the password before deleting anything', async () => {
    const s = { ...steps(), reauthenticate: fails('auth/wrong-password') };
    const result = await deleteAccount(s);

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('deleteWrongPassword');
    expect(s.deleteDocument).not.toHaveBeenCalled();
    expect(s.deleteAuthUser).not.toHaveBeenCalled();
  });

  //the survivable failure: nothing has been touched, so the user can retry
  it('leaves the account alone when the data cannot be deleted', async () => {
    const s = { ...steps(), deleteDocument: fails() };
    const result = await deleteAccount(s);

    expect(result).toEqual({ ok: false, reason: 'deleteDataFailed', dataDeleted: false });
    expect(s.deleteAuthUser).not.toHaveBeenCalled();
  });

  /* The other way round is the one worth reporting honestly: the channels and
     playlists really are gone, so the caller has to clear the local copies
     even though the account survived. */
  it('says the data went even when the account could not be removed', async () => {
    const s = { ...steps(), deleteAuthUser: fails('auth/requires-recent-login') };
    const result = await deleteAccount(s);

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('deleteAccountFailed');
    expect(result.dataDeleted).toBe(true);
  });

  it('runs each step exactly once', async () => {
    const s = steps();
    await deleteAccount(s);

    expect(s.reauthenticate).toHaveBeenCalledTimes(1);
    expect(s.deleteDocument).toHaveBeenCalledTimes(1);
    expect(s.deleteAuthUser).toHaveBeenCalledTimes(1);
  });

});


describe('reauthReason', () => {

  //newer firebase projects collapse a wrong password into invalid-credential
  it('names a wrong password as such, however firebase phrases it', () => {
    expect(reauthReason({code: 'auth/wrong-password'})).toBe('deleteWrongPassword');
    expect(reauthReason({code: 'auth/invalid-credential'})).toBe('deleteWrongPassword');
  });

  it('separates a rate limit from a wrong password', () => {
    expect(reauthReason({code: 'auth/too-many-requests'})).toBe('tooManyAttempts');
  });

  //an unrecognised failure must not put a raw firebase code on screen
  it('falls back to the generic message', () => {
    expect(reauthReason({code: 'auth/network-request-failed'})).toBe('deleteReauthFailed');
    expect(reauthReason(new Error('no code at all'))).toBe('deleteReauthFailed');
    expect(reauthReason(undefined)).toBe('deleteReauthFailed');
  });

});
