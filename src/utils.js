
import okMain from "./audio/okMain.mp3"
import okSetting from "./audio/okSetting.mp3"
import okChannel from "./audio/okChannel.mp3"
import backSetting  from "./audio/backSetting.mp3"
import backMain  from "./audio/backMain.mp3"
import backChannel  from "./audio/backChannel.mp3"
import splashIn  from "./audio/splashScreenIn.mp3"
import splashOut from "./audio/splashScreenOut.mp3"
import videojs from 'video.js';
import { useRef, useEffect } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore, collection} from "firebase/firestore"
import Hls from 'hls.js';


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvbhfJ4s5LFVq9nrGBBa4vnQ67adTFEZg",
  authDomain: "m3tv-66f28.firebaseapp.com",
  projectId: "m3tv-66f28",
  storageBucket: "m3tv-66f28.appspot.com",
  messagingSenderId: "830463803107",
  appId: "1:830463803107:web:14c9fd7d36623752fd4fd6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const dataCollection = collection(db, "data");

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
    const cors = settings.cors;
    let unmuteLater = false;

    //mutes  music 
    if(settings.musicOn){
      setSettings({...settings, musicOn: false});
      unmuteLater = true;
    }


    function exit(){
      if (!document.fullscreen) {
        try {

        //unmutes music
        if(unmuteLater){
          setSettings({...settings, musicOn: true});
        }


        console.log(player);

        //plays sound effect and makes video element invisible, sets playing to false
        
          
          soundEffects.backChannel.play();
          if(videoPlayer === "vjs"){document.getElementById('vjs').style.display = 'none';  player.hide(); player.pause();}      
          
          document.removeEventListener("fullscreenchange", exit);
          setCurPlaying(false);

          //mutes player and unmutes background music, destroys player 
          player.muted = true;
          if(videoPlayer === "hls"){hls.destroy();}
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


    //CORS
    const proxy_url = 'https://phantoma.up.railway.app/';
    if(cors === true){ url = proxy_url + url; }          


    //plays video
    if(videoPlayer === "hls"){
      player.muted = false;
      var hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(player);
      fix(player)
    }
    else if(videoPlayer === "vjs"){
      player.src(url);
      player.volume(settings.vol.channel);
      console.log(player.volume());


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
    document.addEventListener("fullscreenchange", exit);
   try{ player.addEventListener("webkitendfullscreen", exit);} catch {}



  }



