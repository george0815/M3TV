import React, {useContext} from 'react'; //react
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils.js';
import Login from './Login';


function Video() {



  //=====================================STATE==========================//

  //global settings
  const {settings, setSettings} = useContext(SettingsContext);


  //===================================JSXOBJECT=========================//



  return (

    <div id="remBody" className='htmlSettings'>

      <div tabindex="-1" id="settingsTop">
        <div tabindex="-1" lang={[settings.lang]} class="label" id="settingsLabel">{translations[settings.lang].video}</div>
      </div>


      <div tabindex="-1" id="formWrapperVideo">
        <div tabindex="-1" id="mform">

          <label tabindex="-1" lang={[settings.lang]} for="url" class="label mlabel">{translations[settings.lang].cors}</label>
    
          <br/>
          <label tabindex="-1"  class="switch" style={{marginTop: "2vh"}}>
            <input tabindex="1" checked={settings.cors} onChange={((e) =>{soundEffects.okSetting.play(); setSettings({...settings, cors: e.target.checked});})} id="corsButton" type="checkbox"/>
            <span class="slider round"></span>
          </label>
          <br/>         


          <label tabindex="-1" lang={[settings.lang]} for="url" class="label mlabel">{translations[settings.lang].videoPlayer}</label>

          <br/>
          <select value={settings.player} onChange={((e) =>{soundEffects.okSetting.play(); setSettings({...settings, player: e.target.value});})} tabindex="2" class="miscOptions" id="player">

              <option value="hls">hls.js</option>
              <option value="vjs">Video.js</option>

          </select>
          

        </div>

        <Login/>
        <br/><br/><br/>
        <br/><br/><br/>

      </div>


      <div id="bButtonWrapper">
        <button lang={[settings.lang]} onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})}  class="footerButton" id="settingBack">{translations[settings.lang].back}</button> 
      </div>

      
    </div>
  );
}

export default Video;
