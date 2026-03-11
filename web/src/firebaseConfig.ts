import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB84ig6oz73pmv1M-xyVhCTxeYwnMFVp00",
  authDomain: "audiorent-26b13.firebaseapp.com",
  projectId: "audiorent-26b13",
  storageBucket: "audiorent-26b13.firebasestorage.app",
  messagingSenderId: "1075750667833",
  appId: "1:1075750667833:web:2f201b5baa860d1610afe8",
  measurementId: "G-4VDHS37N9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export these so we can use them in Login.tsx
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;