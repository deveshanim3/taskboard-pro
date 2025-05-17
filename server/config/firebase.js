
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
