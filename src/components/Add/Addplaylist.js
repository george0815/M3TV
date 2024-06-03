import {React, useState, useRef, useContext} from 'react'; //react
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
  let tempPlaylist = {}, playlists = [];


  //WHEN INPUT CHANGES, UPATE STATE (AND THUS, UI)
  function onInputChange(e){
    setInput( prevInput => {
      return { ...prevInput,  [e.target.name]: e.target.value}
    })
  }


  async function onInputClick(e){
        
      // getting a hold of the file reference
      var file = e.target.files[0]; 

      // setting up the reader
      var reader = new FileReader();
      reader.readAsText(file,'UTF-8');

      // here we tell the reader what to do when it's done reading...
      reader.onload = async readerEvent => {
        var content = readerEvent.target.result; // this is the content!
        
        tempPlaylist.url = content;
        console.log( tempPlaylist.url );
        document.getElementById("url").value = file.name;


        //repeated if statement because the other one will run before 
        //the reader is finished, and thus wont push it into the array
        //if url and title arent empty, push
        if(!(tempPlaylist.url === "" || tempPlaylist.title === "")){
          //pushes channel to array
          playlists.push(tempPlaylist);


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

    //get streams object and set it to temp
    playlists = streams.playlists;


    //creates and sets variables of channel to be pushed
    tempPlaylist = {
      inf : {title: input.title},
      url: input.url,
      logoUrl: input.logoUrl,
      isLocal: input.isLocal
    }

    if(document.getElementById("isLocal").checked){
      tempPlaylist.isLocal = true;
    

      

      ref.current.click()
    }
    //if playlist isnt local
    else{
        tempPlaylist.url = document.getElementById("url").value;
        tempPlaylist.isLocal = false;

        //if url and title arent empty, push
        if(!(tempPlaylist.url === "" || tempPlaylist.title === "")){
          //pushes channel to array
          playlists.push(tempPlaylist);


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


    //get streams object and set it to temp
    let tempPlaylists = streams.playlists;

    //creates and sets variables of channel to be pushed
    tempPlaylists[props.index] = {
      inf : {title: input.title},
      url: input.url,
      logoUrl: input.logoUrl,
      isLocal: input.isLocal
    }

    
    //if valid
    if(!(input.url === "" || input.title === "")){

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
    
    //get streams object and set it to temp
    let tempPlaylists = streams.playlists;

    //removes channel from array
    tempPlaylists.splice(props.index, 1); 
    
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
        <div lang={[settings.lang]} class="label" id="settingsLabel">{(typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1) ? translations[settings.lang].editPlaylists : translations[settings.lang].addPlaylists}</div>
      </div>



      <div id="mform" className='audioForm'>




          <label lang={[settings.lang]} class="label" for="name">{translations[settings.lang].name}</label>
          <br/>
          <input value={input.title} onChange={(e) => {onInputChange(e)}} type="text" class="miscOptions" id="title" name="title"/>

          <label style={{paddingRight: "5%"}} className="label" for="url">
          {translations[settings.lang].url} 
            <span style={{marginLeft: "2vw"}}>{translations[settings.lang].local}</span>
            <label style={{marginTop: "1vh", marginLeft: "1vw"}} className="switch" for="isLocal">
              <input value={input.isLocal} onChange={(e) => {soundEffects.okSetting.play(); onInputChange(e)}} id="isLocal" type="checkbox"/>
              <span className="slider round"></span>
            </label>
          </label>
          <br/>
          <input value={input.url} onChange={(e) => {onInputChange(e)}} tabindex="2" type="text" class="miscOptions" id="url" name="url"/>

          <label tabindex="-1" lang={[settings.lang]} class="label" for="logoUrl">{translations[settings.lang].logoUrl}</label>
          <br/>
          <input value={input.logoUrl} onChange={(e) => {onInputChange(e)}} tabindex="3" type="text" id="logoUrl" class="miscOptions" name="logoUrl"/>
          
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

      </div>



      <div id="bButtonWrapper" className="editMenu">
      
        <button onClick={(typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1) ? editPlaylist : (()=>{soundEffects.backMain.play(); window.history.back()})} lang={[settings.lang]} class="footerButton" id="addPBack" style={{left: "15%"}}>{translations[settings.lang].back}</button>
        <button onClick={(typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1) ? removePlaylist : Addplaylist} lang={[settings.lang]} class="footerButton" id="okay">{(typeof props.index !== "undefined" && props.index <= streams.playlists.length - 1)  ? translations[settings.lang].remove : translations[settings.lang].confirm}</button> 
  
      </div>

      <input id="fileInput" type='file' ref={ref} onChange={((e) =>{onInputClick(e)})}></input>
    </div>
  );
}

export default Addplaylist;
