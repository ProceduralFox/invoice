
import { getAuth, GithubAuthProvider } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDBbLcUS3osjz8cS_LdgPn3tJOLs-AfSwA",
  authDomain: "invoice-fb1a1.firebaseapp.com",
  projectId: "invoice-fb1a1",
  storageBucket: "invoice-fb1a1.appspot.com",
  messagingSenderId: "51048247965",
  appId: "1:51048247965:web:83f379f3a35aa9d791da74"
};



const app = initializeApp(firebaseConfig);



export const auth = getAuth()
export const provider = new GithubAuthProvider();

export const db = getFirestore();
