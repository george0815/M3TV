//player for playing vids
var player = document.getElementById('curPlaying');

//used for holding current url for arrows
var urlGlobal;

//kinda dont know what promises do
var playPromise;


//holds index of current channel playing, and whether or not something is playing
var curIndex = 0;
var playing = false;


//array of channels for playlists
var channels = [];


//used for page functionality
var page = 0;
var pgCounter = 0;
var tPgCounter = 0;
var runAmt = 0;

//declares playlists array
var playlists = [];

//makes video element invisible
document.getElementById('curPlaying').style.display='none';


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
      language: "",
      pgNmbr: 0



  };
};


//plays playlist
function playC(url, indexP){


  //something is currently playing
  playing = true;


  //plays sound effect and mutes background music
  okChannel2.play();
  if(!(document.getElementById("bgMusic").src.includes("&mute=1"))){
    document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";
  }


 

  //sets current index
  curIndex = indexP;

  //for cors pretected channels
  const proxy_url = 'http://localhost:8000/';
  url = proxy_url + url;

  //unmutes player and sets source
  player.muted = false;
  var hls = new Hls();
  hls.loadSource(url);
  hls.attachMedia(player);
    
  playPromise = player.play();

  //unhides player and makes it full screen
  player.requestFullscreen();
  document.getElementById('curPlaying').style.display='';

}


//responsible for the channel buttons for a specific playlist 
function loadC(url){

  urlGlobal = url;

  //if its the firstime this function is loaded, play sound effect and 
  //set back button id to "backPlaylist", this is to make sure the back button loads the right html
  if(runAmt == 0){
    okChannel.play();
    document.getElementById("backChannel").id = "backPlaylist";
  }


  //increases run amount
  runAmt++;
  document.getElementById('backPlaylist').onclick = function () { backC(); };


  //calls parser and displays channel button
  let promise = translate(url);
  promise.then((url) => {


    //calls parser
    parser(url);

    //deletes all button
    document.getElementById('channelWrapper').innerHTML = '';
    
    //creates button for each channel
    channels.forEach((channel, i) => {




      //for every 12 channels, increases the pgCounter by 1 
      if(i % 12 == 0 && i != 0){
       
        pgCounter++;

        //if script has already ran once, increase total page counter, this is used when decide whether or not to display the navigation arrows
        if(runAmt == 1){
          tPgCounter++;
        }
        
      }
    

      //if page counter matches the current page, displays channel button
      if(pgCounter == page){
        if((!(channel.url === ""))){

          //sets button attributes
          const ch = document.createElement("button");
          ch.title = channel.title;
          ch.innerHTML = "<img src=\""+channel.logo+"\" alt=\""+channel.title+"\">"
          ch.className = 'channelButton';
          ch.onclick = function () { playC(channel.url, i); };

          ch.tabIndex = i + 1;
          ch.lang = localStorage.getItem("lang");

          //creates html element
          document.getElementById('channelWrapper').appendChild(ch);

          console.log(channel.title);


        }      
      }
      
  
           
    });
    
    
  
   
  });






};



//loads channels and their respective buttons
function loadPlaylists(page){


  //loads channel from local storage
  playlists = JSON.parse(localStorage.getItem("playlists"));

  if (playlists != null){
  //creates button for each channel
    playlists.forEach((playlist, i) => {

  
      //for every 12 channels, increases the pgCounter by 1 
      if(i % 12 == 0 && i != 0){
        pgCounter++;
      }


      if(pgCounter == page){
     
        //sets button attributes
        const pl = document.createElement("button");
        pl.title = playlist.title;
        pl.innerHTML = "<img src=\""+playlist.logoUrl+"\" alt=\""+playlist.title+"\">"
        pl.className = 'channelButton';
        pl.onclick = function () { loadC(playlist.url); };

        pl.tabIndex = i + 1;
        pl.lang = localStorage.getItem("lang");

        //creates html element
        document.getElementById('channelWrapper').appendChild(pl);

      }
    });
  }





  //change back button id to backchannel
  test = document.getElementById('backPlaylist');
  if(test){
    document.getElementById('backPlaylist').onclick = "";
    document.getElementById("backPlaylist").id = "backChannel";
  }

  
  

};



//parses extended m3u playlist file
function parser(pl){

  //Resets J
  j = 0;

  //empty channel array
  channels = [];

  //splices m3u for more readability/easier parsing
  pl = pl.replace(/tvg-/g, '\n').replace(/group-/g, '\n').replace(/user-/g, '\n');

  //splits each line into an array
  var arr = pl.split("\n");

  //create new object to hold data
  var tempChannel =  new channel();



  //for each line, parse data from lines and place them into object, then pushes object into channels when the end of channel data is reached
  for (var i = 0; i < arr.length; i++){
   

    //parses id
    if(arr[i].includes("id=\"",0)){

      var tempID = arr[i];
      tempChannel.id =  tempID.replace(/id=\"/g, '').replace(/\"/g, '');

    }
    //parses title and group
    else if (arr[i].includes("title=\"",0)){

      var tempTitle = arr[i];
      tempTitle = tempTitle.replace(/title=\"/g, '').replace(/\"/g, '');

      var tempGroup = tempTitle.substr(0, tempTitle.indexOf(','));
      tempTitle = tempTitle.replace(tempGroup + ',', '');

      tempChannel.title = tempTitle;
      tempChannel.group = tempGroup;

    }
    //parses country
    else if (arr[i].includes("country=\"",0)){

      var tempCountry = arr[i];
      tempChannel.country = tempCountry.replace(/country=\"/g, '').replace(/\"/g, '');

    }
    //parses language
    else if (arr[i].includes("language=\"",0)){

      var tempLanguage = arr[i];
      tempChannel.language = tempLanguage.replace(/language=\"/g, '').replace(/\"/g, '');
      
    }
    //parses logo
    else if (arr[i].includes("logo=\"",0)){

      var tempLogo = arr[i];
      tempChannel.logo = tempLogo.replace(/logo=\"/g, '').replace(/\"/g, '');

    }
    //parses url
    else if (arr[i].includes("http",0)){
      
      tempChannel.url = arr[i];
   
    }
    //if done parsing channel, pushes channel to channel array
    else if(arr[i].includes("#EXTINF",0) && j != 0){
    
      channels.push(tempChannel);
      var tempChannel =  new channel();
        
      j += 1;
    }
    //increments j by one when new channel is being parsed
    else if(arr[i].includes("#EXTINF",0) && j == 0){
  
      j += 1;
    }
    //if EOF, pushes channel to channel array
    else if(i == arr.length - 1){
     
      channels.push(tempChannel);

    }
  }
 
  
}



//gets data from url
function translate(url) {
  var result = fetch(url).then((resp) => {
    return resp.text();
  });
  return result; // As Promise
}








//next channel page
function arrowForward (){
  
  okSetting.play();
  pgCounter = 0;


  //makes video element invisible
  document.getElementById('channelWrapper').innerHTML = "";
  page++;
  loadPlaylists(page);
    
}

//next channel page
function arrowBack() {
  okSetting.play();
   
  pgCounter = 0;


  //makes video element invisible
  document.getElementById('channelWrapper').innerHTML = "";
  page--;
  loadPlaylists(page);
    
}




//next channel page
function arrowForwardC(url){
  
   
  pgCounter = 0;
  okSetting.play();

  //makes video element invisible
  document.getElementById('channelWrapper').innerHTML = "";
  page++;
  loadC(url, page);
    
}

//next channel page
function arrowBackC(url) {
  
   
  pgCounter = 0;

  okSetting.play();
  //makes video element invisible
  document.getElementById('channelWrapper').innerHTML = "";
  page--;
  loadC(url, page);
    
}

//function for back button when viewing an individual playlist
//resets everything
function backC (){


  document.getElementById('channelWrapper').innerHTML = "";

  page = 0;
  pgCounter = 0;
  tPgCounter = 0;
  runAmt = 0;

  loadPlaylists(0);

}



//when user exits fullscreen close video
document.addEventListener("fullscreenchange", function() {

  if (!document.fullscreen) {
  
    //plays sound effect and makes video element invisible, sets playing to false
    backChannel.play();
    document.getElementById('curPlaying').style.display='none';
    playing = false;


    try {
  
      if (playPromise !== undefined) {
        playPromise.then(_ => {})
        .catch(error => {
        });
      }
  
      //mutes player and unmutes background music, destroys player 
      muteChange();
      player.muted = 'true';
      hls.destroy();
             
    } catch (error) {
      console.error(error);
    
    }

  } 


});


  //plays next channel in playlist if user clicks n
  document.removeEventListener('keydown', keys);
  var keys = function(e){
    console.log(e);

    console.log("tPgCounter: " + tPgCounter +"\npage: " + page + "\npgCounter: " + pgCounter);
    
    if (e.key == 'd'){
      if(document.getElementById('backPlaylist') && (tPgCounter > 0) && (page < tPgCounter)){
        arrowForwardC(urlGlobal);
      }
      else if (document.getElementById('backChannel') && (pgCounter > 0) && (page < pgCounter)){
        arrowForward();
        console.log("TEST");
      }
    }
    else if (e.key == 'a'){
      if(document.getElementById('backPlaylist') && page > 0){
        arrowBackC(urlGlobal);
      }
      else if (document.getElementById('backChannel') && page > 0){
        arrowBack();
      }
    }
    //plays next channel in playlist if user clicks n
    else if (e.key == 'n' && channels != null && playing == true && curIndex + 1 <= channels.length){
      playC(channels[curIndex + 1].url, ++curIndex);
    }
    //plays prev channel in playlist if user clicks p
    else if (e.key == 'p' && channels != null && playing == true && curIndex - 1 >= 0){
      playC(channels[curIndex - 1].url, --curIndex);
    }
    //plays random channel in playlist if user clicks r
    else if (e.key == 'r' && channels != null && playing == true){
      var rand = Math.floor(Math.random() * channels.length);
      playC(channels[rand].url, rand);
    }
    //adds channel from playlist to channel
    else if (e.key == 'f' && channels != null && playing == true){

      //array of individual channels
      var iChannels = JSON.parse(localStorage.getItem("iChannels"));
  
      if (iChannels == null){
        iChannels = [];
      }
  
      okSetting.play();
      //creates and sets variables of channel to be pushed
      tempChannel = new channel();
  
      
      tempChannel.title = channels[curIndex].title;
      console.log(tempChannel.title);
  
      tempChannel.logoUrl = channels[curIndex].logo;
      console.log(tempChannel.logoUrl);
  
      tempChannel.url = channels[curIndex].url;
      console.log(tempChannel.url);
    
      if(!(tempChannel.url === "" || tempChannel.title === "")){
        //pushes channel to array
        iChannels.push(tempChannel);
        console.log("PUSHED");
      
      }
  
      //deletes previous storage item so there are no duplicates
      localStorage.removeItem('iChannels');
  
      //pushes it to storage
      localStorage.setItem('iChannels', JSON.stringify(iChannels));

    }

  }
  document.addEventListener("keydown", keys);






