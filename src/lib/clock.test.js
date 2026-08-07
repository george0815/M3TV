import { describe, it, expect } from 'vitest';
import { formatTime, formatDate } from './clock';

/* These run with TZ pinned to Asia/Kolkata by vitest.config.js: a fixed +5:30
   with no daylight saving, so both the hour and the minute differ from UTC and
   a date built from a UTC instant lands on a known local wall clock. On a
   machine set to UTC the bug these cover is invisible. */

//2024-01-05 20:35 UTC is 2024-01-06 02:05 in Kolkata — a different hour, a
//different minute and a different day
const acrossMidnight = new Date(Date.UTC(2024, 0, 5, 20, 35));


describe('formatTime', () => {

  /* The hours used to be read in UTC while the date beside them was local, so
     the two were out of step by the whole offset and disagreed outright either
     side of midnight. */
  it('reads the local hour, not UTC', () => {
    expect(formatTime(acrossMidnight)).toBe('2:05');
  });

  //without the pad, five past two rendered as "2:5"
  it('pads the minutes', () => {
    expect(formatTime(new Date(2024, 0, 5, 14, 5))).toBe('14:05');
    expect(formatTime(new Date(2024, 0, 5, 9, 0))).toBe('9:00');
  });

  //a clock like this does not write "09:00", and the pad was only ever meant
  //for the minutes
  it('does not pad the hour', () => {
    expect(formatTime(new Date(2024, 0, 5, 9, 30))).toBe('9:30');
  });

  it('reads midnight as zero and noon as twelve', () => {
    expect(formatTime(new Date(2024, 0, 5, 0, 0))).toBe('0:00');
    expect(formatTime(new Date(2024, 0, 5, 12, 0))).toBe('12:00');
  });

  it('runs to twenty three hours, not twelve', () => {
    expect(formatTime(new Date(2024, 0, 5, 23, 59))).toBe('23:59');
  });

});


describe('formatDate', () => {

  it('writes a short weekday then a padded month and day', () => {
    expect(formatDate(new Date(2024, 0, 5), 'en-GB')).toBe('Fri 01/05');
  });

  it('pads both parts of the date', () => {
    expect(formatDate(new Date(2024, 10, 9), 'en-GB')).toBe('Sat 11/09');
    expect(formatDate(new Date(2024, 11, 25), 'en-GB')).toBe('Wed 12/25');
  });

  //getMonth is zero based, so december is 11 and has to be written as 12
  it('counts months from one, not zero', () => {
    expect(formatDate(new Date(2024, 0, 15), 'en-GB').endsWith('01/15')).toBe(true);
    expect(formatDate(new Date(2024, 11, 15), 'en-GB').endsWith('12/15')).toBe(true);
  });

  it('names the weekday in the viewer\'s own language', () => {
    expect(formatDate(new Date(2024, 0, 5), 'fr-FR')).toBe('ven. 01/05');
    expect(formatDate(new Date(2024, 0, 5), 'de-DE')).toBe('Fr 01/05');
  });

  //the same local date the time above is read from, so the pair cannot drift
  //apart across midnight
  it('reads the local date, not UTC', () => {
    expect(formatDate(acrossMidnight, 'en-GB')).toBe('Sat 01/06');
  });

});
