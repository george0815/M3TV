import {useContext, useState} from 'react'; //react
import { translations } from '../../misc/translations';
import { SettingsContext } from '../../App'; //gets global settings context
import { soundEffects } from '../../utils';

//firebase
import {createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut,
        deleteUser, reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider,
        GoogleAuthProvider, signInWithPopup, signInWithRedirect, linkWithCredential} from "firebase/auth";
import {auth} from "../../utils";
import { deleteUserData } from "../../lib/userdata";
import { StreamsContext, ToastContext } from '../../App';
import { deleteAccount } from '../../lib/account';
import { useArmedConfirm } from '../../lib/useArmedConfirm';
import { isUserCancellation, shouldRedirectInstead, authErrorReason, reauthMethod } from '../../lib/auth';


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

  /* A google credential that could not be used because the email already has a
     password account. Firebase allows one account per address, so the two have
     to be joined rather than kept apart — held here until the password proves
     the same person owns both, and then linked. */
  const [pendingGoogle, setPendingGoogle] = useState(null);


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



  /* Signing in with google.

     Popup first, redirect second. A popup keeps the app loaded and is the
     better experience where it works, but mobile safari and the browsers
     embedded inside other apps refuse to open one — so those fall through to
     a redirect, which works everywhere and comes back through
     getRedirectResult in App.jsx.

     Nothing is done with the result here. onAuthStateChanged is already
     watching, and it is what loads the account's channels; duplicating that
     would mean two sources of truth for who is signed in. */
  async function signInWithGoogle(){

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    }
    catch (error) {

      //closing the popup, or opening a second one over the first
      if(isUserCancellation(error)){ return; }

      if(shouldRedirectInstead(error)){
        try { await signInWithRedirect(auth, provider); }
        catch (redirectError) { notify(translations[settings.lang][authErrorReason(redirectError)], "danger"); }
        return;
      }

      /* The address already has a password account. Firebase permits one
         account per address, so this is not a second account to create but the
         same one to join — hold the credential and ask for the password that
         proves it is the same person. */
      if(error.code === "auth/account-exists-with-different-credential"){

        const credential = GoogleAuthProvider.credentialFromError(error);

        if(credential){
          setPendingGoogle(credential);
          if(error.customData && error.customData.email){
            document.getElementById("email").value = error.customData.email;
          }
        }

      }

      notify(translations[settings.lang][authErrorReason(error)], "danger");

    }

  }


  //logs in user
  function login(){

    //get inputs from fields
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


   signInWithEmailAndPassword(auth, email, password)
     .then(async (userCredential) => {

       //set loggedIn local storage value to true and go to main page
       const user = userCredential.user;

       /* If a google sign-in was turned away because this address already had
          a password account, the password just proved it is the same person.
          Join them now, so next time either way in works and there is still
          one account holding one set of channels.

          Failing to link is not a failed login — they are signed in either
          way — so it is reported and stepped over rather than thrown. */
       if(pendingGoogle){

         try {
           await linkWithCredential(user, pendingGoogle);
           notify(translations[settings.lang].googleLinked);
         }
         catch (error) {
           notify(translations[settings.lang][authErrorReason(error)], "danger");
         }

         setPendingGoogle(null);

       }

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

    /* An account created through google has no password, so the field is not
       shown for one and asking for it would be an unanswerable question.
       Firebase still requires a fresh session before it will delete anything,
       so that account proves itself by opening the google popup again. */
    const method = reauthMethod(user);

    const password = method === "password"
      ? document.getElementById("deletePassword").value
      : null;

    if(method === "password" && !password){
      notify(translations[settings.lang].confirmPassword, "danger");
      return;
    }

    setDeleting(true);

    const result = await deleteAccount({

      reauthenticate: () => method === "password"
        ? reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password))
        : reauthenticateWithPopup(user, new GoogleAuthProvider()),

      deleteDocument: () => deleteUserData(user.uid),

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

              {/*Under the email row, not beside it: the two are alternatives,
                 and a rule between them says so more clearly than placement.
                 The G is inline svg in Google's four colours — drawn here
                 rather than fetched, since the strict CSP on the deployed site
                 blocks external images and a broken icon is worse than none.*/}
              {!settings.loggedIn &&
                <div id="googleRow">

                  <div className="orRule" aria-hidden="true"></div>

                  <button lang={[settings.lang]} id="googleButton" onClick={(()=>{soundEffects.okSetting.play(); signInWithGoogle()})} className="settingsButton loginButton googleButton">
                    <svg className="googleMark" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
                      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
                    </svg>
                    <span>{translations[settings.lang].continueWithGoogle}</span>
                  </button>

                </div>}

              {/*Only offered while signed in, and kept below the login row
                 rather than beside it — this is the one button on the screen
                 that cannot be undone, so it should not sit within a slip of
                 Logout.*/}
              {settings.loggedIn && !confirmingDelete &&
                <button lang={[settings.lang]} id="deleteAccountButton" onClick={(()=>{soundEffects.backSetting.play(); setConfirmingDelete(true)})} className="settingsButton loginButton dangerButton">{translations[settings.lang].deleteAccount}</button>}

              {settings.loggedIn && confirmingDelete &&
                <div id="deleteConfirm">

                  {/*An account created through google has no password, so it
                     is not asked for one. It proves itself by opening the
                     google popup again when the deletion runs.*/}
                  {reauthMethod(auth.currentUser) === "password"
                    ? <div className="inputContainer">
                        <label tabIndex="-1" lang={[settings.lang]} htmlFor="deletePassword" className="label mlabel">{translations[settings.lang].confirmPassword}</label>
                        {/*a real password field, so it is masked and the browser's
                           password manager can fill it — the alternative was a
                           window.prompt, which shows what is typed in clear*/}
                        <input type="password" autoComplete="current-password" className="miscOptions loginInput" id="deletePassword" name="deletePassword"/>
                      </div>
                    : <div lang={[settings.lang]} className="label mlabel">{translations[settings.lang].confirmWithGoogle}</div>}

                  <div id="buttonRow">
                    <button lang={[settings.lang]} onClick={(()=>{soundEffects.backSetting.play(); disarm(); setConfirmingDelete(false)})} className="settingsButton loginButton">{translations[settings.lang].cancel}</button>
                    <button lang={[settings.lang]} disabled={deleting} onClick={(()=>{soundEffects.okSetting.play(); confirm("delete", translations[settings.lang].deleteWarning, removeAccount)})} className={isArmed("delete") ? "settingsButton loginButton dangerButton armed" : "settingsButton loginButton dangerButton"}>{translations[settings.lang].deleteConfirm}</button>
                  </div>

                </div>}

          </div>


    )
    
}


export default Login;