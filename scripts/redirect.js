

//INDEX BUTTONS
document.getElementById("iPlay").addEventListener("click", function() {

    var idString = document.body.firstChild.id;

    $("#" + idString).load("../play/play.html",function(){
        document.body.firstChild.id = "body";
        document.documentElement.id = ""


      //ADD BUTTONS
      document.getElementById("options").addEventListener("click", function() {


        var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../options/options.html",function(){
            document.body.firstChild.id = "";
            document.documentElement.id = "htmlSettings"
        });
    
    
    
      }); 



      document.getElementById("pBack").addEventListener("click", function() {


        var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../base.html",function(){
            document.body.firstChild.id = "MainContainer";
            document.documentElement.id = ""
        });
    
    
    
      }); 


    document.getElementById("pPlaylist").addEventListener("click", function() {

        var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../play/playPlaylist.html",function(){
            document.body.firstChild.id = "";
            document.body.firstChild.className = "playVid";
            document.documentElement.id = ""
        });
    
    });

    document.getElementById("pChannel").addEventListener("click", function() {

      var idString = document.body.firstChild.id;
  
      $("#" + idString).load("../play/playChannel.html",function(){
          document.body.firstChild.id = "";
          document.body.firstChild.className = "playVid";
          document.documentElement.id = ""
      });
  
  });


        
    });

  });


  


document.getElementById("iAdd").addEventListener("click", function() {

    var idString = document.body.firstChild.id;

    $("#" + idString).load("../add/add.html",function(){

        document.body.firstChild.id = "body";
        document.documentElement.id = ""




    
        //ADD BUTTONS
        document.getElementById("options").addEventListener("click", function() {


            var idString = document.body.firstChild.id;
        
            $("#" + idString).load("../options/options.html",function(){
                document.body.firstChild.id = "";
                document.documentElement.id = "htmlSettings"
            });
        
        
        
          }); 



          document.getElementById("aBack").addEventListener("click", function() {


            var idString = document.body.firstChild.id;
        
            $("#" + idString).load("../base.html",function(){
                document.body.firstChild.id = "MainContainer";
                document.documentElement.id = ""
            });
        
        
        
          }); 


        document.getElementById("aPlaylist").addEventListener("click", function() {

            var idString = document.body.firstChild.id;
        
            $("#" + idString).load("../add/addPlaylist.html",function(){
                document.body.firstChild.id = "";
                document.documentElement.id = "htmlSettings"
            });
        
        });


        document.getElementById("aChannel").addEventListener("click", function() {

            var idString = document.body.firstChild.id;

            $("#" + idString).load("../add/addChannel.html",function(){
            document.body.firstChild.id = "";
            document.documentElement.id = "htmlSettings"


        });


          
        
        
        





    });





    });

  });







  //options
  document.getElementById("options").addEventListener("click", function() {


    var idString = document.body.firstChild.id;

    $("#" + idString).load("../options/options.html",function(){
        document.body.firstChild.id = "";
        document.documentElement.id = "htmlSettings"
    });



  }); 

  



























//PLAY BUTTONS


