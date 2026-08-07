# m3tv
<img src="https://i.imgur.com/Wg3AGFG.png" width=25% height=25%>
m3tv is a web app that allows you to stream M3U playlists and M3U8 streams. 

## Features

- Stream M3U playlists and M3U8 streams.
- Change background music, channel and sound effect volume
- Simple user interface
- adding/removing playlists and channels
- Support for 8 different languages (en, es, fr, gr, ar, ru, ch, jp)

## Screenshots
<img src="https://i.imgur.com/P0ic1Uv.png" width=50% height=50%>
<img src="https://i.imgur.com/6G3352P.png" width=50% height=50%>
<img src="https://i.imgur.com/J2hqipj.png" width=50% height=50%>
<img src="https://i.imgur.com/KyiQjC6.png" width=50% height=50%>


## Usage
The most up-to-date version of the app is available at https://m3tv.net/, this version uses react and has search and account functionality. https://m3tv.netlify.app/ is available as a backup, unfortunately this does not include search or account functionality. Make sure to click anywhere on the splash screen to enter the main menu.<br><br>Can be used with most MPEG-DASH and HLS streams, but mainly intended to be used with the streams found [here](https://github.com/iptv-org/iptv).

If you're trying to view a playlist that's locally hosted using something like [dizquetv](https://github.com/vexorian/dizquetv) or [ErsatzTV](https://github.com/jasongdove/ErsatzTV), just remember to allow insecure content in the browser settings. <br>

NOTE: Streams loaded over HTTP may require you to allow insecure requests to view them. On google this is done by going to Site settings > m3tv and setting "Insecure content" to "Allow".
On Microsoft Edge, you have to whitelist it by going to Settings > Cookies and site permissions > Manage and delete cookies and site data, then clicking "Add" in the "Allow" section and entering the URL
![スクリーンショット 2024-06-04 223555](https://github.com/george0815/M3TV/assets/20736715/58429d53-ef67-46a9-9d5d-6210de29f509)

### Add a Playlist or Channel
1. Click anywhere to exit the splash screen and enter the main menu
2. To add a playlist, click the "Add Playlists" button in the main menu, or the "Add Channels" button if your adding a channel
3. Enter the correct URL for the m3u playlist or m3u8 stream, if the m3u file is stored locally on your computer, click the "local" button NOTE: if you are adding a local playlist, you do not have to enter anything into the textbox. You will be prompted with a file dialog upon clicking the "Okay" button
4. Enter a title and an image URL for the logo (optional)
5. Press back to save changes
6. Once the playlist or channel is added, you can see view them by clicking the "Play Playlists" or "Play Channels" button in the main menu

### Edit a Playlist or Channel
Users can edit existing playlists or channels by clicking the "Edit Playlists" or "Edit Channels" buttons in the options menu. There they can edit a given channel's name, URL, and logo. Changes are saved by pressing the "back" button. Users can also remove a channel or playlist by clicking the "remove" button on the bottom right of the screen.

### Audio Settings
You can adjust the sound effect and channel volume by using their respective sliders. <br>

To change the background music: 
1. Find a youtube video
2. Click "share"
3. Click "Embed"
4. Copy the string that's in the quotations after "src=" and paste it into the text box
5. Click "Back" to save changes

### Video Settings
If you want to view CORS protected streams, then click the "CORS Proxy Server" toggle. Additionally, you can also choose the video player that's used to play the streams. 

### Account Settings
If you want to save streams and then watch them on a different device, then you can create an account, add your desired playlists, and log in on your preferred device (only available on react version). Use "Create account" the first time and "Login" after that. "Forgot password" sends a reset email to whatever address is in the email box.

"Delete account" removes the account and every channel and playlist saved to it. It asks for your password first — Firebase will not delete a session more than a few minutes old, so this is required rather than just a confirmation. Anything saved on the device itself while signed out is left alone and comes back afterwards. It cannot be undone.


### Controls
Next Channel - N<br>
Previous Channel - P<br>
Random Channel - R<br>
Save Channel - F (only available when watching a channel that's a part of a playlist)<br>
Search - S (Only available on react version)<br>
Next Page - D<br>
Previous Page - A

## Running it yourself

Needs [Node.js](https://nodejs.org/) 20 or newer. The app is built with [Vite](https://vite.dev/).

```bash
npm install
cp .env.example .env   # then fill in VITE_FIREBASE_API_KEY
npm run dev            # dev server on http://localhost:3000
```

Without a `.env`, Firebase can't initialise and the login/account features won't work — everything else still runs off local storage. To reach the dev server from another device on your network, run `npm run dev -- --host`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm test` | Run the test suites once |
| `npm run test:watch` | Re-run them as files change |

### Tests

[Vitest](https://vitest.dev/), no browser and no jsdom. The logic worth testing was pulled out of the components into `src/lib/`, which is what the suites import:

| Suite | Covers |
| --- | --- |
| `src/lib/entries.test.js` | What counts as a saveable channel or playlist, and whether a chosen file is really an m3u |
| `src/lib/channels.test.js` | Searching and paging the channel grid, including keeping each result's index in the unfiltered list |
| `src/lib/streams.test.js` | The add, edit and remove transforms, each of which has to leave the array held in state alone |
| `src/lib/account.test.js` | The account deletion sequence, above all that the saved data goes before the account does |
| `src/lib/clock.test.js` | Time and date formatting, run under a fixed `Asia/Kolkata` so a machine set to UTC can't hide a UTC bug |
| `proxy/test/manifest.test.mjs` | The stream proxy's manifest rewriting and target validation |

### Firebase

`VITE_FIREBASE_API_KEY` is not a secret. Vite inlines it into the JS bundle, so it's served to every visitor regardless — Firebase web API keys are public project identifiers, not credentials. What actually protects account data is:

1. `firestore.rules`, which limits each user to the single document at `/data/{their uid}`
2. the authorised domains list in Firebase Console > Authentication > Settings
3. the API key restrictions in Google Cloud Console > Credentials

Rules changes only take effect once deployed:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules --project m3tv-66f28
```

### Deploying

Hosting is AWS Amplify. `amplify.yml` holds the build spec — `npm ci`, `npm run build`, and `dist/` as the artifact directory.

Two things are console-side rather than committed, because Amplify does not read them from the repo:

**Environment variables.** `VITE_FIREBASE_API_KEY` has to be set under App settings → Environment variables, since `.env` isn't committed. Vite inlines it at build time, so changing it requires a fresh build, not just a redeploy.

**Rewrites and redirects.** Client-side routes must fall back to `index.html`, while `/doom/*` keeps serving its own files. Under App settings → Rewrites and redirects, in this order:

| Source | Target | Type |
| --- | --- | --- |
| `https://www.m3tv.net` | `https://m3tv.net` | 301 (Permanent) |
| `/doom` | `/doom/index.html` | 200 (Rewrite) |
| `/doom/` | `/doom/index.html` | 200 (Rewrite) |
| `</^[^.]+$\|\.(?!(css\|html\|json\|webp\|woff2\|jsdos\|wasm\|symbols\|otf\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|mp3\|ttf)$)([^.]+$)/>` | `/index.html` | 200 (Rewrite) |

Order matters — Amplify takes the first match. The two `/doom` rules come first because neither URL has a file extension, so the catch-all would otherwise serve them the app's `index.html`.

**The extension list must be kept in step with the assets the build produces.** Anything not listed is treated as a client-side route and rewritten to `index.html`, so it arrives as a few hundred bytes of HTML rather than the file. That has broken the site twice — once when the splash became `.webp` and once when the font became `.woff2`. Note that `woff` does **not** cover `woff2`; the pattern matches the whole extension. Any commit introducing a new asset type has to update this rule in the same change.

**The www redirect is what keeps the app on one origin**, which matters beyond tidiness: `www.m3tv.net` resolves to the same Amplify distribution and served the app happily, but the browser treats it as a separate origin — so every stream failed for anyone who arrived with the `www.` until it was added to the stream proxy's `ALLOWED_ORIGINS` as well. It is kept in that allowlist regardless, in case this rule is ever removed. The bare origin as a source preserves the path: `www.m3tv.net/playc` lands on `m3tv.net/playc`, so bookmarks survive.

**Saving rules does not apply them.** Amplify serves with a one-year edge TTL (`s-maxage=31536000`) and saving the rules does not invalidate CloudFront — a deploy is what does. After any change here, trigger a build or "Redeploy this version". If the `age` response header only ever climbs across checks, nothing has reached the origin yet.

Everything else under `/doom/` is left alone deliberately. Those are real files in the deployment and S3 serves them with correct content types; the extension list in the catch-all is what keeps them from being swallowed, which is why `html` belongs in it. Do **not** add a `/doom/<*>` → `/doom/<*>` rule to cover them — an Amplify 200 rewrite proxies the response and relabels it `text/html`, so `js-dos.css` stops being applied as a stylesheet and `bundle.jsdos` stops parsing, and the emulator silently fails to boot.

## Acknowledgements

- [hls.js](https://github.com/video-dev/hls.js/): Library for viewing HLS streams.
- [Video.js](https://github.com/videojs/video.js): HTML5 Video Player.
- [m3u8-file-parser](https://github.com/NimitzDEV/m3u8-file-parser): A powerful parser for m3u and m3u8 files.
- [js-dos](https://js-dos.com/): simple API to run DOS games in browser.

