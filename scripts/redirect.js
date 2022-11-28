//creates sound effects
var okMain = new Audio("soundEffects/okMain.mp3"); 
var okSetting = new Audio("soundEffects/okSetting.mp3"); 
var okChannel = new Audio("soundEffects/okChannel.mp3"); 
var backSetting = new Audio("soundEffects/backSetting.mp3"); 
var backMain = new Audio("soundEffects/backMain.mp3"); 
var backChannel = new Audio("soundEffects/backChannel.mp3"); 

        
/*okMain.play();  
okSetting.play();  
okChannel.play();  
backSetting.play();  
backMain.play();  
backChannel.play();  */
      
    

function iAdd(idString){


  $("#" + idString).load("../add/add.html",function(){

      
    
    document.body.firstChild.id = "body";
    document.documentElement.id = "def"



    

    //ADD BUTTONS
    document.getElementById("options").addEventListener("click", function() {


      var idString = document.body.firstChild.id;

    
      iOptions(idString, 1);
    
    
    
      }); 



      document.getElementById("aBack").addEventListener("click", function() {

        backMain.play();
        var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../base.html",function(){
            document.body.firstChild.id = "MainContainer";
            document.documentElement.id = "def"
        });
    
    
    
      }); 


      

    document.getElementById("aPlaylist").addEventListener("click", function() {

        var idString = document.body.firstChild.id;

        
        okSetting.play();
        $("#" + idString).load("../add/addPlaylist.html",function(){
            document.body.firstChild.id = "def";
            document.body.firstChild.className = "";
            document.documentElement.id = "htmlSettings"



            
            
            document.getElementById("addPBack").addEventListener("click", function() {
              backSetting.play();
              var idString = document.body.firstChild.id;

novejbugvbrebgurebugbruibuib
              

              console.log(idString);
              iAdd(idString);
          
              

          });

          







        });
    
    });


    document.getElementById("aChannel").addEventListener("click", function() {
      okSetting.play();

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../add/addChannel.html",function(){
        document.body.firstChild.id = "def";
        document.body.firstChild.className = "";
        document.documentElement.id = "htmlSettings"




        document.getElementById("addCBack").addEventListener("click", function() {
          backSetting.play();

          var idString = document.body.firstChild.id;


              

              console.log(idString);
              iAdd(idString);

      });


    });


      
    
    
    





});





});


}


function iPlay(idString){


  $("#" + idString).load("../play/play.html",function(){


    document.body.firstChild.id = "body";
    document.documentElement.id = ""
   


  //PLAY BUTTONS
  document.getElementById("options").addEventListener("click", function() {


    var idString = document.body.firstChild.id;

    
    iOptions(idString, 2);



  }); 



  document.getElementById("pBack").addEventListener("click", function() {


    var idString = document.body.firstChild.id;

      

    $("#" + idString).load("../base.html",function(){
        document.body.firstChild.id = "MainContainer";
        
    });



  }); 


document.getElementById("pPlaylist").addEventListener("click", function() {

    var idString = document.body.firstChild.id;

    $("#" + idString).load("../play/playPlaylist.html",function(){
     
        document.body.firstChild.id = "def";
        document.body.firstChild.className = "playVid";
       


        document.getElementById("backChannel").addEventListener("click", function(){


         var idString = document.body.firstChild.id;


              

              

              if(document.getElementById("backPlaylist") == null){

                console.log(  document.getElementById("backChannel").id);
              iPlay(idString);
              }



        })


        document.getElementById("optionsChannel").addEventListener("click", function(){


          var idString = document.body.firstChild.id;

    
          iOptions(idString, 2);
      
           
 
         })



    });

});

document.getElementById("pChannel").addEventListener("click", function() {

  var idString = document.body.firstChild.id;

  $("#" + idString).load("../play/playChannel.html",function(){
    
      document.body.firstChild.id = "def";
      
      document.body.firstChild.className = "playVid";

      document.getElementById("backChannel").addEventListener("click", function(){


        var idString = document.body.firstChild.id;


             

             console.log(idString);
             iPlay(idString);
         

       })

       document.getElementById("optionsChannel").addEventListener("click", function(){


        var idString = document.body.firstChild.id;

    
        iOptions(idString, 2);

         

       })






       

      
  });

});


    
});


}

function iOptions(idString, mode){

  var idString = document.body.firstChild.id;

  $("#" + idString).load("../options/options.html",function(){
      document.body.firstChild.id = "def";
      document.body.firstChild.className = "";
      document.documentElement.id = "htmlSettings"




      document.getElementById("mus").addEventListener("click", function() {

    


        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/music.html",function(){


          document.getElementById("settingBack").addEventListener("click", function() {

            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })

          

        })

      })

      document.getElementById("vol").addEventListener("click", function() {



        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/volume.html",function(){


          document.getElementById("settingBack").addEventListener("click", function() {

            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })

          

        })

      })

      document.getElementById("remCh").addEventListener("click", function() {

        

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/removeChannels.html",function(){

          document.body.firstChild.id = "remBody";

          document.getElementById("settingBack").addEventListener("click", function() {

            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })

          

        })

      })

      document.getElementById("remPl").addEventListener("click", function() {


       

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/removePlaylists.html",function(){

          document.body.firstChild.id = "remBody";

          document.getElementById("settingBack").addEventListener("click", function() {

            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })

          

        })


      })

      document.getElementById("lang").addEventListener("click", function() {


        

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/language.html",function(){


          document.getElementById("settingBack").addEventListener("click", function() {

            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })

          

        })


      })


      document.getElementById("settingBack").addEventListener("click", function() {

        var idString = document.body.firstChild.id;


        if (mode == 0){
          
          var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../base.html",function(){
            document.body.firstChild.id = "MainContainer";
            document.documentElement.id = "def"
        });

        }
        else if (mode == 1){

          iAdd(idString);

        }
        else if (mode == 2){
          iPlay(idString);
        }

        
      })




  });

}



//INDEX BUTTONS
document.getElementById("iPlay").addEventListener("click", function() {

    var idString = document.body.firstChild.id;
    console.log(idString);


    iPlay(idString);
    

  });


  


document.getElementById("iAdd").addEventListener("click", function() {


    var idString = document.body.firstChild.id;
    console.log(idString);


    iAdd(idString);


  });







  //options
  document.getElementById("options").addEventListener("click", function() {


    var idString = document.body.firstChild.id;

    
    iOptions(idString, 0);


  }); 

  



























//PLAY BUTTONS


