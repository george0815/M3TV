//play

  //loads channels
  function playC(url){

 
    document.getElementById('curPlaying').style.display='block';
    //document.getElementById('curPlaying').play();   
    var player = videojs('curPlaying');
    player.src(url);
    player.play();  
    console.log(document.getElementById('currentChannel').getAttribute('src'));


  }
  function loadChannels(){


    iChannels = JSON.parse(localStorage.getItem("iChannels"));

    iChannels.forEach(channel => {
       

      
      const ch = document.createElement("button");
      ch.innerHTML = channel.title;





      
      

      ch.onclick = function () { playC(channel.url); };
      document.body.appendChild(ch);
      
   
      

    });

  //document.getElementById('curPlaying').style.display='none';

  };