import { db } from './firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query, 
  orderBy, 
  where,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * 1. Insert Data
 * @param {string} collectionName - Target collection name
 * @param {Object} data - Object containing data to insert
 * @returns {Promise<string>} - Returns the created document ID
 */
export async function insertData(collectionName, data) {
  try {
    const colRef = collection(db, collectionName);
    // Automatically attach creation timestamp
    const dataToSave = {
      ...data,
      createdAt: new Date()
    };
    const docRef = await addDoc(colRef, dataToSave);
    console.log(`Successfully inserted into [${collectionName}], Document ID:`, docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(`Failed to insert into [${collectionName}]:`, error);
    throw error;
  }
}

/**
 * 2. Read All Data from Collection
 * @param {string} collectionName - Collection name
 * @param {string|null} orderByField - (Optional) Field to order by, e.g., 'createdAt'
 * @param {string} orderDirection - (Optional) Order direction 'desc' or 'asc', defaults to 'desc'
 * @returns {Promise<Array>} - Array containing document IDs and data
 */
export async function readAllData(collectionName, orderByField = null, orderDirection = 'desc') {
  try {
    const colRef = collection(db, collectionName);
    let q = colRef;

    if (orderByField) {
      q = query(colRef, orderBy(orderByField, orderDirection));
    }

    const querySnapshot = await getDocs(q);
    const dataList = [];

    querySnapshot.forEach((doc) => {
      dataList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return dataList;
  } catch (error) {
    console.error(`Failed to read collection [${collectionName}]:`, error);
    throw error;
  }
}

/**
 * 3. Query Data by Condition
 * @param {string} collectionName - Collection name
 * @param {string} field - Field name (e.g., 'role', 'status')
 * @param {string} operator - Comparison operator ('==', '>=', '<=', 'array-contains', etc.)
 * @param {any} value - Matching value
 * @returns {Promise<Array>}
 */
export async function queryData(collectionName, field, operator, value) {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const dataList = [];

    querySnapshot.forEach((doc) => {
      dataList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return dataList;
  } catch (error) {
    console.error(`Failed to query [${collectionName}]:`, error);
    throw error;
  }
}

/**
 * 4. Read Single Document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object|null>}
 */
export async function readDataById(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn(`No document found in [${collectionName}] with ID: ${docId}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to read document:`, error);
    throw error;
  }
}

/**
 * 5. Update Existing Data
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} updateData - Object containing fields to update
 */
export async function updateData(collectionName, docId, updateData) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    console.log(`Successfully updated [${collectionName}] ID: ${docId}`);
  } catch (error) {
    console.error(`Failed to update data:`, error);
    throw error;
  }
}

/**
 * 6. Delete Data
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 */
export async function deleteData(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log(`Successfully deleted [${collectionName}] ID: ${docId}`);
  } catch (error) {
    console.error(`Failed to delete data:`, error);
    throw error;
  }
}