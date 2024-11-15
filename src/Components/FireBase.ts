// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr8IXUu0GcZLnM_ES6_BXYJ-1B9MQZAOE",
  authDomain: "e-commerce-afb9b.firebaseapp.com",
  projectId: "e-commerce-afb9b",
  storageBucket: "e-commerce-afb9b.firebasestorage.app",
  messagingSenderId: "787052828699",
  appId: "1:787052828699:web:a27eecfebbb969db2e80be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const database= getFirestore(app)
export { collection, getDocs };
export default app