import React, {useState, useRef, useContext} from 'react'; //react
import {soundEffects, validateEntry, looksLikePlaylist, MAX_PLAYLIST_BYTES} from "../../utils"
import { addEntry, replaceEntry, removeEntry } from "../../lib/streams";
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { StreamsContext } from '../../App';
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../utils"


function Addplaylist(props) {


  //===========================STATE============================//

  //global streams
  const {streams, setStreams} = useContext(StreamsContext);

  //global settings
  const {settings} = useContext(SettingsContext);


  //sets up album state
  const [input, setInput] = useState(

    (typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1) ?

    {
      title: streams.playlists[props.index].inf.title,
      logoUrl: streams.playlists[props.index].logoUrl,
      url: streams.playlists[props.index].url,
      isLocal: streams.playlists[props.index].isLocal
    } 

    :

    {
      title: "",
      logoUrl: "",
      url: "",
      isLocal: false
    }

  ); 


  //shows the "Added" confirmation for a moment after a successful save
  const [saved, setSaved] = useState(false);


  //===========================FUNCTIONS=========================//

  //REF FOR FILEINPUT
  const ref = useRef();


  //SETS UP TEMP PLAYLIST
  //carries the pending entry from Addplaylist() to the file reader callback
  let tempPlaylist = {};


  //WHEN INPUT CHANGES, UPATE STATE (AND THUS, UI)
  function onInputChange(e){
    //a checkbox carries its state on .checked; reading .value gave the string
    //"on" regardless of whether it was ticked
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setInput( prevInput => {
      return { ...prevInput,  [e.target.name]: value}
    })
  }


  async function onInputClick(e){

      // getting a hold of the file reference
      var file = e.target.files[0];

      //undefined when the picker is dismissed without choosing anything, and
      //readAsText(undefined) throws
      if(!file){ return; }

      //checked from the file handle, before a byte is read. A local playlist is
      //stored as its own text, and that text has to fit either a firestore
      //document or localStorage — so reading a video in as a string first and
      //discovering the problem at save time helps nobody.
      if(file.size > MAX_PLAYLIST_BYTES){
        window.alert(translations[settings.lang].fileTooBig);
        return;
      }

      // setting up the reader
      var reader = new FileReader();

      reader.onerror = () => {
        window.alert(translations[settings.lang].notAPlaylist);
      };

      reader.readAsText(file,'UTF-8');

      // here we tell the reader what to do when it's done reading...
      reader.onload = async readerEvent => {
        var content = readerEvent.target.result; // this is the content!

        //the picker's accept list is only a hint — anyone can switch it to "all
        //files" — so the contents are what actually decide. Deliberately loose:
        //see looksLikePlaylist, a headerless list of urls is still valid m3u.
        if(!looksLikePlaylist(content)){
          window.alert(translations[settings.lang].notAPlaylist);
          return;
        }

        tempPlaylist.url = content;
        document.getElementById("url").value = file.name;


        //checked again here rather than only before the picker opened: the read
        //happens asynchronously, so this is the first point at which the file's
        //contents actually exist. isLocal tells the validator not to expect a
        //link — the contents live in url for a local playlist.
        const problem = validateEntry(
          { title: tempPlaylist.inf && tempPlaylist.inf.title, url: content, isLocal: true },
          streams.playlists
        );

        if(problem){
          window.alert(translations[settings.lang][problem]);
          return;
        }

        //built from streams rather than the component-scope playlists array:
        //that one is reassigned on every render, so any re-render between
        //opening the file dialog and the reader finishing would have left it
        //empty here and wiped every other playlist
        let playlists = addEntry(streams.playlists, tempPlaylist);

        if(!await save(playlists)){ return; }

        setInput({

          title: "",
          logoUrl: "",
          url: "",
          isLocal: false

        })

        flashSaved();

      }

  }


  /* Writes the new list to state and, when signed in, to firestore.

     The firestore write was previously awaited with nothing catching it, so a
     document over the 1 MiB limit — which one sizeable local playlist will
     reach on its own — rejected into an unhandled promise and the entry simply
     never arrived, with nothing on screen to say so. Returns false when the
     save failed, so the caller knows not to clear the form or claim success. */
  async function save(playlists){

    setStreams({...streams, playlists: playlists});

    if(!settings.loggedIn){ return true; }

    try {
      await setDoc(doc(db, "data", settings.user.uid), {
        ...streams, playlists: playlists
      });
      return true;
    }
    catch (error) {
      console.error("could not save playlists:", error);
      window.alert(translations[settings.lang].saveFailed);
      return false;
    }

  }


  /* Confirmation that something was actually saved. The form clearing itself
     was the only signal before, which reads as the app having forgotten the
     entry rather than having stored it. */
  function flashSaved(){
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1900);
  }


  //ADDS PLAYLIST
  async function Addplaylist(){
    
    //plays sound effect ADD SOUND EFFECT BACK
    soundEffects.okSetting.play();

    //creates and sets variables of channel to be pushed
    tempPlaylist = {
      inf : {title: input.title},
      url: input.url,
      logoUrl: input.logoUrl,
      isLocal: input.isLocal
    }

    //reads the controlled state now that the checkbox actually tracks it,
    //rather than reaching back into the DOM node
    if(input.isLocal){

      //the title is the only thing worth checking before the file dialog opens;
      //the url does not exist yet, and asking for a file first and rejecting the
      //name afterwards wastes the trip through the picker
      if(!input.title.trim()){
        window.alert(translations[settings.lang].needTitle);
        return;
      }

      tempPlaylist.isLocal = true;
      tempPlaylist.inf = { title: input.title.trim() };

      ref.current.click()
    }
    //if playlist isnt local
    else{
        tempPlaylist.url = document.getElementById("url").value;
        tempPlaylist.isLocal = false;

        const problem = validateEntry(
          { title: input.title, url: tempPlaylist.url, isLocal: false },
          streams.playlists
        );

        if(problem){
          window.alert(translations[settings.lang][problem]);
          return;
        }

        //trimmed, so a stray space cannot make an otherwise identical playlist
        //look like a new one next time
        tempPlaylist.inf = { title: input.title.trim() };
        tempPlaylist.url = tempPlaylist.url.trim();
        tempPlaylist.logoUrl = input.logoUrl.trim();

        //a copy — pushing onto streams.playlists edited state in place
        let playlists = addEntry(streams.playlists, tempPlaylist);

        if(!await save(playlists)){ return; }

        setInput({

          title: "",
          logoUrl: "",
          url: "",
          isLocal: false

        })

        flashSaved();
    }

    

          
  }


  //EDITS PLAYLIST
  async function editPlaylist(){


    //plays sound effect
    soundEffects.backSetting.play();


    //validated before building anything: the edit used to be written straight
    //into the array held in state, so an edit rejected below had already been
    //applied in memory by the time the alert appeared.
    //
    //props.index is passed so the entry being edited does not count as a
    //duplicate of itself. A local playlist keeps its file contents in url, so
    //validateEntry is told to skip the link checks for it.
    const problem = validateEntry(input, streams.playlists, props.index);

    if(problem){
      window.alert(translations[settings.lang][problem]);
      return;
    }

    //replaces the entry at props.index without touching the original array
    let tempPlaylists = replaceEntry(streams.playlists, props.index, {
      inf : {title: input.title.trim()},
      url: input.isLocal ? input.url : input.url.trim(),
      logoUrl: input.logoUrl.trim(),
      isLocal: input.isLocal
    });

    //sets playlists
    setStreams({...streams, playlists: tempPlaylists});

    //uploads doc to firebase
    if(settings.loggedIn){
      await setDoc(doc(db, "data", settings.user.uid), {
        ...streams, playlists: tempPlaylists
      });
    }

    window.history.back();


  }


  //REMOVES PLAYLIST
  async function removePlaylist(){

    if (window.confirm(translations[settings.lang].removePlaylistAlert) == true) {


    soundEffects.okSetting.play();
    
    //removes channel from array. filter rather than splice, which would edit
    //the array held in state in place
    let tempPlaylists = removeEntry(streams.playlists, props.index);

    //sets channels
    setStreams({...streams, playlists: tempPlaylists});

    //uploads doc to firebase
    if(settings.loggedIn){
      await setDoc(doc(db, "data", settings.user.uid), {
        ...streams, playlists: tempPlaylists
      });
    }

    //redirect
    window.history.back();

    }

  }


  return (
    <div id="remBody" className='htmlSettings'>


      <div  id="settingsTop">
        <div lang={[settings.lang]} className="label" id="settingsLabel">{(typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1) ? translations[settings.lang].editPlaylists : translations[settings.lang].addPlaylists}</div>
      </div>



      <div id="mform" className={saved ? 'audioForm justSaved' : 'audioForm'}>




          <label lang={[settings.lang]} className="label" htmlFor="name">{translations[settings.lang].name}</label>
          <br/>
          <input value={input.title} onChange={(e) => {onInputChange(e)}} type="text" className="miscOptions" id="title" name="title"/>

          <label style={{paddingRight: "5%"}} className="label" htmlFor="url">
          {translations[settings.lang].url} 
            <span style={{marginLeft: "2vw"}}>{translations[settings.lang].local}</span>
            <label style={{marginTop: "1vh", marginLeft: "1vw"}} className="switch" htmlFor="isLocal">
              <input checked={input.isLocal} name="isLocal" onChange={(e) => {soundEffects.okSetting.play(); onInputChange(e)}} id="isLocal" type="checkbox"/>
              <span className="slider round"></span>
            </label>
          </label>
          <br/>
          <input value={input.url} onChange={(e) => {onInputChange(e)}} tabIndex="2" type="text" className="miscOptions" id="url" name="url"/>

          <label tabIndex="-1" lang={[settings.lang]} className="label" htmlFor="logoUrl">{translations[settings.lang].logoUrl}</label>
          <br/>
          <input value={input.logoUrl} onChange={(e) => {onInputChange(e)}} tabIndex="3" type="text" id="logoUrl" className="miscOptions" name="logoUrl"/>
          
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

      </div>



      <div id="bButtonWrapper" className="editMenu">
      
        <button onClick={(typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1) ? editPlaylist : (()=>{soundEffects.backMain.play(); window.history.back()})} lang={[settings.lang]} className="footerButton" id="addPBack" style={{left: "15%"}}>{translations[settings.lang].back}</button>
        <button onClick={(typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1) ? removePlaylist : Addplaylist} lang={[settings.lang]} className="footerButton" id="okay">{(typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1)  ? translations[settings.lang].remove : translations[settings.lang].confirm}</button> 
  
      </div>

      {/*accept is a hint for the picker, not a restriction — the dialog still
         lets anyone switch to "all files", which is why the contents are
         sniffed after reading rather than trusted from the extension. text/plain
         is listed because plenty of providers serve playlists as .txt.*/}
      <input id="fileInput" type='file' accept=".m3u,.m3u8,.txt,audio/x-mpegurl,application/vnd.apple.mpegurl,text/plain" ref={ref} onChange={((e) =>{onInputClick(e)})}></input>

      {saved && <div className="saveToast" role="status">{translations[settings.lang].saved}</div>}
    </div>
  );
}

export default Addplaylist;
