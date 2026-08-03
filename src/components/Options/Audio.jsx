import React, {useContext} from 'react'; //react
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils';
import {useNavigate} from 'react-router-dom'; //gets link from react router


function Audiopage() {

  //===========================STATE=========================//

   //global settings
   const {settings, setSettings} = useContext(SettingsContext);


  //===========================SETUP=========================//

  const nav = useNavigate();

  return (

    <div id="remBody" className='htmlSettings'>

      <div tabIndex="-1" id="settingsTop">
        <div tabIndex="-1" lang={[settings.lang]} className="label" id="settingsLabel">{translations[settings.lang].audio}</div>
      </div>
      

        <div tabIndex="-1" className="audioForm" id="mform">

          
            <label tabIndex="-1" lang={[settings.lang]} htmlFor="url" className="label mlabel">{translations[settings.lang].musicUrl}</label> 
            <br/>
            <input tabIndex="1" value={settings.music} onChange={((e) =>{soundEffects.okSetting.play(); setSettings({...settings, music: e.target.value});})} type="text" id="url" className="miscOptions" name="url"/>

            <label tabIndex="-1"  className="switch" style={{marginTop: "2vh"}}>
              <input tabIndex="2" id="muteButton" checked={settings.musicOn} onChange={((e) =>{  soundEffects.okSetting.play(); setSettings({...settings, musicOn: e.target.checked});})} type="checkbox"/>
              <span className="slider round"></span>
            </label>

            <br/>
            <label tabIndex="-1" lang={[settings.lang]} className="label mlabel" htmlFor="cVol">{translations[settings.lang].channels}</label>
            <input tabIndex="3"  type="range" onChange={((e)=>{soundEffects.okSetting.play(); setSettings({...settings, vol: {...settings.vol, channel: e.target.value / 100}})})} id="cVol" value={settings.vol.channel * 100} name="cVol" className="miscOptions"/><br/>
            <label tabIndex="-1" lang={[settings.lang]} className="label mlabel" htmlFor="sVol">{translations[settings.lang].soundEffects}</label>
            <input tabIndex="4" onChange={((e)=>{soundEffects.okSetting.play(); setSettings({...settings, vol: {...settings.vol, soundEffects: e.target.value / 100}})})}  value={settings.vol.soundEffects * 100} type="range" id="sVol" name="sVol" className="miscOptions"/><br/>
 
          
        
      </div>



      <div tabIndex="-1" id="bButtonWrapper">
        <button onClick={(()=>{soundEffects.backSetting.play();window.history.back()})}  className="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
      </div>
      
    </div>
  );
}

export default Audiopage;
