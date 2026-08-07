import { app } from "../utils";

/* Every read and write of a user's saved channels and playlists.

   Two reasons this is one module rather than seven imports.

   Firestore is the heaviest part of the firebase SDK and nothing needs it
   until someone is signed in and saving — the session itself is restored
   through auth, which is separate. Importing it on demand here keeps it out of
   the bundle downloaded to reach the menu, and out of it entirely for anyone
   who never signs in.

   And `doc(db, "data", uid)` was written out at eleven call sites. The
   collection name and the shape of the path are the same fact as the one in
   firestore.rules, which grants access to /data/{userId} and nothing else; a
   typo in any one of the eleven would have been a silent permission failure. */


//the module and the database handle, resolved together and cached as one
//promise so eleven callers share a single import
let firestore = null;

function database(){

  if(!firestore){
    firestore = import("firebase/firestore")
      .then((module) => ({ module, db: module.getFirestore(app) }));
  }

  return firestore;

}


//the one place the path is spelled out
function userDoc({ module, db }, uid){
  return module.doc(db, "data", uid);
}


/* Returns the saved data, or null when the account has none yet — a new
   account has no document until its first save, which is not an error. */
export async function loadUserData(uid){

  const handle = await database();
  const snapshot = await handle.module.getDoc(userDoc(handle, uid));

  return snapshot.exists() ? snapshot.data() : null;

}


//rejects on failure rather than swallowing it: the callers use that to decide
//whether to clear a form or claim the save worked
export async function saveUserData(uid, data){

  const handle = await database();

  return handle.module.setDoc(userDoc(handle, uid), data);

}


/* Removes everything saved to the account. Deliberately separate from
   deleting the account itself, and it has to run first — see src/lib/account.js
   for why that order cannot be reversed. */
export async function deleteUserData(uid){

  const handle = await database();

  return handle.module.deleteDoc(userDoc(handle, uid));

}
