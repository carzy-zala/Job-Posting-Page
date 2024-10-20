// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtPuI18qbeNnIIwfgKIAXSxKWry29WFgM",
  authDomain: "job-portal-1bc7b.firebaseapp.com",
  projectId: "job-portal-1bc7b",
  storageBucket: "job-portal-1bc7b.appspot.com",
  messagingSenderId: "960246995770",
  appId: "1:960246995770:web:a8ce53f1a0b416a8e1ce03",
  measurementId: "G-GJQHPRD5WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);