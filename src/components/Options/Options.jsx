import React, {useContext} from 'react'; //react
import {Link} from 'react-router-dom'// react router
import { translations } from "../../misc/translations";
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils';


function Options() {


  //===============================STATE=========================//


  //global settings
  const {settings} = useContext(SettingsContext);


  return (

    <div id="remBody" className='htmlSettings'>

        <div id="settingsTop">
            <div   className="label" id="settingsLabel">{translations[settings.lang].settings}</div>
        </div>

        <div id="settingsButtonWrapper">

           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/audio"><button lang={[settings.lang]} id="mus" className="settingsButton" >{translations[settings.lang].audio}</button></Link> 
           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/video"> <button lang={[settings.lang]} id="vid" className="settingsButton">{translations[settings.lang].video}</button></Link> 
           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/editc"> <button lang={[settings.lang]} id="remCh" className="settingsButton" >{translations[settings.lang].editChannels}</button></Link> 
           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/editp"> <button lang={[settings.lang]} id="remPl" className="settingsButton" >{translations[settings.lang].editPlaylists}</button></Link> 
           <Link onClick={(()=>{soundEffects.okSetting.play();})} to="/lang"> <button lang={[settings.lang]} id="lang" className="settingsButton" >{translations[settings.lang].language}</button>  </Link>  
   
        </div>  
      {/*The footer is display:none below 1300px — it is a full width
         panel and gets in the way on a phone — so the same action
         appears as a floating control at those widths instead.*/}
      <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})} lang={[settings.lang]} className="mobileBack">{translations[settings.lang].back}</button>



        <div tabIndex="-1" id="bButtonWrapper">
            <button lang={[settings.lang]} onClick={(()=>{soundEffects.backMain.play(); window.history.back()})}   className="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
        </div>
      
    </div>
  );
}

export default Options;
