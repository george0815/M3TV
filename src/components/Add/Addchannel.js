import {React, useState, useContext} from 'react'; //react
import { translations } from "../../misc/translations.js";
import { SettingsContext } from '../../App'; //gets global settings context
import { StreamsContext } from '../../App';
import {soundEffects} from "../../utils.js";
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../utils.js"




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

    //get streams object and set it to temp
    let tempChannels = streams.channels;

    //creates and sets variables of channel to be pushed
    let tempChannel = {
      inf: {
        title: input.title,
        tvgLogo: input.logoUrl,
      },
      url: input.url,
    }

    
    //if valid
    if(!(tempChannel.url === "" || tempChannel.inf.title === "")){
      //pushes channel to array
      tempChannels.push(tempChannel);


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
    //if not valid
    else{window.alert(translations[settings.lang].noInput);}
        
  
    
  }




  //EDITS CHANNEL
  async function editChannel(){

    //plays sound effect
    soundEffects.backSetting.play();


    //get streams object and set it to temp
    let tempChannels = streams.channels;

    //creates and sets variables of channel to be pushed
    tempChannels[props.index] = {
      inf: {
        title: input.title,
        tvgLogo: input.logoUrl,
      },
      url: input.url,
    }

    
    //if valid
    if(!(input.url === "" || input.title === "")){

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
    //if not valid
    else{window.alert(translations[settings.lang].noInput);}


  }



  async function removeChannel(){

    if (window.confirm(translations[settings.lang].removeChannelAlert) == true) {

    //sound effect
    soundEffects.okSetting.play();


    //get streams object and set it to temp
    let tempChannels = streams.channels;

    //removes channel from array
    tempChannels.splice(props.index, 1); 
    
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
