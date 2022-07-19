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

    player.src(url);
    player.play(); 
    player.requestFullscreen();
    document.getElementById('curPlaying').style.display='';
    console.log(document.getElementById('currentChannel').getAttribute('src'));


  }

  //loads channels and their respective buttons
  function loadChannels(page){

    //loads channel from local storage
    iChannels = JSON.parse(localStorage.getItem("iChannels"));


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
    
    player.pause();
    player.src("");
    

    //makes video element invisible
    document.getElementById('curPlaying').style.display='none';

  } 
});



//next channel page
document.getElementById("arrowInsideNext").addEventListener("click", () => {
  
   
  pgCounter = 0;


  //makes video element invisible
  document.getElementById('channelWrapper').innerHTML = "";
  page++;
  loadChannels(page);
    
});
//next channel page
document.getElementById("arrowInsidePrev").addEventListener("click", () => {
  
   
  pgCounter = 0;


  //makes video element invisible
  document.getElementById('channelWrapper').innerHTML = "";
  page--;
  loadChannels(page);
    
});