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
App is available at https://m3tv.netlify.app/ and https://m3tv.vercel.app/ , make sure to click anywhere on the splash screen to enter the main menu.<br><br>Can be used with most MPEG-DASH and HLS streams, but mainly intended to be used with the streams found [here](https://github.com/iptv-org/iptv).

If you're trying to view a playlist that's locally hosted using something like [dizquetv](https://github.com/vexorian/dizquetv) or [ErsatzTV](https://github.com/jasongdove/ErsatzTV), just remember to allow insecure content in the browser settings. <br>

NOTE: On Microsoft Edge, you have to whitelist it by going to Settings > Cookies and site permissions > Manage and delete cookies and site data, then clicking "Add" in the "Allow" section and entering the URL

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


### Controls
Next Channel - N<br>
Previous Channel - P<br>
Random Channel - R<br>
Save Channel - F (only available when watching a channel that's a part of a playlist)<br>
Next Page - D<br>
Previous Page - A

## Acknowledgements

- [hls.js](https://github.com/video-dev/hls.js/): Library for viewing HLS streams.
- [Video.js](https://github.com/videojs/video.js): HTML5 Video Player.
- [m3u8-file-parser](https://github.com/NimitzDEV/m3u8-file-parser): A powerful parser for m3u and m3u8 files.
- [js-dos](https://js-dos.com/): simple API to run DOS games in browser.

