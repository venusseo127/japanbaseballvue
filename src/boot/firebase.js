import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import GlobalConfigJson from '../../global-config.json'

const firebaseProjectName = GlobalConfigJson.FIREBASE_PROJECT

let firebaseConfig
if (firebaseProjectName === 'staging'){
  firebaseConfig = {
    apiKey: "AIzaSyAPRJYXLiUBLbybjPP5P3wPp37jXmWp1ls",
    authDomain: "pilaludere.firebaseapp.com",
    databaseURL: "https://pilaludere.firebaseio.com",
    projectId: "pilaludere",
    storageBucket: "pilaludere.firebasestorage.app",
    messagingSenderId: "1088255491611",
    appId: "1:1088255491611:web:32ef249aab42f32651c2be",
    measurementId: "G-YL5NQHM881"
  }
} else
if (firebaseProjectName === 'production'){
  firebaseConfig = {
    apiKey: "AIzaSyAPRJYXLiUBLbybjPP5P3wPp37jXmWp1ls",
    authDomain: "pilaludere.firebaseapp.com",
    databaseURL: "https://pilaludere.firebaseio.com",
    projectId: "pilaludere",
    storageBucket: "pilaludere.firebasestorage.app",
    messagingSenderId: "1088255491611",
    appId: "1:1088255491611:web:32ef249aab42f32651c2be",
    measurementId: "G-YL5NQHM881"
  };
}

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp)
const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();
const firestoreDb = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
const firebaseFunction = getFunctions(firebaseApp);

googleProvider.addScope('email');

export {
  firebaseApp,
  firebaseAuth,
  facebookProvider,
  googleProvider,
  firestoreDb,
  firebaseStorage,
  firebaseFunction,
}
