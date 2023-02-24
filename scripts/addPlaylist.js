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
    pgNmbr: 0,
    isLocal: false
     
  };
};



//adds channel
var elements = document.querySelectorAll("#okay");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
  
    okSetting.play();
   
    //creates and sets variables of channel to be pushed
    tempPlaylist = new playlist();
    tempPlaylist.title = document.getElementById("name").value;
  
    tempPlaylist.logoUrl =  document.getElementById("logoUrl").value;
    


    //is playlist is local, ask user for file prompt
    if(document.getElementById("isLocal").checked){
      var input = document.createElement('input');
      input.type = 'file';

      input.onchange = e => { 
        
        // getting a hold of the file reference
        var file = e.target.files[0]; 

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
          var content = readerEvent.target.result; // this is the content!
          
          tempPlaylist.url = content;
          console.log( tempPlaylist.url );
          document.getElementById("url").value = file.name;


          //repeated if statement because the other one will run before 
          //the reader is finished, and thus wont push it into the array
          if(!(tempPlaylist.url === "" || tempPlaylist.title === "")){
            //pushes channel to array
            playlists.push(tempPlaylist);
            document.getElementById("mform").reset();
            document.activeElement.blur()
          }

        }


      }

      input.click();
    }
    else{
    tempPlaylist.url = document.getElementById("url").value;
    }

    //if playlist is local, set isLocal bool to true so parser knows how to parse it 
    if(document.getElementById("isLocal").checked){
      tempPlaylist.isLocal = true;
    }
    else{
      tempPlaylist.isLocal = false;
    }
  
    //if url and title arent empty, push
    if(!(tempPlaylist.url === "" || tempPlaylist.title === "")){
      //pushes channel to array
      playlists.push(tempPlaylist);
      document.getElementById("mform").reset();
      document.activeElement.blur()
    }


  });

}
  

//pushes channels array to local storage
var elements = document.querySelectorAll("#addPBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('playlists');

    //pushes it to storage
    localStorage.setItem('playlists', JSON.stringify(playlists));
    
  });

}


  

