  //player for playing vids
  var player = videojs('curPlaying');



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
    iChannels.forEach(channel => {
       
      const ch = document.createElement("button");
      ch.style.content = channel.title;
      ch.className = 'channelButton';

      ch.onclick = function () { playC(channel.url); };
      document.getElementById('channelWrapper').appendChild(ch);
      
    });


    //makes video element invisible
    document.getElementById('curPlaying').style.display='none';

  };