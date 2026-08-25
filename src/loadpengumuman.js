import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * @param {string} collectionNm - collection name in firebase
 * @param {string} orderByField - query
 * @returns {Promise<Array>} - back to doc.io
 */
export async function localCollectionNm (collectionNm, orderByField = null) {
    try {
        const colRef = collection(orderByField, collectionNm);
        let q = colRef;

        if (orderByField) {
            q = query(colRef, orderBy(orderByField, "desc"));
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

    } catch(error) {
        console.error(`read ${collectionNm} fail, error`);
        throw error;
    }
}