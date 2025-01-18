import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
// Function to get a document from Firestore
export const getDocument = async (documentId) => {
  const docRef = doc(db, 'Users', documentId);
  const documentSnapshot = await getDoc(docRef);
  if (documentSnapshot.exists()) {
    return documentSnapshot.data();
  } else {
    throw new Error(`Document with ID ${documentId} does not exist.`);
  }
};
// Function to update a document in Firestore
export const updateDocument = async (documentId, newLog) => {
  const docRef = doc(db, 'Users', documentId);
  await updateDoc(docRef, {
    logs: arrayUnion(newLog),
  });
};