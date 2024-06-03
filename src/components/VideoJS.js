import React, {  useEffect, useState  } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoJS = (props) => {
  const [videoContainerEl, setVideoContainerEl] = useState(null);

  useEffect( () => {
    if (!videoContainerEl) return;

    videoContainerEl.innerHTML = `
      <div data-vjs-player>
        <video id="vjs" style={!props.curPlaying ? {display: "none"} : {display: ""}} class="video-js vjs-default-skin" controls  ><source src="path/to/your/video.mp4"/> </video>
      </div>
    `;

    const videoEl = videoContainerEl.querySelector('video');
    const player = videojs(videoEl);

    return () => {
      player.dispose();
    }
  }, []);

  return <div ref={setVideoContainerEl} />;
}

export default VideoJS;