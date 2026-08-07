import {useContext} from 'react'; //react
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
      {/*The footer is display:none below 1300px — it is a full width
         panel and gets in the way on a phone — so the same action
         appears as a floating control at those widths instead.*/}
      <button onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})} lang={[settings.lang]} className="mobileBack">{translations[settings.lang].back}</button>




      <div id="bButtonWrapper">
        <button lang={[settings.lang]} onClick={(()=>{soundEffects.backSetting.play(); window.history.back()})}  className="footerButton" id="settingBack">{translations[settings.lang].back}</button> 
      </div>

      
    </div>
  );
}

export default Video;
