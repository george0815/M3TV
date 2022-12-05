
if(localStorage.getItem("lang") == null){

  localStorage.setItem('lang', "EN");

}
else{

  if(localStorage.getItem("lang") === "EN"){

    $('[lang="en"]').show();
    $('[lang="es"]').hide();
  $('[lang="jp"]').hide();
  $('[lang="ar"]').hide();
  $('[lang="fr"]').hide();
  $('[lang="gr"]').hide();
  $('[lang="ru"]').hide();
  $('[lang="ch"]').hide();


  $(document.body.firstChild).on('DOMSubtreeModified', function(){
    $('[lang="en"]').show();
    $('[lang="es"]').hide();
  $('[lang="jp"]').hide();
  $('[lang="ar"]').hide();
  $('[lang="fr"]').hide();
  $('[lang="gr"]').hide();
  $('[lang="ru"]').hide();
  $('[lang="ch"]').hide();
  });

  }
  else if(localStorage.getItem("lang") === "ES"){

    $('[lang="es"]').show();
    $('[lang="en"]').hide();
  $('[lang="jp"]').hide();
  $('[lang="ar"]').hide();
  $('[lang="fr"]').hide();
  $('[lang="gr"]').hide();
  $('[lang="ru"]').hide();
  $('[lang="ch"]').hide();


  $(document.body.firstChild).on('DOMSubtreeModified', function(){
    $('[lang="es"]').show();
    $('[lang="en"]').hide();
  $('[lang="jp"]').hide();
  $('[lang="ar"]').hide();
  $('[lang="fr"]').hide();
  $('[lang="gr"]').hide();
  $('[lang="ru"]').hide();
  $('[lang="ch"]').hide();
  });



  }



}









//creates sound effects
var okMain = new Audio("soundEffects/okMain.mp3"); 
var okMain2 = new Audio("soundEffects/okMain.mp3"); 
var okSetting = new Audio("soundEffects/okSetting.mp3"); 
var okChannel = new Audio("soundEffects/okChannel.mp3"); 
var okChannel2 = new Audio("soundEffects/okChannel.mp3"); 
var backSetting = new Audio("soundEffects/backSetting.mp3"); 
var backMain = new Audio("soundEffects/backMain.mp3"); 
var backChannel = new Audio("soundEffects/backChannel.mp3"); 

        

      
    

function iAdd(idString){


  $("#" + idString).load("../add/add.html",function(){

      
    
    document.body.firstChild.id = "body";
    document.documentElement.id = "def"



    

    //ADD BUTTONS
    var elements = document.querySelectorAll("#options");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

      okSetting.play();
      var idString = document.body.firstChild.id;

    
      iOptions(idString, 1);
    
    
    
      }); 

    }



    var elements = document.querySelectorAll("#aBack");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {

        backMain.play();
        var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../base.html",function(){
            document.body.firstChild.id = "MainContainer";
            document.documentElement.id = "def"
        });
    
    
    
      }); 

    }
      

    var elements = document.querySelectorAll("#aPlaylist");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

        var idString = document.body.firstChild.id;

        
        okSetting.play();
        $("#" + idString).load("../add/addPlaylist.html",function(){
            document.body.firstChild.id = "def";
            document.body.firstChild.className = "";
            document.documentElement.id = "htmlSettings"



            
            
            var elements = document.querySelectorAll("#addPBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
              backSetting.play();
              var idString = document.body.firstChild.id;



              console.log(idString);
              iAdd(idString);
          
              

          });
        }

          







        });
    
    });

  }


  var elements = document.querySelectorAll("#aChannel");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function() {
      okSetting.play();

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../add/addChannel.html",function(){
        document.body.firstChild.id = "def";
        document.body.firstChild.className = "";
        document.documentElement.id = "htmlSettings"




        var elements = document.querySelectorAll("#addCBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
          backSetting.play();

          var idString = document.body.firstChild.id;


              

              console.log(idString);
              iAdd(idString);

      });
    }


    });

  
      
    
    
    





});


  }


});


}


function iPlay(idString){


  $("#" + idString).load("../play/play.html",function(){


    document.body.firstChild.id = "body";
    document.documentElement.id = ""
   


  //PLAY BUTTONS
  var elements = document.querySelectorAll("#options");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

    okSetting.play()
    var idString = document.body.firstChild.id;

    
    iOptions(idString, 2);



  }); 
}



var elements = document.querySelectorAll("#pBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

    backMain.play();
    var idString = document.body.firstChild.id;

      

    $("#" + idString).load("../base.html",function(){
        document.body.firstChild.id = "MainContainer";
        
    });



  }); 
  }



  var elements = document.querySelectorAll("#pPlaylist");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function() {
  okMain2.play();
    var idString = document.body.firstChild.id;

    $("#" + idString).load("../play/playPlaylist.html",function(){
      
        document.body.firstChild.id = "def";
        document.body.firstChild.className = "playVid";
       


        var elements = document.querySelectorAll("#backChannel");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
          backSetting.play();

         var idString = document.body.firstChild.id;


              

              

              if(document.getElementById("backPlaylist") == null){

                console.log(  document.getElementById("backChannel").id);
              iPlay(idString);
              }



        })
      }


      var elements = document.querySelectorAll("#optionsChannel");
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function() {

          okSetting.play();
          var idString = document.body.firstChild.id;

    
          iOptions(idString, 2);
      
           
 
         })
        }



    });

});

  }

  var elements = document.querySelectorAll("#pChannel");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function() {
  okMain2.play();
  var idString = document.body.firstChild.id;

  $("#" + idString).load("../play/playChannel.html",function(){
    
      document.body.firstChild.id = "def";
      
      document.body.firstChild.className = "playVid";

      var elements = document.querySelectorAll("#backChannel");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
        backSetting.play();

        var idString = document.body.firstChild.id;


             

             console.log(idString);
             iPlay(idString);
         

       })

      }

      var elements = document.querySelectorAll("#optionsChannel");
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function() {

        okSetting.play();
        var idString = document.body.firstChild.id;

    
        iOptions(idString, 2);

         

       })
      }






       

      
  });

});

}
    
});


}

function iOptions(idString, mode){

  var idString = document.body.firstChild.id;

  $("#" + idString).load("../options/options.html",function(){
      document.body.firstChild.id = "def";
      document.body.firstChild.className = "";
      document.documentElement.id = "htmlSettings"




      var elements = document.querySelectorAll("#mus");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
        okSetting.play();
    


        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/music.html",function(){


          var elements = document.querySelectorAll("#settingBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            backSetting.play();
            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })

        }

          

        })

      })

    }

    var elements = document.querySelectorAll("#vol");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {
        okSetting.play();


        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/volume.html",function(){


          var elements = document.querySelectorAll("#settingBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            backSetting.play();
            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })
        }
          

        })

      })

    }

    var elements = document.querySelectorAll("#remCh");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {
        okSetting.play();
        

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/removeChannels.html",function(){

          document.body.firstChild.id = "remBody";

          var elements = document.querySelectorAll("#settingBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            backSetting.play();
            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })
        }

          

        })

      })
    }

    var elements = document.querySelectorAll("#remPl");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {
        okSetting.play();

       

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/removePlaylists.html",function(){

          document.body.firstChild.id = "remBody";

          var elements = document.querySelectorAll("#settingBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            backSetting.play();
            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })
        }

          

        })


      })
    }

    var elements = document.querySelectorAll("#lang");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {
        okSetting.play();

        

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../options/language.html",function(){



          var elements = document.querySelectorAll("#EN");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            
okSetting.play();
    localStorage.setItem('lang', "EN");


          })

        }

var elements = document.querySelectorAll("#ES");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            
okSetting.play();
    localStorage.setItem('lang', "ES");


          })

        }



        var elements = document.querySelectorAll("#FR");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            
okSetting.play();
    localStorage.setItem('lang', "FR");


          })

        }


        var elements = document.querySelectorAll("#GR");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            
okSetting.play();
    localStorage.setItem('lang', "GR");


          })

        }

        var elements = document.querySelectorAll("#AR");
        for (var i = 0; i < elements.length; i++) {
          elements[i].addEventListener("click", function() {
                    
        okSetting.play();
            localStorage.setItem('lang', "AR");
        
        
                  })
        
                }


                var elements = document.querySelectorAll("#RU");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            
okSetting.play();
    localStorage.setItem('lang', "RU");


          })

        }


        var elements = document.querySelectorAll("#CH");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            
okSetting.play();
    localStorage.setItem('lang', "CH");


          })

        }


        var elements = document.querySelectorAll("#JP");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            
okSetting.play();
    localStorage.setItem('lang', "JP");


          })

        }






          var elements = document.querySelectorAll("#settingBack");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {
            backSetting.play();
            var idString = document.body.firstChild.id;

            iOptions(idString, mode);
          })

        }

          

        })


      })
    }


    var elements = document.querySelectorAll("#settingBack");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {


        var idString = document.body.firstChild.id;


        if (mode == 0){
          backMain.play();
          var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../base.html",function(){
            document.body.firstChild.id = "MainContainer";
            document.documentElement.id = "def"
        });

        }
        else if (mode == 1){

          backSetting.play();
          iAdd(idString);

        }
        else if (mode == 2){
          iPlay(idString);
          backSetting.play();
        }

        
      })
    }




  });

}



//INDEX BUTTONS
var elements = document.querySelectorAll("#iPlay");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {


    okMain.play();
    var idString = document.body.firstChild.id;
    console.log(idString);


    iPlay(idString);


  });
}


  


var elements = document.querySelectorAll("#iAdd");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

    okMain.play();
    var idString = document.body.firstChild.id;
    console.log(idString);


    iAdd(idString);


  });
}






  //options
  var elements = document.querySelectorAll("#options");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

    okMain.play();
    var idString = document.body.firstChild.id;

    
    iOptions(idString, 0);


  }); 
}
  