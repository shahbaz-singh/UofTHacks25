import { getFirebaseAccessToken } from './firebase.js'; // Adjust the import to match your file structure

const FIREBASE_PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const FIRE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
const FIRESTORE_SAVE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/`;

export class Database {
  static APPEND = true;
  static IGNORE = false;

  // Get data from Firestore using the REST API
  static async get(path) {
    if (path.startsWith('/')) path = path.substring(1); // Remove leading slash
    try {
      const accessToken = await getFirebaseAccessToken();
      const [collection, documentId, ...fieldPath] = path.split('/');
      const docUrl = `${FIRE_URL}/${collection}/${documentId}`;
      const response = await fetch(docUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) return null;
      const document = await response.json();
      const data = document.fields;
      if (fieldPath.length === 0) return Database.formatData(data);
      let fieldData = data;
      for (const key of fieldPath) {
        if (!fieldData[key]) return null;
        fieldData = fieldData[key].mapValue?.fields || fieldData[key].arrayValue?.values || fieldData[key];
      }
      return Database.formatData(fieldData);
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  // Simplified set function to update only one field
  static async set(path, value, appendArray = false, appendMap = false) {
    if (path.startsWith('/')) path = path.substring(1); // Remove leading slash
    try {
      const accessToken = await getFirebaseAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
      const [collection, documentId, field] = path.split('/');
      if (!field) return false;
      const docUrl = `${FIRE_URL}/${collection}/${documentId}`;
      if (appendArray) {
        const response = await fetch(docUrl, { method: 'GET', headers });
        const document = await response.json();
        const existingArray = document.fields?.[field]?.arrayValue?.values || [];
        const updatedArray = [...existingArray, Database.formatDataForFirestore(value)];
        const updateBody = { fields: { [field]: { arrayValue: { values: updatedArray } } } };
        const updateResponse = await fetch(`${docUrl}?updateMask.fieldPaths=${field}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateBody),
        });
        if (!updateResponse.ok) {
          console.error('Error updating document:', await updateResponse.text());
          return false;
        }
        return true;
      } else {
        const formattedValue = Database.formatDataForFirestore(value);
        const updateBody = { fields: { [field]: formattedValue } };
        const response = await fetch(`${docUrl}?updateMask.fieldPaths=${field}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateBody),
        });
        return response.ok;
      }
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  }

  // Helper methods (formatObjectForFirestore, formatDataForFirestore, etc.) can be added similarly as in the original file
}

