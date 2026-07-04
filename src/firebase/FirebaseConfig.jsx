import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// NOTE: For Firebase projects created after Oct 2023, storageBucket uses
// "PROJECT_ID.firebasestorage.app" format. Older projects use ".appspot.com".
// Use whichever matches your Firebase Console → Storage bucket name.
const firebaseConfig = {
  apiKey:            "AIzaSyAmkrRXY0U40k40SEulixjxeK89vKaYibA",
  authDomain:        "arpa-af2f0.firebaseapp.com",
  projectId:         "arpa-af2f0",
  storageBucket:     "arpa-af2f0.firebasestorage.app",
  messagingSenderId: "313539519802",
  appId:             "1:313539519802:web:aa49710e815cd969a1dc03",
  measurementId:     "G-FYF2SJX8EG",
};

const app        = initializeApp(firebaseConfig);
const firebaseDB = getFirestore(app);
const auth       = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage    = getStorage(app);

// Debug — remove after testing
console.log("🪣 Storage bucket:", storage?.app?.options?.storageBucket);

export { firebaseDB, auth, googleProvider, storage };
