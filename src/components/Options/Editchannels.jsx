import {useContext} from 'react'; //react
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { StreamsContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { soundEffects } from '../../utils';
import { useArmedConfirm } from '../../lib/useArmedConfirm';
import { saveUserData } from "../../lib/userdata";


function Editchannels(props) {


  //===========================STATE=========================//

  //global settings
  const {settings} = useContext(SettingsContext);

  //global streams
  const {streams, setStreams} = useContext(StreamsContext);

  //sets up naviage
  const nav = useNavigate();

  //removing everything asks on the button rather than in a browser dialog
  const {confirm, isArmed} = useArmedConfirm();


  //===========================FUNCTIONS=====================//


  async function removeAll(){



      setStreams({...streams, channels: []});

      //uploads doc to firebase
      if(settings.loggedIn){
        await saveUserData(settings.user.uid, {
          ...streams, channels: []
        });
      }

  }


  //===========================JSX OBJECT=====================//

  return (

    <div id="remBody" className='htmlSettings'>

      <div tabIndex="-1" id="settingsTop">
        <div tabIndex="-1" lang={[settings.lang]} className="label" id="settingsLabel">{translations[settings.lang].editChannels}</div>  
      </div>
      
      <div tabIndex="-1" id="remChannelWrapper">{streams.channels.map((channel, index)=>{

        return (<button key={index} onClick={(()=>{soundEffects.okSetting.play(); props.setIndex(index); nav("/editcForm")})} className='settingsButton'>{(channel.inf && channel.inf.title) || channel.url}</button>)


      })}</div>
      {/*The footer is display:none below 1300px — it is a full width
         panel and gets in the way on a phone — so the same action
         appears as a floating control at those widths instead.*/}
      <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})} lang={[settings.lang]} className="mobileBack">{translations[settings.lang].back}</button>


    
      <div tabIndex="-1" id="bButtonWrapper">

        <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back();})}  className="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
        <button onClick={(()=>{soundEffects.okSetting.play(); confirm("removeAll", translations[settings.lang].removeAllChannelsAlert, removeAll)})} lang={[settings.lang]} id="removeAll" className={isArmed("removeAll") ? "footerButton armed" : "footerButton"} >{translations[settings.lang].removeAll}</button> 
      
      </div>
      
    </div>
  );
}

export default Editchannels;
