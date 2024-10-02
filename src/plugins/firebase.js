import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from "firebase/storage";
    
const firebaseConfig = {
    apiKey: "AIzaSyBIHc3OEAWsCvuWrrrUXMbL-LvsONIQ-ww",
    authDomain: "studybuddy-99348.firebaseapp.com",
    projectId: "studybuddy-99348",
    storageBucket: "studybuddy-99348.appspot.com",
    messagingSenderId: "330867225862",
    appId: "1:330867225862:web:87fb7bca9000c1e96ada87",
    measurementId: "G-SF1KRN6D6K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export {
    app,
    db,
    auth,
    provider,
    storage
 }

