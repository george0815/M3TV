
//array of individual channels
var iChannels = [];


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

function addChannel(){
  document.getElementById("okay").addEventListener("click", () => {
  
    tempChannel = new channel();
    tempChannel.title = document.getElementById("name").value;
  
    tempChannel.desc =  document.getElementById("desc").value;
    
    tempChannel.url = document.getElementById("url").value;
  
  
    iChannels.push(tempChannel);
    document.getElementById("mform").reset();
      
  });
  

}

  function push(){

  //push channels to local storage
  document.getElementById("backAC").addEventListener("click", () => {


    //deletes previous storage item so there are no duplicates
    localStorage.removeItem('iChannels');

    //pushes it to storage
    localStorage.setItem('iChannels', JSON.stringify(iChannels));
    
  });

  }


   //play
   function playC(url){

    console.log("few");
    document.getElementById('curPlaying').style.display='block';
    //document.getElementById('currentChannel').setAttribute('src', url);


  }
  //loads channels
  function loadChannels(){


    iChannels = JSON.parse(localStorage.getItem("iChannels"));

    iChannels.forEach(channel => {
       

      
      const ch = document.createElement("button");
      ch.innerHTML = channel.title;

      var tempString = 'playC(' + '\'' + channel.url + '\'' + ")";
      ch.onclick = playC(channel.url);
      document.body.appendChild(ch);
      console.log(tempString);
   
      

    });

    document.getElementById('curPlaying').style.display='none';

  };



 