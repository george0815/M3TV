import {useState, useEffect, useContext} from "react";
import { curPlaying, soundEffects } from "../../utils";
import { SettingsContext } from '../../App'; //gets global settings context
import videojs from "video.js";
//video.js ships its own stylesheet and builds the control bar out of <button>
//elements. Without this the app's global button rules style them instead, and
//the control bar renders as a column of full width menu buttons.
import "video.js/dist/video-js.css";
import {useFirstRender} from "../../utils";
import { StreamsContext, ToastContext } from '../../App';
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../utils"
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
            const promptValue = window.prompt(translations[settings.lang].search, search === null ? "" : search);


            setSearch(promptValue); 
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
                await setDoc(doc(db, "data", settings.user.uid), {
                    ...streams, channels: tempChannels
                });
                }
            }
        }      
    }

    //PLAYS CHANNEL
    function playChannel(index){

    




        //if player is hls
        if(settings.player === "hls"){setPlayer(document.getElementById('curPlaying')); document.getElementById("curPlaying").volume = settings.vol.channel;
    }
        //if player is videojs
        else if(settings.player === "vjs"){ 

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