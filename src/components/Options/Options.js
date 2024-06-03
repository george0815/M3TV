import React, {useContext} from 'react'; //react
import {Link} from 'react-router-dom'// react router
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils.js';


function Options() {


  //===============================STATE=========================//


  //global settings
  const {settings} = useContext(SettingsContext);


  return (

    <div id="remBody" className='htmlSettings'>

        <div id="settingsTop">
            <div   class="label" id="settingsLabel">{translations[settings.lang].settings}</div>
        </div>

        <div id="settingsButtonWrapper">

           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/audio"><button lang={[settings.lang]} id="mus" class="settingsButton" >{translations[settings.lang].audio}</button></Link> 
           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/video"> <button lang={[settings.lang]} id="vid" class="settingsButton">{translations[settings.lang].video}</button></Link> 
           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/editc"> <button lang={[settings.lang]} id="remCh" class="settingsButton" >{translations[settings.lang].editChannels}</button></Link> 
           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/editp"> <button lang={[settings.lang]} id="remPl" class="settingsButton" >{translations[settings.lang].editPlaylists}</button></Link> 
           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/lang"> <button lang={[settings.lang]} id="lang" class="settingsButton" >{translations[settings.lang].language}</button>  </Link>  
   
        </div>  

        <div tabindex="-1" id="bButtonWrapper">
            <button lang={[settings.lang]} onClick={(()=>{soundEffects.backMain.play(); window.history.back()})}   class="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
        </div>
      
    </div>
  );
}

export default Options;
