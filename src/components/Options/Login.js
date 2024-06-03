import {React, useContext, useEffect} from 'react'; //react
import { translations } from '../../misc/translations';
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils.js';

//firebase
import {createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../utils";
import { StreamsContext } from '../../App';


function Login(){


//=====================================STATE==========================//

  //global settings
  const {settings, setSettings} = useContext(SettingsContext);


  //global streams
  const {streams, setStreams} = useContext(StreamsContext);


//===================================FUNCTIONS=========================//

//registers new users
function register(){
    

    //get inputs from fields
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    

    //if both inputted passwords match, attempt to sign up user
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          
          //set loggedIn local storage value to true and go to main page
          setSettings({...settings, loggedIn: true, user: user});

        })
        .catch((error) => {

          switch (error.code) {
            case 'auth/email-already-in-use':
              login();
              break;
            default:
              //display error alert
              window.alert("Error: " + error.message + "\nCode: " + error.code);
              break;
          }
          

        });
    
  }



  //logs in user
  function login(){

    //get inputs from fields
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


   signInWithEmailAndPassword(auth, email, password)
     .then((userCredential) => {
       
       //set loggedIn local storage value to true and go to main page
       const user = userCredential.user;
       
       //set loggedIn local storage value to true and go to main page
       setSettings({...settings, loggedIn: true, user: user});

     })
     .catch((error) => {
       //display error alert
       window.alert("Error: " + error.message + "\nCode: " + error.code);
     });

 }






  //logs out user
  function logout(){
    if (window.confirm("Are you sure you want to logout?")) {
    
      //set loggedIn local storage value to true and go to main page
      setSettings({...settings, loggedIn: false, user: null});
      setStreams(localStorage.getItem("streams") ? JSON.parse(localStorage.getItem("streams")) : {

        channels: [],
        playlists: []
      
      });


    
    }
  }



  //changes user password
  function resetPassword(){

    //get email from input
    let email = document.getElementById("email").value;

    sendPasswordResetEmail(auth, email)
      .then(() => { window.alert("Password reset email sent!");})
      .catch((error) => {
         //display error alert
         window.alert("Error: " + error.message + "\nCode: " + error.code);
        // ..
      });

  }


//===================================JSXOBJECT=========================//


    return (

        <div id="loginContainer">

             {!settings.loggedIn && <div className="inputContainer">
                <label tabindex="-1" lang={[settings.lang]} for="email" class="label mlabel">{translations[settings.lang].email}</label>
                <input  type="text" className="miscOptions loginInput"  id="email" name="email"/>
              </div> }
              {!settings.loggedIn &&<div className="inputContainer">
                <label tabindex="-1" lang={[settings.lang]} for="password" class="label mlabel">{translations[settings.lang].password}</label>
                <input  type="text" className="miscOptions loginInput"  id="password" name="password"/>
              </div>}
              <div id="buttonRow">
                {!settings.loggedIn && <button lang={[settings.lang]} id="loginButton" onClick={(() => {soundEffects.okSetting.play(); resetPassword()})} className="settingsButton forgotPassword">{translations[settings.lang].forgot}</button>}
                <button lang={[settings.lang]} id="loginButton" onClick={(()=>{soundEffects.okSetting.play(); settings.loggedIn ? logout() : register()})} className="settingsButton">{settings.loggedIn ? translations[settings.lang].logout : translations[settings.lang].login}</button>
              </div>
          </div>


    )
    
}


export default Login;