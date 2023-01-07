//array of individual channels
var iChannels = JSON.parse(localStorage.getItem("iChannels"));

if (iChannels == null){
  iChannels = [];
}



//channel object that stores channel metadata
function channel() {
  return {
    
      title: "",
      logoUrl: "",
      url: "",
      pgNmbr: 0
     
  }; 
};



//adds channel
var elements = document.querySelectorAll("#okay");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
  
  okSetting.play();
  //creates and sets variables of channel to be pushed
  tempChannel = new channel();
  tempChannel.title = document.getElementById("name").value;
  
  tempChannel.logoUrl =  document.getElementById("logoUrl").value;
    
  tempChannel.url = document.getElementById("url").value;
  
  
  if(!(tempChannel.url === "" || tempChannel.title === "")){
    //pushes channel to array
    iChannels.push(tempChannel);
    document.getElementById("mform").reset();

  }
      
});
  
}

var elements = document.querySelectorAll("#addCBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {


    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('iChannels');

    //pushes it to storage
    localStorage.setItem('iChannels', JSON.stringify(iChannels));
    
  });

}




 