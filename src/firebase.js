// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfbYB0wYCJJPQ0Dipueetv5t8h7VYKNTk",
  authDomain: "ai-exam-judge.firebaseapp.com",
  databaseURL: "https://ai-exam-judge-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-exam-judge",
  storageBucket: "ai-exam-judge.firebasestorage.app",
  messagingSenderId: "145185810162",
  appId: "1:145185810162:web:0eb5500bed24a9a439d26b",
  measurementId: "G-M2XND5233X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app);