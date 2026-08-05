import React, {useContext, useState} from 'react'; //react
import { SettingsContext } from '../../App'; //gets global settings context
import { translations } from '../../misc/translations'; // contains all translations
import { soundEffects } from '../../utils';


function Language() {

  //============================STATE==========================//

  //settings state
  const {settings, setSettings} = useContext(SettingsContext);

  return (

    <div id="remBody" className='htmlSettings'>

      <div tabIndex="-1" id="settingsTop">
        <div tabIndex="-1" lang={[settings.lang]} className="label" id="settingsLabel">{translations[settings.lang].language}</div>
      </div>
      
        <div tabIndex="-1" id="langWrapper">

            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "en"})})}  id="en" className="settingsButton" >{translations[settings.lang].english}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "es"})})}  id="es" className="settingsButton" >{translations[settings.lang].spanish}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "fr"})})}  id="fr" className="settingsButton" >{translations[settings.lang].french}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "gr"})})}  id="gr" className="settingsButton">{translations[settings.lang].german}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "ar"})})}  id="ar" className="settingsButton">{translations[settings.lang].arabic}</button>   
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "ru"})})}  id="ru" className="settingsButton">{translations[settings.lang].russian}</button> 
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "jp"})})}  id="jp" className="settingsButton" >{translations[settings.lang].japanese}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "ch"})})}  id="ch" className="settingsButton" >{translations[settings.lang].chinese}</button>  
            
        </div>  
      
        <div tabIndex="-1" id="bButtonWrapper" className="editMenu">
          <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})}  className="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
        </div>
      
    </div>
  );
}

export default Language;
