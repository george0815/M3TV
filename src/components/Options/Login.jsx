import {useContext, useState} from 'react'; //react
import { translations } from '../../misc/translations';
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils';

//firebase
import {createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut,
        deleteUser, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import {doc, deleteDoc} from "firebase/firestore";
import {auth, db} from "../../utils";
import { StreamsContext, ToastContext } from '../../App';
import { deleteAccount } from '../../lib/account';
import { useArmedConfirm } from '../../lib/useArmedConfirm';


function Login(){


//=====================================STATE==========================//

  //global settings
  const {settings, setSettings} = useContext(SettingsContext);


  //global streams
  const {setStreams} = useContext(StreamsContext);

  //toasts, in place of the alerts these paths used to raise
  const {notify} = useContext(ToastContext);



  //whether the delete-account confirmation is open. Deleting is irreversible
  //and sits on the same screen as the logout button, so it takes two
  //deliberate steps and a password rather than one click.
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  //disables the confirm button while the deletion is in flight, so a second
  //click cannot start a second attempt against a session the first one is
  //already tearing down
  const [deleting, setDeleting] = useState(false);

  /* Logging out and deleting both ask on their own button rather than in a
     browser dialog — see useArmedConfirm. Keyed, because this screen carries
     two of them and arming one must not arm the other. */
  const {confirm, disarm, isArmed} = useArmedConfirm();


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
              notify(translations[settings.lang].accountExists, "danger");
              break;
            default:
              //display error alert
              notify(error.message, "danger");
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
           notify(translations[settings.lang].loginFailed, "danger");
           break;
         default:
           //display error alert
           notify(error.message, "danger");
           break;
       }

     });

 }






  /* Back to whatever this device had saved before anyone signed in. The
     account's channels live only in firestore — App.jsx writes to localStorage
     only while signed out — so the local list is still sitting there untouched
     and is what should come back. Shared by logout and by deletion. */
  function restoreLocalStreams(){

    setStreams(localStorage.getItem("streams") ? JSON.parse(localStorage.getItem("streams")) : {

      channels: [],
      playlists: []

    });

  }


  //logs out user
  function logout(){

    //actually end the Firebase session, otherwise the SDK keeps the user
    //signed in (and keeps refreshing their token) after a "logout"
    signOut(auth).catch((error) => { console.error(error); });

    //set loggedIn local storage value to true and go to main page
    setSettings({...settings, loggedIn: false, user: null});
    restoreLocalStreams();

  }



  /* Deletes the account and everything saved to it.

     The sequence lives in src/lib/account.js — the order is load-bearing and
     is explained there. This half is only the firebase calls to hand it, and
     what to do with the answer.

     Firebase refuses to delete a session more than a few minutes old, so the
     password is required rather than merely a confirmation: it is what makes
     the deletion possible at all. */
  async function removeAccount(){

    const user = auth.currentUser;

    //the persisted flag can outlive the session — App.jsx reconciles the two
    //on load, but the button is on screen in the meantime
    if(!user){
      notify(translations[settings.lang].deleteReauthFailed, "danger");
      return;
    }

    const password = document.getElementById("deletePassword").value;

    if(!password){
      notify(translations[settings.lang].confirmPassword, "danger");
      return;
    }

    setDeleting(true);

    const result = await deleteAccount({

      reauthenticate: () => reauthenticateWithCredential(
        user, EmailAuthProvider.credential(user.email, password)),

      deleteDocument: () => deleteDoc(doc(db, "data", user.uid)),

      deleteAuthUser: () => deleteUser(user),

    });

    setDeleting(false);

    //the saved channels and playlists are really gone, whether or not the
    //account itself went with them, so stop showing them
    if(result.dataDeleted){ restoreLocalStreams(); }

    if(result.ok){

      //onAuthStateChanged does this too once firebase notices, but saying it
      //here means the screen does not sit on a deleted account in the meantime
      setSettings({...settings, loggedIn: false, user: null});
      setConfirmingDelete(false);

    }

    notify(translations[settings.lang][result.reason], result.ok ? undefined : "danger");

  }



  //changes user password
  function resetPassword(){

    //get email from input
    let email = document.getElementById("email").value;

    sendPasswordResetEmail(auth, email)
      .then(() => { notify(translations[settings.lang].resetEmailSent);})
      .catch((error) => {
         //display error alert
         notify(error.message, "danger");
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
                <button lang={[settings.lang]} id="loginButton" onClick={(()=>{soundEffects.okSetting.play(); settings.loggedIn ? confirm("logout", translations[settings.lang].logoutAlert, logout) : login()})} className={isArmed("logout") ? "settingsButton loginButton armed" : "settingsButton loginButton"}>{settings.loggedIn ? translations[settings.lang].logout : translations[settings.lang].login}</button>
              </div>

              {/*Only offered while signed in, and kept below the login row
                 rather than beside it — this is the one button on the screen
                 that cannot be undone, so it should not sit within a slip of
                 Logout.*/}
              {settings.loggedIn && !confirmingDelete &&
                <button lang={[settings.lang]} id="deleteAccountButton" onClick={(()=>{soundEffects.backSetting.play(); setConfirmingDelete(true)})} className="settingsButton loginButton dangerButton">{translations[settings.lang].deleteAccount}</button>}

              {settings.loggedIn && confirmingDelete &&
                <div id="deleteConfirm">

                  <div className="inputContainer">
                    <label tabIndex="-1" lang={[settings.lang]} htmlFor="deletePassword" className="label mlabel">{translations[settings.lang].confirmPassword}</label>
                    {/*a real password field, so it is masked and the browser's
                       password manager can fill it — the alternative was a
                       window.prompt, which shows what is typed in clear*/}
                    <input type="password" autoComplete="current-password" className="miscOptions loginInput" id="deletePassword" name="deletePassword"/>
                  </div>

                  <div id="buttonRow">
                    <button lang={[settings.lang]} onClick={(()=>{soundEffects.backSetting.play(); disarm(); setConfirmingDelete(false)})} className="settingsButton loginButton">{translations[settings.lang].cancel}</button>
                    <button lang={[settings.lang]} disabled={deleting} onClick={(()=>{soundEffects.okSetting.play(); confirm("delete", translations[settings.lang].deleteWarning, removeAccount)})} className={isArmed("delete") ? "settingsButton loginButton dangerButton armed" : "settingsButton loginButton dangerButton"}>{translations[settings.lang].deleteConfirm}</button>
                  </div>

                </div>}

          </div>


    )
    
}


export default Login;