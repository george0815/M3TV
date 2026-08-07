import {useContext, useState} from "react";
import Clock from "./Clock"
import {useNavigate} from 'react-router-dom'; //gets link from react router
import "../styles/General.css";
import "../styles/Clock.css";
import "../styles/Buttons.css";
import "../styles/Misc.css";
import { translations } from "../misc/translations";
import { SettingsContext } from '../App'; //gets global settings context
import { soundEffects } from "../utils"; // sounds effect

  




function Mainpage(props) {


  //===========================STATE=======================//

    //gets settings
    const {settings} = useContext(SettingsContext);


    //show controls
    const [showControls, setShowControls] = useState(false);


    //show controls
    const [showSplash, setShowSplash] = useState(true);


    //fixes bug where splash screen would reappear when going back to main page
    //from another menu. read once on mount and never set again — the flag is
    //written to sessionStorage by hideSplashScreen, not through react state
    const [dontShow] = useState(sessionStorage.getItem("splash") !== null ? sessionStorage.getItem("splash") : false);


  //===========================FUNCTIONS====================//


    const nav = useNavigate()

    function hideSplashScreen(){

        document.getElementById("bgMusic").src = document.getElementById("bgMusic").src
        soundEffects.splashIn.play();
        sessionStorage.setItem("splash", true)
        if(document.getElementById("splashScreen")){document.getElementById("splashScreen").style.opacity = 0;}
        setTimeout(()=>{setShowSplash(false); props.setFirstLoad(true); setShowControls(false)},1200)


        
    }


    function showSplashScreen(){

      setShowControls(true);
      soundEffects.splashOut.play();

    }

  //===========================JSXOBJECT====================//

    return (
      <div id="body">

        {((showSplash && props.firstLoad === null && dontShow === false) || showControls) && <div onClick={hideSplashScreen} id="splashScreen" className={showControls ? "splashControls" : "splash"}>

          {showControls && translations[settings.lang].nextChannel}
          <br/>
          {showControls && translations[settings.lang].previousChannel}
          <br/>
          {showControls && translations[settings.lang].randomChannel}
          <br/>
          {showControls && translations[settings.lang].saveChannel}
          <br/>
          {showControls && translations[settings.lang].nextPage} {showControls && <span onClick={(()=>{window.location.href = '../doom/index.html'})}>D</span>}
          <br/>
          {showControls && translations[settings.lang].previousPage}
          <br/>
          {showControls && translations[settings.lang].searchTitle}
          <br/>
          {showControls && <p id="createdBy">{translations[settings.lang].createdBy}</p>}

        </div>}
  
        {/*Each menu button carries its label along the top and an icon beneath
           it. The icons are inline svg rather than image files so they inherit
           the button's colour and can be animated a piece at a time — the
           action glyph on each one stirs every five seconds, staggered so the
           four are never in step. aria-hidden because the label already says
           what the button does.*/}

        <button onClick={(()=>{soundEffects.okMain.play(); nav("/playp"); })} className="mainPageButton" id="playPlaylist" lang={[settings.lang]} >
          <span className="mainPageLabel">{translations[settings.lang].playPlaylists}</span>
          <svg className="mainPageIcon" viewBox="0 0 48 48" aria-hidden="true">
            <line x1="9" y1="13" x2="31" y2="13"/>
            <line x1="9" y1="21" x2="31" y2="21"/>
            <line x1="9" y1="29" x2="23" y2="29"/>
            <path className="glyph-action filled" d="M29 25 L41 32.5 L29 40 Z"/>
          </svg>
        </button>

        <button onClick={(()=>{soundEffects.okMain.play(); nav("/playc")})} lang={[settings.lang]}  className="mainPageButton" id="playChannel">
          <span className="mainPageLabel">{translations[settings.lang].playChannels}</span>
          <svg className="mainPageIcon" viewBox="0 0 48 48" aria-hidden="true">
            <line x1="17" y1="7" x2="22" y2="14"/>
            <line x1="31" y1="7" x2="26" y2="14"/>
            <rect x="7" y="14" width="34" height="24" rx="3"/>
            <path className="glyph-action filled" d="M20 20 L31 26 L20 32 Z"/>
          </svg>
        </button>

        <button onClick={(()=>{soundEffects.okMain.play(); nav("/addp")})} className="mainPageButton" lang={[settings.lang]} id="addPlaylist">
          <span className="mainPageLabel">{translations[settings.lang].addPlaylists}</span>
          <svg className="mainPageIcon" viewBox="0 0 48 48" aria-hidden="true">
            <line x1="9" y1="13" x2="31" y2="13"/>
            <line x1="9" y1="21" x2="31" y2="21"/>
            <line x1="9" y1="29" x2="23" y2="29"/>
            <g className="glyph-action">
              <line x1="34" y1="26" x2="34" y2="38"/>
              <line x1="28" y1="32" x2="40" y2="32"/>
            </g>
          </svg>
        </button>

        <button onClick={(()=>{soundEffects.okMain.play(); nav("/addc")})} className="mainPageButton" lang={[settings.lang]} id="addChannel">
          <span className="mainPageLabel">{translations[settings.lang].addChannels}</span>
          <svg className="mainPageIcon" viewBox="0 0 48 48" aria-hidden="true">
            <line x1="17" y1="7" x2="22" y2="14"/>
            <line x1="31" y1="7" x2="26" y2="14"/>
            <rect x="7" y="14" width="34" height="24" rx="3"/>
            <g className="glyph-action">
              <line x1="24" y1="20" x2="24" y2="32"/>
              <line x1="18" y1="26" x2="30" y2="26"/>
            </g>
          </svg>
        </button>


        <button onClick={(()=>{showSplashScreen();})} className="mainPageButton" lang={[settings.lang]} id="backMain">{translations[settings.lang].back}</button>     
        <button onClick={(()=>{soundEffects.okMain.play(); nav("/options")})} className="mainPageButton" lang={[settings.lang]} id="optionsMain">{translations[settings.lang].settings}</button>     

        <Clock back={showSplashScreen}/>

      </div>
    );
  }
  
  export default Mainpage;