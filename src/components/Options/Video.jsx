import React, {useContext} from 'react'; //react
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils';
import Login from './Login';


function Video() {



  //=====================================STATE==========================//

  //global settings
  const {settings, setSettings} = useContext(SettingsContext);


  //===================================JSXOBJECT=========================//



  return (

    <div id="remBody" className='htmlSettings'>

      <div tabIndex="-1" id="settingsTop">
        <div tabIndex="-1" lang={[settings.lang]} className="label" id="settingsLabel">{translations[settings.lang].video}</div>
      </div>


      <div tabIndex="-1" id="formWrapperVideo">
        <div tabIndex="-1" id="mform">

          <label tabIndex="-1" lang={[settings.lang]} htmlFor="url" className="label mlabel">{translations[settings.lang].videoPlayer}</label>

          <br/>
          <select value={settings.player} onChange={((e) =>{soundEffects.okSetting.play(); setSettings({...settings, player: e.target.value});})} tabIndex="2" className="miscOptions" id="player">

              <option value="hls">hls.js</option>
              <option value="vjs">Video.js</option>

          </select>
          

        </div>

        <Login/>
        <br/><br/><br/>
        <br/><br/><br/>

      </div>


      <div id="bButtonWrapper" className="editMenu">
        <button lang={[settings.lang]} onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})}  className="footerButton" id="settingBack">{translations[settings.lang].back}</button> 
      </div>

      
    </div>
  );
}

export default Video;
