import React, {useState, useRef, useContext} from 'react'; //react
import {soundEffects} from "../../utils"
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

      // setting up the reader
      var reader = new FileReader();

      reader.onerror = () => {
        window.alert(translations[settings.lang].noInput);
      };

      reader.readAsText(file,'UTF-8');

      // here we tell the reader what to do when it's done reading...
      reader.onload = async readerEvent => {
        var content = readerEvent.target.result; // this is the content!
        
        tempPlaylist.url = content;
        document.getElementById("url").value = file.name;


        //repeated if statement because the other one will run before
        //the reader is finished, and thus wont push it into the array
        //
        //the title check reads inf.title, which is where the title actually
        //lives. it used to read tempPlaylist.title — always undefined, never
        //equal to "" — so an untitled playlist passed validation and was saved
        //with nothing to identify it in the edit list.
        if(!(tempPlaylist.url === "" || !tempPlaylist.inf || tempPlaylist.inf.title === "")){
          //built from streams rather than the component-scope playlists array:
          //that one is reassigned on every render, so any re-render between
          //opening the file dialog and the reader finishing would have left it
          //empty here and wiped every other playlist
          let playlists = [...streams.playlists, tempPlaylist];


          setInput({

            title: "",
            logoUrl: "",
            url: "",
            isLocal: false

          })

          //sets playlists
          setStreams({...streams, playlists: playlists});

          //uploads doc to firebase
          if(settings.loggedIn){
            await setDoc(doc(db, "data", settings.user.uid), {
              ...streams, playlists: playlists
            });
          }

          
          
        } 
        else {window.alert(translations[settings.lang].noInput);}
        

      }
    
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
      tempPlaylist.isLocal = true;

      ref.current.click()
    }
    //if playlist isnt local
    else{
        tempPlaylist.url = document.getElementById("url").value;
        tempPlaylist.isLocal = false;

        //title lives at inf.title; the old check read tempPlaylist.title,
        //which is always undefined, so it never rejected anything
        if(!(tempPlaylist.url === "" || !tempPlaylist.inf || tempPlaylist.inf.title === "")){
          //a copy — pushing onto streams.playlists edited state in place
          let playlists = [...streams.playlists, tempPlaylist];


          setInput({

            title: "",
            logoUrl: "",
            url: "",
            isLocal: false

          })

          //sets playlists
          setStreams({...streams, playlists: playlists});

          //uploads doc to firebase
          if(settings.loggedIn){
            await setDoc(doc(db, "data", settings.user.uid), {
              ...streams, playlists: playlists
            });
          }

        } 
        else {window.alert(translations[settings.lang].noInput);}
    }

    

          
  }


  //EDITS PLAYLIST
  async function editPlaylist(){


    //plays sound effect
    soundEffects.backSetting.play();


    //if valid. checked before building anything: the edit used to be written
    //straight into the array held in state, so an edit rejected below had
    //already been applied in memory by the time the alert appeared
    if(!(input.url === "" || input.title === "")){

      //replaces the entry at props.index without touching the original array
      let tempPlaylists = streams.playlists.map((playlist, i) => i === props.index ? {
        inf : {title: input.title},
        url: input.url,
        logoUrl: input.logoUrl,
        isLocal: input.isLocal
      } : playlist);

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
    //if not valid
    else{window.alert(translations[settings.lang].noInput);}


  }


  //REMOVES PLAYLIST
  async function removePlaylist(){

    if (window.confirm(translations[settings.lang].removePlaylistAlert) == true) {


    soundEffects.okSetting.play();
    
    //removes channel from array. filter rather than splice, which would edit
    //the array held in state in place
    let tempPlaylists = streams.playlists.filter((playlist, i) => i !== props.index);

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



      <div id="mform" className='audioForm'>




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

      <input id="fileInput" type='file' ref={ref} onChange={((e) =>{onInputClick(e)})}></input>
    </div>
  );
}

export default Addplaylist;
