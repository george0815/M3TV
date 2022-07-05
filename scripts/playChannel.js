var player = videojs('curPlaying');

  //loads channels
  function playC(url){

 
    
      
    
    player.src(url);
    player.play();  
    document.getElementById('curPlaying').style.display='';
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

  document.getElementById('curPlaying').style.display='none';

  };