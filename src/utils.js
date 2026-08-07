
import okMain from "./audio/okMain.mp3"
import okSetting from "./audio/okSetting.mp3"
import okChannel from "./audio/okChannel.mp3"
import backSetting  from "./audio/backSetting.mp3"
import backMain  from "./audio/backMain.mp3"
import backChannel  from "./audio/backChannel.mp3"
import splashIn  from "./audio/splashScreenIn.mp3"
import splashOut from "./audio/splashScreenOut.mp3"
import { useRef, useEffect } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { translations } from './misc/translations';

//the save rules live in src/lib so they can be loaded without firebase and
//without a browser — importing this file initialises one and needs the other.
//re-exported here so the components carry on importing them from where they
//always did.
export { validateEntry, looksLikePlaylist, MAX_PLAYLIST_BYTES } from './lib/entries';


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "m3tv-66f28.firebaseapp.com",
  projectId: "m3tv-66f28",
  messagingSenderId: "830463803107",
  appId: "1:830463803107:web:14c9fd7d36623752fd4fd6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


export const auth = getAuth();

export let soundEffects = {

    okMain : new Audio(okMain), 
    okSetting : new Audio(okSetting), 
    okChannel : new Audio(okChannel), 
    backSetting : new Audio(backSetting),    
    backMain : new Audio(backMain), 
    backChannel : new Audio(backChannel), 
    splashIn : new Audio(splashIn), 
    splashOut : new Audio(splashOut)

}

/* hls.js is the largest thing left in the bundle and none of it is needed to
   reach the menu, the settings screens or the add forms — only to play a
   channel, and not even then on safari and ios, which play HLS through the
   browser's own pipeline. So it is fetched on demand.

   The promise is cached rather than the module, so two plays in quick
   succession wait on one download instead of starting two. */
let hlsLoad = null;

export function loadHls(){

  if(!hlsLoad){ hlsLoad = import('hls.js').then(module => module.default); }

  return hlsLoad;

}

/* Whether this browser needs it at all. Asked of a throwaway element rather
   than the real player, because this is called before there is one — the grid
   starts the download on arrival so that playing a channel does not have to
   wait for it. */
export function needsHlsJs(){

  const probe = document.createElement("video");

  return !(probe.canPlayType && probe.canPlayType('application/vnd.apple.mpegurl'));

}


export let curPlaying = false;

//the fullscreenchange handler from the last playChannel() call. it is kept so
//the next call can detach it: switching channels without leaving fullscreen
//never fires exit(), so without this each play left another handler attached,
//each one holding its own settings, player and hls instance alive
let activeExitHandler = null;

//the media-element error handler from the last native-HLS play, tracked for
//the same reason as the one above: it has to come off before the next goes on
let activeNativeErrorHandler = null;

//and the picture-in-picture handlers, same again
let activeLeavePipHandler = null;
let activeEnterPipHandler = null;




export function useFirstRender() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
} 

//PLAYS CHANNEL
/* `notify` is the toast function from App's ToastContext, passed in because
   this is not a component and cannot reach the context itself. It is optional:
   the playlist screen hands playPlaylist() to the same prop with a different
   signature, so nothing here may assume it arrived. */
export function playChannel(url, setCurPlaying, settings, setSettings, player, notify){

    const videoPlayer = settings.player;
    let unmuteLater = false;
    let hls = null;

    //set once exit() has run, so anything still in flight can stand down
    let tornDown = false;

    //optional, and unset by default. streams that send Access-Control-Allow-
    //Origin play directly and never touch this; it exists only as a fallback
    //for the ones that don't. there is no way around it for those: hls.js
    //pulls the manifest and every segment over XHR, so the browser enforces
    //CORS on them.
    const proxy_url = import.meta.env.VITE_CORS_PROXY;

    //mutes  music.
    //updated from the previous value rather than the settings captured when
    //this ran: exit() can fire minutes later, and spreading the stale object
    //would roll back anything changed while the channel was playing
    if(settings.musicOn){
      setSettings(prev => ({...prev, musicOn: false}));
      unmuteLater = true;
    }


    function exit(){

      //entering picture-in-picture takes the video out of fullscreen, so this
      //fires — but the user has not stopped watching. Tearing the player down
      //here left the picture-in-picture window showing a hidden, paused, muted
      //video the moment it opened.
      if (document.pictureInPictureElement) { return; }

      if (!document.fullscreen) {

        //Everything that has to happen regardless runs first and outside the
        //try below. It used to sit underneath the sound effect and the player
        //calls, inside a bare catch — so if the player threw (which it does
        //once a stream has errored) the flag was never cleared, the player
        //surfaces kept display:"" and an invisible overlay swallowed every
        //click on the page. A teardown must not depend on the thing it is
        //tearing down still working.
        curPlaying = false;
        setCurPlaying(false);

        //hls.js may still be downloading when this runs; the flag stops the
        //instance being built after the thing it would attach to has gone
        tornDown = true;

        document.removeEventListener("fullscreenchange", exit);
        if(activeExitHandler === exit){ activeExitHandler = null; }

        document.removeEventListener("leavepictureinpicture", exit);
        if(activeLeavePipHandler === exit){ activeLeavePipHandler = null; }

        if(activeEnterPipHandler){
          document.removeEventListener("enterpictureinpicture", activeEnterPipHandler);
          activeEnterPipHandler = null;
        }

        if(activeNativeErrorHandler){
          try{ player.removeEventListener("error", activeNativeErrorHandler); } catch {}
          activeNativeErrorHandler = null;
        }

        if(videoPlayer === "hls" && hls){
          try{ hls.destroy(); } catch {}
          hls = null;
        }

        //unmutes music
        if(unmuteLater){
          setSettings(prev => ({...prev, musicOn: true}));
        }

        try {

          soundEffects.backChannel.play();

          //makes the video element invisible
          if(videoPlayer === "vjs"){document.getElementById('vjs').style.display = 'none';  player.hide(); player.pause();}

          //mutes player. on a media element muted is a property, but on a
          //videojs player it is a method — assigning to it there replaced the
          //method with `true` instead of muting anything.
          if(videoPlayer === "vjs"){ player.muted(true); }
          else { player.muted = true; }

          try{ player.removeEventListener("webkitendfullscreen", exit);} catch {}


        

        }
        catch {
        
        }
         
      }
          


    }


    

    

    //plays sound effect and mutes background music if it isn't already muted
    soundEffects.okChannel.play();

  

    /*
    if (!(document.getElementById("bgMusic").src.includes("&mute=1"))) {
      document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";
    }*/


    // player for playing vids
    

    function fix(item) {
        var playPromise = item.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {})
            .catch(error => {
              console.error(error);

            });
          }
    }


    //Called once a channel has run out of ways to play. Previously each failure
    //path only raised an alert, which left the viewer holding a dead player —
    //still fullscreen, still marked as playing, with the channel grid
    //unreachable behind it. Leaving fullscreen fires the teardown; if we never
    //got there, run it directly.
    function giveUp(){

      /* A toast is part of the page, and while anything is fullscreen the page
         is not painted — only the fullscreen element and its descendants are.
         window.alert was drawn by the browser itself and did not care; a toast
         raised here would sit behind the video and time out unseen. So it
         waits for the exit instead of racing it. */
      const say = () => {
        if(notify){ notify(translations[settings.lang].streamBlocked, "danger"); }
      };

      if(document.fullscreenElement){
        document.exitFullscreen().then(say).catch(() => { exit(); say(); });
      }
      else { exit(); say(); }

    }

    // sets playing to true so channel buttons can work
    curPlaying = true;
    setCurPlaying(true)


    //loads a source through hls.js, retrying once through the proxy if the
    //direct attempt fails at the network level — which is what a missing
    //Access-Control-Allow-Origin looks like from in here. without a proxy
    //configured it says so plainly instead of failing silently.
    async function startHls(sourceUrl, viaProxy){

      /* Already in hand: the channel grid starts this download as soon as it
         opens, so this awaits a settled promise and resolves on a microtask.
         It matters that it does — playChannel goes on to call
         requestFullscreen, which needs the user activation from the click, and
         activation does not survive a cold download. */
      const Hls = await loadHls();

      //the viewer left while it was arriving
      if(tornDown){ return; }

      hls = new Hls();

      hls.on(Hls.Events.ERROR, (event, data) => {

        if(!data.fatal || data.type !== Hls.ErrorTypes.NETWORK_ERROR){ return; }

        hls.destroy();
        hls = null;

        if(!viaProxy && proxy_url){ startHls(proxy_url + sourceUrl, true); }
        else{ giveUp(); }

      });

      hls.loadSource(sourceUrl);
      hls.attachMedia(player);
      fix(player);

    }


    //an http stream on an https page is refused as mixed content before CORS
    //is even looked at, and no retry changes that — so when we can see it
    //coming, go through the proxy immediately rather than failing first
    const mixedContent = window.location.protocol === "https:" && /^http:\/\//i.test(url);
    const startUrl = (mixedContent && proxy_url) ? proxy_url + url : url;


    //plays video
    if(videoPlayer === "hls"){
      player.muted = false;

      //safari and ios play HLS through the browser's own media pipeline, which
      //CORS does not apply to — so no hls.js is needed there, and no proxy
      //either unless the stream is http on an https page
      if(player.canPlayType && player.canPlayType('application/vnd.apple.mpegurl')){

        //native playback raises no hls.js events, so the one retry has to hang
        //off the media element itself
        let retried = startUrl !== url;

        if(activeNativeErrorHandler){ player.removeEventListener("error", activeNativeErrorHandler); }

        const onNativeError = () => {

          if(retried || !proxy_url){
            giveUp();
            return;
          }

          retried = true;
          player.src = proxy_url + url;
          fix(player);

        };

        activeNativeErrorHandler = onNativeError;
        player.addEventListener("error", onNativeError);

        player.src = startUrl;
        fix(player);

      }
      else{
        startHls(startUrl, startUrl !== url);
      }
    }
    else if(videoPlayer === "vjs"){

      //video.js reports failures through its own error event rather than
      //throwing, so without this the vjs path had no proxy fallback at all —
      //a stream that hls.js would have retried simply died here with
      //MEDIA_ERR_SRC_NOT_SUPPORTED. Worth having even for streams that do send
      //CORS headers: some send Access-Control-Allow-Origin twice, which the
      //browser rejects outright, and going through the proxy normalises it.
      let vjsRetried = startUrl !== url;

      player.on('error', () => {

        if(vjsRetried || !proxy_url){
          giveUp();
          return;
        }

        vjsRetried = true;
        player.error(null);
        player.src(proxy_url + url);

        //fix() rather than a bare play(): play() returns a promise and nothing
        //was catching it, so a stream that failed through the proxy as well
        //surfaced as an uncaught DOMException in the console
        fix(player);

      });

      player.src(startUrl);
      player.volume(settings.vol.channel);


      player.trigger('resize');

      player.show();
      fix(player)
    }

    
    if(player.requestFullscreen) {
      player.requestFullscreen();
    }
    else if(player.webkitEnterFullScreen) {
      try{
      player.addEventListener('loadedmetadata', function() {
        if (player.webkitEnterFullscreen) {
          player.webkitEnterFullScreen();
        }
    });
  }
  catch {
  
  }
      
    }
 


     //STOPS CHANNEL
    if(activeExitHandler){ document.removeEventListener("fullscreenchange", activeExitHandler); }
    activeExitHandler = exit;
    document.addEventListener("fullscreenchange", exit);

    //closing the picture-in-picture window does not fire fullscreenchange, so
    //without this the channel would stay marked as playing with the player
    //sitting there after the viewer had closed it
    if(activeLeavePipHandler){ document.removeEventListener("leavepictureinpicture", activeLeavePipHandler); }
    activeLeavePipHandler = exit;
    document.addEventListener("leavepictureinpicture", exit);

    //the in-page player is still on screen once picture-in-picture opens, and
    //it covers the channel grid. Put the grid back by clearing the playing
    //flag — deliberately without pausing, muting or destroying anything, since
    //the stream carries on in the picture-in-picture window.
    //
    //firefox does not drop out of fullscreen when a video pops out to
    //picture-in-picture, so the document stayed fullscreen over an empty black
    //surface. exit() is gated on leaving fullscreen, so closing the
    //picture-in-picture window then tore nothing down and the page looked
    //frozen until esc was pressed. Picture-in-picture replaces fullscreen, so
    //end it here — the resulting fullscreenchange is ignored by exit() while
    //pictureInPictureElement is set.
    const enterPip = () => {

      setCurPlaying(false);

      if(document.fullscreenElement){
        try{ document.exitFullscreen().catch(() => {}); } catch {}
      }

    };

    if(activeEnterPipHandler){ document.removeEventListener("enterpictureinpicture", activeEnterPipHandler); }
    activeEnterPipHandler = enterPip;
    document.addEventListener("enterpictureinpicture", enterPip);
   try{ player.addEventListener("webkitendfullscreen", exit);} catch {}



  }



