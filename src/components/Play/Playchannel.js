import {React, useState, useContext} from 'react'; //react
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

  console.log(streams.channels  );
  console.log(streams);



//==============================JSX OBJECT===================//

  return (
    <div class="playVid">
      
      {/*holds buttons*/}
      <Channelwrapper play={playChannel} setPage={setPage} setCurPlaying={setCurPlaying} curPlaying={curPlaying} isChannel={true} page={page} data={streams.channels}/>
      {/*clock*/}
      <Clock back={(() => {soundEffects.backMain.play(); window.history.back()})}/>
      <div id="channelsFooter" className="editMenu">
      
        <button onClick={(() => {if(page > 0){ soundEffects.okSetting.play();  setPage(page - 1)}})} lang="en" class="footerButton channelFooterButton" id="addPBack" style={{left: "15%"}}>{'<'}</button>
        <button onClick={(() => { if(page < Math.floor(((streams.channels.length / 12)))){soundEffects.okSetting.play();  setPage(page + 1)}})} lang="en" class="footerButton channelFooterButton" id="okay">{'>'}</button> 
  
      </div>

    </div>
  );
}

export default Playchannel;
