// Firebase initialization and Firestore export
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDpCRAstQJCyKNN6dvRiNlgf_ilqeDDoQ",
  authDomain: "vastuvriksha-architects.firebaseapp.com",
  projectId: "vastuvriksha-architects",
  storageBucket: "vastuvriksha-architects.firebasestorage.app",
  messagingSenderId: "1045300713423",
  appId: "1:1045300713423:web:5969e42a55b307b60ee4ba"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


