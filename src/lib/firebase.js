import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByK3AqqZ4uwpcPY_2iEV9riZ4xxXuPASU",
  authDomain: "youthpargati-e975a.firebaseapp.com",
  projectId: "youthpargati-e975a",
  storageBucket: "youthpargati-e975a.firebasestorage.app",
  messagingSenderId: "733396374495",
  appId: "1:733396374495:web:e2212b96372633dd296a6a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;