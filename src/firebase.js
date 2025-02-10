// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, child, get } from "firebase/database";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRKIda6LNuMFIfJgG1h7s1LqFOCJMNjHo",
  authDomain: "kieli-app.firebaseapp.com",
  databaseURL: "https://kieli-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kieli-app",
  storageBucket: "kieli-app.firebasestorage.app",
  messagingSenderId: "778677382266",
  appId: "1:778677382266:web:2419119415946d0f8adfc3",
  measurementId: "G-Z81ZQZCCP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { db, auth, ref, onValue, set, push, signInAnonymously, signOut };