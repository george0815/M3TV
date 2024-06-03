import React, {useState, useEffect,useContext} from "react";
import { curPlaying, soundEffects } from "../../utils";
import { SettingsContext } from '../../App'; //gets global settings context
import VideoJS from "../VideoJS";
import videojs from "video.js";
import {useFirstRender} from "../../utils";
import { StreamsContext } from '../../App';
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../utils"
import { translations } from "../../misc/translations";



function Channelwrapper(props){


    //===========================SETUP=============================//

    //global streams
    const {streams, setStreams} = useContext(StreamsContext);

    //global settings
    const {settings, setSettings} = useContext(SettingsContext);

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



    //CONTROLS CHANNEL BUTTONS
    const handleUserKeyPress = async function(e) {

        if (e.key == 'd' && (props.page < Math.floor((props.data.length / 12))) && props.curPlaying === false) {

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
                //get streams object and set it to temp
                let tempChannels = streams.channels;
                //pushes channel to array
                tempChannels.push(props.data[curIndex]);

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

            if(videojs.getPlayer("vjs") && !curPlaying){videojs.getPlayer('vjs').dispose(); console.log("DNEONGOINR") }
    
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



            props.play(props.data[curIndex].url, props.setCurPlaying, settings, setSettings, player);



            if(settings.player === "vjs"){

            document.getElementById("vjs").addEventListener('enterpictureinpicture', () => {
                if(settings.player === "vjs"){  player.play(); }
            });

            document.addEventListener("leavepictureinpicture", () => {
                if(settings.player === "vjs"){document.getElementById('vjs').style.display = 'none';  player.hide(); player.pause();}      


            });

            }
        }
    }, [player, curIndex, play]);


    //==============================JSXOBJECT========================//


    return (
        <div id="channelWrapper">

            {/*video players*/}
            <video id="curPlaying"  style={!props.curPlaying ? {display: "none"} : {display: ""}} >  <source id="currentChannel" src="" type="application/x-mpegURL"/> </video>
            <div  style={!props.curPlaying ? {display: "none"} : {display: ""}}  id="vjsContainer"></div>

            {/*channel buttons*/}
            {props.data.map((channel, index)=>(

            ((channel.inf.title.includes(search)
            && (search !== "")) || (search === "" || search === null)) &&

                (props.isChannel ? <button key={index} title={channel.inf.title}  onClick={(()=>{ playChannel(index)})} className='channelButton'><img title={channel.inf.title} src={ channel.inf.tvgLogo} alt={channel.inf.title}></img></button>       
                    :   <button title={channel.inf.title} key={channel.inf.title} onClick={(()=>{props.play(channel.url, channel.isLocal)})} className='channelButton'><img  title={channel.inf.title} src={ channel.urlLogo} alt={channel.inf.title}></img></button>      ) 

                )).slice((props.page * 12), props.page * 12 + 12)
            }

        </div>
    );
}

export default Channelwrapper;