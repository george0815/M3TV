//holds current video player
if(localStorage.getItem("player") == null){localStorage.setItem('player', "hls");}
var vP = localStorage.getItem("player");

// player for playing vids
var player;
if(vP == "hls"){player = document.getElementById('curPlaying');}
else if(vP == "vjs"){ 
  document.getElementById("vjs").lang = localStorage.getItem("lang"); 
player = videojs('vjs');

//used for picture in picture functionaily
document.getElementById("vjs").addEventListener('enterpictureinpicture', () => {
  if(vP="vjs"){ player.play(); }
 });

}


console.log(vP);

// used for page functionality
var page = 0;
var pgCounter = 0;

// holds index of current channel playing, and whether or not something is playing
var curIndex = 0;
var playing = false;

// declares ichannel array
var iChannels = [];

// makes video elements invisible
document.getElementById('curPlaying').style.display = 'none';
document.getElementById('vjs').style.display = 'none';
if(vP === "vjs"){player.hide();}


// plays channel
function playC(url, index) {

  // plays sound effect and mutes background music if it isn't already muted
  okChannel2.play();
  if (!(document.getElementById("bgMusic").src.includes("&mute=1"))) {
    document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";
  }


  // sets current index
  curIndex = index;

  // sets playing to true so channel buttons can work
  playing = true;

  // Unmutes player and sets source

  //CORS
  const proxy_url = 'https://phantoma.up.railway.app/';
  if(localStorage.getItem("cors") == null){
    localStorage.setItem('cors', false);
  }
  else if(localStorage.getItem("cors") == "true"){ url = proxy_url + url; }          
  
  //plays video
  if(vP === "hls"){
    player.muted = false;
    var hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(player);
    playPromise = player.play();
  }
  else if(vP === "vjs"){
    player.src(url);
    player.show();
    player.play();
  }
  player.requestFullscreen();


  console.log(url);

  // Unhides player and makes it full screen
  if(vP == "hls"){document.getElementById('curPlaying').style.display = '';}
  else if(vP == "vjs"){document.getElementById('vjs').style.display = '';}

}

// Loads channels and their respective buttons
function loadChannels(page) {
  // Loads channel from local storage
  iChannels = JSON.parse(localStorage.getItem('iChannels'));

  if (iChannels != null) {
    // Creates button for each channel
    iChannels.forEach((channel, i) => {
      if (i % 12 == 0 && i != 0) {
        pgCounter++;
      }

      if (pgCounter == page) {
        console.log(channel.pgNmbr);
        const ch = document.createElement('button');

        ch.title = channel.title;
        ch.innerHTML = "<img src=\"" + channel.logoUrl + "\" alt=\"" + channel.title + "\">";
        ch.tabIndex = i + 1;
        ch.lang = localStorage.getItem('lang');
        ch.className = 'channelButton';
        ch.onclick = function() {
          playC(channel.url, i);
        };
        document.getElementById('channelWrapper').appendChild(ch);
      }
    });
  }
}
       
  

// when user exits fullscreen close video
document.addEventListener("fullscreenchange", function() {
  if (!document.fullscreen) {

    // plays sound effect and makes video element invisible
    
      backChannel.play();
    if(vP == "hls"){document.getElementById('curPlaying').style.display = 'none';}
    else if(vP == "vjs"){document.getElementById('vjs').style.display = 'none'; player.hide(); player.pause();}
    

    playing = false;

    try {
      if (playPromise !== undefined) {
        playPromise.then(_ => {}).catch(error => {});
      }
      // mutes player and unmutes background music, destroys player
      muteChange();
      player.muted = 'true';
      if(vP == "hls"){hls.destroy();}
    } catch (error) {
      console.error(error);
    }
  }
});


// controlls channel buttons
document.removeEventListener('keydown', keys);
var keys = function(e) {
  console.log(e);
  console.log(curIndex);

  if (e.key == 'd' && (pgCounter > 0) && (page < pgCounter) && playing == false) {
    pgCounter = 0;
    okSetting.play();

    // makes video element invisible
    document.getElementById('channelWrapper').innerHTML = "";
    page++;
    loadChannels(page);
  } else if (e.key == 'a' && page > 0 && playing == false) {
    okSetting.play();
    pgCounter = 0;

    // makes video element invisible
    document.getElementById('channelWrapper').innerHTML = "";
    page--;
    loadChannels(page);
  } else if (e.key == 'n' && iChannels != null && playing == true && curIndex + 1 <= iChannels.length) {
    // plays next channel in playlist if user clicks n
    playC(iChannels[curIndex + 1].url, ++curIndex);
  } else if (e.key == 'p' && iChannels != null && playing == true && curIndex - 1 >= 0) {
    // plays prev channel in playlist if user clicks p
    playC(iChannels[curIndex - 1].url, --curIndex);
  } else if (e.key == 'r' && iChannels != null && playing == true) {
    // plays random channel in playlist if user clicks r
    var rand = Math.floor(Math.random() * iChannels.length);
    playC(iChannels[rand].url, rand);
  }
}
document.addEventListener("keydown", keys);