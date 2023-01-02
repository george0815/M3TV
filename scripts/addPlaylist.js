//array of individual playlists
var playlists = JSON.parse(localStorage.getItem("playlists"));

if (playlists == null){
    playlists = [];
}



//playlist object that stores channel metadata
function playlist() {
  return {
    
    title: "",
    logoUrl: "",
    url: "",
    pgNmbr: 0
     
  };
};


 


//adds channel
  document.getElementById("okay").addEventListener("click", () => {
  
    okSetting.play();
   
    //creates and sets variables of channel to be pushed
    tempPlaylist = new playlist();
    tempPlaylist.title = document.getElementById("name").value;
  
    tempPlaylist.logoUrl =  document.getElementById("logoUrl").value;
    
    tempPlaylist.url = document.getElementById("url").value;
  

    if(!(tempPlaylist.url === "" || tempPlaylist.title === "")){
    //pushes channel to array
    playlists.push(tempPlaylist);
    document.getElementById("mform").reset();
  }


  });
  





  //pushes channels array to local storage
  document.getElementById("addPBack").addEventListener("click", () => {

    

    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('playlists');

    //pushes it to storage
    localStorage.setItem('playlists', JSON.stringify(playlists));
    
  });

  


  

