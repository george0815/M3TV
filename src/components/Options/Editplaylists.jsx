import {useContext} from 'react'; //react
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

        
      <div tabIndex="-1" id="settingsTop">
        <div tabIndex="-1" lang={[settings.lang]} className="label" id="settingsLabel">{translations[settings.lang].editPlaylists}</div>      
      </div>
      
      <div tabIndex="-1" id="remChannelWrapper">{streams.playlists.map((playlist, index)=>{

        return (<button key={index} onClick={(()=>{props.setIndex(index); nav("/editpForm")})} className='settingsButton'>{(playlist.inf && playlist.inf.title) || playlist.url}</button>)

      })}</div>
      {/*The footer is display:none below 1300px — it is a full width
         panel and gets in the way on a phone — so the same action
         appears as a floating control at those widths instead.*/}
      <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})} lang={[settings.lang]} className="mobileBack">{translations[settings.lang].back}</button>



      <div tabIndex="-1" id="bButtonWrapper">

        <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back();})}  className="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
        <button onClick={(()=>{soundEffects.okSetting.play(); removeAll()})}  lang={[settings.lang]} id="removeAll" className="footerButton" >{translations[settings.lang].removeAll}</button> 

      </div>

    </div>
  );
}

export default Editplaylists;
