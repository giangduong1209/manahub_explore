import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBpySqolqbfonbHBVAyLAArE4sHCovu9ys",
    authDomain: "metapolis-35cc4.firebaseapp.com",
    projectId: "metapolis-35cc4",
    storageBucket: "metapolis-35cc4.appspot.com",
    messagingSenderId: "35853369125",
    appId: "1:35853369125:web:cba4d632e800964f1d64cc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;