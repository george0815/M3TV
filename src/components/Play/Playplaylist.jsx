import React, {useContext, useState} from 'react'; //react
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

    //fetches url. tried directly first — most hosts that serve m3u files,
    //github raw among them, send CORS headers and need no help. only if that
    //fails do we retry through the proxy, and only when one is configured.
    //
    //an http url on an https page is the exception: that is blocked as mixed
    //content before the request is made, so there is nothing to learn from
    //trying it and it goes straight through the proxy.
    function translate(url) {

      const proxy = import.meta.env.VITE_CORS_PROXY;
      const mixedContent = window.location.protocol === "https:" && /^http:\/\//i.test(url);

      if(mixedContent && proxy){
        return fetch(proxy + url).then((resp) => resp.text());
      }

      return fetch(url)
        .then((resp) => resp.text())
        .catch((err) => {

          if(!proxy){ throw err; }

          return fetch(proxy + url).then((resp) => resp.text());

        }); // As Promise
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
        //the parser only attaches inf to an entry that had an #EXTINF line
        //before it, and the check below only ever inspected the first segment.
        //So a playlist with one malformed entry anywhere after the first
        //passed validation and then threw while rendering — which in react
        //unmounts the tree and leaves a blank screen. Give every segment
        //something renderable, falling back to the url as a label.
        let channels = parser.getResult().segments.map(segment =>
          segment.inf ? segment : {...segment, inf: {title: segment.url}}
        );

        if(channels.length === 0 || channels[0].url === "<!DOCTYPE html>"){throw new Error(translations[settings.lang].invalidUrl);}
       


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

  //one step back: out of an opened playlist to the list of playlists, or off
  //the screen entirely if we are already looking at the list. Shared by the
  //clock and by the mobile back button below it.
  const goBack = isChannel
    ? (() => {soundEffects.backMain.play(); setData(streams.playlists); setIsChannel(false); setPage(0)})
    : (() => {soundEffects.backMain.play(); window.history.back()});

  return (
    <div className="playVid">

      {/*holds buttons*/}
      { isChannel ? <Channelwrapper play={playChannel} isPlaylist={isPlaylist} setPage={setPage} setCurPlaying={setCurPlaying} curPlaying={curPlaying} isChannel={isChannel} page={page} data={shown}/>
      : <Channelwrapper play={playPlaylist} isPlaylist={isPlaylist} setPage={setPage} setCurPlaying={setCurPlaying} curPlaying={curPlaying} isChannel={isChannel} page={page} data={shown}/>}
      {/*clock*/}
      <Clock back={goBack}/>

      {/*The clock carries the only way off this screen, and the clock is
         display:none below 1300px — so on a phone there was no route back to
         the playlist list, or off to the menu, at all. Same handler, shown only
         where the clock is not.*/}
      <button onClick={goBack} lang={[settings.lang]} className="mobileBack">{translations[settings.lang].back}</button>
      <div id="channelsFooter" className="editMenu">
      
        <button onClick={(() => {if(page > 0){ soundEffects.okSetting.play();  setPage(page - 1)}})} lang="en" className="footerButton channelFooterButton" id="addPBack" style={{left: "15%"}}>{'<'}</button>
        <button onClick={(() => { if(page < Math.ceil(shown.length / 12) - 1){soundEffects.okSetting.play(); setPage(page + 1)}})} lang="en" className="footerButton channelFooterButton" id="okay">{'>'}</button>
  
      </div>


    </div>
  );
}

export default Playplaylist;
