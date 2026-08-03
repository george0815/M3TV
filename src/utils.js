
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
      if (!document.fullscreen) {
        try {

        //unmutes music
        if(unmuteLater){
          setSettings(prev => ({...prev, musicOn: true}));
        }



        //plays sound effect and makes video element invisible, sets playing to false
        
          
          soundEffects.backChannel.play();
          if(videoPlayer === "vjs"){document.getElementById('vjs').style.display = 'none';  player.hide(); player.pause();}

          document.removeEventListener("fullscreenchange", exit);
          if(activeExitHandler === exit){ activeExitHandler = null; }

          //this was set to true on play and never cleared, so Channelwrapper's
          //check on it stayed stuck after the first channel of the session
          curPlaying = false;
          setCurPlaying(false);

          //mutes player and unmutes background music, destroys player
          player.muted = true;
          if(videoPlayer === "hls" && hls){hls.destroy(); hls = null;}
          document.removeEventListener("fullscreenchange", exit);
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


    //plays video
    if(videoPlayer === "hls"){
      player.muted = false;

      //safari and ios play HLS through the browser's own media pipeline, which
      //is not subject to CORS at all — so no hls.js and no proxy is needed
      //there, whatever headers the stream sends
      if(player.canPlayType && player.canPlayType('application/vnd.apple.mpegurl')){
        player.src = url;
        fix(player);
      }
      else{
        startHls(url, false);
      }
    }
    else if(videoPlayer === "vjs"){
      player.src(url);
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
   try{ player.addEventListener("webkitendfullscreen", exit);} catch {}



  }



