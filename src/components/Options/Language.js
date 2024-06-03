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

      <div tabindex="-1" id="settingsTop">
        <div tabindex="-1" lang={[settings.lang]} class="label" id="settingsLabel">{translations[settings.lang].language}</div>
      </div>
      
        <div tabindex="-1" id="langWrapper">

            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "en"})})}  id="en" class="settingsButton" >{translations[settings.lang].english}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "es"})})}  id="es" class="settingsButton" >{translations[settings.lang].spanish}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "fr"})})}  id="fr" class="settingsButton" >{translations[settings.lang].french}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "gr"})})}  id="gr" class="settingsButton">{translations[settings.lang].german}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "ar"})})}  id="ar" class="settingsButton">{translations[settings.lang].arabic}</button>   
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "ru"})})}  id="ru" class="settingsButton">{translations[settings.lang].russian}</button> 
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "jp"})})}  id="jp" class="settingsButton" >{translations[settings.lang].japanese}</button>
            <button lang={[settings.lang]} onClick={(()=> {soundEffects.okSetting.play(); setSettings({...settings, lang: "ch"})})}  id="ch" class="settingsButton" >{translations[settings.lang].chinese}</button>  
            
        </div>  
      
        <div tabindex="-1" id="bButtonWrapper">
          <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})}  class="footerButton" id="settingBack" >{translations[settings.lang].back}</button>
        </div>
      
    </div>
  );
}

export default Language;
