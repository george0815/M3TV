import React, {useContext} from 'react'; //react
import { translations } from "../../misc/translations.js";
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils.js';
import {useNavigate} from 'react-router-dom'; //gets link from react router


function Audiopage() {

  //===========================STATE=========================//

   //global settings
   const {settings, setSettings} = useContext(SettingsContext);


  //===========================SETUP=========================//

  const nav = useNavigate();

  return (

    <div id="remBody" className='htmlSettings'>

      <div tabindex="-1" id="settingsTop">
        <div tabindex="-1" lang={[settings.lang]} class="label" id="settingsLabel">{translations[settings.lang].audio}</div>
      </div>
      

        <div tabindex="-1" className="audioForm" id="mform">

          
            <label tabindex="-1" lang={[settings.lang]} for="url" class="label mlabel">{translations[settings.lang].musicUrl}</label> 
            <br/>
            <input tabindex="1" value={settings.music} onChange={((e) =>{soundEffects.okSetting.play(); setSettings({...settings, music: e.target.value});})} type="text" id="url" class="miscOptions" name="url"/>

            <label tabindex="-1"  class="switch" style={{marginTop: "2vh"}}>
              <input tabindex="2" id="muteButton" checked={settings.musicOn} onChange={((e) =>{  soundEffects.okSetting.play(); setSettings({...settings, musicOn: e.target.checked});})} type="checkbox"/>
              <span class="slider round"></span>
            </label>

            <br/>
            <label tabindex="-1" lang={[settings.lang]} class="label mlabel" for="cVol">{translations[settings.lang].channels}</label>
            <input tabindex="3"  type="range" onChange={((e)=>{soundEffects.okSetting.play(); setSettings({...settings, vol: {...settings.vol, channel: e.target.value / 100}})})} id="cVol" value={settings.vol.channel * 100} name="cVol" class="miscOptions"/><br/>
            <label tabindex="-1" lang={[settings.lang]} class="label mlabel" for="sVol">{translations[settings.lang].soundEffects}</label>
            <input tabindex="4" onChange={((e)=>{soundEffects.okSetting.play(); setSettings({...settings, vol: {...settings.vol, soundEffects: e.target.value / 100}})})}  value={settings.vol.soundEffects * 100} type="range" id="sVol" name="sVol" class="miscOptions"/><br/>
 
          
        
      </div>



      <div tabindex="-1" id="bButtonWrapper">
        <button onClick={(()=>{soundEffects.backSetting.play();window.history.back()})}  class="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
      </div>
      
    </div>
  );
}

export default Audiopage;
