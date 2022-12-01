 //declares ichannel array
 var iChannels = [];


  //loads channels and their respective buttons
  function remChannelsLoad(){

    //loads channel from local storage
    iChannels = JSON.parse(localStorage.getItem("iChannels"));



    if (iChannels != null){
    //creates button for each channel
    iChannels.forEach((channel, i) => {


        const ch = document.createElement("button");
      
       ch.id = channel.title;
        ch.innerHTML = channel.title;
      
    
        ch.className = 'settingsButton';

        ch.onclick = function () { removeCh(channel.title); };
        document.getElementById('remChannelWrapper').appendChild(ch);

      
       

    });

    }

  };


  function removeCh(title){

    document.getElementById(title).style.display = 'none';

    iChannels = iChannels.filter(function( channel ) {
        return channel.title !== title;
      });
      okSetting.play();
      
    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('iChannels');

    //pushes it to storage
    localStorage.setItem('iChannels', JSON.stringify(iChannels));
     


  }


  //removes all
  document.getElementById("removeAll").addEventListener("click", () => {

    okSetting.play();
    //removes all buttons
    document.getElementById("remChannelWrapper").innerHTML = "";

    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('playlists');

    
    remPlaylistsLoad();

  })