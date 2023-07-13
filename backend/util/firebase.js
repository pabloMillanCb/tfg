const firebase = require('firebase');
import firebaseConfig from "/etc/secrets/firebase-config.json"
// Your web app's Firebase configuration
  
firebase.initializeApp(firebaseConfig); //initialize firebase app 
module.exports = { firebase }; //export the app