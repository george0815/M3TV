import { describe, it, expect } from 'vitest';
import { addToast, removeToast, MAX_TOASTS, TOAST_MS } from './toasts';

const toast = (id, message, tone = 'info') => ({ id, message, tone });


describe('addToast', () => {

  it('appends to the end', () => {
    const list = addToast(addToast([], toast(1, 'first')), toast(2, 'second'));
    expect(list.map(t => t.message)).toEqual(['first', 'second']);
  });

  it('starts from nothing', () => {
    expect(addToast([], toast(1, 'hello'))).toEqual([toast(1, 'hello')]);
    expect(addToast(undefined, toast(1, 'hello'))).toEqual([toast(1, 'hello')]);
  });

  /* The save paths retry, so the same failure can be reported twice in a row.
     Two identical toasts stacked on each other read as a rendering fault, not
     as the same thing happening twice. */
  it('does not stack the same message twice', () => {
    let list = addToast([], toast(1, 'Could not save.'));
    list = addToast(list, toast(2, 'Could not save.'));

    expect(list).toHaveLength(1);
  });

  //and the survivor is the new one, so its timer starts again from now
  it('refreshes a repeated message rather than keeping the old one', () => {
    let list = addToast([], toast(1, 'Could not save.'));
    list = addToast(list, toast(2, 'Could not save.'));

    expect(list[0].id).toBe(2);
  });

  it('moves a repeat to the end of the stack', () => {
    let list = addToast([], toast(1, 'first'));
    list = addToast(list, toast(2, 'second'));
    list = addToast(list, toast(3, 'first'));

    expect(list.map(t => t.message)).toEqual(['second', 'first']);
  });

  //different messages are not deduplicated, however similar
  it('keeps distinct messages apart', () => {
    let list = addToast([], toast(1, 'Enter a URL before saving.'));
    list = addToast(list, toast(2, 'Enter a title before saving.'));

    expect(list).toHaveLength(2);
  });

  it('holds at most three', () => {
    let list = [];
    for (let i = 1; i <= 6; i++) { list = addToast(list, toast(i, `message ${i}`)); }

    expect(list).toHaveLength(MAX_TOASTS);
  });

  //an old message scrolling off beats a new one never appearing
  it('drops the oldest when it overflows, not the newest', () => {
    let list = [];
    for (let i = 1; i <= 5; i++) { list = addToast(list, toast(i, `message ${i}`)); }

    expect(list.map(t => t.message)).toEqual(['message 3', 'message 4', 'message 5']);
  });

  it('carries the tone through', () => {
    const list = addToast([], toast(1, 'gone wrong', 'danger'));
    expect(list[0].tone).toBe('danger');
  });

});


describe('removeToast', () => {

  it('removes by id', () => {
    const list = [toast(1, 'a'), toast(2, 'b'), toast(3, 'c')];
    expect(removeToast(list, 2).map(t => t.message)).toEqual(['a', 'c']);
  });

  //a toast dismissed by hand is already gone when its timer fires
  it('does nothing for an id that has already gone', () => {
    const list = [toast(1, 'a')];
    expect(removeToast(list, 99)).toEqual(list);
    expect(removeToast(removeToast(list, 1), 1)).toEqual([]);
  });

  it('survives an empty list', () => {
    expect(removeToast([], 1)).toEqual([]);
    expect(removeToast(undefined, 1)).toEqual([]);
  });

});


describe('timings', () => {

  //long enough to read a sentence, short enough not to sit over the footer
  it('leaves a toast up for a few seconds', () => {
    expect(TOAST_MS).toBeGreaterThan(3000);
    expect(TOAST_MS).toBeLessThan(8000);
  });

});
