import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { doc, setDoc,onSnapshot ,getDoc} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"; // Import Firestore methods

const firebaseConfig = {
    apiKey: "AIzaSyD_rqUBgIDzr3maBFtfol6kyYJQkxoMTHQ",
    authDomain: "study-room-39836.firebaseapp.com",
    projectId: "study-room-39836",
    storageBucket: "study-room-39836.firebasestorage.app",
    messagingSenderId: "556669469703",
    appId: "1:556669469703:web:a70c1f767e65761e1a56a2",
    measurementId: "G-JR6ZTK2PL7"
  };

  export const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);



