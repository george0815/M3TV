import React from 'react'; //react
import {Link} from 'react-router-dom'// react router
import { soundEffects } from '../utils';



function getClientLocale() {
    if (typeof Intl !== 'undefined') {
      try {
        return Intl.NumberFormat().resolvedOptions().locale;
      } catch (err) {
        console.error("Cannot get locale from Intl")
      }
    }
  }


var dt = new Date();


function Clock(props) {
  return (
    <div id="clock">
        <div id="time">{dt.getUTCHours() +":"+ (dt.getUTCMinutes())}</div>
        <br/>
        <div id="date">
            <strong>{(dt.toLocaleDateString(getClientLocale(), { weekday: 'short' })) + " " + (("0"+(dt.getMonth()+1)).slice(-2)) + "/" +(("0"+dt.getDate()).slice(-2))}</strong>
        </div>
        <button onClick={props.back} id="backChannel"  class="clockButton">&#8617;</button>
        <Link onClick={(()=>{soundEffects.okMain.play();})} to="/options"><button tabindex="6" id="optionsChannel" class="clockButton" >&#9881;</button></Link>
    </div>
  );
}

export default Clock;
