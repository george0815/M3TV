import {React, useContext, useState, useEffect} from 'react'; //react
import Clock from '../Clock';
import {soundEffects } from '../../utils'; //import sound effects
import Channelwrapper from './Channelwrapper';
import M3U8FileParser from 'm3u8-file-parser/src/reader';
import { playChannel } from '../../utils';
import { translations } from '../../misc/translations';
import { StreamsContext } from '../../App';
import { SettingsContext } from '../../App';


function Playplaylist() {


  //===========================SETUP=============================//

  //playlists array
  const {streams} = useContext(StreamsContext);

  //settings
  const {settings} = useContext(SettingsContext);


  //============================STATE============================//

  //whther channel is currently playing or not
  const [curPlaying, setCurPlaying] = useState(false)
  //current page, used to render channel buttons
  const [page, setPage] = useState(0);
  //data, can contain either playlists or channels
  const [data, setData] = useState(streams.playlists);
  //whther a user is viewing playlists or channels within a playlist
  const [isChannel, setIsChannel] = useState(false);
  //whther a user is a channel within a playlist specifically
  const [isPlaylist, setIsPlaylist] = useState(false);





  //===========================FUNCTIONS=========================//


  //OPENS PLAYLIST
  function playPlaylist(url, isLocal){

    //fetches url
    function translate(url) {
      var result = fetch(url).then((resp) => {
        return resp.text();
      });
      return result; // As Promise
    }
  

    //plays sound effect
    soundEffects.okChannel.play();

    //parse channels from playlist url
    let urlTemp = url;

    let promise = translate(url);
    promise.then((url) => {

      //  isLocal = true;
      if(isLocal){
        url = urlTemp;
      }


      //parses m3u file
      var parser = new M3U8FileParser();
      parser.read(url);

      try{
        //loads channels
        let channels = parser.getResult().segments;

        if(channels[0].url === "<!DOCTYPE html>" || !Object.hasOwn(channels[0], 'inf')){throw new Error(translations[settings.lang].invalidUrl);}
       


        setData(channels);
        setPage(0);
        setIsChannel(true);
        setIsPlaylist(true)
      }
      catch (e) {
        window.alert(e);
      }

      



    }).catch(() => {
      window.alert(translations[settings.lang].invalidUrl);
    });

  }





  //what is actually on screen: the parsed channels of an opened playlist, or
  //the list of playlists. the footer below counted pages from data.length even
  //while rendering streams.playlists, and data is only the snapshot taken when
  //this mounted — so playlists arriving from firestore after login left it
  //empty and the next-page button could never fire
  const shown = isChannel ? data : streams.playlists;

  return (
    <div className="playVid">

      {/*holds buttons*/}
      { isChannel ? <Channelwrapper play={playChannel} isPlaylist={isPlaylist} setPage={setPage} setCurPlaying={setCurPlaying} curPlaying={curPlaying} isChannel={isChannel} page={page} data={shown}/>
      : <Channelwrapper play={playPlaylist} isPlaylist={isPlaylist} setPage={setPage} setCurPlaying={setCurPlaying} curPlaying={curPlaying} isChannel={isChannel} page={page} data={shown}/>}
      {/*clock*/}
      <Clock back={isChannel ? (() => {soundEffects.backMain.play(); setData(streams.playlists); setIsChannel(false); setPage(0)}) : (() => {soundEffects.backMain.play(); window.history.back()})}/>
      <div id="channelsFooter" className="editMenu">
      
        <button onClick={(() => {if(page > 0){ soundEffects.okSetting.play();  setPage(page - 1)}})} lang="en" className="footerButton channelFooterButton" id="addPBack" style={{left: "15%"}}>{'<'}</button>
        <button onClick={(() => { if(page < Math.ceil(shown.length / 12) - 1){soundEffects.okSetting.play(); setPage(page + 1)}})} lang="en" className="footerButton channelFooterButton" id="okay">{'>'}</button>
  
      </div>


    </div>
  );
}

export default Playplaylist;
