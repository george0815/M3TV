//player for playing vids
var player = document.getElementById('curPlaying');


//used for page functionality
var page = 0;
var pgCounter = 0;


//holds index of current channel playing, and whether or not something is playing
var curIndex = 0;
var playing = false;

//disable next page button
document.getElementById('arrowNext').style.display='none';


//disable prev page button
document.getElementById('arrowPrev').style.display='none';


//declares ichannel array
var iChannels = [];

//makes video element invisible
document.getElementById('curPlaying').style.display='none';



//plays channel
function playC(url, index){

  //plays sound effect and mutes background music
  okChannel2.play();
  document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";


  //Remove after debugging
  console.log(index);

  //sets current index
  curIndex = index;

  //for cors pretected channels
  const proxy_url = 'http://localhost:8000/';
  url = proxy_url + url;



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

        ch.onclick = function () { playC(channel.url); };
        document.getElementById('channelWrapper').appendChild(ch);

      }
      
      
      
    });

  }
       
  

    //enables next page button if there are pages left
    if((pgCounter > 0) && (page < pgCounter)){
      document.getElementById('arrowNext').style.display='';
    }
    else{
      document.getElementById('arrowNext').style.display='none';
    }
    if(page > 0){
      document.getElementById('arrowPrev').style.display='';
    }
    else{
      document.getElementById('arrowPrev').style.display='none';
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
  
      //mutes player and unmutes background music 
      document.getElementById("bgMusic").src = document.getElementById("bgMusic").src.replace('&mute=1','');
      player.muted = 'true';
      hls.destroy();
      
  
       
    } catch (error) {
      console.error(error);
    
    }

  } 
});



//next channel page
document.getElementById("arrowNext").addEventListener("click", () => {
  
   
  pgCounter = 0;

  okSetting.play();

  //makes video element invisible
  document.getElementById('channelWrapper').innerHTML = "";
  page++;
  loadChannels(page);
    
});
//next channel page
document.getElementById("arrowPrev").addEventListener("click", () => {
  
  okSetting.play();
  pgCounter = 0;


  //makes video element invisible
  document.getElementById('channelWrapper').innerHTML = "";
  page--;
  loadChannels(page);
    
});





//plays next channel in playlist if user clicks n
document.addEventListener("keydown", function(e){
  if (e.key == 'n' && channels != null && playing == true && curIndex + 1 <= channels.length){
    playC(channels[curIndex + 1].url, ++curIndex);
  }
})

//plays prev channel in playlist if user clicks p
document.addEventListener("keydown", function(e){
  if (e.key == 'p' && channels != null && playing == true && curIndex - 1 >= 0){
    playC(channels[curIndex - 1].url, --curIndex);
  }
})

//plays random channel in playlist if user clicks r
document.addEventListener('keydown', function(e){
  var rand = Math.floor(Math.random() * channels.length);
  if (e.key == 'r' && channels != null && playing == true){
    playC(channels[rand].url, rand);
  }
})