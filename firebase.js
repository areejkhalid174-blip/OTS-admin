// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAH5Z-QJgzJX_F9V3wk5hRwJan5oz_XwbQ",
  authDomain: "objecttransfersystem.firebaseapp.com",
  projectId: "objecttransfersystem",
  storageBucket: "objecttransfersystem.firebasestorage.app",
  messagingSenderId: "669666525575",
  appId: "1:669666525575:web:9f78a43420630ea2415322",
  measurementId: "G-7ML6Z5P1PC"
};

// Initialize Firebase
try {
  var  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
