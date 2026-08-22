//this JS is using connect our database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// firebase key
const firebaseConfig = {
  apiKey: "AIzaSyDC0HS8kOPb7TaAyl6OgppHXnkSDUjlAPg",
  authDomain: "library-sistem.firebaseapp.com",
  projectId: "library-sistem",
  storageBucket: "library-sistem.firebasestorage.app",
  messagingSenderId: "105583887746",
  appId: "1:105583887746:web:e9da5b187dee1f94887b9b"
};

// reset and output
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);