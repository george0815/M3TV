
function iAdd(idString){


  $("#" + idString).load("../add/add.html",function(){

      

    document.body.firstChild.id = "body";
    document.documentElement.id = "def"



    

    //ADD BUTTONS
    document.getElementById("options").addEventListener("click", function() {


        var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../options/options.html",function(){
            document.body.firstChild.id = "def";
            document.documentElement.id = "htmlSettings"
        });
    
    
    
      }); 



      document.getElementById("aBack").addEventListener("click", function() {


        var idString = document.body.firstChild.id;
    
        $("#" + idString).load("../base.html",function(){
            document.body.firstChild.id = "MainContainer";
            document.documentElement.id = "def"
        });
    
    
    
      }); 


      

    document.getElementById("aPlaylist").addEventListener("click", function() {

        var idString = document.body.firstChild.id;

        
    
        $("#" + idString).load("../add/addPlaylist.html",function(){
            document.body.firstChild.id = "def";
            document.documentElement.id = "htmlSettings"



            
            
            document.getElementById("addPBack").addEventListener("click", function() {

              var idString = document.body.firstChild.id;


              

              console.log(idString);
              iAdd(idString);
          
              

          });

          







        });
    
    });


    document.getElementById("aChannel").addEventListener("click", function() {

        var idString = document.body.firstChild.id;

        $("#" + idString).load("../add/addChannel.html",function(){
        document.body.firstChild.id = "def";
        document.documentElement.id = "htmlSettings"




        document.getElementById("addCBack").addEventListener("click", function() {

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
   


  //PLAY BUTTONS
  document.getElementById("options").addEventListener("click", function() {


    var idString = document.body.firstChild.id;

    $("#" + idString).load("../options/options.html",function(){
        document.body.firstChild.id = "def";
        document.documentElement.id = "htmlSettings"
    });



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


              

              console.log(idString);
              iPlay(idString);
          

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

      
  });

});


    
});


}





//INDEX BUTTONS
document.getElementById("iPlay").addEventListener("click", function() {

    var idString = document.body.firstChild.id;
    console.log(idString);


    iPlay(idString);
    

  });

/*BJBUB*/ 
  


document.getElementById("iAdd").addEventListener("click", function() {


    var idString = document.body.firstChild.id;
    console.log(idString);


    iAdd(idString);


  });







  //options
  document.getElementById("options").addEventListener("click", function() {


    var idString = document.body.firstChild.id;

    $("#" + idString).load("../options/options.html",function(){
        document.body.firstChild.id = "def";
        document.documentElement.id = "htmlSettings"
    });



  }); 

  



























//PLAY BUTTONS


