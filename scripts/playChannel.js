  //player for playing vids
  var player = videojs('curPlaying');

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
  function loadChannels(){

    //loads channel from local storage
    iChannels = JSON.parse(localStorage.getItem("iChannels"));


    //creates button for each channel
    iChannels.forEach((channel, i) => {

      if(i < 12){

        
        console.log(channel.pgNmbr);
        const ch = document.createElement("button");
      
        ch.title = channel.title;
        ch.innerHTML = "<img src=\""+channel.logoUrl+"\" alt=\""+channel.title+"\">"
      
    
        ch.className = 'channelButton';

        ch.onclick = function () { playC(channel.url); };
        document.getElementById('channelWrapper').appendChild(ch);

      }
      else{
        channel.pgNmbr = i/12;
        console.log(channel.pgNmbr);
      }
       
      
      
    });


    

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


//loads new page of channels
