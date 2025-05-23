import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBYH7UVbyJIkAhg7ju9nTpQYdUaLPLSQHU",
  authDomain: "restoran-menu-39ea1.firebaseapp.com",
  projectId: "restoran-menu-39ea1",
  storageBucket: "restoran-menu-39ea1.appspot.com", // DÜZELTİLDİ
  messagingSenderId: "250862885952",
  appId: "1:250862885952:web:af1af0d447be6acad553a5",
  measurementId: "G-N87DYSCT7R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Artık doğru çalışacak