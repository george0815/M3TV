 //disposes of video player when back button is pressed 
  document.getElementById("backChannel").addEventListener("click", function() {

    player.dispose();
    
})
  
  //player for playing vids
  var player = videojs('curPlaying');


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

    //sets source and plays sound effect
    player.src(url);
    okChannel.play();

    

    //unmutes video audio and plays player, sets it to fullscreen
    player.muted(false);
    playPromise = player.play();
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

    
        //for every 12 channels, increases the pgCounter by 1 
        if(i % 12 == 0 && i != 0){

          console.log(pgCounter)
          pgCounter++;
        
        }


        //if page counter matches the current page, displays channel button
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
    
   
    //pauses the player sets the source to 0
    player.pause();
    player.src("");
    

    //makes video element invisible
    document.getElementById('curPlaying').style.display='none';


});


//when user exits fullscreen close video
document.addEventListener("fullscreenchange", function() {
  if (!document.fullscreen) {
  

    //plays soundeffect and makes video element invisible
    backChannel.play();
    document.getElementById('curPlaying').style.display='none';


    //mutes player and sets source to nothing
    try {


      if (playPromise !== undefined) {
        playPromise.then(_ => {})
        .catch(error => {
        });
      }
  
      player.src("");
      player.muted(true);
  
  
       
    } catch (error) {
      console.error(error);
    
    }

  } 
});



//next channel page
document.getElementById("arrowNext").addEventListener("click", () => {
  
  //sets page counter to 0 and plays sound effect
  pgCounter = 0;
  okSetting.play();

  //clears buttons and reloads channels for next page
  document.getElementById('channelWrapper').innerHTML = "";
  page++;
  loadChannels(page);
    
});



//prev channel page
document.getElementById("arrowPrev").addEventListener("click", () => {
  
  //sets page counter to 0 and plays sound effect
  okSetting.play();
  pgCounter = 0;


  //clears buttons and reloads channels for prev page
  document.getElementById('channelWrapper').innerHTML = "";
  page--;
  loadChannels(page);
    
});