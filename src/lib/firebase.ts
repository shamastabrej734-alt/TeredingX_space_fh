import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmxbOTMSZ_dr2iO2euxOjt7n_mkDwuvF4",
  authDomain: "teredingx.firebaseapp.com",
  projectId: "teredingx",
  storageBucket: "teredingx.firebasestorage.app",
  messagingSenderId: "723441053631",
  appId: "1:723441053631:web:aa6b7f5272787a5b3ebb0a",
  measurementId: "G-RPBF8V2MX7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
