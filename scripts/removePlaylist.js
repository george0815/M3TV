 //declares ichannel array
 var playlists = [];


  //loads channels and their respective buttons
  function remPlaylistsLoad(){

    //loads channel from local storage
    playlists = JSON.parse(localStorage.getItem("playlists"));


    //creates button for each channel
    playlists.forEach((playlist, i) => {


        const ch = document.createElement("button");
      
       ch.id = playlist.title;
        ch.innerHTML = playlist.title;
      
    
        ch.className = 'settingsButton';

        ch.onclick = function () { removePl(playlist.title); };
        document.getElementById('remChannelWrapper').appendChild(ch);

      
      

    });

  

  };


  function removePl(title){

    document.getElementById(title).style.display = 'none';

    playlists = playlists.filter(function( playlist ) {
        return playlist.title !== title;
      });

      
    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('playlists');

    //pushes it to storage
    localStorage.setItem('playlists', JSON.stringify(playlists));
     


  }