// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYnbp3hReMexbZnfTi3t9ZTUemlW5uoZM",
  authDomain: "inventorymanagement-22aab.firebaseapp.com",
  projectId: "inventorymanagement-22aab",
  storageBucket: "inventorymanagement-22aab.appspot.com",
  messagingSenderId: "544558892969",
  appId: "1:544558892969:web:e986478717540dd19526b8",
  measurementId: "G-08RJKMJE06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore}