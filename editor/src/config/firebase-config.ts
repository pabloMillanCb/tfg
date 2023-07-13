import { initializeApp } from "firebase/app";
import firebaseConfig from "/etc/secrets/firebase-config.json"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration


  
const firebase = initializeApp(firebaseConfig); //initialize firebase app 

export const firebaseAuth = getAuth(firebase)
export const storage = getStorage(firebase)

//firebaseAuth.setPersistence(firebase.default)

//export onAuthStateChanged
export default firebase ; //export the app


