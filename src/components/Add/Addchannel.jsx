import React, {useState, useContext} from 'react'; //react
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { StreamsContext } from '../../App';
import {soundEffects, validateEntry} from "../../utils";
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../utils"




function Addchannel(props) {

  //===========================STATE============================//


  //global settings
  const {settings} = useContext(SettingsContext);

  //global streams
  const {streams, setStreams} = useContext(StreamsContext);

 
   

  //sets up input state
  const [input, setInput] = useState(

    (typeof props.index !== "undefined" && props.index <= streams.channels.length - 1) ?

    {
      title: streams.channels[props.index].inf.title,
      logoUrl: streams.channels[props.index].inf.tvgLogo,
      url: streams.channels[props.index].url
    } 
 
    :

    {
      title: "",
      logoUrl: "",
      url: ""
    }

  ); 



  //===========================FUNCTIONS=========================//


  //WHEN INPUT CHANGES, UPATE STATE (AND THUS, UI)
  function onInputChange(e){
    setInput( prevInput => {
      return { ...prevInput,  [e.target.name]: e.target.value}
    })
  }


  //ADDS CHANNEL
  async function addChannel(){
    
    //plays sound effect 
    soundEffects.okSetting.play();

    //names the field that is wrong rather than the old catch-all, and catches
    //whitespace-only entries, malformed links and duplicates, all of which the
    //previous empty-string check let straight through
    const problem = validateEntry(input, streams.channels);

    if(problem){
      window.alert(translations[settings.lang][problem]);
      return;
    }

    //trimmed on the way in, so a stray space cannot make an otherwise identical
    //entry look like a new one next time
    let tempChannel = {
      inf: {
        title: input.title.trim(),
        tvgLogo: input.logoUrl.trim(),
      },
      url: input.url.trim(),
    }

    //a copy, not streams.channels itself — pushing onto the array held in
    //state mutated the current state in place before setStreams ever ran
    let tempChannels = [...streams.channels, tempChannel];


    setInput({

      title: "",
      logoUrl: "",
      url: ""

    })

    //sets channels
    setStreams({...streams, channels: tempChannels});

    //uploads doc to firebase
    if(settings.loggedIn){
      await setDoc(doc(db, "data", settings.user.uid), {
        ...streams, channels: tempChannels
      });
    }

  }




  //EDITS CHANNEL
  async function editChannel(){

    //plays sound effect
    soundEffects.backSetting.play();


    //validated before building anything: the edit used to be written straight
    //into the array held in state, so an edit rejected below had already been
    //applied in memory by the time the alert appeared.
    //
    //props.index is passed so the entry being edited does not count as a
    //duplicate of itself
    const problem = validateEntry(input, streams.channels, props.index);

    if(problem){
      window.alert(translations[settings.lang][problem]);
      return;
    }

    //replaces the entry at props.index without touching the original array
    let tempChannels = streams.channels.map((channel, i) => i === props.index ? {
      inf: {
        title: input.title.trim(),
        tvgLogo: input.logoUrl.trim(),
      },
      url: input.url.trim(),
    } : channel);

    //sets channels
    setStreams({...streams, channels: tempChannels});

    //uploads doc to firebase
    if(settings.loggedIn){
      await setDoc(doc(db, "data", settings.user.uid), {
        ...streams, channels: tempChannels
      });
    }

    window.history.back();

  }



  async function removeChannel(){

    if (window.confirm(translations[settings.lang].removeChannelAlert) == true) {

    //sound effect
    soundEffects.okSetting.play();


    //removes channel from array. filter rather than splice, which would edit
    //the array held in state in place
    let tempChannels = streams.channels.filter((channel, i) => i !== props.index);

    //sets channels
    setStreams({...streams, channels: tempChannels});

    //uploads doc to firebase
    if(settings.loggedIn){
      await setDoc(doc(db, "data", settings.user.uid), {
        ...streams, channels: tempChannels
      });
    }

    //redirect
    window.history.back();

    }

  }


  return (

    <div id="remBody" className='htmlSettings'>

      <div id="settingsTop">
        <div lang={[settings.lang]} className="label" id="settingsLabel">{(typeof props.index !== "undefined" && props.index <= streams.channels.length - 1) ? translations[settings.lang].editChannels : translations[settings.lang].addChannels}</div>
      </div>

      <div id="mform" className='audioForm'>

          <label lang={[settings.lang]} className="label" htmlFor="name">{translations[settings.lang].name}</label>       
          <br/>              
          <input value={input.title} onChange={(e) => {onInputChange(e)}} type="text" className="miscOptions"  id="title" name="title"/>

          <label lang={[settings.lang]} className="label" htmlFor="url">{translations[settings.lang].url}</label>      
          <br/>
          <input value={input.url} onChange={(e) => {onInputChange(e)}} type="text" className="miscOptions" id="url" name="url"/>
          
          <label lang={[settings.lang]} className="label" htmlFor="logoUrl">{translations[settings.lang].logoUrl}</label>
          <br/>
          <input value={input.logoUrl} onChange={(e) => {onInputChange(e)}}type="text" className="miscOptions" id="logoUrl" name="logoUrl"/>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

      </div>


      <div  id="bButtonWrapper" className="editMenu">    
          <button onClick={(typeof props.index !== "undefined" && props.index <= streams.channels.length - 1)  ? editChannel : (()=>{ soundEffects.backMain.play(); window.history.back()})} lang={[settings.lang]} className="footerButton" id="addCBack" style={{left: "15%"}}>{translations[settings.lang].back}</button>
          <button onClick={(typeof props.index !== "undefined" && props.index <= streams.channels.length - 1)  ? removeChannel : addChannel} lang={[settings.lang]} className="footerButton" id="okay">{(typeof props.index !== "undefined" && props.index <= streams.channels.length - 1)  ? translations[settings.lang].remove : translations[settings.lang].confirm}</button>  
      </div>

    </div>
  );
}

export default Addchannel;
