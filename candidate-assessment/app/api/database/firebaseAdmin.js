import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Path to your service account JSON file
const serviceAccountPath = path.resolve(__dirname, '../data/yeetcode-9976f-firebase-adminsdk-fbsvc-95a338597a.json');

let adminDb;

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  initializeAdminApp({
    credential: cert(serviceAccount),
  });

  adminDb = getAdminFirestore();
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

export { adminDb }; 