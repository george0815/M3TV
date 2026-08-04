
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
import {getFirestore} from "firebase/firestore"
import Hls from 'hls.js';
import { translations } from './misc/translations';


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

export const db = getFirestore(app);

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
export function playChannel(url, setCurPlaying, settings, setSettings, player){

    const videoPlayer = settings.player;
    let unmuteLater = false;
    let hls = null;

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

    // sets playing to true so channel buttons can work
    curPlaying = true;
    setCurPlaying(true)


    //loads a source through hls.js, retrying once through the proxy if the
    //direct attempt fails at the network level — which is what a missing
    //Access-Control-Allow-Origin looks like from in here. without a proxy
    //configured it says so plainly instead of failing silently.
    function startHls(sourceUrl, viaProxy){

      hls = new Hls();

      hls.on(Hls.Events.ERROR, (event, data) => {

        if(!data.fatal || data.type !== Hls.ErrorTypes.NETWORK_ERROR){ return; }

        hls.destroy();
        hls = null;

        if(!viaProxy && proxy_url){ startHls(proxy_url + sourceUrl, true); }
        else{ window.alert(translations[settings.lang].streamBlocked); }

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
            window.alert(translations[settings.lang].streamBlocked);
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
          window.alert(translations[settings.lang].streamBlocked);
          return;
        }

        vjsRetried = true;
        player.error(null);
        player.src(proxy_url + url);
        player.play();

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



