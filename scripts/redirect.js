//creates sound effects
var okMain = new Audio("soundEffects/okMain.mp3"); 
var okMain2 = new Audio("soundEffects/okMain.mp3"); 
var okSetting = new Audio("soundEffects/okSetting.mp3"); 
var okChannel = new Audio("soundEffects/okChannel.mp3"); 
var okChannel2 = new Audio("soundEffects/okChannel.mp3"); 
var backSetting = new Audio("soundEffects/backSetting.mp3"); 
var backMain = new Audio("soundEffects/backMain.mp3"); 
var backChannel = new Audio("soundEffects/backChannel.mp3"); 


//sets language and volume at the start of program
langChange();
volChange();



//controls the language, hides and shows elements of certain languages depending on 
//a settig value taken from local storage
function langChange(){



//if there is no setting yet (first program start)
if(localStorage.getItem("lang") == null){

  localStorage.setItem('lang', "EN");

  $('[lang="en"]').show();
  $('[lang="es"]').hide();
  $('[lang="jp"]').hide();
  $('[lang="ar"]').hide();
  $('[lang="fr"]').hide();
  $('[lang="gr"]').hide();
  $('[lang="ru"]').hide();
  $('[lang="ch"]').hide();

  //if page changes, makes sure language stays correct
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

//if program has already been started once before
else{


  //ENGLSIH
  if(localStorage.getItem("lang") === "EN"){

    $('[lang="en"]').show();
    $('[lang="es"]').hide();
    $('[lang="jp"]').hide();
    $('[lang="ar"]').hide();
    $('[lang="fr"]').hide();
    $('[lang="gr"]').hide();
    $('[lang="ru"]').hide();
    $('[lang="ch"]').hide();


    //if page changes, makes sure language stays correct
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
  //SPANISH
  else if(localStorage.getItem("lang") === "ES"){

    $('[lang="es"]').show();
    $('[lang="en"]').hide();
    $('[lang="jp"]').hide();
    $('[lang="ar"]').hide();
    $('[lang="fr"]').hide();
    $('[lang="gr"]').hide();
    $('[lang="ru"]').hide();
    $('[lang="ch"]').hide();

    //if page changes, makes sure language stays correct
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
  //FRENCH
  else if(localStorage.getItem("lang") === "FR"){

    $('[lang="es"]').hide();
    $('[lang="en"]').hide();
    $('[lang="jp"]').hide();
    $('[lang="ar"]').hide();
    $('[lang="fr"]').show();
    $('[lang="gr"]').hide();
    $('[lang="ru"]').hide();
    $('[lang="ch"]').hide();

    //if page changes, makes sure language stays correct
    $(document.body.firstChild).on('DOMSubtreeModified', function(){
      $('[lang="es"]').hide();
      $('[lang="en"]').hide();
      $('[lang="jp"]').hide();
      $('[lang="ar"]').hide();
      $('[lang="fr"]').show();
      $('[lang="gr"]').hide();
      $('[lang="ru"]').hide();
      $('[lang="ch"]').hide();
    });



  }
  //GERMAN
  else if(localStorage.getItem("lang") === "GR"){

    $('[lang="es"]').hide();
    $('[lang="en"]').hide();
    $('[lang="jp"]').hide();
    $('[lang="ar"]').hide();
    $('[lang="fr"]').hide();
    $('[lang="gr"]').show();
    $('[lang="ru"]').hide();
    $('[lang="ch"]').hide();

    //if page changes, makes sure language stays correct
    $(document.body.firstChild).on('DOMSubtreeModified', function(){
      $('[lang="es"]').hide();
      $('[lang="en"]').hide();
      $('[lang="jp"]').hide();
      $('[lang="ar"]').hide();
      $('[lang="fr"]').hide();
      $('[lang="gr"]').show();
      $('[lang="ru"]').hide();
      $('[lang="ch"]').hide();
    });



  }
  //ARABIC
  else if(localStorage.getItem("lang") === "AR"){

    $('[lang="es"]').hide();
    $('[lang="en"]').hide();
    $('[lang="jp"]').hide();
    $('[lang="ar"]').show();
    $('[lang="fr"]').hide();
    $('[lang="gr"]').hide();
    $('[lang="ru"]').hide();
    $('[lang="ch"]').hide();

    //if page changes, makes sure language stays correct
    $(document.body.firstChild).on('DOMSubtreeModified', function(){
      $('[lang="es"]').hide();
      $('[lang="en"]').hide();
      $('[lang="jp"]').hide();
      $('[lang="ar"]').show();
      $('[lang="fr"]').hide();
      $('[lang="gr"]').hide();
      $('[lang="ru"]').hide();
      $('[lang="ch"]').hide();
    });



  }
  //RUSSIAN
  else if(localStorage.getItem("lang") === "RU"){

    $('[lang="es"]').hide();
    $('[lang="en"]').hide();
    $('[lang="jp"]').hide();
    $('[lang="ar"]').hide();
    $('[lang="fr"]').hide();
    $('[lang="gr"]').hide();
    $('[lang="ru"]').show();
    $('[lang="ch"]').hide();

    //if page changes, makes sure language stays correct
    $(document.body.firstChild).on('DOMSubtreeModified', function(){
      $('[lang="es"]').hide();
      $('[lang="en"]').hide();
      $('[lang="jp"]').hide();
      $('[lang="ar"]').hide();
      $('[lang="fr"]').hide();
      $('[lang="gr"]').hide();
      $('[lang="ru"]').show();
      $('[lang="ch"]').hide();
    });



  }
  //CHINESE
  else if(localStorage.getItem("lang") === "CH"){

    $('[lang="es"]').hide();
    $('[lang="en"]').hide();
    $('[lang="jp"]').hide();
    $('[lang="ar"]').hide();
    $('[lang="fr"]').hide();
    $('[lang="gr"]').hide();
    $('[lang="ru"]').hide();
    $('[lang="ch"]').show();

    //if page changes, makes sure language stays correct
    $(document.body.firstChild).on('DOMSubtreeModified', function(){
      $('[lang="es"]').hide();
      $('[lang="en"]').hide();
      $('[lang="jp"]').hide();
      $('[lang="ar"]').hide();
      $('[lang="fr"]').hide();
      $('[lang="gr"]').hide();
      $('[lang="ru"]').hide();
      $('[lang="ch"]').show();
    });



  }
  //JAPANESE
  else if(localStorage.getItem("lang") === "JP"){

    $('[lang="es"]').hide();
    $('[lang="en"]').hide();
    $('[lang="jp"]').show();
    $('[lang="ar"]').hide();
    $('[lang="fr"]').hide();
    $('[lang="gr"]').hide();
    $('[lang="ru"]').hide();
    $('[lang="ch"]').hide();

    //if page changes, makes sure language stays correct
    $(document.body.firstChild).on('DOMSubtreeModified', function(){
      $('[lang="es"]').hide();
      $('[lang="en"]').hide();
      $('[lang="jp"]').show();
      $('[lang="ar"]').hide();
      $('[lang="fr"]').hide();
      $('[lang="gr"]').hide();
      $('[lang="ru"]').hide();
      $('[lang="ch"]').hide();
    });



  }



}


}



//controls the music, gets song url from local storage 
function musicChange(){


  //if music setting is null, sets it to default track
  if(localStorage.getItem("mus") == null){

    document.getElementById("bgMusic").src = "https://www.youtube.com/embed/5k3uAtQ8vlg?rel=0&autoplay=1&loop=1";
    localStorage.setItem('mus', "https://www.youtube.com/embed/5k3uAtQ8vlg");
  
  }
  //sets song url
  else{
    document.getElementById('bgMusic').src = localStorage.getItem("mus") + "?rel=0&autoplay=1&loop=1";
  }


}



//controls whether music is muted or not 
function muteChange(){

  //if music setting is null, sets it to unmmuted, otherwise it sets it via the user setting
  if(localStorage.getItem("mute") == null){
    localStorage.setItem("mute", "false");
    document.getElementById("bgMusic").src = document.getElementById("bgMusic").src.replace('&mute=1','');
  }
  else if(localStorage.getItem("mute") == "true"){
    document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";
  }
  else if(localStorage.getItem("mute") == "false"){
    document.getElementById("bgMusic").src = document.getElementById("bgMusic").src.replace('&mute=1','');
  }

}



//controls the volume for sound effects and channels, gets the values from local storage
function volChange(){


  //if setting is null, sets default sound effect volume
  if(localStorage.getItem("seVol") == null){
    
    localStorage.setItem('seVol', "1");
  
  }
  else{


    //sets volume for sound effects
    okMain.volume = parseFloat(localStorage.getItem("seVol"));  
    okMain2.volume = parseFloat(localStorage.getItem("seVol"));  
    okSetting.volume = parseFloat(localStorage.getItem("seVol"));  
    okChannel.volume = parseFloat(localStorage.getItem("seVol"));  
    okChannel2.volume = parseFloat(localStorage.getItem("seVol"));  
    backSetting.volume = parseFloat(localStorage.getItem("seVol"));  
    backMain.volume = parseFloat(localStorage.getItem("seVol"));  
    backChannel.volume = parseFloat(localStorage.getItem("seVol"));  
    

  }
  //if setting is null, sets default sound effect volume
  if(localStorage.getItem("cVol") == null){
    
    localStorage.setItem('cVol', "1");
  
  }
  

}

        

      
    
//controls all the buttons within the Add menu, recursively. 
function iAdd(idString){




  //loads add menu (add.html)
  $("#" + idString).load("../add/add.html",function(){

      
    //sets the ids for the body and html
    document.body.firstChild.id = "body";
    document.documentElement.id = "def"


    //OPTIONS BUTTON
    var elements = document.querySelectorAll("#options");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {


        //saves id and plays sound effect
        okSetting.play();
        var idString = document.body.firstChild.id;

    
        //loads options menu (options.html)
        iOptions(idString, 1);
    
    
    
      }); 

    }


    //BACK BUTTON
    var elements = document.querySelectorAll("#aBack");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {

        //saves id and plays sound effect
        backMain.play();
        var idString = document.body.firstChild.id;
    
        //loads main menu("base.html") and sets ids
        $("#" + idString).load("../base.html",function(){
            document.body.firstChild.id = "MainContainer";
            document.documentElement.id = "def"
        });
    
    
    
      }); 

    }
      

    //ADD PLAYLIST MENU BUTTON
    var elements = document.querySelectorAll("#aPlaylist");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {

        //saves id and plays sound effect
        var idString = document.body.firstChild.id;        
        okSetting.play();


        //loads add playlist menu (addPlaylist.html)
        $("#" + idString).load("../add/addPlaylist.html",function(){

          //sets ids
          document.body.firstChild.id = "def";
          document.body.firstChild.className = "";
          document.documentElement.id = "htmlSettings"



          //BACK BUTTON
          var elements = document.querySelectorAll("#addPBack");
          for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function() {

              //plays sound effect and saves id
              backSetting.play();
              var idString = document.body.firstChild.id;

              //loads add menu
              iAdd(idString);
          
            });
          }

        });
    
      });

    }



    //ADD CHANNEL MENU BUTTON
    var elements = document.querySelectorAll("#aChannel");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {

        //saves id and plays sound effect
        okSetting.play();
        var idString = document.body.firstChild.id;


        //loads add channels menu (addChannel.html)
        $("#" + idString).load("../add/addChannel.html",function(){


          //sets ids
          document.body.firstChild.id = "def";
          document.body.firstChild.className = "";
          document.documentElement.id = "htmlSettings"


          //BACK BUTTON
          var elements = document.querySelectorAll("#addCBack");
          for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function() {

              //plays sound effect and saves id
              backSetting.play();
              var idString = document.body.firstChild.id;
           
              //loads add menu (add.html)
              iAdd(idString);

            });
          }
        });
      });
    }
  });
}





//PLAY BUTTONS

function iPlay(idString){


  //loads play menu (play.html)
  $("#" + idString).load("../play/play.html",function(){


    //sets ids
    document.body.firstChild.id = "body";
    document.documentElement.id = ""
   

    //OPTIONS BUTTON
    var elements = document.querySelectorAll("#options");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {

        //saves id and plays sound effect
        okSetting.play()
        var idString = document.body.firstChild.id;

        //loads options menu (options.html)
        iOptions(idString, 2);

      }); 
    }



    //BACK BUTTON
    var elements = document.querySelectorAll("#pBack");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {

        //saves id and plays sound effect
        backMain.play();
        var idString = document.body.firstChild.id;

      
        //loads main menu (base.html)
        $("#" + idString).load("../base.html",function(){
          document.body.firstChild.id = "MainContainer";      
        });

      }); 
    }


    //PLAY PLAYLISTS MENU BUTTON
    var elements = document.querySelectorAll("#pPlaylist");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {


        //saves id and plays sound effect
        okMain2.play();
        var idString = document.body.firstChild.id;


        //loads play playlist menu (playPlaylist.html)
        $("#" + idString).load("../play/playPlaylist.html",function(){
      
          //sets ids
          document.body.firstChild.id = "def";
          document.body.firstChild.className = "playVid";

          //sets channel volume
          document.getElementById("curPlaying").volume = localStorage.getItem("cVol");
       

          //BACK BUTTON
          var elements = document.querySelectorAll("#backChannel");
          for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function() {


              //saves id and plays sound effect
              backSetting.play();
              var idString = document.body.firstChild.id;

              //if user is on choose playlist screen, loads play playlist menu (playPlaylist.html.html)
              if(document.getElementById("backPlaylist") == null){
                iPlay(idString);
              }

            })
          }


          //OPTIONS BUTTON
          var elements = document.querySelectorAll("#optionsChannel");
          for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function() {


              //saves id and plays sound effect
              okSetting.play();
              var idString = document.body.firstChild.id;


              //loads play options menu (options.html)
              iOptions(idString, 2);
      
            })
          }

        });

      });

    } 


    //PLAY CHANNEL MENU BUTTON
    var elements = document.querySelectorAll("#pChannel");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {

        //saves id and plays sound effect
        okMain2.play();
        var idString = document.body.firstChild.id;


        //loads play channel menu (playChannel.html)
        $("#" + idString).load("../play/playChannel.html",function(){
    

          //sets channel volume
          document.getElementById("curPlaying").volume = localStorage.getItem("cVol");
       

          //sets ids
          document.body.firstChild.id = "def";
          document.body.firstChild.className = "playVid";


          //BACK BUTTON
          var elements = document.querySelectorAll("#backChannel");
          for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function() {


              //saves id and plays sound effect
              backSetting.play();
              var idString = document.body.firstChild.id;


              //loads play menu (play.html)
              iPlay(idString);
         

            })

          }


          //OPTIONS BUTTON
          var elements = document.querySelectorAll("#optionsChannel");
          for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function() {


              //saves id and plays sound effect
              okSetting.play();
              var idString = document.body.firstChild.id;

              //loads options menu (options.html)
              iOptions(idString, 2);

        
            })
          }

    
        });

      });

    }
    
  });


}






//OPTIONS

function iOptions(idString, mode){

  var idString = document.body.firstChild.id;


  //loads options menu (options.html)
  $("#" + idString).load("../options/options.html",function(){

      //sets ids
      document.body.firstChild.id = "def";
      document.body.firstChild.className = "";
      document.documentElement.id = "htmlSettings"


      //MUSIC MENU BUTTON
      var elements = document.querySelectorAll("#mus");
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function() {


          //saves id and plays sound effect
          okSetting.play();
          var idString = document.body.firstChild.id;


          //loads music menu music.html)
          $("#" + idString).load("../options/music.html",function(){

            if(localStorage.getItem("mute") == "false"){
              document.getElementById("muteButton").checked = true;
            }
            else if(localStorage.getItem("mute") == "true"){ 
              document.getElementById("muteButton").checked = false;  
            }
          

            //BACK BUTTON
            var elements = document.querySelectorAll("#settingBack");
            var song = localStorage.getItem('mus');
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {


                //saves id and plays sound effect
                backSetting.play();
                var idString = document.body.firstChild.id;


                if(!(document.getElementById("url").value === "") && document.getElementById("url").value != song){
                  localStorage.setItem('mus', document.getElementById("url").value);
                  musicChange();
                }


                //loads options menu (options.html)
                iOptions(idString, mode);

              })

            }   


            //MUTE BUTTON
            var elements = document.querySelectorAll("#muteButton");
            document.getElementById("url").value = localStorage.getItem('mus');
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
            

                //plays sound effect
                okSetting.play();


                if(localStorage.getItem("mute") == "false"){
                  localStorage.setItem("mute", "true")
                  document.getElementById("bgMusic").src = document.getElementById("bgMusic").src + "&mute=1";
                }

                else if(localStorage.getItem("mute") == "true"){
                  localStorage.setItem("mute", "false")
                  document.getElementById("bgMusic").src = document.getElementById("bgMusic").src.replace('&mute=1',''); 
                }

              })
            }   
          })
        })
      } 




      //VOLUME MENU BUTTON
      var elements = document.querySelectorAll("#vol");
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function() {


          //saves id and plays sound effect
          okSetting.play();
          var idString = document.body.firstChild.id;

          //loads volume menu (volume.html)
          $("#" + idString).load("../options/volume.html",function(){


            //Controls sound effect volume
            document.getElementById("sVol").value = localStorage.getItem("seVol") * 100;
            document.getElementById("sVol").addEventListener("change", function() {
            
              okSetting.play();
              okMain.volume = document.getElementById("sVol").value / 100;  
              okSetting.volume = document.getElementById("sVol").value / 100;  
              okChannel.volume = document.getElementById("sVol").value / 100;  
              okChannel2.volume = document.getElementById("sVol").value / 100;  
              backSetting.volume = document.getElementById("sVol").value / 100;  
              backMain.volume = document.getElementById("sVol").value / 100;  
              backChannel.volume = document.getElementById("sVol").value / 100;  

            })


            //Controls channel volume
            document.getElementById("cVol").value = localStorage.getItem("cVol") * 100;
            document.getElementById("cVol").addEventListener("change", function() {
            
              okSetting.play();            
              localStorage.setItem('cVol', document.getElementById("cVol").value / 100);
              
            })



            //BACK BUTTON
            var elements = document.querySelectorAll("#settingBack");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {


                //saves id and plays sound effect
                backSetting.play();
                var idString = document.body.firstChild.id;

                localStorage.setItem("seVol",  document.getElementById("sVol").value / 100);
                iOptions(idString, mode);

              })
            }
          
          })

        })

      }





      //REMOVE CHANNEL MENU BUTTON
      var elements = document.querySelectorAll("#remCh");
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function() {


          //saves id and plays sound effect
          okSetting.play();
          var idString = document.body.firstChild.id;


          //loads remove channels menu (removeChannels.html)
          $("#" + idString).load("../options/removeChannels.html",function(){

            document.body.firstChild.id = "remBody";


            //BACK BUTTON
            var elements = document.querySelectorAll("#settingBack");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {

                //saves id and plays sound effect
                backSetting.play();
                var idString = document.body.firstChild.id;

                iOptions(idString, mode);

              })
            }

          })

        })
      }



      //REMOVE PLAYLIST MENU BUTTON
      var elements = document.querySelectorAll("#remPl");
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function() {

          //saves id and plays sound effect
          okSetting.play();
          var idString = document.body.firstChild.id;


          //loads remove channels menu (removeChannels.html)
          $("#" + idString).load("../options/removePlaylists.html",function(){

            document.body.firstChild.id = "remBody";


            //BACK BUTTON
            var elements = document.querySelectorAll("#settingBack");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {

                //saves id and plays sound effect
                backSetting.play();
                var idString = document.body.firstChild.id;

                iOptions(idString, mode);

              })
            }

          })

        })
      }



      //LANGUAGE MENU BUTTON
      var elements = document.querySelectorAll("#lang");
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function() {


          //saves id and plays sound effect
          okSetting.play();
          var idString = document.body.firstChild.id;


          //loads remove language menu (language.html)
          $("#" + idString).load("../options/language.html",function(){


            //ENGLISH BUTTON
            var elements = document.querySelectorAll("#EN");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
            
                okSetting.play();
                localStorage.setItem('lang', "EN");
                langChange();

              })

            }

            //SPANISH BUTTON
            var elements = document.querySelectorAll("#ES");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
            
                okSetting.play();
                localStorage.setItem('lang', "ES");
                langChange();

              })

            }

            //FRENCH BUTTON
            var elements = document.querySelectorAll("#FR");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
            
                okSetting.play();
                localStorage.setItem('lang', "FR");
                langChange();

              })

            }

            //GERMAN BUTTON
            var elements = document.querySelectorAll("#GR");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
            
                okSetting.play();
                localStorage.setItem('lang', "GR");
                langChange();

              })

            }

            //ARABIC BUTTON
            var elements = document.querySelectorAll("#AR");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
                    
                okSetting.play();
                localStorage.setItem('lang', "AR");
                langChange();
        
              })
        
            }

            //RUSSIAN BUTTON
            var elements = document.querySelectorAll("#RU");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
            
                okSetting.play();
                localStorage.setItem('lang', "RU");
                langChange();

              })

            }

            //CHINESE BUTTON
            var elements = document.querySelectorAll("#CH");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
            
                okSetting.play();
                localStorage.setItem('lang', "CH");
                langChange();

              })

            }

            //JAPANESE BUTTON
            var elements = document.querySelectorAll("#JP");
            for (var i = 0; i < elements.length; i++) {
              elements[i].addEventListener("click", function() {
            
                okSetting.play();
                localStorage.setItem('lang', "JP");
                langChange();

              })

            }

            //BACK BUTTON
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




    //BACK BUTTON
    var elements = document.querySelectorAll("#settingBack");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function() {


        //saves id
        var idString = document.body.firstChild.id;


        if (mode == 0){

          //saves id and plays sound effect
          backMain.play();
          var idString = document.body.firstChild.id;
    

          //loads mein menu (base.html)
          $("#" + idString).load("../base.html",function(){
            //sets ids
            document.body.firstChild.id = "MainContainer";
            document.documentElement.id = "def"
          });

        }
        else if (mode == 1){

          //plays sound effect and reloads add menu
          backSetting.play();
          iAdd(idString);

        }
        else if (mode == 2){

          //plays sound effect and reloads play menu
          iPlay(idString);
          backSetting.play();

        }

        
      })
    }

  });

}






//INDEX BUTTONS


//PLAY
var elements = document.querySelectorAll("#iPlay");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {


    //saves id and plays sound effect
    okMain.play();
    var idString = document.body.firstChild.id;


    //loads play menu (play.html)
    iPlay(idString);


  });
}


//ADD
var elements = document.querySelectorAll("#iAdd");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

    //saves id and plays sound effect
    okMain.play();
    var idString = document.body.firstChild.id;


    //loads add menu (add.html)
    iAdd(idString);


  });
}


//OPTIONS
var elements = document.querySelectorAll("#options");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function() {

    //saves id and plays sound effect
    okMain.play();
    var idString = document.body.firstChild.id;

    
    //loads options menu (options.html)
    iOptions(idString, 0);


  }); 
}
  


document.addEventListener("keydown", function(e){

  if (e.key == 'Tab') {

  }

})



//controls the gamepad controls
var i = 1; 
window.addEventListener("gamepadconnected", function(e) {
  var gp = navigator.getGamepads()[e.gamepad.index];
  console.log("A " + gp.id + " was successfully detected!");

  setInterval(function(){

    // ===> Get a fresh GamepadList! <===
    var gp = navigator.getGamepads()[e.gamepad.index];

    

    if(gp.buttons[1].pressed == true){

   
      console.log("pressed");


      document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Tab'}));

    }
  
  }, 100)
});




