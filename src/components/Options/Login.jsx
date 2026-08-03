import {useContext} from 'react'; //react
import { translations } from '../../misc/translations';
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils';

//firebase
import {createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "../../utils";
import { StreamsContext } from '../../App';


function Login(){


//=====================================STATE==========================//

  //global settings
  const {settings, setSettings} = useContext(SettingsContext);


  //global streams
  const {setStreams} = useContext(StreamsContext);


//===================================FUNCTIONS=========================//

//the whole settings object gets written to localStorage, and a Firebase user
//serializes its refresh token along with it. only the uid is ever used, so
//keep just that instead of parking a long-lived credential in localStorage.
function publicProfile(user){
  return { uid: user.uid, email: user.email };
}

//registers new users
//
//this is deliberately its own button. it used to be what the "Login" button
//called, falling back to login() on auth/email-already-in-use — which meant a
//typo in the email field silently created a brand new account and dropped the
//user into it with none of their channels, instead of telling them the
//password was wrong.
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
          setSettings({...settings, loggedIn: true, user: publicProfile(user)});

        })
        .catch((error) => {

          switch (error.code) {
            case 'auth/email-already-in-use':
              //don't quietly log them in — they asked to create an account
              window.alert(translations[settings.lang].accountExists);
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
       setSettings({...settings, loggedIn: true, user: publicProfile(user)});

     })
     .catch((error) => {

       switch (error.code) {
         //firebase collapses "no such user" and "wrong password" into
         //invalid-credential, so point at the sign-up button rather than
         //guessing which one it was
         case 'auth/invalid-credential':
         case 'auth/user-not-found':
         case 'auth/wrong-password':
           window.alert(translations[settings.lang].loginFailed);
           break;
         default:
           //display error alert
           window.alert("Error: " + error.message + "\nCode: " + error.code);
           break;
       }

     });

 }






  //logs out user
  function logout(){
    if (window.confirm("Are you sure you want to logout?")) {

      //actually end the Firebase session, otherwise the SDK keeps the user
      //signed in (and keeps refreshing their token) after a "logout"
      signOut(auth).catch((error) => { console.error(error); });

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
                <label tabIndex="-1" lang={[settings.lang]} htmlFor="email" className="label mlabel">{translations[settings.lang].email}</label>
                <input  type="email" autoComplete="username" className="miscOptions loginInput"  id="email" name="email"/>
              </div> }
              {!settings.loggedIn &&<div className="inputContainer">
                <label tabIndex="-1" lang={[settings.lang]} htmlFor="password" className="label mlabel">{translations[settings.lang].password}</label>
                <input  type="password" autoComplete="current-password" className="miscOptions loginInput"  id="password" name="password"/>
              </div>}
              <div id="buttonRow">
                {!settings.loggedIn && <button lang={[settings.lang]} id="forgotButton" onClick={(() => {soundEffects.okSetting.play(); resetPassword()})} className="settingsButton loginButton forgotPassword">{translations[settings.lang].forgot}</button>}
                {!settings.loggedIn && <button lang={[settings.lang]} id="signUpButton" onClick={(()=>{soundEffects.okSetting.play(); register()})} className="settingsButton loginButton">{translations[settings.lang].signUp}</button>}
                <button lang={[settings.lang]} id="loginButton" onClick={(()=>{soundEffects.okSetting.play(); settings.loggedIn ? logout() : login()})} className="settingsButton loginButton">{settings.loggedIn ? translations[settings.lang].logout : translations[settings.lang].login}</button>
              </div>
          </div>


    )
    
}


export default Login;