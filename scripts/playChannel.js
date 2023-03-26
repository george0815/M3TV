//player for playing vids
var player = document.getElementById('curPlaying');


//used for page functionality
var page = 0;
var pgCounter = 0;


//holds index of current channel playing, and whether or not something is playing
var curIndex = 0;
var playing = false;




//declares ichannel array
var iChannels = [];



//makes video element invisible
document.getElementById('curPlaying').style.display='none';



//plays channel
function playC(url, index){

  //plays sound effect and mutes background music if it isn't already muted
  okChannel2.play();
  if(!(document.getElementById("bgMusic").src.includes("&mute=1"))){
    document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";
  }
  


  //Remove after debugging
  console.log(index);

  //sets current index
  curIndex = index;

  //for cors pretected channels
  const proxy_url = 'http://localhost:8000/';
  url = proxy_url + url;


  //sets playing to true so channel buttons can work
  playing = true;


  //unmutes player and sets source
  player.muted = false;
  var hls = new Hls();
  hls.loadSource(url);
  hls.attachMedia(player);
    
  playPromise = player.play();

  //unhides player and makes it full screen
  player.requestFullscreen();
  document.getElementById('curPlaying').style.display='';


}

//loads channels and their respective buttons
function loadChannels(page){

  //loads channel from local storage
  iChannels = JSON.parse(localStorage.getItem("iChannels"));

  if (iChannels != null){

    //creates button for each channel
    iChannels.forEach((channel, i) => {


      if(i % 12 == 0 && i != 0){
        console.log(pgCounter)
        pgCounter++;
      
      }


      if(pgCounter == page){
       
        
        console.log(channel.pgNmbr);
        const ch = document.createElement("button");
      
        ch.title = channel.title;
        ch.innerHTML = "<img src=\""+channel.logoUrl+"\" alt=\""+channel.title+"\">"
      
        ch.tabIndex = i + 1;
        ch.lang = localStorage.getItem("lang");

        ch.className = 'channelButton';

        ch.onclick = function () { playC(channel.url, i); };
        document.getElementById('channelWrapper').appendChild(ch);

      }
      
      
      
    });

  }
       
  

    
    

};




//when user exits fullscreen close video
document.addEventListener("fullscreenchange", function() {
  if (!document.fullscreen) {
  
    //plays sound effect and makes video element invisible
    backChannel.play();
    document.getElementById('curPlaying').style.display='none';
    playing = false;

    try {

      if (playPromise !== undefined) {
        playPromise.then(_ => {})
        .catch(error => {
        });
      }
  
      //mutes player and unmutes background music, destroys player 
      muteChange();
      player.muted = 'true';
      hls.destroy();
      
  
       
    } catch (error) {
      console.error(error);
    
    }

  } 
});


//controlls channel buttons
  document.removeEventListener('keydown', keys);
  var keys = function(e){
    console.log(e);
  
    console.log(curIndex);
    //console.log(iChannels.length);
    
    if (e.key == 'd' && (pgCounter > 0) && (page < pgCounter)){
      pgCounter = 0;

      okSetting.play();

      //makes video element invisible
      document.getElementById('channelWrapper').innerHTML = "";
      page++;
      loadChannels(page);
    }
    else if (e.key == 'a' && page > 0){
      okSetting.play();
      pgCounter = 0;


      //makes video element invisible
      document.getElementById('channelWrapper').innerHTML = "";
      page--;
      loadChannels(page);
    }
    //plays next channel in playlist if user clicks n
    else if (e.key == 'n' && iChannels != null && playing == true && curIndex + 1 <= iChannels.length){
      playC(iChannels[curIndex + 1].url, ++curIndex);
    }
    //plays prev channel in playlist if user clicks p
    else if (e.key == 'p' && iChannels != null && playing == true && curIndex - 1 >= 0){
      playC(iChannels[curIndex - 1].url, --curIndex);
    }
    //plays random channel in playlist if user clicks r
    else if (e.key == 'r' && iChannels != null && playing == true){
      var rand = Math.floor(Math.random() * iChannels.length);
      playC(iChannels[rand].url, rand);
    }
    
  }
  document.addEventListener("keydown", keys);