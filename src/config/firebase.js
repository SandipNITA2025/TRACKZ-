// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBowObAEhkBASpGkLbCRINJVpX_6jnCets",
  authDomain: "indohype-657ae.firebaseapp.com",
  projectId: "indohype-657ae",
  storageBucket: "indohype-657ae.appspot.com",
  messagingSenderId: "591593411648",
  appId: "1:591593411648:web:6d29d24ca260b4cda83ba5",
  measurementId: "G-H0VCJ8MBC7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
