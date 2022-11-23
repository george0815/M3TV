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



//gamepad test
window.addEventListener("gamepadconnected", function(e) {
    const gp = navigator.getGamepads()[e.gamepad.index];
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      gp.index, gp.id,
      gp.buttons.length, gp.axes.length);
  });


//adds channel
  document.getElementById("okay").addEventListener("click", () => {
  
   
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
  





  //pushes channels array to local storage
  document.getElementById("addCBack").addEventListener("click", () => {


    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('iChannels');

    //pushes it to storage
    localStorage.setItem('iChannels', JSON.stringify(iChannels));
    
  });

  


  



 