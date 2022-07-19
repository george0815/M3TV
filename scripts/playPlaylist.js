//array of channels for playlists
var channels = [];


//used for page functionality
var page = 0;
var pgCounter = 0;

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

  player.src(url);
  player.play(); 
  player.requestFullscreen();
  document.getElementById('curPlaying').style.display='';
  console.log(document.getElementById('currentChannel').getAttribute('src'));


}

function loadC(url){

  
  let promise = translate(url);
  promise.then((url) => {
  
    parser(url);
   
  });
  
  document.getElementById('channelWrapper').innerHTML = '';


console.log(channels);
console.log(channels.length);

console.log("fwefew");



//creates button for each channel
channels.forEach((channel, i) => {

    
 

 
  if(i % 12 == 0 && i != 0){
    console.log(pgCounter)
    pgCounter++;
    
  }


  if(pgCounter == page){
   
    
    console.log(channel.pgNmbr);
    const ch = document.createElement("button");
  
    ch.title = channel.title;
    ch.innerHTML = "<img src=\""+channel.logoUrl+"\" alt=\""+channel.title+"\">"
  

    ch.className = 'channelButton';

    ch.onclick = function () { playC(channel.url); };
    document.getElementById('channelWrapper').appendChild(ch);

  }
  
   
  
  
});





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





};









//loads channels and their respective buttons
function loadPlaylists(page){

  //loads channel from local storage
  playlists = JSON.parse(localStorage.getItem("playlists"));


  //creates button for each channel
  playlists.forEach((playlist, i) => {

    
 

 
    if(i % 12 == 0 && i != 0){
      console.log(pgCounter)
      pgCounter++;
      
    }


    if(pgCounter == page){
     
      
      console.log(playlist.pgNmbr);
      const pl = document.createElement("button");
    
      pl.title = playlist.title;
      pl.innerHTML = "<img src=\""+playlist.logoUrl+"\" alt=\""+playlist.title+"\">"
    
  
      pl.className = 'channelButton';

      pl.onclick = function () { loadC(playlist.url); };
      document.getElementById('channelWrapper').appendChild(pl);

    }
    
     
    
    
  });



  

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
function translate(url) {


  var result = fetch(url).then((resp) => {
    return resp.text();
  });
  return result; // As Promise
}




/*
 
  3. load channels
  4. change back button onclick
 */