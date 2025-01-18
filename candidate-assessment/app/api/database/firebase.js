import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Client-side Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase Config:', firebaseConfig);

let db;

// Initialize Firebase for client-side
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase client initialized successfully');
} catch (error) {
  console.error('Firebase client initialization error:', error);
}

export { db };
