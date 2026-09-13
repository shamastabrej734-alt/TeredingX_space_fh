import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "dark-origin-hc9s2",
  appId: "1:978171049463:web:accd6208a72ee96e21aaf2",
  apiKey: "AIzaSyC4RPByArIYvrZihvkYe5_T3gk0KNMlgUs",
  authDomain: "dark-origin-hc9s2.firebaseapp.com",
  storageBucket: "dark-origin-hc9s2.firebasestorage.app",
  messagingSenderId: "978171049463",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
}, "ai-studio-eaf0e6f0-ad23-427f-9863-21d1e3410959");
