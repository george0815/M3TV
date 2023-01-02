//player for playing vids
var player = document.getElementById('curPlaying');


//used for page functionality
var page = 0;
var pgCounter = 0;

//disable next page button
document.getElementById('arrowNext').style.display='none';


//disable prev page button
document.getElementById('arrowPrev').style.display='none';


//declares ichannel array
var iChannels = [];

//makes video element invisible
document.getElementById('curPlaying').style.display='none';

//plays channel
function playC(url){

  //plays sound effect and mutes background music
  okChannel2.play();
  document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";

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




/*on escape, close video this is technically uneeded since escape will exit fullscreen and
 fire the below function anyway, but this is just incase escape doesnt exit fullscreen by default*/
  document.addEventListener('keydown', function(event) {
    
   
    player.pause();
    player.src("");
    

    //makes video element invisible
    document.getElementById('curPlaying').style.display='none';


});


//when user exits fullscreen close video
document.addEventListener("fullscreenchange", function() {
  if (!document.fullscreen) {
  
    //plays sound effect and makes video element invisible
    backChannel.play();
    document.getElementById('curPlaying').style.display='none';

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