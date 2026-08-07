import {useState, useEffect, useContext, useRef} from "react";
import { curPlaying, soundEffects } from "../../utils";
import { SettingsContext } from '../../App'; //gets global settings context
/* video.js is 688 kB on its own — bigger than everything else on this screen
   put together — and hls.js is the default player. Most people never select
   it, so it is fetched only when it is going to be used.

   Its stylesheet comes with it. video.js builds its control bar out of
   <button> elements, so without that stylesheet the app's global button rules
   style them instead and the control bar renders as a column of full width
   menu buttons. The counter-rules for that live in Buttons.css, which is in
   the main bundle and harmless on its own.

   The promise is cached rather than the module, so two clicks in quick
   succession wait on one download instead of starting two. */
let videojsLoad = null;

function loadVideojs(){

  if(!videojsLoad){
    videojsLoad = Promise.all([
      import("video.js"),
      import("video.js/dist/video-js.css"),
    ]).then(([module]) => module.default);
  }

  return videojsLoad;

}
import {useFirstRender} from "../../utils";
import { StreamsContext, ToastContext } from '../../App';
import {loadHls, needsHlsJs} from "../../utils"
import { saveUserData } from "../../lib/userdata";
import { translations } from "../../misc/translations";
import { matchChannels, pageCount, pageOf } from "../../lib/channels";
import { addEntry } from "../../lib/streams";



function Channelwrapper(props){


    //===========================SETUP=============================//

    //global streams
    const {streams, setStreams} = useContext(StreamsContext);

    //global settings
    const {settings, setSettings} = useContext(SettingsContext);

  //toasts, in place of the alerts these paths used to raise
  const {notify} = useContext(ToastContext);


    //==============================STATE========================//

    //search title
    const [search, setSearch] = useState("");

    /* Whether the search field is open. It used to be a window.prompt, which
       is drawn by the browser and blocks the page — and being modal was doing
       real work here, because the key handler below is on window and would
       otherwise read every letter typed into the box as a shortcut. The field
       takes that job over by refusing the shortcuts while it has focus. */
    const [searching, setSearching] = useState(false);

    const searchField = useRef(null);


    //current index
    const [curIndex, setCurIndex] = useState(0);

    //used for calling useeffect when index and player haven't changed
    const [play, setPlay] = useState(false);

    //current player
    const [player, setPlayer] = useState(null);

    //==============================FUNCTIONS========================//

    //USE TO TELL WHETHER THE COMPONENT HAS RENDERED ONCE
    const firstRender = useFirstRender();




    //entries matching the current search, each paired with its index in
    //props.data. the index has to survive filtering because playChannel(index)
    //and the curIndex next/prev/random keys all look items back up in props.data
    const matches = matchChannels(props.data, search);

    //pages are counted off the filtered list, and props.page is clamped rather
    //than trusted — see src/lib/channels.js
    const pages = pageCount(matches.length);


    /* Arriving on the screen and changing page run the same entrance: the tiles
       cascade up and fade in, column by column. No direction tracking, because
       there is no sideways travel to point anywhere.

       Nothing here triggers it. The tiles already remount on a page change —
       their keys carry each entry's index in props.data, so a new page is a new
       set of keys — and the animation replays off that. */



    //CONTROLS CHANNEL BUTTONS
    const handleUserKeyPress = async function(e) {

        /* Every letter here is a shortcut, so anything typed into a field is
           not for us — 'a' and 'd' in a channel name would page the grid out
           from under the search that is being typed. Escape still gets
           through, because closing the box is the one thing it should do. */
        const typing = e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA");
        if(typing && e.key !== "Escape"){ return; }

        if (e.key == 'd' && (props.page < pages - 1) && props.curPlaying === false) {

            //next page
            soundEffects.okSetting.play();
            props.setPage(props.page + 1);

        } 
        else if (e.key == 'a' && props.page > 0 && props.curPlaying === false) {

            //previous page
            soundEffects.okSetting.play();  
            props.setPage(props.page - 1);

        }
        else if (e.key == 's' && props.curPlaying === false) {

            //the key that opens the box must not also land in it
            e.preventDefault();

            soundEffects.okSetting.play();
            setSearching(true);

        }
        else if (props.isChannel){

            // plays next channel in playlist if user clicks n
            if (e.key == 'n' && props.data != null && props.curPlaying === true && ((curIndex + 1) < props.data.length)) {setCurIndex(curIndex + 1);}
            // plays prev channel in playlist if user clicks p
            else if (e.key == 'p' && props.data != null && props.curPlaying === true && ((curIndex - 1) >= 0)) {setCurIndex(curIndex - 1);} 
            // plays random channel in playlist if user clicks r
            else if (e.key == 'r' && props.data != null && props.curPlaying === true) {
                var rand = Math.floor(Math.random() * props.data.length);
                setCurIndex(rand);
            }
            //adds channel in playlist to individual channels
            else if(e.key == 'f' && props.data != null && props.curPlaying === true && props.isPlaylist){
                soundEffects.okSetting.play();
                //a copy — pushing onto streams.channels edited the array held
                //in state in place, before setStreams had run
                let tempChannels = addEntry(streams.channels, props.data[curIndex]);

                //sets channels
                setStreams({...streams, channels: tempChannels});

                //uploads doc to firebase
                if(settings.loggedIn){
                await saveUserData(settings.user.uid, {
                    ...streams, channels: tempChannels
                });
                }
            }
        }      
    }

    //PLAYS CHANNEL
    async function playChannel(index){

        //if player is hls
        if(settings.player === "hls"){setPlayer(document.getElementById('curPlaying')); document.getElementById("curPlaying").volume = settings.vol.channel;
    }
        //if player is videojs
        else if(settings.player === "vjs"){

            //already in hand by now — the effect below starts fetching it as
            //soon as this screen opens, so this awaits a settled promise and
            //resolves on a microtask
            const videojs = await loadVideojs();

            if(videojs.getPlayer("vjs") && !curPlaying){videojs.getPlayer('vjs').dispose(); }

            let videoContainerEl = document.getElementById("vjsContainer");
            videoContainerEl.innerHTML = `
              <video id="vjs" class="video-js vjs-default-skin" controls  ></video>
           `;

           //sets player to videojs
            let videoEl = videoContainerEl.querySelector('video');
            setPlayer(videojs(videoEl));


        }

        //sets current index
        setCurIndex(index);
        //if index and player hsn't changed
        if(curIndex === index){ setPlay(!play)}


      }

    
    //==============================USEEFFECT========================//


    /* Fetch the player library on arrival at the grid, not on the click.

       Waiting for it inside the click handler would spend the user activation
       that requestFullscreen depends on: activation is transient and expires
       after a few seconds, so a cold download could outlast it and the channel
       would play windowed instead of fullscreen. Starting here gives it the
       time it takes to pick a channel, and leaves the click awaiting a promise
       that has already settled.

       Only the one that is actually going to be used — and on safari and ios
       neither, since those play HLS through the browser's own pipeline and
       hls.js is never constructed there. */
    useEffect(() => {

        if(settings.player === "vjs"){ loadVideojs(); }
        else if(settings.player === "hls" && needsHlsJs()){ loadHls(); }

    }, [settings.player]);



    //opened by a keypress, so the next keystroke has to land in it
    useEffect(() => {
        if(searching && searchField.current){ searchField.current.focus(); }
    }, [searching]);


    //a search that no longer matches anything on this page would otherwise
    //leave the grid blank until the footer was pressed
    function changeSearch(value){
        setSearch(value);
        props.setPage(0);
    }


    function closeSearch(clear){
        if(clear){ changeSearch(""); }
        setSearching(false);
    }



    //makes it so key event handler doesn't exponentially multiply
    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    //plays channel when player is set, doesn't run on first render because player would be null
    useEffect(() => {
    
        if(!firstRender){



            props.play(props.data[curIndex].url, props.setCurPlaying, settings, setSettings, player, notify);



            //picture-in-picture used to be handled here as well, hiding and
            //pausing the player on leave and calling play() on enter. It is
            //owned by playChannel() in utils now, for both player types and in
            //one place: entering hides the in-page surface without stopping
            //anything, leaving runs the same teardown as exiting fullscreen.
        }
    }, [player, curIndex, play]);


    //==============================JSXOBJECT========================//


    return (
        <div id="channelWrapper">

            {/*video players*/}
            {/*controls are what give the viewer a volume slider, a pause button
               and the picture-in-picture control while fullscreen. Without it
               this element had none of them, and the channel volume could only
               be set beforehand from the audio settings page.*/}
            {/*no <source> child: it carried an empty src and a mime type
               firefox has no native support for, so the browser ran resource
               selection against it on every mount, failed, and logged it. The
               source is set either by hls.js through MediaSource or by
               assigning .src directly on the native path.*/}
            <video id="curPlaying" controls playsInline  style={!props.curPlaying ? {display: "none"} : {display: ""}} ></video>
            <div  style={!props.curPlaying ? {display: "none"} : {display: ""}}  id="vjsContainer"></div>

            {/*The search box, in place of the window.prompt this used to open.
               Filters as it is typed rather than on an OK, so the grid answers
               while the name is still being spelled.*/}
            {searching &&
                <div id="channelSearch">
                    <input
                        ref={searchField}
                        type="search"
                        className="miscOptions"
                        value={search === null ? "" : search}
                        placeholder={translations[settings.lang].search}
                        aria-label={translations[settings.lang].search}
                        onChange={(e) => changeSearch(e.target.value)}
                        onKeyDown={(e) => {
                            //escape clears and closes, enter just closes and
                            //leaves the results up
                            if(e.key === "Escape"){ closeSearch(true); }
                            if(e.key === "Enter"){ closeSearch(false); }
                        }}
                    />
                    <button
                        lang={[settings.lang]}
                        className="searchClose"
                        onClick={(() => {soundEffects.backSetting.play(); closeSearch(true)})}
                    >{translations[settings.lang].cancel}</button>
                </div>}

            {/*Nothing to show, and why.

               An empty grid on its own reads as a load that failed rather
               than an account with nothing in it yet — and now that search
               filters as it is typed, "no results" needs saying too. Rendered
               always but only visible on a phone: the desktop layout is
               finished and this would be a change to it.*/}
            {matches.length === 0 &&
                <div lang={[settings.lang]} className="emptyGrid" role="status">
                    {search
                        ? translations[settings.lang].noMatches
                        : translations[settings.lang][props.isChannel ? "noChannelsYet" : "noPlaylistsYet"]}
                </div>}

            {/*channel buttons*/}
            {pageOf(matches, props.page).map(({channel, index})=>{

                //entries saved before playlists were normalised can still be
                //missing inf, and reading through it during render throws,
                //which takes the whole page down rather than one tile
                const title = (channel.inf && channel.inf.title) || channel.url || "";
                const logo = props.isChannel ? (channel.inf && channel.inf.tvgLogo) : channel.urlLogo;

                return props.isChannel
                    ? <button key={index} title={title} onClick={(()=>{ playChannel(index)})} className='channelButton'><img title={title} src={logo} alt={title}></img></button>
                    : <button title={title} key={title} onClick={(()=>{props.play(channel.url, channel.isLocal)})} className='channelButton'><img title={title} src={logo} alt={title}></img></button>;

                })
            }

        </div>
    );
}

export default Channelwrapper;