import React, {useState, useContext} from 'react'; //react
import Clock from '../Clock'; //clock compoenent
import { playChannel } from '../../utils';
import Channelwrapper from './Channelwrapper';
import { StreamsContext } from '../../App';
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils';
import { translations } from '../../misc/translations';



function Playchannel() {

//===========================SETUP=============================//

  //channels array
  const {streams} = useContext(StreamsContext);

  //settings
  const {settings} = useContext(SettingsContext);

  //============================STATE============================//

  //whther channel is currently playing or not
  const [curPlaying, setCurPlaying] = useState(false)
  //current page, used to render channel buttons
  const [page, setPage] = useState(0);




//==============================JSX OBJECT===================//

  //shared by the clock and by the mobile back button below it
  const goBack = () => {soundEffects.backMain.play(); window.history.back()};

  return (
    <div className="playVid">
      
      {/*holds buttons*/}
      <Channelwrapper play={playChannel} setPage={setPage} setCurPlaying={setCurPlaying} curPlaying={curPlaying} isChannel={true} page={page} data={streams.channels}/>
      {/*clock*/}
      <Clock back={goBack}/>

      {/*The clock carries the only way off this screen, and the clock is
         display:none below 1300px — so on a phone there was no route back to
         the menu at all. Same handler, shown only where the clock is not.*/}
      <button onClick={goBack} lang={[settings.lang]} className="mobileBack">{translations[settings.lang].back}</button>
      <div id="channelsFooter" className="editMenu">
      
        <button onClick={(() => {if(page > 0){ soundEffects.okSetting.play();  setPage(page - 1)}})} lang="en" className="footerButton channelFooterButton" id="addPBack" style={{left: "15%"}}>{'<'}</button>
        <button onClick={(() => { if(page < Math.ceil(streams.channels.length / 12) - 1){soundEffects.okSetting.play();  setPage(page + 1)}})} lang="en" className="footerButton channelFooterButton" id="okay">{'>'}</button>
  
      </div>

    </div>
  );
}

export default Playchannel;
