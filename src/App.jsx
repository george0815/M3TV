import {useState, useEffect, useRef, useCallback, createContext, lazy, Suspense} from 'react'; //react
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
import { onAuthStateChanged } from "firebase/auth";
import {db, auth} from "./utils"
//CSS
import Toasts from "./components/Toasts";
import { addToast, removeToast, TOAST_MS } from "./lib/toasts";
import { embedUrl } from "./lib/music";
import "./styles/General.css";
import "./styles/Clock.css";
import "./styles/Buttons.css";
import "./styles/Misc.css";
//last, so the refinements win ties without !important
import "./styles/Polish.css";
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

/* Everything that used to be a window.alert now goes through here.

   notify(message, tone) from anywhere inside the tree; "danger" for something
   that went wrong, anything else for something that went right. The queue
   rules — no duplicates, at most three, newest wins — live in src/lib/toasts.js. */
export const ToastContext = createContext({ toasts: [], notify: () => {}, dismiss: () => {} });



 





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


  /* Fetch the play routes before anyone asks for them.

     They are loaded on demand to keep video.js out of the bundle everyone
     downloads to reach the menu, which is worth doing — but it means the first
     navigation to one waits on a chunk with nothing on screen at all, since
     Suspense renders its fallback and the clock bar is inside the route that
     has not arrived yet. That is the blank on the first visit, and only the
     first: afterwards the chunk is resolved and nothing suspends.

     So it is fetched while the menu is sitting idle, when there is nothing
     competing for the connection. By the time a tile is clicked there is
     usually nothing left to wait for. */
  useEffect(() => {

    const load = () => {
      import("./components/Play/Playplaylist");
      import("./components/Play/Playchannel");
    };

    //requestIdleCallback is unsupported on safari before 17, so it falls back
    //to a plain delay long enough to be past the first paint
    if(window.requestIdleCallback){
      const id = window.requestIdleCallback(load, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(load, 1500);
    return () => window.clearTimeout(id);

  }, []);


  //toasts, in place of window.alert
  const [toasts, setToasts] = useState([]);

  //ids only have to be unique among the handful on screen at once
  const nextToastId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(current => removeToast(current, id));
  }, []);

  /* Stable, because it is handed to playChannel() in utils.js, which attaches
     the handlers that outlive the render that made them. A new function every
     render would mean the one captured down there aged out of date. */
  const notify = useCallback((message, tone) => {

    if(!message){ return; }

    const id = ++nextToastId.current;

    setToasts(current => addToast(current, { id, message: String(message), tone }));

    //every toast times out; dismissing by hand just gets there first, and
    //removeToast is by id so the timer firing afterwards is harmless
    window.setTimeout(() => setToasts(current => removeToast(current, id)), TOAST_MS);

  }, []);


  //gets playlist and channel data
  async function getData(user){

    try{

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
    catch (error) {

      //this used to be an unhandled rejection. a denied or failed read left
      //the user looking at stale or empty data with nothing to say anything
      //had gone wrong. deliberately not an alert: token refreshes and brief
      //network drops would make that fire constantly. whatever is already in
      //state is left alone rather than being cleared.
      console.error("could not load saved streams:", error);

    }

  }

 


  //saves settings to local storage whenever it's saved
  useEffect(() => {
       localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings]);




  //loads saved streams once firebase has told us who, if anyone, is signed in.
  //
  //this used to key off settings.loggedIn, which is persisted in localStorage
  //and therefore available immediately on load — while firebase restores its
  //session asynchronously. So on a refresh the read could go out before auth
  //was ready, with request.auth still null, and the firestore rules would
  //rightly deny it. That is the "sometimes my channels don't load" shape.
  //
  //it also reconciles the persisted flag with reality: if the session is gone
  //but localStorage still says logged in, the app now believes firebase.
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if(user){
        setSettings(prev => prev.loggedIn && prev.user && prev.user.uid === user.uid
          ? prev
          : {...prev, loggedIn: true, user: { uid: user.uid, email: user.email }});
        getData(user);
      }
      else{
        setSettings(prev => prev.loggedIn ? {...prev, loggedIn: false, user: null} : prev);
      }

    });

    return unsubscribe;

  }, []);


  //saves streams to local storage whenever it's saved
  useEffect(() => {
   if(!settings.loggedIn){

     //localStorage runs out at roughly 5MB and throws QuotaExceededError when
     //it does, which a local playlist stored as its own file contents can
     //reach. Unhandled, that took down the render that triggered it.
     try { localStorage.setItem("streams", JSON.stringify(streams)); }
     catch (error) { console.error("could not save streams locally:", error); }

   }
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
       <ToastContext.Provider value={{toasts, notify, dismiss}}>
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

        <Toasts/>

        {/* key={Date()} before, which is a new value in every second — so any
            render that crossed a second boundary remounted this, reloading the
            embed and restarting the track from the top. Keyed on the address
            instead: it changes when the music does and not otherwise.

            allow="autoplay" stays. Firefox logs "skipping unsupported feature
            name" for it because it has not implemented that permission, but
            chrome needs it or the track never starts. */}
        <iframe key={settings.music} tabIndex="-1" id="bgMusic" width="0" height="0" style={{border: 0}} src={embedUrl(settings.music, !settings.musicOn)} title="Background music" allow="autoplay"></iframe>

       </ToastContext.Provider>
      </StreamsContext.Provider>
    </SettingsContext.Provider>

  );
}

export default App;
