// Firebase client config and initialization
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAv5fQ89ZmYqOiN9T98OzyMuNU3Z_t7hxA",
  authDomain: "luxxelabels-5a935.firebaseapp.com",
  projectId: "luxxelabels-5a935",
  storageBucket: "luxxelabels-5a935.firebasestorage.app",
  messagingSenderId: "450141608427",
  appId: "1:450141608427:web:97cad23b8a20b0fe13a1ae",
  measurementId: "G-8RTVLBD3PL"
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);