import React, {useContext} from 'react'; //react
import { translations } from "../../misc/translations.js";
import { SettingsContext } from '../../App'; //gets global settings context
import { StreamsContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { soundEffects } from '../../utils.js';
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../utils.js"


function Editchannels(props) {


  //===========================STATE=========================//

  //global settings
  const {settings} = useContext(SettingsContext);

  //global streams
  const {streams, setStreams} = useContext(StreamsContext);

  //sets up naviage
  const nav = useNavigate();


  //===========================FUNCTIONS=====================//


  async function removeAll(){


    if (window.confirm(translations[settings.lang].removeAllChannelsAlert) == true) {

      setStreams({...streams, channels: []});

      //uploads doc to firebase
      if(settings.loggedIn){
        await setDoc(doc(db, "data", settings.user.uid), {
          ...streams, channels: []
        });
      }

    }

  }


  //===========================JSX OBJECT=====================//

  return (

    <div id="remBody" className='htmlSettings'>

      <div tabindex="-1" id="settingsTop">
        <div tabindex="-1" lang={[settings.lang]} class="label" id="settingsLabel">{translations[settings.lang].editChannels}</div>  
      </div>
      
      <div tabindex="-1" id="remChannelWrapper">{streams.channels.map((channel, index)=>{

        return (<button onClick={(()=>{soundEffects.okSetting.play(); props.setIndex(index); nav("/editcForm")})} className='settingsButton'>{channel.inf.title}</button>)


      })}</div>
    
      <div tabindex="-1" id="bButtonWrapper">

        <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back();})}  class="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
        <button onClick={(()=>{soundEffects.okSetting.play(); removeAll()})}  lang={[settings.lang]} id="removeAll" class="footerButton" >{translations[settings.lang].removeAll}</button> 
      
      </div>
      
    </div>
  );
}

export default Editchannels;
