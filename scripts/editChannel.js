//hides remove button
var removeButtons = document.querySelectorAll("#remove");
for (var i = 0; i < removeButtons.length; i++) {removeButtons[i].remove(); }
 
//declares ichannel array
var iChannels = [];


//loads channels and their respective buttons
function editChannelsLoad(){
  
  //loads channel from local storage
  iChannels = JSON.parse(localStorage.getItem("iChannels"));



  if (iChannels != null){
  //creates button for each channel
  iChannels.forEach((channel, i) => {

      const ch = document.createElement("button");
      
      ch.id = i;
      ch.innerHTML = channel.title;
      ch.className = 'settingsButton';
      ch.onclick = function () { editCh(channel.title, i); };
        
      document.getElementById('remChannelWrapper').appendChild(ch);

    });
    }
  };

  //called when user clicks a button for a channel
  function editCh(title, id){
    

    okSetting.play();

    //loads edit menu
    $("#remChannelWrapper").load("../add/addChannel.html #mform",function(){

      //loads values
      iChannels.forEach((channel, i) => {
  
        if(id == i){
          document.getElementById("name").value = channel.title;
          document.getElementById("logoUrl").value = channel.logoUrl;
          document.getElementById("url").value = channel.url;
        }
  
      });

      //adds remove button
      for (var i = 0; i < removeButtons.length; i++) { document.getElementById("bButtonWrapper").appendChild(removeButtons[i]);}


      //remove button event handler
      var elements = document.querySelectorAll("#remove");
      for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {
 
        okSetting.play();

        //recreates channels array, excluding the to be deleted channel
        let tempChannels = [];
        iChannels.forEach((channel, i) => {if (id !== i){tempChannels.push(channel);}});
        iChannels = tempChannels;
          
        //deletes previous storage item so there are no duplicates
        localStorage.removeItem('iChannels');
    
        //pushes it to storage
        localStorage.setItem('iChannels', JSON.stringify(iChannels));
      

        //loads main screen again
        $("#remBody").load("../options/editChannels.html",function(){})

    })

  }

  //removes previouse back button event handler
  var elements = document.querySelectorAll("#settingBack");
  for (var i = 0; i < elements.length; i++) { elements[i].removeEventListener("click", back)}


  //back event handler
  elements = document.querySelectorAll("#settingBack");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function() {
 
      okSetting.play();

      
      //recreates channels array, and saves changes for the channel that was edited
      let tempChannels = [];
      iChannels.forEach((channel, i) => {

        if (id !== i){ tempChannels.push(channel);}
        else if(id == i){
          channel.title = document.getElementById("name").value;
          channel.logoUrl =  document.getElementById("logoUrl").value;
          channel.url = document.getElementById("url").value;
          tempChannels.push(channel);
        }
      });
      iChannels = tempChannels;
        
      //deletes previous storage item so there are no duplicates
      localStorage.removeItem('iChannels');
  
      //pushes it to storage
      localStorage.setItem('iChannels', JSON.stringify(iChannels));
    
      //loads main screen again
      $("#remBody").load("../options/editChannels.html",function(){})
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
      localStorage.removeItem('iChannels');

      editChannelsLoad();

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

