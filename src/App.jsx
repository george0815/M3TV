import React, {useState, useEffect, createContext, lazy, Suspense} from 'react'; //react
//Components
import Mainpage from './components/Mainpage';
import Addplaylist from './components/Add/Addplaylist';
import Addchannel from './components/Add/Addchannel';
import Options from './components/Options/Options';
import Audiopage from './components/Options/Audio';
import Editchannels from './components/Options/Editchannels';
import Editplaylists from './components/Options/Editplaylists';
import Language from './components/Options/Language';
import Video from './components/Options/Video';
import { BrowserRouter, Route, Routes } from 'react-router-dom' //React Router
import { soundEffects } from './utils';
import { doc, getDoc } from "firebase/firestore"; 
import {db} from "./utils"
//CSS
import "./styles/General.css";
import "./styles/Clock.css";
import "./styles/Buttons.css";
import "./styles/Misc.css";
import './App.css';

//the two play routes are the only thing that pulls in video.js, which is far
//and away the biggest dependency here. loading them on demand keeps it out of
//the bundle everyone downloads just to reach the main menu.
const Playplaylist = lazy(() => import("./components/Play/Playplaylist"));
const Playchannel  = lazy(() => import("./components/Play/Playchannel"));



//settings for a visitor with nothing saved yet
const DEFAULT_SETTINGS = {

  lang: "en",
  player: "hls",
  cors: false,
  vol: {
    channel: 1.0,
    soundEffects: 0.0
  },
  loggedIn: false,
  user: {},
  music: "https://www.youtube.com/embed/5k3uAtQ8vlg",
  musicOn: false

};

//earlier builds stored the whole Firebase user object in settings, and that
//serializes the account's refresh token into localStorage. only the uid is
//ever read, so trim it back on load — otherwise existing installs keep
//carrying a long-lived credential around forever.
function loadSettings(){

  const saved = localStorage.getItem("settings");
  if(!saved){ return DEFAULT_SETTINGS; }

  const settings = JSON.parse(saved);
  if(settings.user && typeof settings.user === "object"){
    settings.user = { uid: settings.user.uid, email: settings.user.email };
  }

  return settings;
}

//import context
export const SettingsContext = createContext(loadSettings());

//export context
export const StreamsContext = createContext(localStorage.getItem("streams") ? JSON.parse(localStorage.getItem("streams")) : {

  channels: [],
  playlists: []

});



 





function App() {


  //saves settings to local storage whenever it's saved
 useEffect(() => {

  if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {

     
    window.history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function(event) {
      window.location.replace(window.location);
    });

  } 

}, []);


  //streams
  const [streams, setStreams] = useState(localStorage.getItem("streams") ? JSON.parse(localStorage.getItem("streams")) : {

    channels: [],
    playlists: []
  
  });

  //channels
  const [settings, setSettings] = useState(loadSettings());


  //used for editingChannels/playlists
  const [index, setIndex] = useState(null);


  //used for making sure the splash screen isn't rendered everytime
  const [firstLoad, setFirstLoad] = useState(null);


  //gets playlist and channel data
  async function getData(user){

    console.log(user);
    console.log(streams);

    const docRef = doc(db, "data", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
       
        //sets state
        setStreams(docSnap.data());

      }
      else{

        setStreams({

          channels: [],
          playlists: []

        });

      }

  } 

 


  //saves settings to local storage whenever it's saved
  useEffect(() => {
       localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings]);




  //saves settings to local storage whenever it's saved
  useEffect(() => {
    
    if(settings.loggedIn === true){
      getData(settings.user);
    }
  }, [settings.loggedIn, settings.user]);


  //saves streams to local storage whenever it's saved
  useEffect(() => {
   if(!settings.loggedIn){ localStorage.setItem("streams", JSON.stringify(streams))}
  }, [streams]);


  //alters soundeffects volume
  useEffect(() => {

    soundEffects.okMain.volume = settings.vol.soundEffects; 
    soundEffects.okSetting.volume = settings.vol.soundEffects;
    soundEffects.okChannel.volume = settings.vol.soundEffects; 
    soundEffects.backSetting.volume = settings.vol.soundEffects; 
    soundEffects.backMain.volume = settings.vol.soundEffects;
    soundEffects.backChannel.volume = settings.vol.soundEffects;
    soundEffects.splashIn.volume = settings.vol.soundEffects;
    soundEffects.splashOut.volume = settings.vol.soundEffects;

}, [settings.vol.soundEffects]);


  return (
    <SettingsContext.Provider value={{settings, setSettings}}>

      <StreamsContext.Provider value={{streams, setStreams}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Mainpage firstLoad={firstLoad} setFirstLoad={setFirstLoad}/>}/>
            <Route path="playp" element={<Suspense fallback={null}><Playplaylist /></Suspense>}/>
            <Route path="playc" element={<Suspense fallback={null}><Playchannel /></Suspense>}/>
            <Route path="addp" element={<Addplaylist />}/>
            <Route path="addc" element={<Addchannel />}/>
            <Route path="options" element={<Options />}/>
            <Route path="video" element={<Video />}/>
            <Route path="audio" element={<Audiopage />}/>
            <Route path="editcForm" element={<Addchannel index={index}/>}/>
            <Route path="editpForm" element={<Addplaylist index={index}/>}/>
            <Route path="editc" element={<Editchannels setIndex={setIndex}/>}/>
            <Route path="editp" element={<Editplaylists setIndex={setIndex}/>}/>
            <Route path="lang" element={<Language />}/>

          </Routes>
        </BrowserRouter>

        <iframe key={Date()} tabIndex="-1"  id="bgMusic" width="0" height="0" src={settings.music + "?rel=0&autoplay=1&loop=1" + (settings.musicOn ? "" : "&mute=1")} title="YouTube video player" frameBorder="0" allow="autoplay"></iframe> 

      </StreamsContext.Provider>
    </SettingsContext.Provider>

  );
}

export default App;
