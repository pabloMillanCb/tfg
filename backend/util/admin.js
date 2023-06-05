var admin = require("firebase-admin");


var serviceAccount = require("../keys/tfg-backend-2fd4c-firebase-adminsdk-tmyuf-b890a8439b.json");


admin.initializeApp({

  credential: admin.credential.cert(serviceAccount)

});

const db = admin.firestore();
module.exports = { admin, db };