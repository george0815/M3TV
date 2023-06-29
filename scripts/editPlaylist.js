//hides remove button
var removeButtons = document.querySelectorAll("#remove");
for (var i = 0; i < removeButtons.length; i++) {removeButtons[i].remove(); }
 
//declares playlists array
var playlists = [];


//loads playlists and their respective buttons
function editPlaylistsLoad(){
  
  //loads playlists from local storage
  playlists = JSON.parse(localStorage.getItem("playlists"));



  if (playlists != null){
  //creates button for each playlist
  playlists.forEach((playlist, i) => {

      const pl = document.createElement("button");
      
      pl.id = i;
      pl.innerHTML = playlist.title;
      pl.className = 'settingsButton';
      pl.onclick = function () { editPl(playlist.title, i); };
        
      document.getElementById('remChannelWrapper').appendChild(pl);

    });
    }
  };

  //called when user clicks a button for a playlist
  function editPl(title, id){

    okSetting.play();

    //loads edit menu
    $("#remChannelWrapper").load("../add/addChannel.html #mform",function(){

      //loads values
      playlists.forEach((playlist, i) => {
  
        if(id == i){
          document.getElementById("name").value = playlist.title;
          document.getElementById("logoUrl").value = playlist.logoUrl;
          document.getElementById("url").value = playlist.url;
        }
  
      });

      //adds remove button
      for (var i = 0; i < removeButtons.length; i++) { document.getElementById("bButtonWrapper").appendChild(removeButtons[i]);}


      //remove button event handler
      var elements = document.querySelectorAll("#remove");
      for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {
 
        okSetting.play();

        //recreates playlists array, excluding the to be deleted playlist
        let tempPlaylists = [];
        playlists.forEach((playlist, i) => {if (id !== i){tempPlaylists.push(playlist);}});
        playlists = tempPlaylists;
          
        //deletes previous storage item so there are no duplicates
        localStorage.removeItem('playlists');
    
        //pushes it to storage
        localStorage.setItem('playlists', JSON.stringify(playlists));
      

        //loads main screen again
        $("#remBody").load("../options/editPlaylists.html",function(){})

    })

  }


   //removes previouse back button event handler
   var elements = document.querySelectorAll("#settingBack");
   for (var i = 0; i < elements.length; i++) { elements[i].removeEventListener("click", back)} 
  
  
  //back event handler
  var elements = document.querySelectorAll("#settingBack");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function() {
 
      okSetting.play();

      
      //recreates playlists array, and saves changes for the playlists that was edited
      let tempPlaylists = [];
      playlists.forEach((playlist, i) => {

        if (id !== i){ tempPlaylists.push(playlist);}
        else if(id == i){
          playlist.title = document.getElementById("name").value;
          playlist.logoUrl =  document.getElementById("logoUrl").value;
          playlist.url = document.getElementById("url").value;
          tempPlaylists.push(playlist);
        }
      });
      playlists = tempPlaylists;
        
      //deletes previous storage item so there are no duplicates
      localStorage.removeItem('playlists');
  
      //pushes it to storage
      localStorage.setItem('playlists', JSON.stringify(playlists));
    
      //loads main screen again
      $("#remBody").load("../options/editPlaylists.html",function(){ })
    })
  }
})
}


  //remove all button event handler
  var elements = document.querySelectorAll("#removeAll");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function() {
 
      okSetting.play();
      //removes all buttons
      document.getElementById("remChannelWrapper").innerHTML = "";

      //deletes previous storage item so there are no duplicates
      localStorage.removeItem('playlists');

      editPlaylistsLoad();

    })

  }

//back button event handler
var elements = document.querySelectorAll("#settingBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", back)
}

//function for back button
function back(){

  //saves id and plays sound effect
  backSetting.play();
  var idString = document.body.firstChild.id;
  iOptions();

}

