//player for playing vids
var player = videojs('curPlaying');

var playPromise;




//array of channels for playlists
var channels = [];


//used for page functionality
var page = 0;
var pgCounter = 0;
var tPgCounter = 0;
var runAmt = 0;

//disable next page button
document.getElementById('arrowNext').style.display='none';


//disable prev page button
document.getElementById('arrowPrev').style.display='none';


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
function playC(url){

  
  okChannel2.play();

 
  document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";

  
  player.muted(false);
  player.src(url);
  console.log(url);


  playPromise = player.play();

  


  player.requestFullscreen();
  document.getElementById('curPlaying').style.display='';



}

function loadC(url){

  
  


if(runAmt == 0){

  okChannel.play();
  document.getElementById("backChannel").id = "backPlaylist";
}

  console.log("HERE");  

  runAmt++;

  

//disable next page button
document.getElementById('arrowNext').onclick = function () { arrowForwardC(url); };
document.getElementById('arrowPrev').onclick = function () { arrowBackC(url); };
document.getElementById('backPlaylist').onclick = function () { backC(); };



  let promise = translate(url);
  promise.then((url) => {

    
  
    parser(url);


    document.getElementById('channelWrapper').innerHTML = '';


    
    
    
    //creates button for each channel
    channels.forEach((channel, i) => {

    
        
     
    
     
      if(i % 12 == 0 && i != 0){
       
        pgCounter++;


        if(runAmt == 1){
          tPgCounter++;
        }
        
      }
    
    
      if(pgCounter == page){
       
        

        

        if(!(channel.url === "")){
     
          const ch = document.createElement("button");

          console.log(ch.title);
      
       
          ch.title = channel.title;
          ch.innerHTML = "<img src=\""+channel.logo+"\" alt=\""+channel.title+"\">"
          ch.className = 'channelButton';
          ch.onclick = function () { playC(channel.url); };
          document.getElementById('channelWrapper').appendChild(ch);

        }
        
    
      }
      
       
      
      
    });
    
    
    
    
    
    //enables next page button if there are pages left
    if((tPgCounter > 0) && (page < tPgCounter)){
    
     
    
      document.getElementById('arrowNext').style.display='';
    
    }
    else{
      document.getElementById('arrowNext').style.display='none';
    }
    if(page > 0){
      document.getElementById('arrowPrev').style.display='';
    
    }
    else{
      document.getElementById('arrowPrev').style.display='none';
    }


   
  });
  
 





};









//loads channels and their respective buttons
function loadPlaylists(page){


  

  //loads channel from local storage
  playlists = JSON.parse(localStorage.getItem("playlists"));

  if (playlists != null){
  //creates button for each channel
  playlists.forEach((playlist, i) => {

    
 

 
    if(i % 12 == 0 && i != 0){
 
      pgCounter++;
      
    }


    if(pgCounter == page){
     
      
 
      const pl = document.createElement("button");
    
      pl.title = playlist.title;
      pl.innerHTML = "<img src=\""+playlist.logoUrl+"\" alt=\""+playlist.title+"\">"
    
  
      pl.className = 'channelButton';

      pl.onclick = function () { loadC(playlist.url); };
      document.getElementById('channelWrapper').appendChild(pl);

    }
    
     
    
    
  });
}


  

  //enables next page button if there are pages left
  if((pgCounter > 0) && (page < pgCounter)){

   

    document.getElementById('arrowNext').style.display='';

  }
  else{
    document.getElementById('arrowNext').style.display='none';
  }
  if(page > 0){
    document.getElementById('arrowPrev').style.display='';

  }
  else{
    document.getElementById('arrowPrev').style.display='none';
  }
  

//disable next page button
document.getElementById('arrowNext').onclick = function () { arrowForward(); };
document.getElementById('arrowPrev').onclick = function () { arrowBack(); };


test = document.getElementById('backPlaylist');
if(test){
document.getElementById('backPlaylist').onclick = "";
document.getElementById("backPlaylist").id = "backChannel";
}

document.getElementById("backChannel").addEventListener("click", function() {

    player.dispose();
    
})
  

};






//parses extended m3u playlist file
function parser(pl){

  

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
    
    
      channels.push(tempChannel);
      var tempChannel =  new channel();
        
      j += 1;
    }
    else if(arr[i].includes("#EXTINF",0) && j == 0){
  
      j += 1;
    }
    else if(i == arr.length - 1){

      
      channels.push(tempChannel);

    }
  }
 
  
}



//gets data from download link
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
  

    backChannel.play();
    //makes video element invisible
    document.getElementById('curPlaying').style.display='none';



    try {
  
   


      if (playPromise !== undefined) {
        playPromise.then(_ => {})
        .catch(error => {
        });
      }
  
      document.getElementById("bgMusic").src = document.getElementById("bgMusic").src.replace('&mute=1','');
      player.src("");
      player.muted(true);
  
       
    } catch (error) {
      console.error(error);
    
    }

  } 


});
