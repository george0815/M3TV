
//array of individual channels
var iChannels = [];


iChannels = JSON.parse(localStorage.getItem("iChannels"));
//channel object that stores channel metadata
function channel() {
  return {
    
      title: "",
      desc: "",
      url: ""
     
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
  
    tempChannel.desc =  document.getElementById("desc").value;
    
    tempChannel.url = document.getElementById("url").value;
  
  
    //pushes channel to array
    iChannels.push(tempChannel);
    document.getElementById("mform").reset();
      
  });
  





  //pushes channels array to local storage
  document.getElementById("backAC").addEventListener("click", () => {


    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('iChannels');

    //pushes it to storage
    localStorage.setItem('iChannels', JSON.stringify(iChannels));
    
  });

  


   



 