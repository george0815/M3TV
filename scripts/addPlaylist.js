//array of channels for playlists
var channels = [];


//array of individual channels
var playlists = [];


//used for accessing channels array
var j = 0;

//channel object that stores channel metadata
function channel() {
  return {
      id: "",
      title: "",
      group: "",
      url: "",
      logo: "",
      country: "",
      language: ""
  };
};



//playlist object that stores playlist metadata
function playlist() {
  return {

    title: "",
    logoUrl: "",
    url: ""

  };
};



//parses extended m3u playlist file
function parser(pl){

  
  //splices m3u for more readability/easier parsing
  pl = pl.replace(/tvg-/g, '\n').replace(/group-/g, '\n').replace(/user-/g, '\n');

  //splits each line into an array
  var arr = pl.split("\n");

  //create new object to hold data
  var tempChannel =  new channel();


  //for each line, parse data from lines and place them into object, then pushes object into channels when the end of channel data is reached
  for (var i = 0; i < arr.length; i++){
   
    if(arr[i].includes("id=\"",0)){

      var tempID = arr[i];

      tempChannel.id =  tempID.replace(/id=\"/g, '').replace(/\"/g, '');

    }
    else if (arr[i].includes("title=\"",0)){

      var tempTitle = arr[i];

      tempTitle = tempTitle.replace(/title=\"/g, '').replace(/\"/g, '');

      var tempGroup = tempTitle.substr(0, tempTitle.indexOf(','));

      tempTitle = tempTitle.replace(tempGroup + ',', '');

      tempChannel.title = tempTitle;
      tempChannel.group = tempGroup;

    }
    else if (arr[i].includes("country=\"",0)){

      var tempCountry = arr[i];
    
      tempChannel.country = tempCountry.replace(/country=\"/g, '').replace(/\"/g, '');

    }
    else if (arr[i].includes("language=\"",0)){

      var tempLanguage = arr[i];

      tempChannel.language = tempLanguage.replace(/language=\"/g, '').replace(/\"/g, '');
      
    }
    else if (arr[i].includes("logo=\"",0)){

      var tempLogo = arr[i];

      tempChannel.logo = tempLogo.replace(/logo=\"/g, '').replace(/\"/g, '');

    }
    else if (arr[i].includes("http",0)){
      
      tempChannel.url = arr[i];
   
    }
    else if(arr[i].includes("#EXTINF",0) && j != 0){
    
      console.log(tempChannel);
      channels.push(tempChannel);
      var tempChannel =  new channel();
        
      j += 1;
    }
    else if(arr[i].includes("#EXTINF",0) && j == 0){
  
      j += 1;
    }
    else if(i == arr.length - 1){

      console.log(tempChannel);
      channels.push(tempChannel);

    }
  }
 
  
}



//gets data from download link
function translate() {

  var url = document.getElementById('url').value;
  var result = fetch(url).then((resp) => {
    return resp.text();
  });
  return result; // As Promise
}


/*onclick, get data from m3u download link and parse
document.getElementById("okay").addEventListener("click", () => {

  let promise = translate();
  promise.then((pl) => {
  
    parser(pl);
   
  });
  
});*/




//adds playlist object to playlists array
document.getElementById("okay").addEventListener("click", () => {

  //creates and sets variables of playlist to be pushed
  tempPlaylist = new playlist();
  tempPlaylist.title = document.getElementById("name").value;
  
  tempPlaylist.logoUrl =  document.getElementById("logoUrl").value;
    
  tempPlaylist.url = document.getElementById("url").value;
  
  //pushes playlist to array
  playlists.push(tempPlaylist);

  document.getElementById("mform").reset();

});



//pushes playlists array to local storage
document.getElementById("settingBack").addEventListener("click", () => {
  
  localStorage.setItem('playlists', JSON.stringify(playlists));
  
});





//gamepad test
window.addEventListener("gamepadconnected", function(e) {
  const gp = navigator.getGamepads()[e.gamepad.index];
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    gp.index, gp.id,
    gp.buttons.length, gp.axes.length);
});



