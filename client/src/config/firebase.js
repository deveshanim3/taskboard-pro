// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCAHgSxeSs3d8jGW1r2kSWtuDPWUlgWuXk",
  authDomain: "taskboard-pro-17ee6.firebaseapp.com",
  projectId: "taskboard-pro-17ee6",
  storageBucket: "taskboard-pro-17ee6.firebasestorage.app",
  messagingSenderId: "806165134690",
  appId: "1:806165134690:web:93086c9ad01c2e6a6f403b",
  measurementId: "G-CB6Z6QSP4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
