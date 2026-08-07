import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {

    //nothing under test touches the DOM — the pure logic was pulled out into
    //src/lib for exactly that reason — so there is no jsdom to install and no
    //browser to stand up
    environment: 'node',

    //the app's own suites sit next to what they test; the proxy is a separate
    //deployable with its own directory
    include: ['src/**/*.test.js', 'proxy/test/**/*.test.mjs'],

    //a fixed offset, deliberately not UTC and deliberately not a whole number
    //of hours. The clock had a bug where the time was read in UTC while the
    //date beside it was local, which is invisible on a machine set to UTC —
    //half of Asia/Kolkata's +5:30 is there to make sure the minutes move too.
    env: { TZ: 'Asia/Kolkata' },

  },
});
