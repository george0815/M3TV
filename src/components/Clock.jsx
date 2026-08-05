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
            {/*Traced from the reference rather than drawn by eye: the sample was
               measured for tooth count, pitch, the four radii and the tooth
               width, then the path generated from those numbers.

               Shape numbers, all in a 32 unit box centred at 16,16: tip radius 15,
               root 11.25, ring inner 9.15, axle 3.27. Teeth are 2.35 wide at
               the root tapering to 1.40 at the tip, with the two tip corners eased
               off on a 0.50 radius. Raise the root for shorter teeth, raise
               the inner radius for a thinner ring, raise the corner radius to
               soften the tips further.
               Radial sides — the obvious way to draw a gear — flare outward
               instead, which is the one thing that looked wrong against the
               reference. Widen the tip figure toward the root figure to
               straighten them, or drop it further to sharpen them.

               One path, three subpaths, fill-rule evenodd: the crossing count
               leaves the ring solid, the gap empty and the axle solid.*/}
            <svg className="clockIcon" viewBox="0 0 32 32" aria-hidden="true">
              <path className="solid" fillRule="evenodd" d="M 27.06 18.04 L 29.93 20.26 A 0.5 0.5 0 0 1 30.20 20.91 L 29.51 22.57 A 0.5 0.5 0 0 1 28.86 22.84 L 25.27 22.38 A 11.25 11.25 0 0 1 22.38 25.27 L 22.84 28.86 A 0.5 0.5 0 0 1 22.57 29.51 L 20.91 30.20 A 0.5 0.5 0 0 1 20.26 29.93 L 18.04 27.06 A 11.25 11.25 0 0 1 13.96 27.06 L 11.74 29.93 A 0.5 0.5 0 0 1 11.09 30.20 L 9.43 29.51 A 0.5 0.5 0 0 1 9.16 28.86 L 9.62 25.27 A 11.25 11.25 0 0 1 6.73 22.38 L 3.14 22.84 A 0.5 0.5 0 0 1 2.49 22.57 L 1.80 20.91 A 0.5 0.5 0 0 1 2.07 20.26 L 4.94 18.04 A 11.25 11.25 0 0 1 4.94 13.96 L 2.07 11.74 A 0.5 0.5 0 0 1 1.80 11.09 L 2.49 9.43 A 0.5 0.5 0 0 1 3.14 9.16 L 6.73 9.62 A 11.25 11.25 0 0 1 9.62 6.73 L 9.16 3.14 A 0.5 0.5 0 0 1 9.43 2.49 L 11.09 1.80 A 0.5 0.5 0 0 1 11.74 2.07 L 13.96 4.94 A 11.25 11.25 0 0 1 18.04 4.94 L 20.26 2.07 A 0.5 0.5 0 0 1 20.91 1.80 L 22.57 2.49 A 0.5 0.5 0 0 1 22.84 3.14 L 22.38 6.73 A 11.25 11.25 0 0 1 25.27 9.62 L 28.86 9.16 A 0.5 0.5 0 0 1 29.51 9.43 L 30.20 11.09 A 0.5 0.5 0 0 1 29.93 11.74 L 27.06 13.96 A 11.25 11.25 0 0 1 27.06 18.04 Z M 25.15 16.00 A 9.15 9.15 0 1 1 6.85 16.00 A 9.15 9.15 0 1 1 25.15 16.00 Z M 19.27 16.00 A 3.27 3.27 0 1 1 12.73 16.00 A 3.27 3.27 0 1 1 19.27 16.00 Z"/>
            </svg>
          </button>
        </Link>
    </div>
  );
}

export default Clock;
