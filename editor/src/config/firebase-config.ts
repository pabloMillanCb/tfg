import { initializeApp } from "firebase/app";

import { getAuth, onAuthStateChanged } from "firebase/auth";


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyAaTOOaGBqUfk9oZQUc18nWpdSudiLa_nY",
  
    authDomain: "tfg-backend-2fd4c.firebaseapp.com",
  
    projectId: "tfg-backend-2fd4c",
  
    storageBucket: "tfg-backend-2fd4c.appspot.com",
  
    messagingSenderId: "628724485334",
  
    appId: "1:628724485334:web:029801f94181617d750d77"
  
  };
  
const firebase = initializeApp(firebaseConfig); //initialize firebase app 

export const firebaseAuth = getAuth(firebase)

firebaseAuth.setPersistence(firebase.default)

//export onAuthStateChanged
export default firebase ; //export the app


