import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCIrpUYXmIdg7InH5l-8xXkVu0adJ9WzAA",
  authDomain: "accialert-f49a0.firebaseapp.com",
  projectId: "accialert-f49a0",
  storageBucket: "accialert-f49a0.appspot.com",
  messagingSenderId: "479204633321",
  appId: "1:479204633321:web:bb1e5267dd0d065dce9e78",
  measurementId: "G-KS6C3M4R19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);