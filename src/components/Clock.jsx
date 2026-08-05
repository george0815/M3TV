import React, { useState, useEffect } from 'react'; //react
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


function Clock(props) {

  //this was a module-scope `new Date()`, evaluated once when the module first
  //loaded. nothing reassigned it and nothing ticked, so the clock showed
  //whatever time the page was opened and then never moved — and since
  //client-side navigation does not re-run module scope, only a full refresh
  //ever changed it.
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  //local time, not UTC. the date underneath has always been local, so reading
  //the hours in UTC put the two out of step by the whole timezone offset, and
  //made them disagree outright either side of midnight.
  //
  //minutes are padded the same way the date parts are; without it five past
  //two rendered as "2:5".
  const time = now.getHours() + ":" + ("0" + now.getMinutes()).slice(-2);

  return (
    <div id="clock">
        <div id="time">{time}</div>
        <br/>
        <div id="date">
            <strong>{(now.toLocaleDateString(getClientLocale(), { weekday: 'short' })) + " " + (("0"+(now.getMonth()+1)).slice(-2)) + "/" +(("0"+now.getDate()).slice(-2))}</strong>
        </div>
        {/*These were the &#8617; and &#9881; entities, which are drawn by
           whichever font on the system happens to carry them — so the arrow and
           the gear differed in weight, size and vertical alignment between
           browsers and platforms, and on some Linux systems rendered as an
           emoji or a missing-glyph box. Inline svg draws the same on all of
           them and inherits the button's colour.*/}

        <button onClick={props.back} id="backChannel" className="clockButton" aria-label="Back">
          <svg className="clockIcon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M27 22 v-3 a6 6 0 0 0 -6 -6 H8"/>
            <path d="M13 8 L7 13 L13 18"/>
          </svg>
        </button>

        <Link onClick={(()=>{soundEffects.okMain.play();})} to="/options">
          <button tabIndex="6" id="optionsChannel" className="clockButton" aria-label="Settings">
            <svg className="clockIcon" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="4.2"/>
              <path d="M16 3.5 l2 3.4 3.9 -.7 .8 3.9 3.4 2 -2 3.4 2 3.4 -3.4 2 -.8 3.9 -3.9 -.7 -2 3.4 -2 -3.4 -3.9 .7 -.8 -3.9 -3.4 -2 2 -3.4 -2 -3.4 3.4 -2 .8 -3.9 3.9 .7 z"/>
            </svg>
          </button>
        </Link>
    </div>
  );
}

export default Clock;
