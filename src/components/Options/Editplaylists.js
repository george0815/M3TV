import React, {useEffect, useContext} from 'react'; //react
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { useNavigate } from 'react-router-dom';
import { StreamsContext } from '../../App';
import { soundEffects } from '../../utils';
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../utils"




function Editplaylists(props) {

  //===========================STATE=========================//

   //global settings
   const {settings} = useContext(SettingsContext);

   //global streams
   const {streams, setStreams} = useContext(StreamsContext);

   //sets up naviage
  const nav = useNavigate();

   //===========================FUNCTIONS=====================//


  async function removeAll(){


    if (window.confirm(translations[settings.lang].removeAllPlaylistsAlert) == true) {

      setStreams({...streams, playlists: []});

      //uploads doc to firebase
      if(settings.loggedIn){
        await setDoc(doc(db, "data", settings.user.uid), {
          ...streams, playlists: []
        });
      }

    }

  }


  //===========================JSX OBJECT=====================//


  return (

    <div id="remBody" className='htmlSettings'>

        
      <div tabindex="-1" id="settingsTop">
        <div tabindex="-1" lang={[settings.lang]} class="label" id="settingsLabel">{translations[settings.lang].editPlaylists}</div>      
      </div>
      
      <div tabindex="-1" id="remChannelWrapper">{streams.playlists.map((playlist, index)=>{

        return (<button onClick={(()=>{props.setIndex(index); nav("/editpForm")})} className='settingsButton'>{playlist.inf.title}</button>)

      })}</div>

      <div tabindex="-1" id="bButtonWrapper">

        <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back();})}  class="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
        <button onClick={(()=>{soundEffects.okSetting.play(); removeAll()})}  lang={[settings.lang]} id="removeAll" class="footerButton" >{translations[settings.lang].removeAll}</button> 

      </div>

    </div>
  );
}

export default Editplaylists;
