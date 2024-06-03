import React, {useContext, useState} from "react";
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


    //fixes bug where splash screen would reappear when going back to main page from another menu
    const [dontShow, setDontShow] = useState(sessionStorage.getItem("splash") !== null ? sessionStorage.getItem("splash") : false);


    console.log(sessionStorage.getItem("splash"));

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
  
        <button onClick={(()=>{soundEffects.okMain.play(); nav("/playp"); })} className="mainPageButton" id="playPlaylist" lang={[settings.lang]} >{translations[settings.lang].playPlaylists}</button>
        <button onClick={(()=>{soundEffects.okMain.play(); nav("/playc")})} lang={[settings.lang]}  className="mainPageButton" id="playChannel">{translations[settings.lang].playChannels}</button>
        <button onClick={(()=>{soundEffects.okMain.play(); nav("/addp")})} className="mainPageButton" lang={[settings.lang]} id="addPlaylist">{translations[settings.lang].addPlaylists}</button>
        <button onClick={(()=>{soundEffects.okMain.play(); nav("/addc")})} className="mainPageButton" lang={[settings.lang]} id="addChannel">{translations[settings.lang].addChannels}</button>     

        <button onClick={(()=>{showSplashScreen();})} className="mainPageButton" lang={[settings.lang]} id="backMain">{translations[settings.lang].back}</button>     
        <button onClick={(()=>{soundEffects.okMain.play(); nav("/options")})} className="mainPageButton" lang={[settings.lang]} id="optionsMain">{translations[settings.lang].settings}</button>     

        <Clock back={showSplashScreen}/>

      </div>
    );
  }
  
  export default Mainpage;