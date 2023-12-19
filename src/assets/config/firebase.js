// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlC8flLzqPhwEjWyY4WfzFpU-g10aehFg",
  authDomain: "a23-synthese-equipe01.firebaseapp.com",
  projectId: "a23-synthese-equipe01",
  storageBucket: "a23-synthese-equipe01.appspot.com",
  messagingSenderId: "610052992149",
  appId: "1:610052992149:web:e46bf8c7350dc975cc7f9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
